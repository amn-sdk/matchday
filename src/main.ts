import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { profile } from './content'
import { bindUi, closePanel, currentPanel, openProject, openSection, squad } from './ui'
import './style.css'

// ---------------------------------------------------------------------------
// Pitch dimensions (world units). The pitch runs along Z; we attack the north goal (-Z).
// ---------------------------------------------------------------------------
const HW = 17 // half width (touchlines at x = ±HW)
const HL = 26 // half length (goal lines at z = ±HL)
const GOAL_HW = 3.3 // half width of the goal mouth
const GOAL_H = 2.4
const GOAL_D = 2.2
const BALL_R = 0.45
const PLAYER_R = 0.55

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const container = document.getElementById('scene')!
const intro = document.getElementById('intro')!
const hint = document.getElementById('hint')!
const toast = document.getElementById('toast')!
const scoreEl = document.getElementById('score')!

bindUi()

let renderer: THREE.WebGLRenderer
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
} catch {
  // No WebGL: fall back to the content panels only.
  intro.classList.add('hide')
  hint.hidden = true
  openSection('squad')
  throw new Error('WebGL unavailable')
}

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 1.75))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.domElement.tabIndex = -1
renderer.domElement.style.outline = 'none'
container.appendChild(renderer.domElement)

const labelRenderer = new CSS2DRenderer()
labelRenderer.domElement.style.position = 'fixed'
labelRenderer.domElement.style.inset = '0'
labelRenderer.domElement.style.pointerEvents = 'none'
labelRenderer.domElement.style.zIndex = '5'
document.body.appendChild(labelRenderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050816)
scene.fog = new THREE.Fog(0x050816, 70, 150)

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400)
camera.position.set(0, 48, 62)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}

function makeLabel(html: string, onClick?: () => void, className = '') {
  const el = document.createElement('div')
  el.className = `label ${className}`
  el.innerHTML = html
  if (onClick) {
    el.setAttribute('role', 'button')
    el.tabIndex = 0
    el.addEventListener('pointerdown', (e) => e.stopPropagation())
    el.addEventListener('click', onClick)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onClick()
    })
  }
  return { obj: new CSS2DObject(el), el }
}

function box(w: number, h: number, d: number, color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...opts }))
  m.castShadow = true
  m.receiveShadow = true
  return m
}

// ---------------------------------------------------------------------------
// Lights and sky
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x0b1a10, 0.75))
const sun = new THREE.DirectionalLight(0xe6ecff, 2.1)
sun.position.set(14, 34, 12)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.left = -34
sun.shadow.camera.right = 34
sun.shadow.camera.top = 40
sun.shadow.camera.bottom = -40
sun.shadow.camera.far = 90
sun.shadow.bias = -0.0004
scene.add(sun)

{
  const n = 700
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.42
    const r = 180
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.cos(phi) + 10
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xaab8ff, size: 0.7, fog: false })))
}

// ---------------------------------------------------------------------------
// Pitch
// ---------------------------------------------------------------------------
const PX = 20 // canvas pixels per world unit
const CW = 44 // canvas covers x in [-22, 22]
const CL = 64 // and z in [-32, 32]
const pitchTex = canvasTexture(CW * PX, CL * PX, (ctx) => {
  const toX = (x: number) => (x + CW / 2) * PX
  const toY = (z: number) => (z + CL / 2) * PX
  // Grass stripes
  for (let i = 0; i < CL / 4; i++) {
    ctx.fillStyle = i % 2 ? '#1f7a43' : '#23864a'
    ctx.fillRect(0, i * 4 * PX, CW * PX, 4 * PX)
  }
  // Subtle noise
  for (let i = 0; i < 26000; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},0.035)`
    ctx.fillRect(Math.random() * CW * PX, Math.random() * CL * PX, 2, 2)
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.88)'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 0.14 * PX
  const rect = (x1: number, z1: number, x2: number, z2: number) =>
    ctx.strokeRect(toX(x1), toY(z1), (x2 - x1) * PX, (z2 - z1) * PX)
  const circle = (x: number, z: number, r: number, a0 = 0, a1 = Math.PI * 2, fill = false) => {
    ctx.beginPath()
    ctx.arc(toX(x), toY(z), r * PX, a0, a1)
    if (fill) ctx.fill()
    else ctx.stroke()
  }
  rect(-HW, -HL, HW, HL)
  ctx.beginPath()
  ctx.moveTo(toX(-HW), toY(0))
  ctx.lineTo(toX(HW), toY(0))
  ctx.stroke()
  circle(0, 0, 4.6)
  circle(0, 0, 0.18, 0, Math.PI * 2, true)
  for (const s of [-1, 1]) {
    const line = s * HL
    rect(-10, Math.min(line, line - s * 8), 10, Math.max(line, line - s * 8))
    rect(-4.6, Math.min(line, line - s * 3), 4.6, Math.max(line, line - s * 3))
    const spot = line - s * 5.5
    circle(0, spot, 0.16, 0, Math.PI * 2, true)
    // Penalty arc (outside the box only)
    const a = Math.acos(2.5 / 4.6)
    if (s < 0) circle(0, spot, 4.6, Math.PI / 2 - a, Math.PI / 2 + a)
    else circle(0, spot, 4.6, -Math.PI / 2 - a, -Math.PI / 2 + a)
  }
  for (const [cx, cz, a0] of [
    [-HW, -HL, 0],
    [HW, -HL, Math.PI / 2],
    [HW, HL, Math.PI],
    [-HW, HL, -Math.PI / 2],
  ]) {
    circle(cx, cz, 0.9, a0, a0 + Math.PI / 2)
  }
})
const pitch = new THREE.Mesh(new THREE.PlaneGeometry(CW, CL), new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95 }))
pitch.rotation.x = -Math.PI / 2
pitch.receiveShadow = true
scene.add(pitch)

const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 240), new THREE.MeshStandardMaterial({ color: 0x0c1226, roughness: 1 }))
ground.rotation.x = -Math.PI / 2
ground.position.y = -0.02
ground.receiveShadow = true
scene.add(ground)

// Advertising boards around the pitch
{
  const adTex = canvasTexture(1024, 64, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 1024, 0)
    g.addColorStop(0, '#2a3cff')
    g.addColorStop(1, '#7b4dff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 1024, 64)
    ctx.fillStyle = '#fff'
    ctx.font = '600 34px Outfit, Inter, sans-serif'
    ctx.textBaseline = 'middle'
    const txt = '  AMINE SADDIK  ·  SOFTWARE ENGINEER  ·  AI  ·  3D  ·  OPEN TO US ROLES  ·'
    ctx.fillText(txt, 0, 34)
    ctx.fillText(txt, ctx.measureText(txt).width, 34)
  })
  adTex.wrapS = THREE.RepeatWrapping
  const mat = new THREE.MeshStandardMaterial({ map: adTex, emissive: 0xffffff, emissiveMap: adTex, emissiveIntensity: 0.55 })
  const addBoard = (len: number, x: number, z: number, ry: number) => {
    const t = adTex.clone()
    t.repeat.set(len / 22, 1)
    t.needsUpdate = true
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.12), mat.clone())
    ;(m.material as THREE.MeshStandardMaterial).map = t
    ;(m.material as THREE.MeshStandardMaterial).emissiveMap = t
    m.position.set(x, 0.45, z)
    m.rotation.y = ry
    scene.add(m)
  }
  addBoard(2 * HW + 4, 0, -HL - 4, 0)
  addBoard(2 * HL + 6, HW + 3.4, 0, -Math.PI / 2)
  addBoard(2 * HL + 6, -HW - 3.4, 0, Math.PI / 2)
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------
function makeGoal(dir: 1 | -1) {
  const g = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, emissive: 0x333333 })
  const post = new THREE.CylinderGeometry(0.09, 0.09, GOAL_H, 12)
  for (const x of [-GOAL_HW, GOAL_HW]) {
    const p = new THREE.Mesh(post, white)
    p.position.set(x, GOAL_H / 2, 0)
    p.castShadow = true
    g.add(p)
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, GOAL_HW * 2 + 0.18, 12), white)
  bar.rotation.z = Math.PI / 2
  bar.position.y = GOAL_H
  bar.castShadow = true
  g.add(bar)
  // Net as a grid of lines
  const pts: number[] = []
  const step = 0.4
  const d = GOAL_D * dir
  for (let x = -GOAL_HW; x <= GOAL_HW + 0.01; x += step) {
    pts.push(x, GOAL_H, 0, x, GOAL_H * 0.85, d, x, GOAL_H * 0.85, d, x, 0, d)
  }
  for (let y = 0; y <= GOAL_H * 0.85 + 0.01; y += step) {
    pts.push(-GOAL_HW, y, d, GOAL_HW, y, d)
    for (const x of [-GOAL_HW, GOAL_HW]) pts.push(x, y, 0, x, y, d)
  }
  for (let t = 0; t <= 1.001; t += 0.25) {
    for (const x of [-GOAL_HW, GOAL_HW]) pts.push(x, GOAL_H * (1 - t * 0.15), d * t, x, 0, d * t)
    pts.push(-GOAL_HW, GOAL_H * (1 - t * 0.15), d * t, GOAL_HW, GOAL_H * (1 - t * 0.15), d * t)
  }
  const netGeo = new THREE.BufferGeometry()
  netGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  const net = new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: 0xdfe6ff, transparent: true, opacity: 0.45 }))
  g.add(net)
  g.position.z = dir * HL
  scene.add(g)
  return { group: g, net }
}
const northGoal = makeGoal(-1)
makeGoal(1)

// ---------------------------------------------------------------------------
// Stands, crowd, floodlights, scoreboard
// ---------------------------------------------------------------------------
const crowdPalette = [0x3b6cff, 0x5a7dff, 0x8b5cf6, 0xffffff, 0xdfe5ff, 0x1d2a66, 0xffd166, 0x2b3a8f]
const crowdSeats: { x: number; y: number; z: number; ry: number; phase: number }[] = []

function makeStand(len: number, cx: number, cz: number, ry: number) {
  const g = new THREE.Group()
  const steps = 9
  for (let i = 0; i < steps; i++) {
    const step = box(len, 0.9 * (i + 1), 1.2, i % 2 ? 0x141a36 : 0x181f40)
    step.position.set(0, 0.45 * (i + 1), i * 1.2)
    step.castShadow = false
    g.add(step)
    for (let s = -len / 2 + 0.5; s < len / 2 - 0.4; s += 0.62) {
      if (Math.random() < 0.18) continue
      const local = new THREE.Vector3(s + (Math.random() - 0.5) * 0.12, 0.9 * (i + 1) + 0.3, i * 1.2 - 0.15)
      local.applyAxisAngle(new THREE.Vector3(0, 1, 0), ry)
      crowdSeats.push({ x: local.x + cx, y: local.y, z: local.z + cz, ry, phase: Math.random() * Math.PI * 2 })
    }
  }
  const roof = box(len + 1, 0.25, 6, 0x0f1530, { metalness: 0.4 })
  roof.castShadow = false
  roof.position.set(0, 0.9 * steps + 4.2, (steps - 1) * 1.2 - 2.5)
  g.add(roof)
  g.position.set(cx, 0, cz)
  g.rotation.y = ry
  scene.add(g)
}
makeStand(2 * HW + 6, 0, -HL - 6, Math.PI)
makeStand(2 * HL + 4, HW + 6, 0, -Math.PI / 2)
makeStand(2 * HL + 4, -HW - 6, 0, Math.PI / 2)
makeStand(2 * HW + 6, 0, HL + 7, 0)

const crowd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.62, 0.34), new THREE.MeshStandardMaterial({ roughness: 0.9 }), crowdSeats.length)
{
  const m = new THREE.Matrix4()
  const c = new THREE.Color()
  crowdSeats.forEach((s, i) => {
    m.makeRotationY(s.ry).setPosition(s.x, s.y, s.z)
    crowd.setMatrixAt(i, m)
    crowd.setColorAt(i, c.setHex(crowdPalette[(Math.random() * crowdPalette.length) | 0]))
  })
}
scene.add(crowd)

function updateCrowd(t: number, excitement: number) {
  if (reduceMotion) return
  const m = new THREE.Matrix4()
  crowdSeats.forEach((s, i) => {
    const jump = Math.max(0, Math.sin(t * (6 + excitement * 6) + s.phase)) * (0.05 + excitement * 0.45)
    m.makeRotationY(s.ry).setPosition(s.x, s.y + jump, s.z)
    crowd.setMatrixAt(i, m)
  })
  crowd.instanceMatrix.needsUpdate = true
}

const glowTex = canvasTexture(128, 128, (ctx) => {
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(200,215,255,0.6)')
  g.addColorStop(1, 'rgba(120,140,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
})

for (const [x, z] of [
  [-HW - 12, -HL - 10],
  [HW + 12, -HL - 10],
  [-HW - 12, HL + 10],
  [HW + 12, HL + 10],
]) {
  const tower = new THREE.Group()
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 24, 10), new THREE.MeshStandardMaterial({ color: 0x1a2142, metalness: 0.5, roughness: 0.5 }))
  pole.position.y = 12
  tower.add(pole)
  const head = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xe8eeff, emissiveIntensity: 2.2 }))
  head.position.y = 24.5
  tower.add(head)
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85, fog: false }))
  glow.scale.set(13, 13, 1)
  glow.position.y = 24.5
  tower.add(glow)
  tower.position.set(x, 0, z)
  tower.lookAt(0, 0, 0)
  scene.add(tower)
}

// Scoreboard above the north stand
const scoreCanvas = document.createElement('canvas')
scoreCanvas.width = 1024
scoreCanvas.height = 320
const scoreTex = new THREE.CanvasTexture(scoreCanvas)
scoreTex.colorSpace = THREE.SRGBColorSpace
let goals = 0
function drawScoreboard() {
  const ctx = scoreCanvas.getContext('2d')!
  ctx.fillStyle = '#070b1f'
  ctx.fillRect(0, 0, 1024, 320)
  ctx.strokeStyle = '#3b6cff'
  ctx.lineWidth = 8
  ctx.strokeRect(4, 4, 1016, 312)
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 86px Outfit, Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(profile.name.toUpperCase(), 512, 120)
  ctx.fillStyle = '#9fb2ff'
  ctx.font = '500 40px Outfit, Inter, sans-serif'
  ctx.fillText('SOFTWARE ENGINEER · AI · 3D', 512, 186)
  ctx.fillStyle = '#ffd166'
  ctx.font = '700 64px Outfit, Inter, sans-serif'
  ctx.fillText(`GOALS  ${goals}`, 512, 276)
  scoreTex.needsUpdate = true
}
drawScoreboard()
{
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 5.6),
    new THREE.MeshStandardMaterial({ map: scoreTex, emissive: 0xffffff, emissiveMap: scoreTex, emissiveIntensity: 0.9 }),
  )
  board.position.set(0, 17.5, -HL - 18)
  scene.add(board)
  const frame = box(18.8, 6.4, 0.6, 0x10162e)
  frame.position.set(0, 17.5, -HL - 18.4)
  scene.add(frame)
}

// ---------------------------------------------------------------------------
// Stations: dugout (career), tactics board (skills), corner flag (resume), goal (contact)
// ---------------------------------------------------------------------------
interface Station {
  id: string
  x: number
  z: number
  r: number
  label: HTMLElement
  open: () => void
}
const stations: Station[] = []

function addStation(id: string, x: number, z: number, r: number, labelHtml: string, labelPos: THREE.Vector3, open: () => void) {
  const { obj, el } = makeLabel(labelHtml, open)
  obj.position.copy(labelPos)
  scene.add(obj)
  stations.push({ id, x, z, r, label: el, open })
}

// Dugout
{
  const g = new THREE.Group()
  const back = box(0.3, 2.4, 6, 0x1b2350)
  back.position.set(-1.2, 1.2, 0)
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.1, 6.2),
    new THREE.MeshPhysicalMaterial({ color: 0x9fb2ff, transparent: true, opacity: 0.35, roughness: 0.1 }),
  )
  roof.position.set(0, 2.45, 0)
  const bench = box(0.8, 0.5, 5.4, 0x3b6cff)
  bench.position.set(-0.6, 0.25, 0)
  g.add(back, roof, bench)
  g.position.set(-HW - 3.2, 0, 4)
  scene.add(g)
}
addStation('career', -HW - 0.5, 4, 2.6, '<span class="num station">C</span><span class="name">Dugout · Career</span>', new THREE.Vector3(-HW - 3, 3.4, 4), () => openSection('career'))

// Tactics board
{
  const tex = canvasTexture(512, 320, (ctx) => {
    ctx.fillStyle = '#0d3b24'
    ctx.fillRect(0, 0, 512, 320)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 3
    ctx.strokeRect(16, 16, 480, 288)
    ctx.beginPath()
    ctx.moveTo(256, 16)
    ctx.lineTo(256, 304)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(256, 160, 40, 0, Math.PI * 2)
    ctx.stroke()
    const dots: [number, number][] = [
      [40, 160], [110, 60], [110, 125], [110, 195], [110, 260], [200, 90], [200, 160], [200, 230], [320, 70], [340, 160], [320, 250],
    ]
    dots.forEach(([x, y], i) => {
      ctx.fillStyle = i === 0 ? '#1fa971' : '#3b6cff'
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.strokeStyle = '#ffd166'
    ctx.setLineDash([10, 8])
    ctx.beginPath()
    ctx.moveTo(340, 160)
    ctx.quadraticCurveTo(420, 120, 470, 160)
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 30px Outfit, Inter, sans-serif'
    ctx.fillText('SKILLS', 380, 290)
  })
  const side = new THREE.MeshStandardMaterial({ color: 0x1a2142 })
  const face = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.35 })
  // Box faces: +x, -x, +y, -y, +z, -z. The -x face looks at the pitch.
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 3.8), [side, face, side, side, side, side])
  board.position.set(HW + 2.4, 1.9, 4)
  board.castShadow = true
  scene.add(board)
  const legs = box(0.12, 0.8, 3, 0x1a2142)
  legs.position.set(HW + 2.4, 0.4, 4)
  scene.add(legs)
}
addStation('skills', HW + 0.5, 4, 2.6, '<span class="num station">S</span><span class="name">Tactics board · Skills</span>', new THREE.Vector3(HW + 2.4, 3.9, 4), () => openSection('skills'))

// Corner flags
for (const [x, z] of [
  [-HW, -HL],
  [HW, -HL],
  [-HW, HL],
  [HW, HL],
]) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }))
  pole.position.set(x, 0.8, z)
  pole.castShadow = true
  scene.add(pole)
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.4),
    new THREE.MeshStandardMaterial({ color: x > 0 && z < 0 ? 0xffd166 : 0x8b5cf6, side: THREE.DoubleSide }),
  )
  flag.position.set(x + 0.3, 1.4, z)
  scene.add(flag)
}
addStation(
  'resume',
  HW - 0.9,
  -HL + 0.9,
  1.8,
  '<span class="num station">R</span><span class="name">Corner flag · Resume</span>',
  new THREE.Vector3(HW, 2.4, -HL),
  () => openSection('resume'),
)

// Goal label
{
  const { obj, el } = makeLabel('<span class="num station">⚽</span><span class="name">Score here · Contact</span>', () => openSection('contact'))
  obj.position.set(0, GOAL_H + 1.1, -HL - 0.6)
  scene.add(obj)
  stations.push({ id: 'contact-label', x: 0, z: -HL, r: 0, label: el, open: () => openSection('contact') })
}

// Center circle label (About)
{
  const { obj, el } = makeLabel('<span class="num station">A</span><span class="name">Kick-off · About me</span>', () => openSection('about'))
  obj.position.set(0, 0.3, -4.6)
  scene.add(obj)
  stations.push({ id: 'about', x: 0, z: 0, r: 1.1, label: el, open: () => openSection('about') })
}

// ---------------------------------------------------------------------------
// Players (one per project)
// ---------------------------------------------------------------------------
interface Player {
  slug: string
  group: THREE.Group
  x: number
  z: number
  label: HTMLElement
  bump: number
  bench: boolean
}
const players: Player[] = []
const playerMeshes: THREE.Object3D[] = []

function numberTexture(n: number) {
  return canvasTexture(128, 128, (ctx) => {
    ctx.clearRect(0, 0, 128, 128)
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 92px Outfit, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(n), 64, 70)
  })
}

const skinTones = [0xc89a78, 0xa8754f, 0xe0b58f, 0x8a5a3c, 0xd2a07a]
squad.forEach((s, i) => {
  const gk = s.position === 'Goalkeeper'
  const bench = s.position === 'Substitute'
  const jersey = gk ? 0x1fa971 : 0x3b6cff
  const g = new THREE.Group()
  const skin = skinTones[i % skinTones.length]

  for (const side of [-1, 1]) {
    const leg = box(0.2, 0.62, 0.22, skin)
    leg.position.set(side * 0.15, 0.5, 0)
    const sock = box(0.22, 0.34, 0.24, 0x0f1638)
    sock.position.set(side * 0.15, 0.17, 0)
    const arm = box(0.15, 0.62, 0.17, jersey)
    arm.position.set(side * 0.42, 1.48, 0)
    const hand = box(0.13, 0.14, 0.14, skin)
    hand.position.set(side * 0.42, 1.1, 0)
    g.add(leg, sock, arm, hand)
  }
  const shorts = box(0.56, 0.32, 0.32, 0x241a6b)
  shorts.position.y = 0.96
  const torso = box(0.64, 0.72, 0.36, jersey)
  torso.position.y = 1.47
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 16), new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 }))
  head.position.y = 2.08
  head.castShadow = true
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x1b1410, roughness: 0.9 }),
  )
  hair.position.y = 2.1
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: numberTexture(s.number), transparent: true }))
  num.position.set(0, 1.52, 0.185)
  g.add(shorts, torso, head, hair, num)
  g.scale.setScalar(1.18)
  g.position.set(s.x, 0, s.z)
  if (bench) {
    g.position.set(-HW - 3.6, 0, 6.2)
    g.rotation.y = -Math.PI / 2
  }
  g.traverse((o) => (o.userData.slug = s.project.slug))
  scene.add(g)
  playerMeshes.push(g)

  const featured = s.project.featured ? '<span class="star">★</span>' : ''
  const { obj, el } = makeLabel(
    `<span class="num ${gk ? 'gk' : ''}">${s.number}</span><span class="name">${s.project.title}</span>${featured}`,
    () => openProject(s.project.slug),
    bench ? 'dim' : '',
  )
  obj.position.set(0, 3.05, 0)
  g.add(obj)
  players.push({ slug: s.project.slug, group: g, x: g.position.x, z: g.position.z, label: el, bump: 0, bench })
})

// ---------------------------------------------------------------------------
// Ball
// ---------------------------------------------------------------------------
const ballGeo = new THREE.IcosahedronGeometry(BALL_R, 2).toNonIndexed()
{
  const base = new THREE.IcosahedronGeometry(1, 0)
  const corners: THREE.Vector3[] = []
  const p = base.attributes.position
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i).normalize()
    if (!corners.some((c) => c.distanceTo(v) < 0.01)) corners.push(v)
  }
  const pos = ballGeo.attributes.position
  const colors: number[] = []
  for (let i = 0; i < pos.count; i += 3) {
    const c = new THREE.Vector3()
    for (let k = 0; k < 3; k++) c.add(new THREE.Vector3().fromBufferAttribute(pos, i + k))
    c.normalize()
    const dark = corners.some((v) => v.dot(c) > 0.94)
    const col = dark ? [0.06, 0.07, 0.12] : [0.96, 0.97, 1]
    for (let k = 0; k < 3; k++) colors.push(...col)
  }
  ballGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  ballGeo.computeVertexNormals()
}
const ball = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, flatShading: true }))
ball.castShadow = true
scene.add(ball)

const ballPos = new THREE.Vector3(0, BALL_R, 0.8)
const ballVel = new THREE.Vector3()
let ballVy = 0
const lastDir = new THREE.Vector3(0, 0, -1)

// Ball marker ring (helps on small screens)
const marker = new THREE.Mesh(
  new THREE.RingGeometry(0.62, 0.75, 32),
  new THREE.MeshBasicMaterial({ color: 0x8ea6ff, transparent: true, opacity: 0.6, depthWrite: false }),
)
marker.rotation.x = -Math.PI / 2
scene.add(marker)

// Tap / click target
const targetMarker = new THREE.Mesh(
  new THREE.RingGeometry(0.3, 0.42, 24),
  new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0, depthWrite: false }),
)
targetMarker.rotation.x = -Math.PI / 2
targetMarker.position.y = 0.03
scene.add(targetMarker)
let target: THREE.Vector3 | null = null

// Confetti
const confettiCount = 500
const confettiPos = new Float32Array(confettiCount * 3)
const confettiVel: THREE.Vector3[] = []
const confettiCol = new Float32Array(confettiCount * 3)
for (let i = 0; i < confettiCount; i++) {
  confettiVel.push(new THREE.Vector3())
  const c = new THREE.Color([0xffd166, 0x3b6cff, 0x8b5cf6, 0xffffff][i % 4])
  confettiCol.set([c.r, c.g, c.b], i * 3)
}
const confettiGeo = new THREE.BufferGeometry()
confettiGeo.setAttribute('position', new THREE.BufferAttribute(confettiPos, 3))
confettiGeo.setAttribute('color', new THREE.BufferAttribute(confettiCol, 3))
const confetti = new THREE.Points(confettiGeo, new THREE.PointsMaterial({ size: 0.28, vertexColors: true, transparent: true }))
confetti.visible = false
scene.add(confetti)
let confettiTime = 0

function launchConfetti() {
  confetti.visible = true
  confettiTime = 3
  for (let i = 0; i < confettiCount; i++) {
    confettiPos.set([(Math.random() - 0.5) * 6, 2 + Math.random(), -HL - 1 + (Math.random() - 0.5) * 2], i * 3)
    confettiVel[i].set((Math.random() - 0.5) * 16, 8 + Math.random() * 10, 4 + Math.random() * 10)
  }
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = new Set<string>()
let started = false
let moved = false
let shootQueued = false

function isTypingTarget(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false
  return t.closest('#panel') !== null || ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(t.tagName)
}

window.addEventListener('keydown', (e) => {
  if (!started) return
  const k = e.key.toLowerCase()
  const control = ['w', 'a', 's', 'd', 'z', 'q', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']
  if (!control.includes(k)) return
  if (isTypingTarget(e.target) && (k.startsWith('arrow') || k === ' ')) return
  e.preventDefault()
  if (k === ' ') shootQueued = true
  else keys.add(k)
})
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()))
window.addEventListener('blur', () => keys.clear())

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (!started) return
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hitPlayer = raycaster.intersectObjects(playerMeshes, true)[0]
  if (hitPlayer?.object.userData.slug) {
    openProject(hitPlayer.object.userData.slug)
    return
  }
  const hit = raycaster.intersectObject(pitch)[0]
  if (hit) {
    target = hit.point.clone()
    target.x = THREE.MathUtils.clamp(target.x, -HW - 1.5, HW + 1.5)
    target.z = THREE.MathUtils.clamp(target.z, -HL - 1.6, HL + 1.5)
    targetMarker.position.set(target.x, 0.03, target.z)
    ;(targetMarker.material as THREE.MeshBasicMaterial).opacity = 0.9
    markMoved()
  }
})

function markMoved() {
  if (!moved) {
    moved = true
    setTimeout(() => hint.classList.add('faded'), 2500)
  }
}

document.getElementById('kickoff')!.addEventListener('click', start)
document.getElementById('skip')!.addEventListener('click', start)
function start() {
  if (started) return
  started = true
  intro.classList.add('hide')
  setTimeout(() => intro.remove(), 700)
  renderer.domElement.focus()
}

// ---------------------------------------------------------------------------
// Game logic
// ---------------------------------------------------------------------------
let touchLock = '' // id of the player/station that was just triggered
let celebrating = 0
let leftCenter = false

function showToast(text: string) {
  toast.textContent = text
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 1600)
}

function scoreGoal() {
  goals++
  scoreEl.textContent = String(goals)
  drawScoreboard()
  showToast('GOAL!')
  launchConfetti()
  celebrating = 3
  setTimeout(() => openSection('contact'), 900)
  setTimeout(() => {
    ballPos.set(0, BALL_R, 0.8)
    ballVel.set(0, 0, 0)
    ballVy = 0
    target = null
    leftCenter = false
  }, 2200)
}

let inGoal = false

function updateBall(dt: number) {
  // Direction from keyboard (screen-aligned: camera looks toward -Z)
  const dir = new THREE.Vector3()
  if (keys.has('w') || keys.has('z') || keys.has('arrowup')) dir.z -= 1
  if (keys.has('s') || keys.has('arrowdown')) dir.z += 1
  if (keys.has('a') || keys.has('q') || keys.has('arrowleft')) dir.x -= 1
  if (keys.has('d') || keys.has('arrowright')) dir.x += 1
  if (dir.lengthSq() > 0) {
    target = null
    markMoved()
  } else if (target) {
    dir.set(target.x - ballPos.x, 0, target.z - ballPos.z)
    if (dir.length() < 0.5) {
      target = null
      dir.set(0, 0, 0)
    }
  }
  if (dir.lengthSq() > 0) {
    dir.normalize()
    lastDir.copy(dir)
    ballVel.addScaledVector(dir, 30 * dt)
    const speed = ballVel.length()
    if (speed > 10.5) ballVel.multiplyScalar(10.5 / speed)
  }

  if (shootQueued) {
    shootQueued = false
    const d = ballVel.lengthSq() > 0.5 ? ballVel.clone().normalize() : lastDir.clone()
    ballVel.copy(d.multiplyScalar(21))
    ballVy = 4.2
    target = null
    markMoved()
  }

  // Friction
  ballVel.multiplyScalar(Math.exp(-(dir.lengthSq() > 0 ? 1.2 : 1.1) * dt))
  ballPos.addScaledVector(ballVel, dt)

  // Vertical (lobbed shots)
  ballVy -= 22 * dt
  ballPos.y += ballVy * dt
  if (ballPos.y < BALL_R) {
    ballPos.y = BALL_R
    ballVy = Math.abs(ballVy) > 2 ? -ballVy * 0.45 : 0
  }

  // Boundaries
  const maxX = HW + 1.8
  if (Math.abs(ballPos.x) > maxX) {
    ballPos.x = Math.sign(ballPos.x) * maxX
    ballVel.x *= -0.6
    target = null
  }
  if (ballPos.z > HL + 1.8) {
    ballPos.z = HL + 1.8
    ballVel.z *= -0.6
    target = null
  }
  const inMouth = Math.abs(ballPos.x) < GOAL_HW - BALL_R && ballPos.y < GOAL_H
  if (ballPos.z < -HL - 0.05) {
    if (inMouth || inGoal) {
      inGoal = true
      if (Math.abs(ballPos.x) > GOAL_HW - BALL_R) {
        ballPos.x = Math.sign(ballPos.x) * (GOAL_HW - BALL_R)
        ballVel.x *= -0.4
      }
      if (ballPos.z < -HL - GOAL_D + BALL_R) {
        ballPos.z = -HL - GOAL_D + BALL_R
        ballVel.z *= -0.25
        ballVel.x *= 0.5
      }
      if (celebrating <= 0 && ballPos.z < -HL - BALL_R) scoreGoal()
    } else if (ballPos.z < -HL - 1.8) {
      ballPos.z = -HL - 1.8
      ballVel.z *= -0.6
      target = null
    }
  } else {
    inGoal = false
  }
  // Goal posts
  for (const px of [-GOAL_HW, GOAL_HW]) {
    const dx = ballPos.x - px
    const dz = ballPos.z + HL
    const d = Math.hypot(dx, dz)
    if (d < BALL_R + 0.1 && ballPos.y < GOAL_H) {
      const nx = dx / d
      const nz = dz / d
      ballPos.x = px + nx * (BALL_R + 0.1)
      ballPos.z = -HL + nz * (BALL_R + 0.1)
      const vn = ballVel.x * nx + ballVel.z * nz
      if (vn < 0) {
        ballVel.x -= 1.7 * vn * nx
        ballVel.z -= 1.7 * vn * nz
      }
    }
  }

  // Players
  for (const p of players) {
    if (p.bench) continue
    const dx = ballPos.x - p.x
    const dz = ballPos.z - p.z
    const d = Math.hypot(dx, dz)
    const minD = PLAYER_R + BALL_R
    if (d < minD && ballPos.y < 2.2) {
      const nx = dx / (d || 1)
      const nz = dz / (d || 1)
      ballPos.x = p.x + nx * minD
      ballPos.z = p.z + nz * minD
      const vn = ballVel.x * nx + ballVel.z * nz
      if (vn < 0) {
        ballVel.x -= 1.5 * vn * nx
        ballVel.z -= 1.5 * vn * nz
      }
      target = null
      if (touchLock !== p.slug) {
        touchLock = p.slug
        p.bump = 1
        openProject(p.slug)
      }
    } else if (touchLock === p.slug && d > minD + 2.2) {
      touchLock = ''
    }
  }

  // Stations
  const distCenter = Math.hypot(ballPos.x, ballPos.z)
  if (distCenter > 5.5) leftCenter = true
  for (const s of stations) {
    if (s.r <= 0) continue
    const d = Math.hypot(ballPos.x - s.x, ballPos.z - s.z)
    if (s.id === 'about' && !leftCenter) continue
    if (d < s.r && touchLock !== s.id) {
      touchLock = s.id
      s.open()
      if (s.id === 'about') leftCenter = false
    } else if (touchLock === s.id && d > s.r + 2) {
      touchLock = ''
    }
  }

  // Rolling rotation
  const v = new THREE.Vector3(ballVel.x, 0, ballVel.z)
  const speed = v.length()
  if (speed > 0.001) {
    const axis = new THREE.Vector3(v.z, 0, -v.x).normalize()
    ball.rotateOnWorldAxis(axis, (speed * dt) / BALL_R)
  }
  ball.position.copy(ballPos)
  marker.position.set(ballPos.x, 0.03, ballPos.z)
}

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------
const camOffset = new THREE.Vector3()
const lookAt = new THREE.Vector3(0, 0, -4)
function updateCamOffset() {
  const portrait = window.innerWidth / window.innerHeight < 0.85
  camera.fov = portrait ? 68 : 48
  camOffset.set(0, portrait ? 28 : 15, portrait ? 25 : 17)
  camera.updateProjectionMatrix()
}

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  labelRenderer.setSize(w, h)
  camera.aspect = w / h
  updateCamOffset()
}
window.addEventListener('resize', resize)
resize()

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()
const tmp = new THREE.Vector3()

function tick() {
  requestAnimationFrame(tick)
  const dt = Math.min(clock.getDelta(), 1 / 30)
  const t = clock.elapsedTime

  if (started) {
    updateBall(dt)
    const desired = tmp.copy(ballPos).add(camOffset)
    desired.y = camOffset.y
    desired.x = THREE.MathUtils.clamp(desired.x, -9, 9) // keep the stands out of the way
    camera.position.lerp(desired, 1 - Math.exp(-3.2 * dt))
    lookAt.lerp(new THREE.Vector3(ballPos.x, 0, ballPos.z - 4), 1 - Math.exp(-5 * dt))
    camera.lookAt(lookAt)
  } else {
    // Slow orbit behind the intro card
    const a = reduceMotion ? 0.6 : t * 0.08 + 0.6
    camera.position.set(Math.sin(a) * 36, 46, Math.cos(a) * 36)
    camera.lookAt(0, 0, 0)
    ball.position.copy(ballPos)
    marker.position.set(ballPos.x, 0.03, ballPos.z)
  }

  // Players: face the ball, idle bob, bump on touch
  const panelOpen = currentPanel()
  for (const p of players) {
    if (!p.bench) {
      const fx = ballPos.x - p.x
      const fz = ballPos.z - p.z
      const desiredRy = Math.atan2(-fx, -fz)
      let diff = desiredRy - p.group.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      p.group.rotation.y += diff * Math.min(1, dt * 3)
    }
    p.bump = Math.max(0, p.bump - dt * 2.5)
    p.group.position.y = (reduceMotion ? 0 : Math.abs(Math.sin(t * 2 + p.x)) * 0.04) + Math.sin(p.bump * Math.PI) * 0.6
    const near = Math.hypot(ballPos.x - p.x, ballPos.z - p.z) < 4 || panelOpen === `project:${p.slug}`
    p.label.classList.toggle('near', near)
  }
  for (const s of stations) {
    if (s.r > 0) s.label.classList.toggle('near', Math.hypot(ballPos.x - s.x, ballPos.z - s.z) < s.r + 2.5)
  }

  // Target marker fade
  const tm = targetMarker.material as THREE.MeshBasicMaterial
  tm.opacity = target ? 0.9 : Math.max(0, tm.opacity - dt * 3)

  // Goal net shake and celebrations
  if (celebrating > 0) {
    celebrating -= dt
    northGoal.net.position.z = Math.sin(t * 40) * 0.06 * celebrating
  }
  updateCrowd(t, celebrating > 0 ? Math.min(1, celebrating) : 0)

  if (confettiTime > 0) {
    confettiTime -= dt
    for (let i = 0; i < confettiCount; i++) {
      const v = confettiVel[i]
      v.y -= 9 * dt
      v.multiplyScalar(Math.exp(-0.9 * dt))
      confettiPos[i * 3] += v.x * dt
      confettiPos[i * 3 + 1] = Math.max(0.05, confettiPos[i * 3 + 1] + v.y * dt)
      confettiPos[i * 3 + 2] += v.z * dt
    }
    confettiGeo.attributes.position.needsUpdate = true
    ;(confetti.material as THREE.PointsMaterial).opacity = Math.min(1, confettiTime)
    if (confettiTime <= 0) confetti.visible = false
  }

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}
tick()

// Close the panel when clicking on the pitch (desktop), so the view is clear again.
renderer.domElement.addEventListener('dblclick', () => closePanel())

// Dev-only hook used to test the physics from the console.
if (import.meta.env.DEV) Object.assign(window, { __pitch: { ballPos, ballVel } })

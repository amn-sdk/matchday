import { education, experience, profile, projects, resumes, skills, type Project } from './content'

/** Squad: each project gets a shirt number and a position on the pitch (4-3-3). */
export interface SquadEntry {
  project: Project
  number: number
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | 'Substitute'
  x: number
  z: number
}

const lineup: [string, number, SquadEntry['position'], number, number][] = [
  ['ladybug-optimization', 1, 'Goalkeeper', 0, 21],
  ['rapizz', 2, 'Defender', 12, 13],
  ['mesh-processing', 4, 'Defender', 4, 14],
  ['deep-learning-labs', 5, 'Defender', -4, 14],
  ['earthquake-dashboard', 3, 'Defender', -12, 13],
  ['quiz-app', 6, 'Midfielder', -9, 3],
  ['facturezen', 8, 'Midfielder', 0, 6.5],
  ['game-jam-2025', 10, 'Midfielder', 9, 3],
  ['tron-ai', 7, 'Forward', 10, -9],
  ['maroctour', 9, 'Forward', 0, -11],
  ['opengl-renderer', 11, 'Forward', -10, -9],
  ['scam-simulator', 12, 'Substitute', -20.5, 9],
]

export const squad: SquadEntry[] = lineup
  .map(([slug, number, position, x, z]) => {
    const project = projects.find((p) => p.slug === slug)
    return project ? { project, number, position, x, z } : null
  })
  .filter((e): e is SquadEntry => e !== null)

export const CLASSIC_URL = profile.links.site

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const panel = document.getElementById('panel')!
const body = document.getElementById('panel-body')!
let current = ''
let onCloseCb: (() => void) | null = null

export function onPanelClose(cb: () => void) {
  onCloseCb = cb
}

export function currentPanel() {
  return panel.hidden ? '' : current
}

export function closePanel() {
  if (panel.hidden) return
  panel.hidden = true
  current = ''
  onCloseCb?.()
}

function show(id: string, html: string) {
  current = id
  body.innerHTML = html
  body.scrollTop = 0
  panel.hidden = false
  ;(document.getElementById('panel-close') as HTMLButtonElement).focus({ preventScroll: true })
}

function projectHtml(e: SquadEntry) {
  const p = e.project
  const team = p.team
    ? `<div class="p-section"><h3>Team</h3><div class="chips">${p.team
        .map((m) => `<span class="chip ${m === profile.name ? 'me' : ''}">${esc(m)}</span>`)
        .join('')}</div></div>`
    : ''
  const link = p.repo
    ? `<a class="btn btn-primary" href="${p.repo}" target="_blank" rel="noreferrer">View on GitHub ↗</a>`
    : `<span class="note">${esc(p.repoNote ?? '')}</span>`
  return `
    <p class="p-eyebrow">#${e.number} · ${e.position} · ${esc(p.kind)}</p>
    <h2 class="p-title" id="panel-title">${esc(p.title)}</h2>
    <p class="p-lead">${esc(p.tagline)}</p>
    ${p.image ? `<img class="p-img" src="${p.image}" alt="${esc(p.title)} cover" />` : ''}
    <p class="note">${esc(p.context)}</p>
    <div class="p-section"><h3>The problem</h3><p>${esc(p.problem)}</p></div>
    <div class="p-section"><h3>My role</h3><p>${esc(p.role)}</p></div>
    <div class="p-section"><h3>Architecture</h3><div class="flowline">${p.architecture
      .map((s, i) => `${i ? '<span class="arrow">→</span>' : ''}<span class="step">${esc(s.label)}</span>`)
      .join('')}</div></div>
    <div class="p-section"><h3>Technical choices</h3><ul>${p.choices
      .map((c) => `<li><strong>${esc(c.name)}</strong> ${esc(c.why)}</li>`)
      .join('')}</ul></div>
    <div class="p-section"><h3>Challenges</h3><ul>${p.challenges
      .map((c) => `<li><strong>${esc(c.problem)}:</strong> ${esc(c.solution)}</li>`)
      .join('')}</ul></div>
    <div class="p-section"><h3>Results</h3><ul>${p.results
      .map((r) => `<li><strong>${esc(r.title)}:</strong> ${esc(r.detail)}</li>`)
      .join('')}</ul></div>
    <div class="p-section"><h3>Stack</h3><div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>
    ${team}
    <div class="p-section"><h3>What I learned</h3><p>${esc(p.learned)}</p></div>
    ${
      p.slides?.length
        ? `<div class="p-section"><h3>Presentation</h3><p class="note">${esc(p.slidesNote ?? '')}</p>
            <div class="deck" data-deck tabindex="0" aria-roledescription="slide deck" aria-label="${esc(p.title)} presentation">
              <div class="deck-stage">
                <img src="${p.slides[0]}" alt="${esc(p.title)} presentation, slide 1 of ${p.slides.length}" data-deck-img />
                <button class="deck-arrow prev" data-deck-go="-1" aria-label="Previous slide" disabled>‹</button>
                <button class="deck-arrow next" data-deck-go="1" aria-label="Next slide">›</button>
              </div>
              <div class="deck-bar"><span data-deck-count aria-live="polite">1 / ${p.slides.length}</span><button class="btn" data-deck-full>Fullscreen</button></div>
            </div></div>`
        : ''
    }
    ${
      p.video || p.gallery?.length
        ? `<div class="p-section"><h3>Demo</h3>${
            p.video
              ? `<video class="p-demo" src="${p.video}" ${p.gallery?.[0] ? `poster="${p.gallery[0]}"` : ''} controls muted loop playsinline preload="metadata" aria-label="${esc(p.title)} demo recording"></video>`
              : ''
          }${
            p.gallery?.length
              ? `<div class="p-gallery">${p.gallery.map((g, i) => `<a href="${g}" target="_blank" rel="noreferrer"><img src="${g}" alt="${esc(p.title)} screenshot ${i + 1}" loading="lazy" /></a>`).join('')}</div>`
              : ''
          }</div>`
        : ''
    }
    <div class="p-actions">${link}</div>
  `
}

export function openProject(slug: string) {
  const e = squad.find((s) => s.project.slug === slug)
  if (!e) return
  show(`project:${slug}`, projectHtml(e))
  const slides = e.project.slides
  const deck = body.querySelector<HTMLElement>('[data-deck]')
  if (!slides?.length || !deck) return
  let i = 0
  const img = deck.querySelector<HTMLImageElement>('[data-deck-img]')!
  const count = deck.querySelector<HTMLElement>('[data-deck-count]')!
  const prev = deck.querySelector<HTMLButtonElement>('.deck-arrow.prev')!
  const next = deck.querySelector<HTMLButtonElement>('.deck-arrow.next')!
  const full = deck.querySelector<HTMLButtonElement>('[data-deck-full]')!
  const go = (n: number) => {
    i = Math.max(0, Math.min(slides.length - 1, n))
    img.src = slides[i]
    img.alt = `${e.project.title} presentation, slide ${i + 1} of ${slides.length}`
    count.textContent = `${i + 1} / ${slides.length}`
    prev.disabled = i === 0
    next.disabled = i === slides.length - 1
    if (slides[i + 1]) new Image().src = slides[i + 1]
  }
  prev.onclick = () => go(i - 1)
  next.onclick = () => go(i + 1)
  deck.onkeydown = (ev) => {
    if (ev.key === 'ArrowRight') { ev.stopPropagation(); go(i + 1) }
    if (ev.key === 'ArrowLeft') { ev.stopPropagation(); go(i - 1) }
  }
  let x0: number | null = null
  deck.ontouchstart = (ev) => (x0 = ev.touches[0].clientX)
  deck.ontouchend = (ev) => {
    if (x0 === null) return
    const dx = ev.changedTouches[0].clientX - x0
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
    x0 = null
  }
  full.onclick = () => {
    if (document.fullscreenElement) return void document.exitFullscreen()
    if (deck.classList.contains('pseudo')) return void deck.classList.remove('pseudo', 'is-full')
    if (deck.requestFullscreen) deck.requestFullscreen().catch(() => deck.classList.add('pseudo', 'is-full'))
    else deck.classList.add('pseudo', 'is-full')
  }
  document.addEventListener('fullscreenchange', () => {
    const on = document.fullscreenElement === deck
    deck.classList.toggle('is-full', on)
    full.textContent = on ? 'Exit fullscreen' : 'Fullscreen'
  })
}

export function openSection(id: string) {
  switch (id) {
    case 'about':
      return show(
        'about',
        `<p class="p-eyebrow">Kick-off · About me</p>
         <h2 class="p-title" id="panel-title">${esc(profile.name)}</h2>
         <p class="p-lead">${esc(profile.summary)}</p>
         ${profile.about.map((p) => `<div class="p-section"><p>${esc(p)}</p></div>`).join('')}
         <div class="p-section"><h3>Languages</h3><div class="chips">${profile.languages
           .map((l) => `<span class="chip">${esc(l.name)} · ${esc(l.level)}</span>`)
           .join('')}</div></div>
         <div class="p-section"><h3>Looking for</h3><p>${esc(profile.availability)}</p></div>
         <div class="p-actions">
           <button class="btn btn-primary" data-open="squad">Meet the squad</button>
           <button class="btn" data-open="resume">Resume</button>
         </div>`,
      )
    case 'squad': {
      const groups: SquadEntry['position'][] = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Substitute']
      const labels: Record<string, string> = {
        Forward: 'Forwards · featured projects',
        Midfielder: 'Midfield',
        Defender: 'Defense',
        Goalkeeper: 'Goalkeeper',
        Substitute: 'Bench',
      }
      return show(
        'squad',
        `<p class="p-eyebrow">Starting XI · ${squad.length} projects</p>
         <h2 class="p-title" id="panel-title">The squad</h2>
         <p class="p-lead">Every player is a project. Pick one to read the case study, or dribble into them on the pitch.</p>
         ${groups
           .map((g) => {
             const list = squad.filter((s) => s.position === g)
             if (!list.length) return ''
             return `<div class="squad-group"><h3>${labels[g]}</h3>${list
               .map(
                 (s) => `<button class="squad-row" data-project="${s.project.slug}">
                   <span class="num ${g === 'Goalkeeper' ? 'gk' : g === 'Substitute' ? 'sub' : ''}">${s.number}</span>
                   <span><strong>${esc(s.project.title)}</strong><small>${esc(s.project.kind)} · ${esc(s.project.stack.slice(0, 3).join(', '))}</small></span>
                 </button>`,
               )
               .join('')}</div>`
           })
           .join('')}`,
      )
    }
    case 'career':
      return show(
        'career',
        `<p class="p-eyebrow">The dugout · Career</p>
         <h2 class="p-title" id="panel-title">Experience</h2>
         ${experience
           .map(
             (e) => `<div class="tl">
               <div class="tl-period">${esc(e.period)} · ${esc(e.location)}</div>
               <h4>${esc(e.role)}</h4>
               <div class="org">${esc(e.company)}</div>
               <div class="p-section" style="margin-top:6px"><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
             </div>`,
           )
           .join('')}
         <h2 class="p-title" style="margin-top:28px;font-size:24px">Education</h2>
         ${education
           .map(
             (e) => `<div class="tl">
               <div class="tl-period">${esc(e.period || '')}${e.period ? ' · ' : ''}${esc(e.location)}</div>
               <h4>${esc(e.school)}</h4>
               <div class="org">${esc(e.degree)}</div>
               <p class="note" style="margin:0">${esc(e.detail)}</p>
             </div>`,
           )
           .join('')}`,
      )
    case 'skills':
      return show(
        'skills',
        `<p class="p-eyebrow">Tactics board · Skills</p>
         <h2 class="p-title" id="panel-title">Technical skills</h2>
         ${skills
           .map(
             (s) => `<div class="p-section"><h3>${esc(s.group)}</h3><div class="chips">${s.items
               .map((i) => `<span class="chip">${esc(i)}</span>`)
               .join('')}</div></div>`,
           )
           .join('')}`,
      )
    case 'contact':
      return show(
        'contact',
        `<p class="p-eyebrow">Full time · Contact</p>
         <h2 class="p-title" id="panel-title">Let's build something together.</h2>
         <p class="p-lead">I'm looking for software engineering opportunities in the United States. The fastest way to reach me is by email or LinkedIn.</p>
         <div class="p-actions" style="flex-direction:column;align-items:stretch">
           <a class="btn btn-primary" href="mailto:${profile.email}">✉ ${esc(profile.email)}</a>
           <a class="btn" href="${profile.links.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
           <a class="btn" href="${profile.links.github}" target="_blank" rel="noreferrer">GitHub ↗</a>
           ${profile.phones.map((ph) => `<a class="btn" href="tel:${ph.tel}">☎ ${esc(ph.display)} · ${esc(ph.label)}</a>`).join('')}
           <button class="btn" data-open="resume">Resume · CV</button>
         </div>`,
      )
    case 'resume':
      return show(
        'resume',
        `<p class="p-eyebrow">Corner flag · Resume / CV</p>
         <h2 class="p-title" id="panel-title">Resume</h2>
         <p class="p-lead">English and French versions, side by side.</p>
         <div class="cv-grid">${resumes
           .map(
             (r) => `<section class="cv-col" lang="${r.lang}">
               <h3><span class="num station">${r.flag}</span> ${esc(r.heading)} <small>${esc(r.language)}</small></h3>
               <a class="cv-paper" href="${r.pdf}" target="_blank" rel="noreferrer"><img src="${r.preview}" alt="${esc(r.heading)} (${esc(r.language)})" loading="lazy" /></a>
               <div class="p-actions">
                 <a class="btn btn-primary" href="${r.pdf}" target="_blank" rel="noreferrer">${esc(r.open)} ↗</a>
                 <a class="btn" href="${r.pdf}" download>${esc(r.download)}</a>
               </div>
               <div class="p-section"><h3>${esc(r.aboutTitle)}</h3>${r.about.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
             </section>`,
           )
           .join('')}</div>`,
      )
    case 'menu':
      return show(
        'menu',
        `<p class="p-eyebrow">Menu</p>
         <h2 class="p-title" id="panel-title">Go to</h2>
         <div class="p-actions" style="flex-direction:column;align-items:stretch">
           <button class="btn" data-open="squad">Squad · projects</button>
           <button class="btn" data-open="career">Career · experience</button>
           <button class="btn" data-open="skills">Skills</button>
           <button class="btn" data-open="about">About me</button>
           <button class="btn btn-primary" data-open="contact">Contact</button>
           <button class="btn" data-open="resume">Resume</button>
           <a class="btn" href="${CLASSIC_URL}">Classic portfolio</a>
         </div>`,
      )
  }
}

/** Wire every [data-open] and [data-project] button, including those rendered later in the panel. */
export function bindUi() {
  document.addEventListener('click', (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-open],[data-project]')
    if (!el) return
    if (el.dataset.open) openSection(el.dataset.open)
    if (el.dataset.project) openProject(el.dataset.project)
  })
  document.getElementById('panel-close')!.addEventListener('click', closePanel)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel()
  })
  ;(document.getElementById('classic-link') as HTMLAnchorElement).href = CLASSIC_URL
}

interface LoopState {
  start: number | null
  end: number | null
  active: boolean
}

interface SavedLoop {
  videoId: string
  start: number
  end: number
  label?: string
  createdAt: number
}

let loopState: LoopState = { start: null, end: null, active: false }
let checkInterval: number | null = null
let currentVideoId: string | null = null

function getVideo(): HTMLVideoElement | null {
  return document.querySelector('video.html5-main-video')
}

function getVideoId(): string | null {
  const url = new URL(location.href)
  return url.searchParams.get('v')
}

function formatTime(s: number): string {
  const mins = Math.floor(s / 60)
  const secs = Math.floor(s % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

async function saveLoop() {
  if (!currentVideoId || loopState.start === null || loopState.end === null) return

  const loop: SavedLoop = {
    videoId: currentVideoId,
    start: loopState.start,
    end: loopState.end,
    createdAt: Date.now()
  }

  const key = `loop_${currentVideoId}`
  await chrome.storage.local.set({ [key]: loop })
  showToast('Loop saved')
}

async function loadLoop() {
  if (!currentVideoId) return

  const key = `loop_${currentVideoId}`
  const result = await chrome.storage.local.get(key)
  const saved = result[key] as SavedLoop | undefined

  if (saved) {
    loopState.start = saved.start
    loopState.end = saved.end
    updatePanel()
    showToast(`Loaded: ${formatTime(saved.start)} - ${formatTime(saved.end)}`)
  }
}

function setStart() {
  const video = getVideo()
  if (!video) return
  loopState.start = video.currentTime
  updatePanel()
  showToast(`Start: ${formatTime(video.currentTime)}`)
}

function setEnd() {
  const video = getVideo()
  if (!video) return
  loopState.end = video.currentTime
  updatePanel()
  showToast(`End: ${formatTime(video.currentTime)}`)
}

function toggleLoop() {
  loopState.active? clearLoop() : startLoop()
}

function startLoop() {
  const video = getVideo()
  if (!video || loopState.start === null || loopState.end === null) {
    showToast('Set start and end first')
    return
  }
  if (loopState.start >= loopState.end) {
    showToast('Start must be before end')
    return
  }

  loopState.active = true
  video.currentTime = loopState.start
  video.play()

  if (checkInterval) clearInterval(checkInterval)
  checkInterval = window.setInterval(() => {
    if (!loopState.active || loopState.end === null ||!video) return
    if (video.currentTime >= loopState.end) {
      video.currentTime = loopState.start!
    }
  }, 50) // 50ms for smoother loop

  updatePanel()
  saveLoop()
}

function clearLoop() {
  loopState = { start: null, end: null, active: false }
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
  updatePanel()
}

function showToast(msg: string) {
  const existing = document.getElementById('yt-loop-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.id = 'yt-loop-toast'
  toast.textContent = msg
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.95);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 2147483647;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    pointer-events: none;
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2000)
}

function updatePanel() {
  const startBtn = document.getElementById('yt-loop-start-btn')
  const endBtn = document.getElementById('yt-loop-end-btn')
  const loopBtn = document.getElementById('yt-loop-toggle-btn')

  if (startBtn) {
    startBtn.textContent = loopState.start!== null
     ? `A: ${formatTime(loopState.start)}`
      : 'Set A'
    startBtn.style.background = loopState.start!== null? '#0a5' : '#333'
  }

  if (endBtn) {
    endBtn.textContent = loopState.end!== null
     ? `B: ${formatTime(loopState.end)}`
      : 'Set B'
    endBtn.style.background = loopState.end!== null? '#0a5' : '#333'
  }

  if (loopBtn) {
    loopBtn.textContent = loopState.active? 'Stop' : 'Loop'
    loopBtn.style.background = loopState.active? '#c00' : '#333'
    loopBtn.style.opacity = (loopState.start!== null && loopState.end!== null)? '1' : '0.5'
  }
}

function injectControls() {
  const controls = document.querySelector('.ytp-right-controls')
  if (!controls || document.getElementById('yt-loop-controls')) return

  const container = document.createElement('div')
  container.id = 'yt-loop-controls'
  container.style.cssText = `display: inline-flex; gap: 4px; margin-right: 8px;`

  const makeBtn = (id: string, text: string, onClick: () => void, title: string) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.textContent = text
    btn.title = title
    btn.onclick = onClick
    btn.className = 'ytp-button'
    btn.style.cssText = `
      background: #333;
      color: white;
      border: none;
      padding: 0 10px;
      height: 36px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      margin: 6px 1px;
    `
    btn.onmouseenter = () => btn.style.background = '#444'
    btn.onmouseleave = () => updatePanel()
    return btn
  }

  container.appendChild(makeBtn('yt-loop-start-btn', 'Set A', setStart, 'Set loop start ['))
  container.appendChild(makeBtn('yt-loop-end-btn', 'Set B', setEnd, 'Set loop end ]'))
  container.appendChild(makeBtn('yt-loop-toggle-btn', 'Loop', toggleLoop, 'Toggle loop \\'))

  controls.prepend(container)
  updatePanel()
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  if (e.key === '[') {
    e.preventDefault()
    setStart()
  }
  if (e.key === ']') {
    e.preventDefault()
    setEnd()
  }
  if (e.key === '\\') {
    e.preventDefault()
    toggleLoop()
  }
})

// Message listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ pong: true })
    return true
  }
  if (msg.type === 'GET_STATE') {
    sendResponse({ loopState, currentTime: getVideo()?.currentTime || 0 })
    return true
  }
  if (msg.type === 'SET_LOOP') {
    loopState.start = msg.start
    loopState.end = msg.end
    startLoop()
    sendResponse({ success: true })
    return true
  }
  if (msg.type === 'CLEAR_LOOP') {
    clearLoop()
    sendResponse({ success: true })
    return true
  }
  return true
})

// Init + SPA navigation
const observer = new MutationObserver(() => {
  injectControls()
  const vid = getVideoId()
  if (vid && vid!== currentVideoId) {
    currentVideoId = vid
    clearLoop()
    loadLoop()
  }
})
observer.observe(document.body, { childList: true, subtree: true })

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectControls)
} else {
  injectControls()
  currentVideoId = getVideoId()
  loadLoop()
}

export {}
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './popup.css'

function Nav() {
  const { pathname } = useLocation()
  const tabs = [
    { path: '/', label: 'Loop' },
    { path: '/shortcuts', label: 'Shortcuts' },
    { path: '/loops', label: 'Saved' },
    { path: '/about', label: 'About' },
  ]

  return (
    <nav className="nav">
      {tabs.map(t => (
        <Link
          key={t.path}
          to={t.path}
          className={pathname === t.path? 'nav-active' : ''}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}

function LoopControls() {
  const [start, setStart] = useState<number | null>(null)
  const [end, setEnd] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isActive, setIsActive] = useState(false)

  async function getActiveTabId(): Promise<number> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) throw new Error('No active tab')

    // Ping to verify content script is loaded
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'PING' })
    } catch (e) {
      throw new Error('Please refresh the YouTube page')
    }
    return tab.id
  }

  async function getCurrentTime() {
    try {
      const tabId = await getActiveTabId()
      const res = await chrome.tabs.sendMessage(tabId, { type: 'GET_TIME' })
      if (res?.time!== undefined) {
        setCurrentTime(res.time)
      }
    } catch (e: any) {
      console.error(e.message)
    }
  }

  async function handleSetStart() {
    await getCurrentTime()
    setStart(currentTime) // start and setStart are in scope here
  }

  async function handleSetEnd() {
    await getCurrentTime()
    setEnd(currentTime) // end and setEnd are in scope here
  }

  async function handleStartLoop() {
    if (start === null || end === null || start >= end) {
      alert('Set valid start and end points. Start must be < End.')
      return
    }

    try {
      const tabId = await getActiveTabId()
      await chrome.tabs.sendMessage(tabId, {
        type: 'SET_LOOP',
        start,
        end
      })
      setIsActive(true)
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function handleClearLoop() {
    try {
      const tabId = await getActiveTabId()
      await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_LOOP' })
      setIsActive(false)
      setStart(null)
      setEnd(null)
    } catch (e: any) {
      alert(e.message)
    }
  }

  useEffect(() => {
    getCurrentTime()
    const interval = setInterval(getCurrentTime, 500)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = (s % 60).toFixed(2)
    return `${mins}:${secs.padStart(5, '0')}`
  }

  return (
    <div className="loop-controls">
      <div className="time-display">
        Current: {formatTime(currentTime)}
      </div>

      <div className="points">
        <button onClick={handleSetStart} className="btn">
          Set Start: {start!== null? formatTime(start) : '--:--'}
        </button>
        <button onClick={handleSetEnd} className="btn">
          Set End: {end!== null? formatTime(end) : '--:--'}
        </button>
      </div>

      <div className="actions">
        <button
          onClick={handleStartLoop}
          className="btn btn-primary"
          disabled={start === null || end === null}
        >
          {isActive? 'Update Loop' : 'Start Loop'}
        </button>
        <button
          onClick={handleClearLoop}
          className="btn btn-danger"
          disabled={!isActive && start === null}
        >
          Clear
        </button>
      </div>

      {isActive && start!== null && end!== null && (
        <div className="active-loop">
          Looping {formatTime(start)} → {formatTime(end)}
        </div>
      )}
    </div>
  )
}

function PopupContent() {
  const { pathname } = useLocation()

  return (
    <div className="popup-container">
      <Nav />
      <div className="content">
        {pathname === '/' && <LoopControls />}
        {pathname === '/shortcuts' && <div>Shortcuts coming soon</div>}
        {pathname === '/loops' && <div>Saved loops coming soon</div>}
        {pathname === '/about' && <div>YouTube Loop v0.1.0</div>}
      </div>
    </div>
  )
}

export default function Popup() {
  return <PopupContent />
}
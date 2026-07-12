import React from 'react'
import ReactDOM from 'react-dom/client'
import { Logger } from '../utils/logger'
import Panel from '../panel/Panel'

const logger = new Logger('Injector')
const CONTAINER_ID = 'yt-loop-panel-root'

export class Injector {
  private root: ReactDOM.Root | null = null
  private container: HTMLElement | null = null

  mount() {
    if (document.getElementById(CONTAINER_ID)) {
      logger.warn('Panel already mounted')
      return
    }

    this.container = document.createElement('div')
    this.container.id = CONTAINER_ID
    document.body.appendChild(this.container)

    this.root = ReactDOM.createRoot(this.container)
    this.root.render(React.createElement(Panel))
    logger.info('Panel mounted')
  }

  unmount() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    if (this.container) {
      this.container.remove()
      this.container = null
    }
    logger.info('Panel unmounted')
  }
}
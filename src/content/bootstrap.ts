import { Logger } from '../utils/logger'
import { YoutubeObserver } from './youtubeObserver'
import { Injector } from './injector'
import { eventBus } from '../core/EventBus'
import type { YoutubePlayerState } from '../types/youtube'

const logger = new Logger('Bootstrap')

export class Bootstrap {
  private observer = new YoutubeObserver()
  private injector = new Injector()

  async start() {
    logger.info('Starting content script')
    
    // Wait for YouTube to be ready, then inject
    eventBus.on('youtube:ready', (state: YoutubePlayerState) => {
      if (state.isReady) {
        logger.info('YouTube ready, injecting panel')
        this.injector.mount()
      }
    })

    await this.observer.init()
  }

  stop() {
    logger.info('Stopping content script')
    this.observer.cleanup()
    this.injector.unmount()
  }
}
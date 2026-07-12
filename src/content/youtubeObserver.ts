import { Logger } from '../utils/logger'
import { waitForElement, getVideoId } from '../utils/dom'
import { eventBus } from '../core/EventBus'
import type { YoutubePlayerState } from '../types/youtube'

const logger = new Logger('YoutubeObserver')

export class YoutubeObserver {
  private video: HTMLVideoElement | null = null
  private currentVideoId: string | null = null
  private observer: MutationObserver | null = null

  async init() {
    logger.info('Initializing YouTube observer')
    await this.findVideo()
    this.watchNavigation()
  }

  private async findVideo() {
    this.video = await waitForElement<HTMLVideoElement>('video.html5-main-video')
    if (this.video) {
      this.currentVideoId = getVideoId()
      logger.info('Video element found', { videoId: this.currentVideoId })
      this.emitState()
    } else {
      logger.warn('Video element not found')
    }
  }

  private watchNavigation() {
    // YouTube is a SPA, so we watch for URL changes
    let lastUrl = location.href
    this.observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href
        logger.info('Navigation detected', { url: lastUrl })
        this.handleNavigation()
      }
    })

    this.observer.observe(document, { subtree: true, childList: true })
  }

  private async handleNavigation() {
    const newVideoId = getVideoId()
    if (newVideoId !== this.currentVideoId) {
      logger.info('Video changed', { from: this.currentVideoId, to: newVideoId })
      await this.findVideo()
    }
  }

  private emitState() {
    const state: YoutubePlayerState = {
      video: this.video,
      videoId: this.currentVideoId,
      isReady: !!this.video
    }
    eventBus.emit('youtube:ready', state)
  }

  cleanup() {
    this.observer?.disconnect()
    this.video = null
    logger.info('Observer cleaned up')
  }
}
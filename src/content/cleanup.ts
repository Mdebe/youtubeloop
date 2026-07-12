import { Logger } from '../utils/logger'

const logger = new Logger('Cleanup')

export function setupCleanup(callback: () => void) {
  window.addEventListener('beforeunload', () => {
    logger.info('Page unloading, cleaning up')
    callback()
  })
}
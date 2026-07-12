import { Logger } from '../utils/logger'

const logger = new Logger('Background')

chrome.runtime.onInstalled.addListener(() => {
  logger.info('YouTube Loop installed')
})

export {}
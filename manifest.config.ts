import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'YouTube Loop',
  version: '1.0.0',
  description: 'isimbelambela mculo ',
  permissions: ['storage', 'activeTab'],
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'public/icon16.png',
      48: 'public/icon48.png',
      128: 'public/icon128.png'
    }
  },
  icons: {
    16: 'public/icon16.png',
    48: 'public/icon48.png',
    128: 'public/icon128.png'
  },
  content_scripts: [
    {
      matches: ['*://*.youtube.com/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle'
    }
  ]
})
export function waitForElement<T extends Element>(
  selector: string,
  timeout = 10000
): Promise<T | null> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector<T>(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect()
        resolve(document.querySelector<T>(selector))
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}

export function getVideoId(): string | null {
  const url = new URL(window.location.href)
  return url.searchParams.get('v')
}
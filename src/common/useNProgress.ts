import { useRouter } from 'next/router'
import np from 'nprogress'
import { useEffect } from 'react'

/** Show progress indicator only if transition takes longer than `delay`. */
const delay = 250

np.configure({ showSpinner: false })

let timeout: number

function startProgressIndicator() {
  timeout = window.setTimeout(np.start, delay)
}

function stopProgressIndicator() {
  window.clearTimeout(timeout)
  np.done()
}

/**
 * Adds progress bar for client-side transitions.
 *
 * Should be placed in `pages/_app.page.tsx`.
 */
export function useNProgress(): void {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', startProgressIndicator)
    router.events.on('routeChangeComplete', stopProgressIndicator)
    router.events.on('routeChangeError', stopProgressIndicator)

    return () => {
      router.events.off('routeChangeStart', startProgressIndicator)
      router.events.off('routeChangeComplete', stopProgressIndicator)
      router.events.off('routeChangeError', stopProgressIndicator)
    }
  }, [router.events])
}

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Collection routes that should preserve scroll position
const COLLECTION_ROUTES = ['/diva', '/mini', '/paws', '/collections']
const SCROLL_KEY_PREFIX = 'mulyam-scroll-'

function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  // Check if a path is a collection page
  const isCollectionPage = (path) => {
    return COLLECTION_ROUTES.some(route => path.startsWith(route))
  }

  // Check if a path is a product page
  const isProductPage = (path) => {
    return path.startsWith('/products/')
  }

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isCollectionPage(pathname)) {
        sessionStorage.setItem(
          SCROLL_KEY_PREFIX + pathname,
          String(window.scrollY)
        )
      }
    }

    // Save on page unload
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      // Save scroll position when unmounting (navigating away)
      if (isCollectionPage(pathname)) {
        sessionStorage.setItem(
          SCROLL_KEY_PREFIX + pathname,
          String(window.scrollY)
        )
      }
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  useEffect(() => {
    const prevPath = prevPathname.current
    prevPathname.current = pathname

    // If navigating from product page back to collection page
    if (isProductPage(prevPath) && isCollectionPage(pathname)) {
      const savedScroll = sessionStorage.getItem(SCROLL_KEY_PREFIX + pathname)
      if (savedScroll) {
        // Delay to ensure content is rendered
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScroll, 10))
        })
        return
      }
    }

    // For all other navigations, scroll to top
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop

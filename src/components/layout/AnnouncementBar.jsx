import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AnnouncementBar({
  banners = [],
  // Legacy single-banner props for backwards compatibility
  message,
  bgColor,
  textColor,
  link,
  // Rotation settings
  rotationInterval = 3000, // 3 seconds default
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Convert legacy props to banners array if needed
  // Banners from useStoreBanners use camelCase: text, bgColor, textColor, link
  const allBanners = banners.length > 0 ? banners : message ? [{
    text: message,
    bgColor: bgColor,
    textColor: textColor,
    link: link,
  }] : [{
    text: "Free shipping on orders above ₹1,499!",
    bgColor: null,
    textColor: null,
    link: null,
  }]

  // Rotate banners
  useEffect(() => {
    if (allBanners.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % allBanners.length)
        setIsTransitioning(false)
      }, 300) // Fade out duration
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [allBanners.length, rotationInterval])

  const currentBanner = allBanners[currentIndex]
  const displayMessage = currentBanner?.text || "Free shipping on orders above ₹1,499!"

  const style = {
    backgroundColor: currentBanner?.bgColor || undefined,
    color: currentBanner?.textColor || undefined,
  }

  const content = (
    <div
      className={`text-center py-2 text-sm font-body transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      } ${!currentBanner?.bgColor ? 'bg-coral' : ''} ${!currentBanner?.textColor ? 'text-white' : ''}`}
      style={style}
    >
      {displayMessage}
    </div>
  )

  // If there's a link, wrap in Link component
  const linkUrl = currentBanner?.link
  if (linkUrl) {
    // Check if it's an internal or external link
    if (linkUrl.startsWith('/')) {
      return <Link to={linkUrl}>{content}</Link>
    }
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

export default AnnouncementBar

'use client'

import React, { useState, useRef, useEffect } from 'react'

interface HoverCardProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  positionX?: 'left' | 'center' | 'right';
  positionY?: 'top' | 'bottom';
  width?: number | string;
  onHoverChange?: (isHovered: boolean) => void;
}

export default function HoverCard({
  trigger,
  children,
  positionX = 'right',
  positionY = 'bottom',
  width = 250,
  onHoverChange
}: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [adjustedPositionY, setAdjustedPositionY] = useState<'top' | 'bottom'>(positionY)
  const avatarRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    // Cancel any existing timeout to avoid multiple actions in rapid succession
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Set the timeout to show the card
    timeoutRef.current = setTimeout(() => {
      setIsRendered(true)  // Begin rendering the card after the delay
      setTimeout(() => {
        setIsHovered(true)
        if (onHoverChange) {
          onHoverChange(true)
        }
      }, 50)
    }, 800)
  }

  const handleMouseLeave = () => {
    // Immediately hide the hover card if the mouse leaves 
    setIsHovered(false)
    if (onHoverChange) {
      onHoverChange(false)
    }

    // Clear the timeout to avoid triggering the hover card after mouse leave
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Hide the rendered card shortly after the mouse leaves
    timeoutRef.current = setTimeout(() => setIsRendered(false), 300)
  }

  const updatePosition = () => {
    if (!cardRef.current || !avatarRef.current) return

    const cardRect = cardRef.current.getBoundingClientRect()
    const avatarRect = avatarRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    if (cardRect.height + avatarRect.bottom > viewportHeight) {
      setAdjustedPositionY('top')
    } else {
      setAdjustedPositionY('bottom')
    }
  }

  useEffect(() => {
    if (!isRendered) return
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isRendered])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const positionYStyles = adjustedPositionY === 'bottom'
    ? { top: '100%' }
    : { bottom: '100%' }

  let positionXClasses = ''
  if (positionX === 'left') {
    positionXClasses = 'left-0'
  } else if (positionX === 'center') {
    positionXClasses = 'left-1/2 -translate-x-1/2'
  } else if (positionX === 'right') {
    positionXClasses = 'right-0'
  }

  return (
    <div
      className="relative inline-block hoverCard"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={avatarRef}
    >
      {trigger}
      {isRendered && (
        <div
          ref={cardRef}
          className={`pt-3 pb-3 absolute ${positionXClasses} z-50 transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            ...positionYStyles,
            width: typeof width === 'number' ? `${width}px` : width
          }}
          aria-hidden={!isHovered}
        >
          <div className={`border borderColor shadow-md shadow-gray-200 dark:shadow-neutral-700/70 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden`}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
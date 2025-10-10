import React, { useEffect, useState } from 'react'
import type { ImageFile, Config } from '../App'

interface AnimationPreviewProps {
  images: ImageFile[]
  config: Config
}

const AnimationPreview: React.FC<AnimationPreviewProps> = ({ images, config }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying || images.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, config.frameDuration)

    return () => clearInterval(interval)
  }, [images.length, config.frameDuration, isPlaying])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const goToFrame = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="animation-preview">
        <div className="preview-placeholder">
          <p>Upload images to see animation preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animation-preview">
      <div className="preview-container">
        <div className="preview-image-container">
          <img
            src={images[currentImageIndex]?.url}
            alt={`Frame ${currentImageIndex + 1}`}
            className="preview-image"
          />
          <div className="preview-controls">
            <button onClick={togglePlayback} className="play-pause-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <span className="frame-counter">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        <div className="frame-timeline">
          <div className="timeline-label">Frames:</div>
          <div className="timeline-frames">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToFrame(index)}
                className={`frame-thumb ${index === currentImageIndex ? 'active' : ''}`}
              >
                <img src={image.url} alt={`Frame ${index + 1}`} />
                <span className="frame-number">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="preview-info">
          <div className="info-item">
            <strong>Total Frames:</strong> {images.length}
          </div>
          <div className="info-item">
            <strong>Frame Duration:</strong> {config.frameDuration}ms
          </div>
          <div className="info-item">
            <strong>Total Duration:</strong> {(images.length * config.frameDuration / 1000).toFixed(1)}s
          </div>
          <div className="info-item">
            <strong>FPS:</strong> {(1000 / config.frameDuration).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimationPreview
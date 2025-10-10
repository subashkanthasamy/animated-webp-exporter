import React from 'react'
import type { ImageFile, Config } from '../App'

interface ConvertButtonProps {
  images: ImageFile[]
  config: Config
  isConverting: boolean
  setIsConverting: React.Dispatch<React.SetStateAction<boolean>>
}

const ConvertButton: React.FC<ConvertButtonProps> = ({
  images,
  config,
  isConverting,
  setIsConverting
}) => {
  const loadImageAsCanvas = (imageFile: ImageFile): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        resolve(canvas)
      }
      img.src = imageFile.url
    })
  }


  const convertToWebP = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    console.log('Starting conversion with', images.length, 'images')

    try {
      // For now, let's create individual WebP files for each image
      // This will work reliably while we debug the animated WebP issue

      for (let i = 0; i < images.length; i++) {
        console.log(`Converting image ${i + 1}/${images.length}`)

        const canvas = await loadImageAsCanvas(images[i])

        // Convert canvas to WebP blob
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `image_${i + 1}_${Date.now()}.webp`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              console.log(`Downloaded image ${i + 1}`)
            }
            resolve()
          }, 'image/webp', config.quality / 100)
        })

        // Add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log('All images converted and downloaded')
      setIsConverting(false)
    } catch (error) {
      console.error('Error converting to WebP:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setIsConverting(false)
    }
  }

  if (images.length === 0) {
    return (
      <div className="convert-section">
        <p className="convert-message">Upload images to enable conversion</p>
      </div>
    )
  }

  return (
    <div className="convert-section">
      <div className="convert-buttons">
        <button
          onClick={convertToWebP}
          disabled={isConverting}
          className="convert-btn convert-webp-btn"
        >
          {isConverting ? '🔄 Converting...' : '🖼️ Download as WebP'}
        </button>
      </div>

      <div className="format-info">
        <div className="format-card">
          <h4>🖼️ WebP Images</h4>
          <ul>
            <li>Modern format</li>
            <li>High quality compression</li>
            <li>Individual image files</li>
            <li>Better than JPEG/PNG</li>
          </ul>
        </div>
      </div>

      {isConverting && (
        <div className="converting-status">
          <div className="spinner"></div>
          <p>Processing {images.length} images...</p>
        </div>
      )}
    </div>
  )
}

export default ConvertButton
import React, { useCallback } from 'react'
import type { ImageFile } from '../App'

interface ImageUploaderProps {
  images: ImageFile[]
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    const newImages: ImageFile[] = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: crypto.randomUUID()
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      const toRemove = prev.find(img => img.id === id)
      if (toRemove) {
        URL.revokeObjectURL(toRemove.url)
      }
      return updated
    })
  }

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.url))
    setImages([])
  }

  return (
    <div className="image-uploader">
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <div className="drop-zone-content">
          <p>📷 Drag & drop images here</p>
          <p>or</p>
          <label className="file-input-label">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="file-input"
            />
            Choose Files
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="image-grid">
          <div className="image-grid-header">
            <h3>{images.length} images selected</h3>
            <button onClick={clearAll} className="clear-btn">
              Clear All
            </button>
          </div>
          <div className="images">
            {images.map((image, index) => (
              <div key={image.id} className="image-item">
                <img src={image.url} alt={`Preview ${index + 1}`} />
                <div className="image-overlay">
                  <span className="image-number">{index + 1}</span>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
import React from 'react'
import type { ImageFile, Config } from '../App'
// @ts-expect-error - gif.js doesn't have TypeScript declarations
import GIF from 'gif.js'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

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

  const convertToAnimatedGIF = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    console.log('Starting animated GIF conversion with', images.length, 'images')

    try {
      // Initialize GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 0, // Will be set from first image
        height: 0, // Will be set from first image
        workerScript: '/gif.worker.js' // Note: This needs to be available in public folder
      })

      for (let i = 0; i < images.length; i++) {
        console.log(`Processing image ${i + 1}/${images.length}`)
        const canvas = await loadImageAsCanvas(images[i])

        // Set dimensions from first image
        if (i === 0) {
          gif.setOptions({ width: canvas.width, height: canvas.height })
        }

        gif.addFrame(canvas, { delay: config.frameDuration })
      }

      gif.on('finished', function(blob: Blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `animated_${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        console.log('Animated GIF created and downloaded')
        setIsConverting(false)
      })

      gif.render()
    } catch (error) {
      console.error('Error creating animated GIF:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setIsConverting(false)
    }
  }


  const convertToAnimatedWebP = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    console.log('Starting animated WebP conversion with', images.length, 'images')

    try {
      // Initialize FFmpeg
      const ffmpeg = new FFmpeg()

      // Load FFmpeg core with error handling
      console.log('Loading FFmpeg...')
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        })
      } catch (loadError) {
        console.error('Failed to load FFmpeg:', loadError)
        alert('FFmpeg failed to load. This may be due to browser compatibility or network issues. Please try the Animated GIF option instead.')
        setIsConverting(false)
        return
      }

      // Convert images to WebP format and write to FFmpeg filesystem
      for (let i = 0; i < images.length; i++) {
        console.log(`Processing image ${i + 1}/${images.length}`)
        const canvas = await loadImageAsCanvas(images[i])

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!)
          }, 'image/webp', config.quality / 100)
        })

        // Write to FFmpeg filesystem with zero-padded filename
        const fileName = `frame_${i.toString().padStart(4, '0')}.webp`
        await ffmpeg.writeFile(fileName, await fetchFile(blob))
      }

      // Create animated WebP using FFmpeg
      console.log('Creating animated WebP...')
      const framerate = 1000 / config.frameDuration // Convert ms to fps
      await ffmpeg.exec([
        '-framerate', framerate.toString(),
        '-i', 'frame_%04d.webp',
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-quality', config.quality.toString(),
        '-loop', '0', // Infinite loop
        'output.webp'
      ])

      // Read the output file
      const data = await ffmpeg.readFile('output.webp')
      const animatedWebPBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/webp' })

      // Download the animated WebP
      const url = URL.createObjectURL(animatedWebPBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `animated_${Date.now()}.webp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log('Animated WebP created and downloaded')
      setIsConverting(false)
    } catch (error) {
      console.error('Error creating animated WebP:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setIsConverting(false)
    }
  }

  const convertToWebPFiles = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    console.log('Starting individual WebP conversion with', images.length, 'images')

    try {
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
              a.download = `frame_${i + 1}_${Date.now()}.webp`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              console.log(`Downloaded frame ${i + 1}`)
            }
            resolve()
          }, 'image/webp', config.quality / 100)
        })

        // Add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log('All WebP files created and downloaded')
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
          onClick={convertToAnimatedWebP}
          disabled={isConverting}
          className="convert-btn convert-webp-animated-btn"
        >
          {isConverting ? '🔄 Converting...' : '🎬 Download as Animated WebP'}
        </button>
        <button
          onClick={convertToAnimatedGIF}
          disabled={isConverting}
          className="convert-btn convert-gif-btn"
        >
          {isConverting ? '🔄 Converting...' : '🎞️ Download as Animated GIF'}
        </button>
        <button
          onClick={convertToWebPFiles}
          disabled={isConverting}
          className="convert-btn convert-webp-btn"
        >
          {isConverting ? '🔄 Converting...' : '🖼️ Download as WebP Files'}
        </button>
      </div>

      <div className="format-info">
        <div className="format-card">
          <h4>🎬 Animated WebP</h4>
          <ul>
            <li>Modern animated format</li>
            <li>Superior compression vs GIF</li>
            <li>Single animated file</li>
            <li>Smaller file sizes</li>
          </ul>
        </div>
        <div className="format-card">
          <h4>🎞️ Animated GIF</h4>
          <ul>
            <li>Universal browser support</li>
            <li>Single animated file</li>
            <li>Configurable frame timing</li>
            <li>Works everywhere</li>
          </ul>
        </div>
        <div className="format-card">
          <h4>🖼️ WebP Files</h4>
          <ul>
            <li>Modern format</li>
            <li>Superior compression</li>
            <li>Individual frame files</li>
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
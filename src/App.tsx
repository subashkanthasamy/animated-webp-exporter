import { useState } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import ConfigPanel from './components/ConfigPanel'
import AnimationPreview from './components/AnimationPreview'
import ConvertButton from './components/ConvertButton'

export interface ImageFile {
  file: File
  url: string
  id: string
}

export interface Config {
  frameDuration: number
  quality: number
}

function App() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [config, setConfig] = useState<Config>({
    frameDuration: 500,
    quality: 80
  })
  const [isConverting, setIsConverting] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Animated WebP Exporter</h1>
        <p>Convert multiple images into animated WebP formats</p>
      </header>

      <main className="app-main">
        <div className="workflow-step">
          <h2>📤 Upload Images</h2>
          <ImageUploader images={images} setImages={setImages} />
        </div>

        {images.length > 0 && (
          <>
            <div className="workflow-step">
              <h2>🔧 Configure Animation</h2>
              <ConfigPanel config={config} setConfig={setConfig} />
            </div>

            <div className="workflow-step">
              <h2>👀 Preview Animation</h2>
              <AnimationPreview images={images} config={config} />
            </div>

            <div className="workflow-step">
              <h2>⚙️ Convert & Download</h2>
              <ConvertButton
                images={images}
                config={config}
                isConverting={isConverting}
                setIsConverting={setIsConverting}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App

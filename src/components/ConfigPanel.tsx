import React from 'react'
import type { Config } from '../App'

interface ConfigPanelProps {
  config: Config
  setConfig: React.Dispatch<React.SetStateAction<Config>>
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  const handleFrameDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      frameDuration: parseInt(e.target.value)
    }))
  }

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      quality: parseInt(e.target.value)
    }))
  }

  return (
    <div className="config-panel">
      <div className="config-group">
        <label htmlFor="frame-duration">
          ⏱️ Frame Duration: {config.frameDuration}ms
        </label>
        <input
          id="frame-duration"
          type="number"
          min="50"
          max="5000"
          step="10"
          value={config.frameDuration}
          onChange={handleFrameDurationChange}
          className="number-input"
          placeholder="Enter duration in ms"
        />
      </div>

      <div className="config-group">
        <label htmlFor="quality">
          🎯 Quality: {config.quality}%
        </label>
        <input
          id="quality"
          type="range"
          min="10"
          max="100"
          step="5"
          value={config.quality}
          onChange={handleQualityChange}
          className="slider"
        />
        <div className="slider-labels">
          <span>Low (10%)</span>
          <span>High (100%)</span>
        </div>
      </div>

      <div className="config-preview">
        <div className="config-summary">
          <h4>Animation Settings</h4>
          <ul>
            <li>Frame Duration: {config.frameDuration}ms</li>
            <li>Quality: {config.quality}%</li>
            <li>Speed: {config.frameDuration < 300 ? 'Fast' : config.frameDuration < 800 ? 'Medium' : 'Slow'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel
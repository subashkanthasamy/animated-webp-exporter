# 🎨 Animated WebP Exporter

Convert multiple images into animated static WebP formats with an intuitive web interface.

## ✨ Features

- **📤 Upload**: Drag & drop or select multiple images
- **🔧 Configure**: Set frame duration and quality
- **👀 Preview**: Watch animation before conversion
- **⚙️ Convert**: Process images into animated format
- **📥 Download**: Get animated GIF + static WebP

## 🚀 User Workflow

1. **Upload Images**: Drag and drop multiple images or use the file picker
2. **Configure Settings**: Adjust frame duration (100ms-2000ms) and quality (10%-100%)
3. **Preview Animation**: Watch the animation with play/pause controls and frame navigation
4. **Convert & Download**: Generate and download your animated GIF and static WebP files

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **gif.js** for GIF generation
- **HTML5 Canvas** for image processing
- **CSS Grid & Flexbox** for responsive design

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop

1. Run `npm run build` to create the `dist` folder
2. Go to [Netlify](https://netlify.com) and drag the `dist` folder to deploy

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on every push

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ImageUploader.tsx    # Drag & drop file upload
│   ├── ConfigPanel.tsx      # Frame duration & quality settings
│   ├── AnimationPreview.tsx # Animation preview with controls
│   └── ConvertButton.tsx    # GIF/WebP conversion & download
├── App.tsx                  # Main application component
├── App.css                  # Global styles
└── main.tsx                 # Application entry point
```

## 🎯 Features in Detail

### Image Upload
- Drag and drop multiple images
- File picker fallback
- Image preview with thumbnails
- Remove individual images
- Clear all functionality

### Configuration Panel
- Frame duration slider (100ms - 2000ms)
- Quality slider (10% - 100%)
- Real-time preview updates
- Speed indication (Fast/Medium/Slow)

### Animation Preview
- Play/pause controls
- Frame navigation
- Timeline with clickable thumbnails
- Animation statistics (duration, FPS, etc.)

### File Conversion
- Animated GIF generation using gif.js
- Static WebP export using Canvas API
- Download progress indication
- Format comparison info

## 🌐 Browser Support

- **GIF Generation**: All modern browsers
- **WebP Support**: Chrome, Firefox, Safari 16+, Edge
- **File API**: All modern browsers
- **Canvas API**: All modern browsers

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with ❤️ using React, TypeScript, and Vite**

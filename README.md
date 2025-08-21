# 🖼️ Animated Image Generator

This project lets you upload multiple images and generate an animated output (GIF or WebP) using ImageMagick and Node.js.

---

## 🔧 Prerequisites

### ✅ 1. Install Node.js and npm

Check if Node.js is installed:

```bash
node -v
npm -v
```

If not, install it:

```bash
brew install node        # macOS
# or visit https://nodejs.org for other platforms
```

---

### ✅ 2. Install ImageMagick (for `magick` CLI)

#### macOS (using Homebrew)

```bash
brew install imagemagick
```

Verify installation:

```bash
magick -version
```

> If `magick` is not found, make sure `/opt/homebrew/bin` is in your system PATH.

---

## 🚀 Getting Started

### 1. Install project dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## 🛠️ Usage

1. Upload image files (JPG, PNG, etc.).
2. The server generates an animated GIF or WebP using ImageMagick:
   ```bash
   magick -delay 3 image1.png image2.png ... -loop 0 output.webp
   ```
3. Download the generated file.

---

## 📁 Project Structure

```
.
├── uploads/               # Uploaded images
├── output/                # Generated files
├── public/                # Optional frontend
├── server.js              # Express backend
├── package.json
└── README.md
```

---

## 🧯 Troubleshooting

### ❌ Error: `magick: command not found`

- Make sure ImageMagick is installed.
- Run: `which magick`
- If not found, add this to your shell config (`~/.zshrc` or `~/.bash_profile`):

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Then apply changes:

```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

---

## 📄 License

MIT License © 2025 Your Name# animated-webp-exporter

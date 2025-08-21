const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static("public"));
const upload = multer({ dest: "uploads/" });

app.post("/convert-webp", upload.array("images"), (req, res) => {
  const frameDuration = req.body.frameDuration || 30; // default delay if not provided

  if (!req.files || req.files.length < 2) {
    return res.status(400).send("Upload at least 2 images");
  }

  const uploadedPaths = req.files.map(file => file.path);
  const outputFile = path.join(__dirname, `animated_${Date.now()}.webp`);

  // Build the ImageMagick `convert` command
  console.log("Converting images to WebP...");
  console.log("Frame duration:", frameDuration);
  const cmd = `magick -delay ${frameDuration/10} ${uploadedPaths.join(" ")} -loop 0 ${outputFile}`;

  exec(cmd, (err) => {
    if (err) {
      console.error("Convert error:", err);
      return res.status(500).send("Failed to convert images");
    }

    // Send the resulting WebP file to the client
    res.download(outputFile, () => {
      // Cleanup: delete temp uploaded files and output file
      uploadedPaths.forEach(f => fs.unlinkSync(f));
      fs.unlinkSync(outputFile);
    });
  });
});
app.use(express.static(path.join(__dirname, "public")));
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

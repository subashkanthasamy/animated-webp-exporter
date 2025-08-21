document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const convertBtn = document.getElementById('convertBtn');
    const previewBtn = document.getElementById('previewBtn');
    const formatSelect = document.getElementById('format');
    const frameDuration = document.getElementById('frameDuration');
    const progress = document.getElementById('progress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const download = document.getElementById('download');
    const downloadLink = document.getElementById('downloadLink');
    const animatedPreview = document.getElementById('animatedPreview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');

    let uploadedFiles = [];
    let previewInterval = null;

    // API configuration
    const API_BASE_URL = 'http://localhost:3000'; // Local development server

    // Update quality value display
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function extractFrameNumber(filename) {
        const match = filename.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }

    function naturalSort(a, b) {
        const numA = extractFrameNumber(a.name);
        const numB = extractFrameNumber(b.name);
        
        // If both files have numbers, sort numerically
        if (numA > 0 && numB > 0) {
            return numA - numB;
        }
        
        // If only one file has a number, prioritize it
        if (numA > 0) return -1;
        if (numB > 0) return 1;
        
        // If neither has numbers, sort alphabetically
        return a.name.localeCompare(b.name);
    }

    function handleFiles(files) {
        uploadedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (uploadedFiles.length > 0) {
            showPreview();
            convertBtn.disabled = false;
            previewBtn.disabled = false;
        }
    }

    function showPreview() {
        preview.innerHTML = '';
        preview.classList.remove('hidden');
        
        // Sort files naturally
        uploadedFiles.sort(naturalSort);
        
        // Create preview grid
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-6 gap-2';
        
        uploadedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'relative group';
                div.innerHTML = `
                    <img src="${e.target.result}" class="w-full h-full object-cover rounded" style="width: 50px; height: 50px;">
                    <div class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl">
                        ${index + 1}
                    </div>
                    <div class="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
                        ${file.name}
                    </div>
                `;
                grid.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
        
        preview.appendChild(grid);
    }

    function showAnimatedPreview() {
        if (previewInterval) {
            clearInterval(previewInterval);
        }
        
        animatedPreview.innerHTML = '';
        animatedPreview.classList.remove('hidden');
        
        let currentFrame = 0;
        const frameDuration = parseInt(document.getElementById('frameDuration').value);
        
        function showFrame() {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                animatedPreview.innerHTML = '';
                animatedPreview.appendChild(img);
            };
            reader.readAsDataURL(uploadedFiles[currentFrame]);
            currentFrame = (currentFrame + 1) % uploadedFiles.length;
        }
        
        showFrame();
        previewInterval = setInterval(showFrame, frameDuration);
    }

    previewBtn.addEventListener('click', showAnimatedPreview);

    convertBtn.addEventListener('click', async () => {
        if (uploadedFiles.length === 0) return;
        
        convertBtn.disabled = true;
        progress.classList.remove('hidden');
        download.classList.add('hidden');
        
        try {
            const frameDuration = parseInt(document.getElementById('frameDuration').value);
            const quality = parseInt(qualitySlider.value);
            
            // Create FormData
            const formData = new FormData();
            uploadedFiles.forEach(file => {
                formData.append('images', file);
            });
            formData.append('quality', quality);
            formData.append('frameDuration', frameDuration);
            
            // Send to backend
            const response = await fetch('/convert-webp', {
            method: 'POST',
            body: formData
            });

            if (!response.ok) {
            throw new Error("Failed to create animated WebP");
            }

            // Convert response to a Blob (it's binary data)
            const blob = await response.blob();

            // Create a temporary download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'animated.webp';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error creating animated WebP:', error);
            alert(error.message || 'Error creating animated WebP. Please try again.');
        } finally {
            convertBtn.disabled = false;
        }
    });
}); 

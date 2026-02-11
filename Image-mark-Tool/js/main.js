/**
 * Image Mark Tool - UI & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles
    initParticles();

    // 2. Initialize Image Processor
    const processor = new ImageProcessor('main-canvas');
    setupToolEventListeners(processor);
});

/**
 * Particle Animation for Hero Section
 */
function initParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const particleCount = 20;
    const colors = ['#26c7bc', '#14859c', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 30 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];

        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            borderRadius: '50%',
            opacity: Math.random() * 0.3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `-${Math.random() * 20}s`
        });

        container.appendChild(particle);
    }

    // Add CSS for particles via JS to keep style.css clean for main logic
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(100px, 100px) rotate(120deg); }
            66% { transform: translate(-100px, 200px) rotate(240deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        .particle { pointer-events: none; }
    `;
    document.head.appendChild(style);
}

/**
 * Tool Event Listeners
 */
function setupToolEventListeners(processor) {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const previewContainer = document.getElementById('preview-container');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Tab Toggles
    const textTypeBtn = document.getElementById('text-type-btn');
    const imageTypeBtn = document.getElementById('image-type-btn');
    const textControls = document.getElementById('text-controls');
    const imageControls = document.getElementById('image-controls');

    // Controls
    const watermarkTextInput = document.getElementById('watermark-text');
    const fontSizeInput = document.getElementById('font-size');
    const fontColorInput = document.getElementById('font-color');
    const opacityInput = document.getElementById('opacity');
    const rotationInput = document.getElementById('rotation');
    const positionSelect = document.getElementById('position');
    const logoInput = document.getElementById('logo-input');

    // Values Display
    const opacityVal = document.getElementById('opacity-val');
    const rotationVal = document.getElementById('rotation-val');

    // Handle Image Upload
    uploadArea.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            await processor.loadImage(e.target.files[0]);
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'flex';
            downloadBtn.disabled = false;
        }
    });

    // Handle Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--glass-border)';
    });

    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processor.loadImage(e.dataTransfer.files[0]);
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'flex';
            downloadBtn.disabled = false;
        }
    });

    // Handle Tab Swapping
    textTypeBtn.addEventListener('click', () => {
        textTypeBtn.classList.add('active');
        imageTypeBtn.classList.remove('active');
        textControls.style.display = 'block';
        imageControls.style.display = 'none';
        processor.updateConfig({ type: 'text' });
    });

    imageTypeBtn.addEventListener('click', () => {
        imageTypeBtn.classList.add('active');
        textTypeBtn.classList.remove('active');
        imageControls.style.display = 'block';
        textControls.style.display = 'none';
        processor.updateConfig({ type: 'image' });
    });

    // Tool Interaction Listeners
    watermarkTextInput.addEventListener('input', (e) => {
        processor.updateConfig({ text: e.target.value });
    });

    fontSizeInput.addEventListener('input', (e) => {
        processor.updateConfig({ fontSize: parseInt(e.target.value) });
    });

    fontColorInput.addEventListener('input', (e) => {
        processor.updateConfig({ fontColor: e.target.value });
    });

    opacityInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        opacityVal.textContent = val;
        processor.updateConfig({ opacity: val });
    });

    rotationInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        rotationVal.textContent = val;
        processor.updateConfig({ rotation: val });
    });

    positionSelect.addEventListener('change', (e) => {
        processor.updateConfig({ position: e.target.value });
    });

    // Logo Upload
    const logoUploadTrigger = document.querySelector('.logo-upload-btn');
    logoUploadTrigger.addEventListener('click', () => logoInput.click());

    logoInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            await processor.loadWatermark(e.target.files[0]);
        }
    });

    // Actions
    downloadBtn.addEventListener('click', () => {
        processor.download('image-mark-tool-result.png');
    });

    resetBtn.addEventListener('click', () => {
        location.reload(); // Simple reset
    });
}

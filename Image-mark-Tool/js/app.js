/**
 * Image Mark Tool - Core Logic
 * Handles image loading, processing, and watermark rendering on Canvas.
 */

class ImageProcessor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.watermarkImage = null;
        this.config = {
            type: 'text', // 'text' or 'image'
            text: 'Image Mark Tool',
            fontSize: 40,
            fontColor: '#ffffff',
            opacity: 0.5,
            rotation: 0,
            position: 'center', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'custom'
            customX: 0,
            customY: 0
        };
    }

    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.originalImage = img;
                    this.render();
                    resolve(img);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async loadWatermark(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.watermarkImage = img;
                    this.render();
                    resolve(img);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.render();
    }

    render() {
        if (!this.originalImage) return;

        // Set canvas dimensions to match original image
        this.canvas.width = this.originalImage.width;
        this.canvas.height = this.originalImage.height;

        // Draw original image
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.originalImage, 0, 0);

        // Apply watermark
        this.ctx.save();
        this.ctx.globalAlpha = this.config.opacity;

        if (this.config.type === 'text') {
            this.drawTextWatermark();
        } else if (this.config.type === 'image' && this.watermarkImage) {
            this.drawImageWatermark();
        }

        this.ctx.restore();
    }

    drawTextWatermark() {
        const { text, fontSize, fontColor, rotation, position } = this.config;
        this.ctx.font = `${fontSize}px Inter, sans-serif`;
        this.ctx.fillStyle = fontColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const { x, y } = this.calculatePosition();

        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.fillText(text, 0, 0);
    }

    drawImageWatermark() {
        const { rotation, position } = this.config;
        const { x, y } = this.calculatePosition();

        // Scale watermark if it's too large (default to 20% of image width)
        const scale = (this.canvas.width * 0.2) / this.watermarkImage.width;
        const w = this.watermarkImage.width * scale;
        const h = this.watermarkImage.height * scale;

        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.drawImage(this.watermarkImage, -w / 2, -h / 2, w, h);
    }

    calculatePosition() {
        const margin = 50;
        let x, y;

        switch (this.config.position) {
            case 'top-left':
                x = margin;
                y = margin;
                break;
            case 'top-right':
                x = this.canvas.width - margin;
                y = margin;
                break;
            case 'bottom-left':
                x = margin;
                y = this.canvas.height - margin;
                break;
            case 'bottom-right':
                x = this.canvas.width - margin;
                y = this.canvas.height - margin;
                break;
            case 'center':
            default:
                x = this.canvas.width / 2;
                y = this.canvas.height / 2;
                break;
        }

        // Adjust for text alignment/centering in draw methods
        return { x, y };
    }

    download(filename = 'watermarked-image.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

window.ImageProcessor = ImageProcessor;

class DrawingApp {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.toolBtns = document.querySelectorAll(".tool");
        this.fillColorCheckbox = document.querySelector("#fill-color");
        this.sizeSlider = document.querySelector("#size-slider");
        this.colorBtns = document.querySelectorAll(".colors .option");
        this.colorPicker = document.querySelector("#color-picker");
        this.clearCanvasBtn = document.querySelector(".clear-canvas");
        this.saveImgBtn = document.querySelector(".save-img");

        this.isDrawing = false;
        this.selectedTool = "brush";
        this.brushWidth = 5;
        this.selectedColor = "#000";

        this.bindEvents();
        this.init();
    }

    init() {
        this.setCanvasBackground();
    }

    bindEvents() {
        window.addEventListener("load", this.handleLoad.bind(this));
        this.toolBtns.forEach(btn => btn.addEventListener("click", this.handleToolClick.bind(this)));
        this.sizeSlider.addEventListener("change", this.handleSliderChange.bind(this));
        this.colorBtns.forEach(btn => btn.addEventListener("click", this.handleColorClick.bind(this)));
        this.colorPicker.addEventListener("change", this.handleColorPickerChange.bind(this));
        this.clearCanvasBtn.addEventListener("click", this.clearCanvas.bind(this));
        this.saveImgBtn.addEventListener("click", this.saveImage.bind(this));
        this.canvas.addEventListener("mousedown", this.startDraw.bind(this));
        this.canvas.addEventListener("mousemove", this.draw.bind(this));
        this.canvas.addEventListener("mouseup", this.endDraw.bind(this));
        this.canvas.addEventListener("touchstart", this.startDraw.bind(this), { passive: false });
        this.canvas.addEventListener("touchmove", this.draw.bind(this), { passive: false });
        this.canvas.addEventListener("touchend", this.endDraw.bind(this));
    }

    handleLoad() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.setCanvasBackground();
    }

    handleToolClick(event) {
        document.querySelector(".options .active").classList.remove("active");
        event.currentTarget.classList.add("active");
        this.selectedTool = event.currentTarget.id;
    }

    handleSliderChange() {
        this.brushWidth = this.sizeSlider.value;
    }

    handleColorClick(event) {
        let selectedElement = document.querySelector(".colors .option.selected");
        if (selectedElement) {
            selectedElement.classList.remove("selected");
        }

        event.currentTarget.classList.add("selected");
        this.selectedColor = window.getComputedStyle(event.currentTarget).getPropertyValue("background-color");
    }

    handleColorPickerChange() {
        this.selectedColor = this.colorPicker.value;
    }

    setCanvasBackground() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.selectedColor;
    }

    startDraw(event) {
        if (event.touches) {
            event.preventDefault();
            let rect = this.canvas.getBoundingClientRect();
            event = {
                offsetX: event.touches[0].clientX - rect.left,
                offsetY: event.touches[0].clientY - rect.top
            };
        }
        this.isDrawing = true;
        this.prevMouseX = event.offsetX;
        this.prevMouseY = event.offsetY;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.brushWidth;
        this.ctx.strokeStyle = this.selectedColor;
        this.ctx.fillStyle = this.selectedColor;
        this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(event) {
        if (event.touches) {
            event.preventDefault();
            let rect = this.canvas.getBoundingClientRect();
            event = {
                offsetX: event.touches[0].clientX - rect.left,
                offsetY: event.touches[0].clientY - rect.top
            };
        }
        if (!this.isDrawing) return;
        this.ctx.putImageData(this.snapshot, 0, 0);
        // ... rest of the draw method remains unchanged
        switch (this.selectedTool) {
            case "brush":
                this.ctx.strokeStyle = this.selectedColor;
                this.ctx.lineTo(event.offsetX, event.offsetY);
                this.ctx.stroke();
                break;
            case "eraser":
                this.ctx.strokeStyle = "#fff";
                this.ctx.lineTo(event.offsetX, event.offsetY);
                this.ctx.stroke();
                break;
            case "rectangle":
                this.drawRect(event);
                break;
            case "circle":
                this.drawCircle(event);
                break;
            case "triangle":
                this.drawTriangle(event);
                break;
        }
    }

    endDraw() {
        this.isDrawing = false;
    }

    drawRect(event) {
        if (!this.fillColorCheckbox.checked) {
            this.ctx.strokeRect(this.prevMouseX, this.prevMouseY, event.offsetX - this.prevMouseX, event.offsetY - this.prevMouseY);
        } else {
            this.ctx.fillRect(this.prevMouseX, this.prevMouseY, event.offsetX - this.prevMouseX, event.offsetY - this.prevMouseY);
        }
    }

    drawCircle(event) {
        this.ctx.beginPath();
        let radius = Math.sqrt(Math.pow((this.prevMouseX - event.offsetX), 2) + Math.pow((this.prevMouseY - event.offsetY), 2));
        this.ctx.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI);
        this.fillColorCheckbox.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    drawTriangle(event) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevMouseX, this.prevMouseY);
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.lineTo(this.prevMouseX * 2 - event.offsetX, event.offsetY);
        this.ctx.closePath();
        this.fillColorCheckbox.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setCanvasBackground();
    }

    saveImage() {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

new DrawingApp();

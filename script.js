document.addEventListener("DOMContentLoaded", function () {
    class AABB {
        constructor(element) {
            // to do: can't spawn on each other
            // & add a third box? 
            this.element = element;
            this.width = Math.floor(Math.random() * 50) + 60; // Random width  [60, 110]
            this.height = Math.floor(Math.random() * 50) + 60; // Random height [60, 110]
            this.x = Math.random() * (400 - this.width);
            this.y = Math.random() * (400 - this.height);
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;

            // Store original colours to restore after collision 
            this.originalColor = getRandomPastelColor();
            this.originalBorder = `2px solid ${darkenColor(this.originalColor)}`; 
            
            // init all interactivity attributes
            this.initDrag();
            this.applyStyles();
            this.updatePosition();
        }

        applyStyles() {
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
            this.element.style.background = this.originalColor;
            this.element.style.border = `2px solid ${darkenColor(this.originalColor)}`;
        }

        initDrag() {
            this.element.addEventListener("mousedown", (e) => {
                this.isDragging = true;
                this.offsetX = e.clientX - this.x;
                this.offsetY = e.clientY - this.y;
            });

            document.addEventListener("mousemove", (e) => {
                if (this.isDragging) {
                    this.x = e.clientX - this.offsetX;
                    this.y = e.clientY - this.offsetY;
                    this.updatePosition();
                    checkCollision();
                }
            });

            document.addEventListener("mouseup", () => {
                this.isDragging = false;
            });
        }

        updatePosition() {
            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }

        getBounds() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            };
        }
    }

    function isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function checkCollision() {
        const box1Bounds = box1.getBounds();
        const box2Bounds = box2.getBounds();
        if (isColliding(box1Bounds, box2Bounds)) {
            box1.element.style.background = "#CD5C5C";
            box2.element.style.background = "#CD5C5C";
            box1.element.style.border = "2px solid white";
            box2.element.style.border = "2px solid white";
        } else {
            box1.element.style.background = box1.originalColor;
            box2.element.style.background = box2.originalColor;
            box1.element.style.border = box1.originalBorder;
            box2.element.style.border = box2.originalBorder;
        }
    }

    function getRandomPastelColor() {
        const r = Math.floor(Math.random() * 128) + 127;
        const g = Math.floor(Math.random() * 128) + 127;
        const b = Math.floor(Math.random() * 128) + 127;
        return `rgb(${r}, ${g}, ${b})`;
    }

    function darkenColor(rgb) {
        const match = rgb.match(/\d+/g);
        if (!match) return "black";
        const r = Math.max(0, match[0] - 50);
        const g = Math.max(0, match[1] - 50);
        const b = Math.max(0, match[2] - 50);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Creates the demo container
    const demoContainer = document.getElementById("AABB-demo");
    demoContainer.style.position = "relative";
    demoContainer.style.width = "400px";
    demoContainer.style.height = "400px";
    demoContainer.style.border = "2px solid black";
    demoContainer.style.overflow = "hidden";

    // And the boxes within it
    const box1El = document.createElement("div");
    box1El.style.position = "absolute";
    box1El.style.cursor = "grab";

    const box2El = document.createElement("div");
    box2El.style.position = "absolute";
    box2El.style.cursor = "grab";

    demoContainer.appendChild(box1El);
    demoContainer.appendChild(box2El);

    const box1 = new AABB(box1El);
    const box2 = new AABB(box2El);
});

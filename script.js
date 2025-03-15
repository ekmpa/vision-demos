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

    
});

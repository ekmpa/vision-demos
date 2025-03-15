document.addEventListener("DOMContentLoaded", function () {
    class AABB {
        constructor(element, existingBox) {
            // to do: can't spawn on each other
            // & add a third box? 
            const { x, y, width, height } = getNonOverlappingPosition(existingBox);
            this.element = element;
            this.width = width; // Random width  [60, 110]
            this.height = height; // Random height [60, 110]
            this.x = x;
            this.y = y;
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

    function getNonOverlappingPosition(existingBox) {
        let width = Math.floor(Math.random() * 50) + 60;
        let height = Math.floor(Math.random() * 50) + 60; 
        let x, y;
        let maxAttempts = 100;
        let attempts = 0;
        
        do {
            x = Math.random() * (400 - width);
            y = Math.random() * (250 - height);
            attempts++;
        } while (existingBox && isColliding({ x, y, width, height }, existingBox.getBounds()) && attempts < maxAttempts);
    
        return { x, y, width, height };
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
        const xOverlap = box1Bounds.x < box2Bounds.x + box2Bounds.width && box1Bounds.x + box1Bounds.width > box2Bounds.x;
        const yOverlap = box1Bounds.y < box2Bounds.y + box2Bounds.height && box1Bounds.y + box1Bounds.height > box2Bounds.y;
        const collision = xOverlap && yOverlap;
        
        updateProjections(box1Bounds, box2Bounds, xOverlap, yOverlap);
        
        if (collision) {
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

    function updateProjections(a, b, xOverlap, yOverlap) {
        xProjection1.style.left = `${a.x}px`;
        xProjection1.style.width = `${a.width}px`;
        xProjection1.style.background = xOverlap ? "red" : "green";

        xProjection2.style.left = `${b.x}px`;
        xProjection2.style.width = `${b.width}px`;
        xProjection2.style.background = xOverlap ? "red" : "green";

        yProjection1.style.top = `${a.y}px`;
        yProjection1.style.height = `${a.height}px`;
        yProjection1.style.background = yOverlap ? "red" : "green";

        yProjection2.style.top = `${b.y}px`;
        yProjection2.style.height = `${b.height}px`;
        yProjection2.style.background = yOverlap ? "red" : "green";
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
    demoContainer.style.height = "250px";
    demoContainer.style.border = "2px solid black";
    demoContainer.style.overflow = "hidden";

    const createProjection = (isHorizontal) => {
        const proj = document.createElement("div");
        proj.style.position = "absolute";
        proj.style.background = "green";
        if (isHorizontal) {
            proj.style.height = "3px";
            proj.style.width = "0px";
        } else {
            proj.style.width = "3px";
            proj.style.height = "0px";
        }
        demoContainer.appendChild(proj);
        return proj;
    };

    const xProjection1 = createProjection(true);
    const xProjection2 = createProjection(true);
    const yProjection1 = createProjection(false);
    const yProjection2 = createProjection(false);

    const box1El = document.createElement("div");
    box1El.style.position = "absolute";
    box1El.style.cursor = "grab";

    const box2El = document.createElement("div");
    box2El.style.position = "absolute";
    box2El.style.cursor = "grab";

    demoContainer.appendChild(box1El);
    demoContainer.appendChild(box2El);

    const box1 = new AABB(box1El);
    const box2 = new AABB(box2El, box1);
});

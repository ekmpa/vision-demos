document.addEventListener("DOMContentLoaded", function () {
    // Creates the demo container
    const demoContainer = document.getElementById("circle-demo");
    demoContainer.style.position = "relative";
    demoContainer.style.width = "400px";
    demoContainer.style.height = "250px";
    demoContainer.style.border = "2px solid black";
    demoContainer.style.borderRadius = "50px";
    demoContainer.style.overflow = "hidden";

    const numCircles = 3;
    const circles = [];
    const radius = 30;
    const lines = [];

    function createCircle(color) {
        const circle = document.createElement("div");
        circle.style.width = circle.style.height = radius * 2 + "px";
        circle.style.position = "absolute";
        circle.style.borderRadius = "50%";
        circle.style.backgroundColor = color;
        circle.style.cursor = "grab";
        demoContainer.appendChild(circle);
        
        const circleObj = {
            element: circle,
            x: Math.random() * (400 - 2 * radius),
            y: Math.random() * (250 - 2 * radius),
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            originalColor: color
        };

        circle.addEventListener("mousedown", (e) => {
            circleObj.isDragging = true;
            circleObj.offsetX = e.clientX - circleObj.x;
            circleObj.offsetY = e.clientY - circleObj.y;
        });

        document.addEventListener("mousemove", (e) => {
            if (circleObj.isDragging) {
                circleObj.x = e.clientX - circleObj.offsetX;
                circleObj.y = e.clientY - circleObj.offsetY;
                updatePositions();
                checkCollisions();
            }
        });

        document.addEventListener("mouseup", () => {
            circleObj.isDragging = false;
        });

        return circleObj;
    }

    for (let i = 0; i < numCircles; i++) {
        circles.push(createCircle("#ccff66"));
    }

    function createLine() {
        const line = document.createElement("div");
        line.style.position = "absolute";
        line.style.height = "2px";
        line.style.backgroundColor = "green";
        line.style.opacity = "50%";
        demoContainer.appendChild(line);
        return line;
    }

    for (let i = 0; i < numCircles; i++) {
        for (let j = i + 1; j < numCircles; j++) {
            lines.push(createLine());
        }
    }

    function detectCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius * 2;
    }

    function updatePositions() {
        let lineIndex = 0;
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            circle.element.style.left = circle.x + "px";
            circle.element.style.top = circle.y + "px";

            for (let j = i + 1; j < circles.length; j++) {
                let otherCircle = circles[j];
                let dx = otherCircle.x - circle.x;
                let dy = otherCircle.y - circle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let angle = Math.atan2(dy, dx);
                let midX = circle.x + radius;
                let midY = circle.y + radius;

                lines[lineIndex].style.left = `${midX}px`;
                lines[lineIndex].style.top = `${midY}px`;
                lines[lineIndex].style.width = `${distance}px`;
                lines[lineIndex].style.transform = `rotate(${angle}rad)`;
                lines[lineIndex].style.transformOrigin = "0 50%";
                lines[lineIndex].style.backgroundColor = detectCollision(circle, otherCircle) ? "#8B0000" : "green";
                lineIndex++;
            }
        }
    }

    function checkCollisions() {
        for (let i = 0; i < circles.length; i++) {
            circles[i].element.style.backgroundColor = circles[i].originalColor;
        }
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                if (detectCollision(circles[i], circles[j])) {
                    circles[i].element.style.backgroundColor = "red";
                    circles[j].element.style.backgroundColor = "red";
                }
            }
        }
    }

    updatePositions();
});

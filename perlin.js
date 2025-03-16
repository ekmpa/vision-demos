document.addEventListener("DOMContentLoaded", function () {
    // Demo container
    const demoContainer = document.getElementById("perlin-demo");
    demoContainer.style.position = "relative";
    demoContainer.style.width = "400px";
    demoContainer.style.height = "250px";
    demoContainer.style.border = "2px solid black";
    demoContainer.style.borderRadius = "50px";
    demoContainer.style.overflow = "hidden";

    // Canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 250;
    demoContainer.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const slider = document.getElementById("perlin-slider");

    // Perlin Noise implementation
    class PerlinNoise {
        constructor() {
            this.permutation = this.generatePermutation();
        }

        generatePermutation() {
            const perm = Array.from({ length: 256 }, (_, i) => i);
            for (let i = perm.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [perm[i], perm[j]] = [perm[j], perm[i]];
            }
            return [...perm, ...perm];
        }

        fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        lerp(a, b, t) {
            return a + t * (b - a);
        }

        grad(hash, x, y) {
            const h = hash & 3;
            const u = h < 2 ? x : y;
            const v = h < 2 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
        }

        noise(x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            const u = this.fade(x);
            const v = this.fade(y);

            const aa = this.permutation[X] + Y;
            const ab = this.permutation[X] + Y + 1;
            const ba = this.permutation[X + 1] + Y;
            const bb = this.permutation[X + 1] + Y + 1;

            return this.lerp(
                this.lerp(this.grad(this.permutation[aa], x, y), this.grad(this.permutation[ba], x - 1, y), u),
                this.lerp(this.grad(this.permutation[ab], x, y - 1), this.grad(this.permutation[bb], x - 1, y - 1), u),
                v
            );
        }
    }

    const perlin = new PerlinNoise();

    function generatePerlin2D(width, height, scale) {
        const noise = new Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                noise[y * width + x] = perlin.noise(x / scale, y / scale);
            }
        }
        return noise;
    }

    // Render 
    function renderPerlin2D(scale) {
        const noiseData = generatePerlin2D(canvas.width, canvas.height, scale);
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < noiseData.length; i++) {
            const value = Math.floor((noiseData[i] + 1) * 128); // Normalize value
            imageData.data[i * 4] = value;
            imageData.data[i * 4 + 1] = value;
            imageData.data[i * 4 + 2] = value;
            imageData.data[i * 4 + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    renderPerlin2D(parseInt(slider.value));

    // Update render on slider change
    slider.addEventListener("input", function () {
        renderPerlin2D(parseInt(slider.value));
    });
    
});
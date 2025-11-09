// Advanced Environment Animation System
// Handles trees swaying, clouds moving, wind effects, ambient lighting

class Cloud {
    constructor(x, y, speed, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.opacity = 0.3 + Math.random() * 0.4;
        this.type = Math.floor(Math.random() * 3);
    }

    update(deltaTime, mapWidth) {
        this.x += this.speed;

        // Wrap around when cloud goes off screen
        if (this.x > mapWidth + 200) {
            this.x = -200;
        }
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';

        // Draw cloud as multiple circles
        const circles = [
            { offsetX: 0, offsetY: 0, radius: this.size * 0.6 },
            { offsetX: this.size * 0.5, offsetY: -this.size * 0.2, radius: this.size * 0.5 },
            { offsetX: -this.size * 0.5, offsetY: -this.size * 0.1, radius: this.size * 0.45 },
            { offsetX: this.size * 0.8, offsetY: this.size * 0.1, radius: this.size * 0.4 },
            { offsetX: -this.size * 0.8, offsetY: this.size * 0.05, radius: this.size * 0.35 }
        ];

        circles.forEach(circle => {
            ctx.beginPath();
            ctx.arc(
                screenX + circle.offsetX,
                screenY + circle.offsetY,
                circle.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        ctx.restore();
    }
}

class WindEffect {
    constructor() {
        this.strength = 0;
        this.direction = 0;
        this.targetStrength = 0;
        this.targetDirection = 0;
        this.changeTimer = 0;
        this.changeInterval = 5000; // Change wind every 5 seconds
    }

    update(deltaTime) {
        this.changeTimer += deltaTime;

        // Change wind direction and strength periodically
        if (this.changeTimer >= this.changeInterval) {
            this.targetStrength = Math.random() * 2;
            this.targetDirection = Math.random() * Math.PI * 2;
            this.changeTimer = 0;
        }

        // Smoothly interpolate to target
        this.strength += (this.targetStrength - this.strength) * 0.01;

        // Interpolate angle
        let angleDiff = this.targetDirection - this.direction;
        if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.direction += angleDiff * 0.01;
    }

    getWindVector() {
        return {
            x: Math.cos(this.direction) * this.strength,
            y: Math.sin(this.direction) * this.strength
        };
    }
}

class TreeAnimation {
    constructor(x, y, treeType) {
        this.x = x;
        this.y = y;
        this.treeType = treeType;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.swayAmplitude = 1 + Math.random() * 2;
        this.swaySpeed = 0.001 + Math.random() * 0.002;
    }

    update(deltaTime, wind) {
        this.swayPhase += this.swaySpeed * deltaTime;

        // Add wind influence
        if (wind) {
            this.swayPhase += wind.x * 0.001;
        }
    }

    getSwayOffset() {
        return Math.sin(this.swayPhase) * this.swayAmplitude;
    }
}

class AmbientLight {
    constructor() {
        // Time of day in hours (0-24)
        this.timeOfDay = 12; // Start at noon
        this.timeSpeed = 0.0001; // Very slow time progression

        this.ambientColor = { r: 255, g: 255, b: 255 };
        this.ambientIntensity = 1.0;
    }

    update(deltaTime) {
        this.timeOfDay += this.timeSpeed * deltaTime;
        if (this.timeOfDay >= 24) {
            this.timeOfDay -= 24;
        }

        // Calculate lighting based on time of day
        this.updateLighting();
    }

    updateLighting() {
        const hour = this.timeOfDay;

        if (hour >= 6 && hour < 8) {
            // Dawn (6-8)
            const t = (hour - 6) / 2;
            this.ambientColor = this.interpolateColor(
                { r: 255, g: 180, b: 140 }, // Dawn orange
                { r: 255, g: 240, b: 220 }, // Morning light
                t
            );
            this.ambientIntensity = 0.6 + t * 0.3;
        } else if (hour >= 8 && hour < 12) {
            // Morning (8-12)
            this.ambientColor = { r: 255, g: 245, b: 230 };
            this.ambientIntensity = 0.9;
        } else if (hour >= 12 && hour < 17) {
            // Noon to Afternoon (12-17)
            this.ambientColor = { r: 255, g: 255, b: 255 };
            this.ambientIntensity = 1.0;
        } else if (hour >= 17 && hour < 19) {
            // Dusk (17-19)
            const t = (hour - 17) / 2;
            this.ambientColor = this.interpolateColor(
                { r: 255, g: 240, b: 220 }, // Afternoon
                { r: 255, g: 150, b: 100 }, // Dusk orange
                t
            );
            this.ambientIntensity = 0.9 - t * 0.3;
        } else if (hour >= 19 && hour < 20) {
            // Evening (19-20)
            const t = (hour - 19);
            this.ambientColor = this.interpolateColor(
                { r: 255, g: 150, b: 100 }, // Dusk
                { r: 100, g: 120, b: 180 }, // Night blue
                t
            );
            this.ambientIntensity = 0.6 - t * 0.3;
        } else {
            // Night (20-6)
            this.ambientColor = { r: 80, g: 100, b: 150 };
            this.ambientIntensity = 0.3;
        }
    }

    interpolateColor(color1, color2, t) {
        return {
            r: Math.floor(color1.r + (color2.r - color1.r) * t),
            g: Math.floor(color1.g + (color2.g - color1.g) * t),
            b: Math.floor(color1.b + (color2.b - color1.b) * t)
        };
    }

    applyLighting(ctx, canvasWidth, canvasHeight) {
        // Create overlay for ambient lighting
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(${this.ambientColor.r}, ${this.ambientColor.g}, ${this.ambientColor.b}, ${1 - this.ambientIntensity * 0.5})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    getTimeString() {
        const hour = Math.floor(this.timeOfDay);
        const minute = Math.floor((this.timeOfDay % 1) * 60);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
}

class EnvironmentSystem {
    constructor(mapWidth, mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        // Clouds
        this.clouds = [];
        this.initializeClouds();

        // Wind
        this.wind = new WindEffect();

        // Tree animations
        this.treeAnimations = new Map();

        // Ambient lighting
        this.ambientLight = new AmbientLight();

        // Fog effect
        this.fogEnabled = false;
        this.fogDensity = 0.1;
    }

    initializeClouds() {
        const cloudCount = 15;
        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push(new Cloud(
                Math.random() * this.mapWidth,
                Math.random() * 200 + 50, // Clouds in sky
                0.05 + Math.random() * 0.1,
                30 + Math.random() * 40
            ));
        }
    }

    addTreeAnimation(x, y, treeType) {
        const key = `${x},${y}`;
        if (!this.treeAnimations.has(key)) {
            this.treeAnimations.set(key, new TreeAnimation(x, y, treeType));
        }
    }

    getTreeSwayOffset(x, y) {
        const key = `${x},${y}`;
        const animation = this.treeAnimations.get(key);
        return animation ? animation.getSwayOffset() : 0;
    }

    update(deltaTime) {
        // Update wind
        this.wind.update(deltaTime);

        // Update clouds
        this.clouds.forEach(cloud => cloud.update(deltaTime, this.mapWidth));

        // Update tree animations
        const windVector = this.wind.getWindVector();
        this.treeAnimations.forEach(tree => tree.update(deltaTime, windVector));

        // Update ambient lighting
        this.ambientLight.update(deltaTime);
    }

    draw(ctx, cameraX, cameraY) {
        // Draw clouds (before terrain)
        this.clouds.forEach(cloud => cloud.draw(ctx, cameraX, cameraY));
    }

    drawPostEffects(ctx, canvasWidth, canvasHeight) {
        // Apply ambient lighting
        this.ambientLight.applyLighting(ctx, canvasWidth, canvasHeight);

        // Apply fog if enabled
        if (this.fogEnabled) {
            ctx.save();
            ctx.fillStyle = `rgba(200, 200, 220, ${this.fogDensity})`;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.restore();
        }
    }

    enableFog(density = 0.2) {
        this.fogEnabled = true;
        this.fogDensity = density;
    }

    disableFog() {
        this.fogEnabled = false;
    }

    setTimeOfDay(hour) {
        this.ambientLight.timeOfDay = hour;
        this.ambientLight.updateLighting();
    }

    getTimeOfDay() {
        return this.ambientLight.getTimeString();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentSystem;
}

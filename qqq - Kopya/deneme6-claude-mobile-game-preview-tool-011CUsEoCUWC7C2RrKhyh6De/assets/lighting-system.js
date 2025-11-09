// Advanced Lighting and Shadow System
// Dynamic shadows, point lights, ambient occlusion, light sources

class Light {
    constructor(x, y, radius, color, intensity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color; // { r, g, b }
        this.intensity = intensity; // 0-1
        this.flickerSpeed = 0;
        this.flickerAmount = 0;
        this.flickerPhase = Math.random() * Math.PI * 2;
    }

    setFlicker(speed, amount) {
        this.flickerSpeed = speed;
        this.flickerAmount = amount;
    }

    update(deltaTime) {
        if (this.flickerSpeed > 0) {
            this.flickerPhase += this.flickerSpeed * deltaTime * 0.001;
        }
    }

    getCurrentIntensity() {
        if (this.flickerAmount > 0) {
            const flicker = Math.sin(this.flickerPhase) * this.flickerAmount;
            return Math.max(0, Math.min(1, this.intensity + flicker));
        }
        return this.intensity;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        const currentIntensity = this.getCurrentIntensity();

        // Create radial gradient for light
        const gradient = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, this.radius
        );

        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentIntensity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentIntensity * 0.4})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Shadow {
    constructor(x, y, width, height, opacity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = opacity;
        this.angle = 0;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#000000';

        // Draw elliptical shadow
        ctx.beginPath();
        ctx.ellipse(
            screenX,
            screenY,
            this.width,
            this.height,
            this.angle,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}

class LightingSystem {
    constructor() {
        // Lights
        this.lights = [];

        // Shadows
        this.shadows = new Map(); // key: entity id, value: Shadow

        // Global illumination
        this.ambientLightLevel = 1.0; // 0 = dark, 1 = bright
        this.globalLightColor = { r: 255, g: 255, b: 255 };

        // Shadow settings
        this.shadowsEnabled = true;
        this.shadowBlur = 10;
        this.shadowOpacity = 0.3;

        // Light direction (for directional shadows)
        this.lightDirection = { x: 0.5, y: 0.8 }; // Normalized vector
    }

    // Add a point light
    addLight(x, y, radius, color, intensity) {
        const light = new Light(x, y, radius, color, intensity);
        this.lights.push(light);
        return light;
    }

    // Add a torch light (flickering)
    addTorch(x, y, radius = 150) {
        const light = this.addLight(
            x, y, radius,
            { r: 255, g: 180, b: 100 }, // Warm orange
            0.8
        );
        light.setFlicker(2, 0.1);
        return light;
    }

    // Add a magical light (glowing)
    addMagicalLight(x, y, radius = 100, color = { r: 150, g: 100, b: 255 }) {
        const light = this.addLight(x, y, radius, color, 0.9);
        light.setFlicker(1, 0.05);
        return light;
    }

    // Remove a light
    removeLight(light) {
        const index = this.lights.indexOf(light);
        if (index > -1) {
            this.lights.splice(index, 1);
        }
    }

    // Add or update shadow for an entity
    setShadow(entityId, x, y, width, height, opacity = 0.3) {
        const shadow = new Shadow(x, y, width, height, opacity);
        this.shadows.set(entityId, shadow);
    }

    // Remove shadow for an entity
    removeShadow(entityId) {
        this.shadows.delete(entityId);
    }

    // Update shadow position based on light direction
    updateShadow(entityId, entityX, entityY, entityWidth, entityHeight) {
        if (!this.shadowsEnabled) return;

        // Calculate shadow offset based on light direction
        const shadowOffsetX = -this.lightDirection.x * 10;
        const shadowOffsetY = -this.lightDirection.y * 10;

        // Shadow position
        const shadowX = entityX + shadowOffsetX;
        const shadowY = entityY + entityHeight + shadowOffsetY;

        // Shadow size (proportional to distance from ground)
        const shadowWidth = entityWidth * 0.6;
        const shadowHeight = entityHeight * 0.2;

        this.setShadow(entityId, shadowX, shadowY, shadowWidth, shadowHeight, this.shadowOpacity);
    }

    update(deltaTime) {
        // Update all lights
        this.lights.forEach(light => light.update(deltaTime));
    }

    // Draw shadows (call before drawing entities)
    drawShadows(ctx, cameraX, cameraY) {
        if (!this.shadowsEnabled) return;

        ctx.save();
        ctx.filter = `blur(${this.shadowBlur}px)`;

        this.shadows.forEach(shadow => {
            shadow.draw(ctx, cameraX, cameraY);
        });

        ctx.restore();
    }

    // Draw lights (call after drawing entities, with additive blending)
    drawLights(ctx, cameraX, cameraY) {
        if (this.lights.length === 0) return;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // Additive blending

        this.lights.forEach(light => {
            light.draw(ctx, cameraX, cameraY);
        });

        ctx.restore();
    }

    // Apply ambient darkness overlay
    drawAmbientDarkness(ctx, canvasWidth, canvasHeight) {
        if (this.ambientLightLevel >= 1.0) return;

        ctx.save();
        const darkness = 1 - this.ambientLightLevel;
        ctx.fillStyle = `rgba(0, 0, 0, ${darkness * 0.7})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    // Set ambient light level (0-1)
    setAmbientLight(level) {
        this.ambientLightLevel = Math.max(0, Math.min(1, level));
    }

    // Set global light color
    setGlobalLightColor(r, g, b) {
        this.globalLightColor = { r, g, b };
    }

    // Enable/disable shadows
    setShadowsEnabled(enabled) {
        this.shadowsEnabled = enabled;
    }

    // Set shadow blur amount
    setShadowBlur(blur) {
        this.shadowBlur = blur;
    }

    // Set shadow opacity
    setShadowOpacity(opacity) {
        this.shadowOpacity = Math.max(0, Math.min(1, opacity));
    }

    // Set light direction for shadows
    setLightDirection(x, y) {
        // Normalize
        const length = Math.sqrt(x * x + y * y);
        this.lightDirection = {
            x: x / length,
            y: y / length
        };
    }

    // Calculate lighting at a specific point
    getLightingAtPoint(x, y) {
        let totalR = this.globalLightColor.r * this.ambientLightLevel;
        let totalG = this.globalLightColor.g * this.ambientLightLevel;
        let totalB = this.globalLightColor.b * this.ambientLightLevel;
        let totalIntensity = this.ambientLightLevel;

        // Add contribution from each light
        this.lights.forEach(light => {
            const dx = x - light.x;
            const dy = y - light.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < light.radius) {
                const attenuation = 1 - (distance / light.radius);
                const intensity = light.getCurrentIntensity() * attenuation;

                totalR += light.color.r * intensity;
                totalG += light.color.g * intensity;
                totalB += light.color.b * intensity;
                totalIntensity += intensity;
            }
        });

        // Normalize
        return {
            r: Math.min(255, totalR),
            g: Math.min(255, totalG),
            b: Math.min(255, totalB),
            intensity: Math.min(1, totalIntensity)
        };
    }

    // Clear all lights
    clearLights() {
        this.lights = [];
    }

    // Clear all shadows
    clearShadows() {
        this.shadows.clear();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightingSystem;
}

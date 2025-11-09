// Advanced Weather System
// Rain, snow, fog, wind, thunder, lightning

class RainDrop {
    constructor(x, y, speed, length) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.length = length;
        this.opacity = 0.4 + Math.random() * 0.3;
    }

    update(deltaTime, wind) {
        this.y += this.speed;
        this.x += wind * 0.5;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#a0b0c0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX, screenY + this.length);
        ctx.stroke();
        ctx.restore();
    }
}

class Snowflake {
    constructor(x, y, speed, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.drift = (Math.random() - 0.5) * 0.5;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.02 + Math.random() * 0.02;
        this.opacity = 0.7 + Math.random() * 0.3;
    }

    update(deltaTime, wind) {
        this.y += this.speed;
        this.swayPhase += this.swaySpeed;
        this.x += Math.sin(this.swayPhase) * 0.5 + this.drift + wind * 0.2;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle effect
        ctx.fillStyle = '#e0f0ff';
        ctx.beginPath();
        ctx.arc(screenX - this.size * 0.3, screenY - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Lightning {
    constructor(x, startY, endY) {
        this.x = x;
        this.startY = startY;
        this.endY = endY;
        this.segments = this.generateSegments();
        this.duration = 100 + Math.random() * 100;
        this.timer = 0;
        this.opacity = 1.0;
    }

    generateSegments() {
        const segments = [];
        const segmentCount = 10 + Math.floor(Math.random() * 10);
        let currentX = this.x;
        let currentY = this.startY;
        const stepY = (this.endY - this.startY) / segmentCount;

        for (let i = 0; i < segmentCount; i++) {
            const nextX = currentX + (Math.random() - 0.5) * 30;
            const nextY = currentY + stepY;
            segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
            currentX = nextX;
            currentY = nextY;
        }

        return segments;
    }

    update(deltaTime) {
        this.timer += deltaTime;
        this.opacity = 1 - (this.timer / this.duration);
        return this.timer < this.duration;
    }

    draw(ctx, cameraX, cameraY) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';

        this.segments.forEach(segment => {
            const screenX1 = segment.x1 - cameraX;
            const screenY1 = segment.y1 - cameraY;
            const screenX2 = segment.x2 - cameraX;
            const screenY2 = segment.y2 - cameraY;

            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.stroke();
        });

        // Inner bright core
        ctx.strokeStyle = '#e0f0ff';
        ctx.lineWidth = 1;
        this.segments.forEach(segment => {
            const screenX1 = segment.x1 - cameraX;
            const screenY1 = segment.y1 - cameraY;
            const screenX2 = segment.x2 - cameraX;
            const screenY2 = segment.y2 - cameraY;

            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.stroke();
        });

        ctx.restore();
    }
}

class WeatherSystem {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Weather type
        this.currentWeather = 'clear'; // clear, rain, snow, storm, fog

        // Rain
        this.rainDrops = [];
        this.rainIntensity = 0; // 0-1

        // Snow
        this.snowflakes = [];
        this.snowIntensity = 0; // 0-1

        // Lightning
        this.lightnings = [];
        this.lightningTimer = 0;
        this.lightningInterval = 3000; // ms between lightning strikes

        // Fog
        this.fogDensity = 0; // 0-1
        this.fogColor = { r: 200, g: 200, b: 220 };

        // Wind
        this.windSpeed = 0; // -5 to 5

        // Thunder sound flag (for game to handle)
        this.shouldPlayThunder = false;
    }

    // Set weather type
    setWeather(weatherType, intensity = 0.5) {
        this.currentWeather = weatherType;

        switch (weatherType) {
            case 'clear':
                this.rainIntensity = 0;
                this.snowIntensity = 0;
                this.fogDensity = 0;
                this.windSpeed = 0;
                break;

            case 'rain':
                this.rainIntensity = intensity;
                this.snowIntensity = 0;
                this.fogDensity = 0.1;
                this.windSpeed = intensity * 2;
                break;

            case 'snow':
                this.rainIntensity = 0;
                this.snowIntensity = intensity;
                this.fogDensity = 0.2;
                this.windSpeed = intensity;
                break;

            case 'storm':
                this.rainIntensity = intensity;
                this.snowIntensity = 0;
                this.fogDensity = 0.3;
                this.windSpeed = intensity * 3;
                this.lightningInterval = 2000 / intensity;
                break;

            case 'fog':
                this.rainIntensity = 0;
                this.snowIntensity = 0;
                this.fogDensity = intensity;
                this.windSpeed = 0.5;
                break;
        }
    }

    update(deltaTime, cameraX, cameraY) {
        this.shouldPlayThunder = false;

        // Update rain
        if (this.rainIntensity > 0) {
            // Add new rain drops
            const dropsToAdd = Math.floor(this.rainIntensity * 5);
            for (let i = 0; i < dropsToAdd; i++) {
                this.rainDrops.push(new RainDrop(
                    cameraX + Math.random() * this.canvasWidth,
                    cameraY - 10,
                    8 + Math.random() * 8,
                    10 + Math.random() * 10
                ));
            }

            // Update existing rain drops
            this.rainDrops = this.rainDrops.filter(drop => {
                drop.update(deltaTime, this.windSpeed);
                return drop.y < cameraY + this.canvasHeight + 50;
            });

            // Limit rain drops
            if (this.rainDrops.length > 500) {
                this.rainDrops = this.rainDrops.slice(-500);
            }
        }

        // Update snow
        if (this.snowIntensity > 0) {
            // Add new snowflakes
            const flakesToAdd = Math.floor(this.snowIntensity * 3);
            for (let i = 0; i < flakesToAdd; i++) {
                this.snowflakes.push(new Snowflake(
                    cameraX + Math.random() * this.canvasWidth,
                    cameraY - 10,
                    0.5 + Math.random() * 1.5,
                    2 + Math.random() * 3
                ));
            }

            // Update existing snowflakes
            this.snowflakes = this.snowflakes.filter(flake => {
                flake.update(deltaTime, this.windSpeed);
                return flake.y < cameraY + this.canvasHeight + 50;
            });

            // Limit snowflakes
            if (this.snowflakes.length > 300) {
                this.snowflakes = this.snowflakes.slice(-300);
            }
        }

        // Update lightning (for storms)
        if (this.currentWeather === 'storm') {
            this.lightningTimer += deltaTime;

            if (this.lightningTimer >= this.lightningInterval) {
                // Create lightning
                const lightningX = cameraX + Math.random() * this.canvasWidth;
                this.lightnings.push(new Lightning(
                    lightningX,
                    cameraY,
                    cameraY + Math.random() * 300 + 200
                ));

                this.shouldPlayThunder = true;
                this.lightningTimer = 0;
                this.lightningInterval = 1000 + Math.random() * 4000;
            }
        }

        // Update existing lightning
        this.lightnings = this.lightnings.filter(lightning => lightning.update(deltaTime));
    }

    draw(ctx, cameraX, cameraY) {
        // Draw rain
        this.rainDrops.forEach(drop => drop.draw(ctx, cameraX, cameraY));

        // Draw snow
        this.snowflakes.forEach(flake => flake.draw(ctx, cameraX, cameraY));

        // Draw lightning
        this.lightnings.forEach(lightning => lightning.draw(ctx, cameraX, cameraY));

        // Draw fog overlay
        if (this.fogDensity > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(${this.fogColor.r}, ${this.fogColor.g}, ${this.fogColor.b}, ${this.fogDensity * 0.6})`;
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.restore();
        }
    }

    // Flash screen white when lightning strikes
    drawLightningFlash(ctx) {
        if (this.lightnings.length > 0 && this.lightnings[0].timer < 50) {
            ctx.save();
            const opacity = (1 - this.lightnings[0].timer / 50) * 0.3;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.restore();
        }
    }

    // Get current weather type
    getWeather() {
        return this.currentWeather;
    }

    // Get wind speed (for particle system)
    getWindSpeed() {
        return this.windSpeed;
    }

    // Check if thunder should play
    checkThunder() {
        const result = this.shouldPlayThunder;
        this.shouldPlayThunder = false;
        return result;
    }

    // Clear all weather effects
    clear() {
        this.rainDrops = [];
        this.snowflakes = [];
        this.lightnings = [];
        this.setWeather('clear');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherSystem;
}

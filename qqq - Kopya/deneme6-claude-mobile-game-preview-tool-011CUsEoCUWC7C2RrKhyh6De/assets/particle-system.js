// Advanced Particle System for Realistic Effects
// Handles dust, water splash, leaves, footsteps, etc.

class Particle {
    constructor(x, y, vx, vy, type, lifespan) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.life = lifespan;
        this.maxLife = lifespan;
        this.alpha = 1.0;
        this.size = 1;
        this.color = '#ffffff';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.gravity = 0;
        this.friction = 1.0;

        // Type-specific properties
        this.initializeByType(type);
    }

    initializeByType(type) {
        switch(type) {
            case 'dust':
                this.size = 1 + Math.random() * 2;
                this.color = 'rgba(150, 130, 100, 0.6)';
                this.gravity = -0.02; // Float upward
                this.friction = 0.98;
                break;

            case 'grass_dust':
                this.size = 1 + Math.random() * 1.5;
                this.color = 'rgba(100, 140, 80, 0.5)';
                this.gravity = -0.015;
                this.friction = 0.97;
                break;

            case 'water_splash':
                this.size = 2 + Math.random() * 3;
                this.color = 'rgba(100, 150, 200, 0.8)';
                this.gravity = 0.15; // Fall down
                this.friction = 0.95;
                break;

            case 'water_ripple':
                this.size = 3;
                this.maxSize = 20 + Math.random() * 15;
                this.color = 'rgba(150, 200, 250, 0.6)';
                this.expandSpeed = 0.5;
                break;

            case 'leaf':
                this.size = 3 + Math.random() * 4;
                this.color = Math.random() < 0.5 ? 'rgba(60, 120, 40, 0.8)' : 'rgba(80, 100, 30, 0.8)';
                this.gravity = 0.03;
                this.friction = 0.98;
                this.swayAmplitude = 2 + Math.random() * 3;
                this.swayFrequency = 0.05 + Math.random() * 0.05;
                break;

            case 'footstep':
                this.size = 4 + Math.random() * 2;
                this.color = 'rgba(80, 60, 40, 0.4)';
                this.gravity = 0;
                this.friction = 1.0;
                this.fadeSpeed = 0.02;
                break;

            case 'sparkle':
                this.size = 2 + Math.random() * 2;
                this.color = 'rgba(255, 255, 200, 0.9)';
                this.pulseSpeed = 0.1;
                this.pulsePhase = Math.random() * Math.PI * 2;
                break;

            case 'rain':
                this.size = 1;
                this.length = 8 + Math.random() * 6;
                this.color = 'rgba(150, 180, 220, 0.6)';
                this.gravity = 0.5;
                this.friction = 1.0;
                break;

            case 'snow':
                this.size = 2 + Math.random() * 3;
                this.color = 'rgba(255, 255, 255, 0.9)';
                this.gravity = 0.02;
                this.friction = 0.99;
                this.drift = (Math.random() - 0.5) * 0.3;
                break;
        }
    }

    update(deltaTime) {
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Apply gravity
        this.vy += this.gravity;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Type-specific updates
        if (this.type === 'water_ripple') {
            this.size += this.expandSpeed;
            if (this.size > this.maxSize) {
                this.life = 0;
            }
        }

        if (this.type === 'leaf') {
            // Sway motion for leaves
            this.x += Math.sin(Date.now() * this.swayFrequency) * this.swayAmplitude * 0.1;
            this.rotation += this.rotationSpeed;
        }

        if (this.type === 'sparkle') {
            // Pulsing effect
            this.alpha = 0.5 + Math.sin(Date.now() * this.pulseSpeed + this.pulsePhase) * 0.5;
        }

        if (this.type === 'snow') {
            // Drift motion for snow
            this.vx += this.drift * 0.01;
        }

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Decrease life
        this.life -= deltaTime;

        // Fade out
        const lifeRatio = this.life / this.maxLife;
        if (this.type !== 'sparkle') {
            this.alpha = lifeRatio;
        }

        return this.life > 0;
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.type === 'water_ripple') {
            // Draw expanding circle
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'rain') {
            // Draw rain as line
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX + this.vx * 2, screenY + this.vy * 2);
            ctx.stroke();
        } else if (this.type === 'leaf') {
            // Draw leaf with rotation
            ctx.translate(screenX, screenY);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw as circle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500;
    }

    // Emit dust particles when walking on dirt/grass
    emitDust(x, y, terrain = 'dirt') {
        const particleType = terrain === 'grass' ? 'grass_dust' : 'dust';
        for (let i = 0; i < 3; i++) {
            const angle = (Math.random() - 0.5) * Math.PI;
            const speed = 0.5 + Math.random() * 1;
            this.addParticle(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                particleType,
                500 + Math.random() * 500
            );
        }
    }

    // Emit water splash when entering water
    emitWaterSplash(x, y, intensity = 1) {
        // Splash particles
        for (let i = 0; i < 8 * intensity; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = 1 + Math.random() * 3;
            this.addParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 2,
                'water_splash',
                400 + Math.random() * 400
            );
        }

        // Ripple effect
        this.addParticle(x, y, 0, 0, 'water_ripple', 1000);
    }

    // Emit leaves when walking under trees
    emitLeaves(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 0.5;
            this.addParticle(
                x + (Math.random() - 0.5) * 30,
                y - 20 - Math.random() * 20,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'leaf',
                2000 + Math.random() * 2000
            );
        }
    }

    // Emit footstep mark
    emitFootstep(x, y) {
        this.addParticle(
            x,
            y,
            0,
            0,
            'footstep',
            3000
        );
    }

    // Emit sparkles (for magical effects)
    emitSparkles(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            this.addParticle(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                0,
                0,
                'sparkle',
                1000 + Math.random() * 1000
            );
        }
    }

    // Emit rain
    emitRain(x, y, width, height, density = 1) {
        const count = Math.floor(density * 5);
        for (let i = 0; i < count; i++) {
            this.addParticle(
                x + Math.random() * width,
                y - 50,
                (Math.random() - 0.5) * 0.5,
                8 + Math.random() * 4,
                'rain',
                2000
            );
        }
    }

    // Emit snow
    emitSnow(x, y, width, height, density = 1) {
        const count = Math.floor(density * 3);
        for (let i = 0; i < count; i++) {
            this.addParticle(
                x + Math.random() * width,
                y - 50,
                (Math.random() - 0.5) * 0.3,
                0.5 + Math.random() * 0.5,
                'snow',
                5000
            );
        }
    }

    addParticle(x, y, vx, vy, type, lifespan) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push(new Particle(x, y, vx, vy, type, lifespan));
        }
    }

    update(deltaTime) {
        // Update all particles and remove dead ones
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
    }

    draw(ctx, cameraX, cameraY) {
        this.particles.forEach(particle => {
            particle.draw(ctx, cameraX, cameraY);
        });
    }

    clear() {
        this.particles = [];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}

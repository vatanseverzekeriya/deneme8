// Advanced Camera System
// Smooth follow, camera shake, zoom, parallax, screen transitions

class CameraSystem {
    constructor(canvasWidth, canvasHeight, mapWidth, mapHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        // Camera position
        this.x = 0;
        this.y = 0;

        // Target position (what camera is following)
        this.targetX = 0;
        this.targetY = 0;

        // Smooth follow parameters
        this.smoothness = 0.1; // 0 = instant, 1 = no follow
        this.lookAheadDistance = 50; // Pixels to look ahead in movement direction

        // Zoom
        this.zoom = 1.0;
        this.targetZoom = 1.0;
        this.zoomSpeed = 0.05;
        this.minZoom = 0.5;
        this.maxZoom = 2.0;

        // Camera shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeX = 0;
        this.shakeY = 0;

        // Camera deadzone (area where target can move without camera moving)
        this.deadzoneWidth = 100;
        this.deadzoneHeight = 100;

        // Boundaries
        this.boundaryPadding = 50;

        // Velocity tracking for look-ahead
        this.targetVelocityX = 0;
        this.targetVelocityY = 0;
        this.lastTargetX = 0;
        this.lastTargetY = 0;
    }

    // Set the target position for the camera to follow
    setTarget(x, y) {
        // Calculate velocity for look-ahead
        this.targetVelocityX = x - this.lastTargetX;
        this.targetVelocityY = y - this.lastTargetY;
        this.lastTargetX = x;
        this.lastTargetY = y;

        // Add look-ahead based on velocity
        const speed = Math.sqrt(this.targetVelocityX ** 2 + this.targetVelocityY ** 2);
        if (speed > 0.1) {
            const normalizedVX = this.targetVelocityX / speed;
            const normalizedVY = this.targetVelocityY / speed;
            this.targetX = x + normalizedVX * this.lookAheadDistance;
            this.targetY = y + normalizedVY * this.lookAheadDistance;
        } else {
            this.targetX = x;
            this.targetY = y;
        }
    }

    // Update camera position with smooth following
    update(deltaTime) {
        // Smooth follow to target
        const targetCameraX = this.targetX - this.canvasWidth / (2 * this.zoom);
        const targetCameraY = this.targetY - this.canvasHeight / (2 * this.zoom);

        // Apply smoothing
        this.x += (targetCameraX - this.x) * this.smoothness;
        this.y += (targetCameraY - this.y) * this.smoothness;

        // Apply boundaries
        this.applyBoundaries();

        // Update zoom
        this.zoom += (this.targetZoom - this.zoom) * this.zoomSpeed;

        // Update camera shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
            this.shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;

            // Decay shake intensity
            this.shakeIntensity *= 0.95;

            if (this.shakeDuration <= 0) {
                this.shakeIntensity = 0;
                this.shakeX = 0;
                this.shakeY = 0;
            }
        }
    }

    applyBoundaries() {
        // Ensure camera stays within map bounds
        const maxX = this.mapWidth * 32 - this.canvasWidth / this.zoom + this.boundaryPadding;
        const maxY = this.mapHeight * 32 - this.canvasHeight / this.zoom + this.boundaryPadding;

        this.x = Math.max(-this.boundaryPadding, Math.min(this.x, maxX));
        this.y = Math.max(-this.boundaryPadding, Math.min(this.y, maxY));
    }

    // Get camera position with shake applied
    getX() {
        return this.x + this.shakeX;
    }

    getY() {
        return this.y + this.shakeY;
    }

    // Trigger camera shake
    shake(intensity, duration) {
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
        this.shakeDuration = Math.max(this.shakeDuration, duration);
    }

    // Set zoom level
    setZoom(zoom) {
        this.targetZoom = Math.max(this.minZoom, Math.min(zoom, this.maxZoom));
    }

    // Zoom in/out
    zoomIn(amount = 0.1) {
        this.setZoom(this.targetZoom + amount);
    }

    zoomOut(amount = 0.1) {
        this.setZoom(this.targetZoom - amount);
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.getX()) * this.zoom,
            y: (worldY - this.getY()) * this.zoom
        };
    }

    // Convert screen coordinates to world coordinates
    screenToWorld(screenX, screenY) {
        return {
            x: screenX / this.zoom + this.getX(),
            y: screenY / this.zoom + this.getY()
        };
    }

    // Check if a point is visible on screen
    isVisible(worldX, worldY, margin = 50) {
        const screen = this.worldToScreen(worldX, worldY);
        return screen.x > -margin &&
               screen.x < this.canvasWidth + margin &&
               screen.y > -margin &&
               screen.y < this.canvasHeight + margin;
    }

    // Check if a rectangle is visible on screen
    isRectVisible(worldX, worldY, width, height) {
        const left = this.getX();
        const right = this.getX() + this.canvasWidth / this.zoom;
        const top = this.getY();
        const bottom = this.getY() + this.canvasHeight / this.zoom;

        return worldX + width > left &&
               worldX < right &&
               worldY + height > top &&
               worldY < bottom;
    }

    // Get visible bounds (for culling)
    getVisibleBounds() {
        return {
            left: this.getX(),
            right: this.getX() + this.canvasWidth / this.zoom,
            top: this.getY(),
            bottom: this.getY() + this.canvasHeight / this.zoom,
            width: this.canvasWidth / this.zoom,
            height: this.canvasHeight / this.zoom
        };
    }

    // Transition camera to a specific position
    transitionTo(x, y, duration = 1000) {
        // Smooth transition using animation
        const startX = this.x;
        const startY = this.y;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-in-out)
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.x = startX + (x - startX) * eased;
            this.y = startY + (y - startY) * eased;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Set camera smoothness (0 = instant, 1 = no follow)
    setSmoothness(smoothness) {
        this.smoothness = Math.max(0, Math.min(1, smoothness));
    }

    // Set look-ahead distance
    setLookAheadDistance(distance) {
        this.lookAheadDistance = distance;
    }

    // Apply camera transformation to context
    applyTransform(ctx) {
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.getX(), -this.getY());
    }

    // Restore context transformation
    restoreTransform(ctx) {
        ctx.restore();
    }

    // Get parallax offset for background layers
    getParallaxOffset(layer = 1) {
        // Layer 0 = no movement (UI)
        // Layer 1 = full movement (game world)
        // Layer 0.5 = half movement (distant background)
        return {
            x: this.getX() * layer,
            y: this.getY() * layer
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraSystem;
}

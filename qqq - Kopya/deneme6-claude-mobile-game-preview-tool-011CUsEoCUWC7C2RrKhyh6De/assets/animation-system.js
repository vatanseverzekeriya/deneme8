// Professional Animation System for RPG Game
// Handles 8-directional movement and sprite animations

class AnimationSystem {
    constructor() {
        this.spriteSize = 64;
        this.animationFrames = 4;
        this.directions = 8;
        this.frameTime = 100; // milliseconds per frame - Smoother animation (was 150)
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameProgress = 0; // For sub-frame interpolation (smooth transitions)

        // Direction mapping: 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
        this.directionNames = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    }

    // Get direction index from movement vector
    getDirection(dx, dy) {
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return 4; // Default to south (idle)
        
        // Calculate angle: atan2 gives angle from positive x-axis
        // -PI to PI, where 0 is right, PI/2 is down, -PI/2 is up
        const angle = Math.atan2(dy, dx);
        
        // Our sprite sheet order: 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
        // atan2 mapping:
        // N (up, dy<0): -PI/2 -> direction 0
        // NE (dx>0, dy<0): -PI/4 -> direction 1
        // E (right, dx>0): 0 -> direction 2
        // SE (dx>0, dy>0): PI/4 -> direction 3
        // S (down, dy>0): PI/2 -> direction 4
        // SW (dx<0, dy>0): 3PI/4 -> direction 5
        // W (left, dx<0): PI or -PI -> direction 6
        // NW (dx<0, dy<0): -3PI/4 -> direction 7
        
        // Convert angle to direction index
        // Add PI/2 to rotate from atan2's coordinate system to our sprite sheet
        let normalizedAngle = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
        
        // Convert to direction index (0-7)
        let direction = Math.round(normalizedAngle / (Math.PI / 4)) % 8;
        
        return direction;
    }

    // Update animation frame with smooth interpolation
    update(deltaTime, isMoving) {
        if (isMoving) {
            this.frameTimer += deltaTime;

            // Calculate frame progress for smooth interpolation
            this.frameProgress = this.frameTimer / this.frameTime;

            if (this.frameTimer >= this.frameTime) {
                this.currentFrame = (this.currentFrame + 1) % this.animationFrames;
                this.frameTimer = 0;
                this.frameProgress = 0;
            }
        } else {
            // Smooth transition to idle (gradually return to frame 0)
            if (this.currentFrame !== 0) {
                this.frameTimer += deltaTime;
                if (this.frameTimer >= this.frameTime / 2) { // Faster return to idle
                    this.currentFrame = 0;
                    this.frameTimer = 0;
                    this.frameProgress = 0;
                }
            } else {
                this.frameTimer = 0;
                this.frameProgress = 0;
            }
        }
    }

    // Get current frame index
    getCurrentFrame() {
        return this.currentFrame;
    }

    // Reset animation
    reset() {
        this.currentFrame = 0;
        this.frameTimer = 0;
    }
}

// Sprite Manager - Handles loading and caching sprites
class SpriteManager {
    constructor() {
        this.sprites = new Map();
        this.generator = new SpriteGenerator();
        this.playerAnimation = new AnimationSystem();
        this.monsterAnimations = new Map(); // One animation per monster
    }

    // Initialize all sprites
    initialize() {
        // Generate Shadow Knight sprite sheet
        const shadowKnightSheet = this.generator.generateShadowKnightSpriteSheet();
        this.sprites.set('shadowKnight', shadowKnightSheet);
        this.sprites.set('knight', shadowKnightSheet); // Legacy support
        
        // Generate monster sprite sheets
        const monsterTypes = ['wolf', 'goblin', 'orc', 'troll', 'dragon'];
        monsterTypes.forEach(type => {
            const sheet = this.generator.generateMonsterSpriteSheet(type);
            this.sprites.set(type, sheet);
        });
        
        // Generate item sprites
        const itemSprites = this.generator.generateItemSprites();
        this.sprites.set('items', itemSprites);
        
        // Generate skill icon sprites
        const skillIcons = this.generator.generateSkillIcons();
        this.sprites.set('skills', skillIcons);
        
        return Promise.resolve();
    }

    // Get sprite sheet
    getSpriteSheet(type) {
        return this.sprites.get(type);
    }

    // Draw sprite at position with direction and frame
    drawSprite(ctx, type, x, y, direction, frame, scale = 1) {
        const sheet = this.getSpriteSheet(type);
        if (!sheet) return;

        const spriteSize = 64;
        const sourceX = frame * spriteSize;
        const sourceY = direction * spriteSize;
        
        const destSize = spriteSize * scale;
        const destX = x - destSize / 2;
        const destY = y - destSize / 2;

        ctx.drawImage(
            sheet,
            sourceX, sourceY, spriteSize, spriteSize,
            destX, destY, destSize, destSize
        );
    }

    // Draw character with animation
    drawCharacter(ctx, type, x, y, dx, dy, isMoving, deltaTime) {
        const direction = this.playerAnimation.getDirection(dx, dy);
        this.playerAnimation.update(deltaTime, isMoving);
        const frame = this.playerAnimation.getCurrentFrame();
        
        this.drawSprite(ctx, type, x, y, direction, frame, 1);
    }

    // Draw monster with animation (separate animation instance per monster)
    drawMonster(ctx, type, x, y, dx, dy, isMoving, deltaTime, monsterId) {
        // Create unique animation system for each monster
        if (!this.monsterAnimations.has(monsterId)) {
            this.monsterAnimations.set(monsterId, new AnimationSystem());
        }
        
        const animation = this.monsterAnimations.get(monsterId);
        const direction = animation.getDirection(dx, dy);
        animation.update(deltaTime, isMoving);
        const frame = animation.getCurrentFrame();
        
        this.drawSprite(ctx, type, x, y, direction, frame, 0.9);
    }

    // Draw item icon
    drawItemIcon(ctx, itemType, x, y, size = 32) {
        const itemSheet = this.getSpriteSheet('items');
        if (!itemSheet) return;

        let sourceX = 0;
        switch(itemType) {
            case 'HP':
            case 'potion_heal':
                sourceX = 0;
                break;
            case 'MP':
            case 'potion_mana':
                sourceX = 32;
                break;
            case 'AU':
            case 'gold':
                sourceX = 64;
                break;
            case 'SW':
            case 'weapon':
                sourceX = 96;
                break;
            case 'AR':
            case 'armor':
                sourceX = 128;
                break;
        }

        ctx.drawImage(
            itemSheet,
            sourceX, 0, 32, 32,
            x - size / 2, y - size / 2, size, size
        );
    }

    // Draw skill icon
    drawSkillIcon(ctx, skillIndex, x, y, size = 32) {
        const skillSheet = this.getSpriteSheet('skills');
        if (!skillSheet) return;

        const sourceX = skillIndex * 32;
        ctx.drawImage(
            skillSheet,
            sourceX, 0, 32, 32,
            x - size / 2, y - size / 2, size, size
        );
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationSystem, SpriteManager };
}


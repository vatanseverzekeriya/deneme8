// High-Quality RPG Sprite Generator
// Knight Theme - Professional Quality Assets

class SpriteGenerator {
    constructor() {
        this.spriteSize = 64; // 64x64 pixels per sprite
        this.animationFrames = 4; // 4 frames per animation
        this.directions = 8; // 8 directions: N, NE, E, SE, S, SW, W, NW
    }

    // Generate Shadow Knight Character Sprite Sheet
    generateShadowKnightSpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = this.spriteSize * this.animationFrames;
        canvas.height = this.spriteSize * this.directions;
        const ctx = canvas.getContext('2d');
        
        // Enable pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;

        for (let dir = 0; dir < this.directions; dir++) {
            for (let frame = 0; frame < this.animationFrames; frame++) {
                const x = frame * this.spriteSize;
                const y = dir * this.spriteSize;
                
                this.drawShadowKnight(ctx, x, y, dir, frame);
            }
        }

        return canvas;
    }

    // Generate Knight Character Sprite Sheet (legacy support)
    generateKnightSpriteSheet() {
        return this.generateShadowKnightSpriteSheet();
    }

    // Professional Shadow Knight Sprite with advanced shading and details
    drawShadowKnight(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        // Professional Shadow Knight color scheme - Realistic metallic armor with advanced shading
        const darkMetal = '#0f0f1a';
        const metalBase = '#1a1a2a';
        const metalMid = '#2a2a3a';
        const metalHighlight = '#3a3a4a';
        const metalShine = '#5a5a6a';
        const metalReflection = '#7a7a8a';
        const darkPurple = '#1d0f2d';
        const purpleAccent = '#3a2a5a';
        const purpleGlow = '#5a4a7a';
        const capeColor = '#050510';
        const capeShadow = '#0a0a15';
        const swordGlow = '#9a7aff';
        const swordBase = '#5a3a7a';
        const swordEdge = '#ffaa00';
        const shadowColor = 'rgba(0, 0, 0, 0.6)';
        const glowColor = 'rgba(154, 122, 255, 0.4)';
        const skinTone = '#8b6a4a';
        const eyeColor = '#ff4444';

        // Animation offset for walking
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2.5;
        const armSwing = Math.sin(frame * Math.PI / 2) * 4;
        const legOffset = Math.sin(frame * Math.PI / 2) * 5;

        // Draw realistic shadow with gradient
        const shadowGradient = ctx.createRadialGradient(0, this.spriteSize / 2 - 6, 0, 0, this.spriteSize / 2 - 6, 25);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 6, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rotate based on direction
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Cape (flowing, only visible from behind)
        if (direction === 0 || direction === 1 || direction === 7) {
            ctx.fillStyle = capeColor;
            ctx.beginPath();
            ctx.moveTo(-16, -12 + walkOffset);
            ctx.quadraticCurveTo(-22, 5 + walkOffset, -18, 18 + walkOffset);
            ctx.lineTo(-12, 22 + walkOffset);
            ctx.quadraticCurveTo(-8, 8 + walkOffset, -6, -8 + walkOffset);
            ctx.closePath();
            ctx.fill();
            
            // Cape inner shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.moveTo(-14, -10 + walkOffset);
            ctx.quadraticCurveTo(-18, 8 + walkOffset, -15, 16 + walkOffset);
            ctx.lineTo(-12, 18 + walkOffset);
            ctx.quadraticCurveTo(-9, 5 + walkOffset, -7, -6 + walkOffset);
            ctx.closePath();
            ctx.fill();
        }

        // Body (torso) - Base layer with gradient
        const torsoGradient = ctx.createLinearGradient(-13, -22 + walkOffset, -13, 10 + walkOffset);
        torsoGradient.addColorStop(0, darkMetal);
        torsoGradient.addColorStop(0.5, metalBase);
        torsoGradient.addColorStop(1, darkMetal);
        ctx.fillStyle = torsoGradient;
        ctx.fillRect(-13, -22 + walkOffset, 26, 32);
        
        // Chest plate - Main armor with realistic shading
        const chestGradient = ctx.createLinearGradient(-11, -20 + walkOffset, -11, 0 + walkOffset);
        chestGradient.addColorStop(0, metalMid);
        chestGradient.addColorStop(0.3, metalHighlight);
        chestGradient.addColorStop(0.7, metalMid);
        chestGradient.addColorStop(1, metalBase);
        ctx.fillStyle = chestGradient;
        ctx.fillRect(-11, -20 + walkOffset, 22, 20);
        
        // Chest plate highlights (metallic reflection)
        ctx.fillStyle = metalReflection;
        ctx.fillRect(-9, -18 + walkOffset, 18, 3);
        ctx.fillRect(-7, -15 + walkOffset, 14, 2);
        
        // Chest plate highlights
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(-9, -18 + walkOffset, 18, 3);
        ctx.fillRect(-9, -12 + walkOffset, 18, 2);
        
        // Chest plate shine
        ctx.fillStyle = metalShine;
        ctx.fillRect(-8, -17 + walkOffset, 6, 1);
        ctx.fillRect(-8, -11 + walkOffset, 8, 1);
        
        // Armor details - rivets
        ctx.fillStyle = metalShine;
        for (let i = -8; i <= 8; i += 8) {
            ctx.beginPath();
            ctx.arc(i, -15 + walkOffset, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Shoulder pads - Left
        ctx.fillStyle = metalBase;
        ctx.fillRect(-20, -24 + walkOffset, 10, 12);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(-19, -23 + walkOffset, 8, 2);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(-18, -21 + walkOffset, 6, 8);
        
        // Shoulder pads - Right
        ctx.fillStyle = metalBase;
        ctx.fillRect(10, -24 + walkOffset, 10, 12);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(11, -23 + walkOffset, 8, 2);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(12, -21 + walkOffset, 6, 8);
        
        // Head/Helmet - Base
        ctx.fillStyle = metalBase;
        ctx.beginPath();
        ctx.arc(0, -32 + walkOffset, 13, 0, Math.PI * 2);
        ctx.fill();
        
        // Helmet top highlight
        ctx.fillStyle = metalHighlight;
        ctx.beginPath();
        ctx.arc(0, -35 + walkOffset, 10, 0, Math.PI);
        ctx.fill();
        
        // Helmet visor - Dark with glow
        ctx.fillStyle = darkMetal;
        ctx.fillRect(-9, -30 + walkOffset, 18, 5);
        ctx.fillStyle = glowColor;
        ctx.fillRect(-7, -29 + walkOffset, 14, 3);
        
        // Helmet details - Side plates
        ctx.fillStyle = metalBase;
        ctx.fillRect(-15, -28 + walkOffset, 4, 8);
        ctx.fillRect(11, -28 + walkOffset, 4, 8);
        
        // Arms - Left
        ctx.fillStyle = metalBase;
        ctx.fillRect(-22, -12 + walkOffset, 9, 22 + armSwing);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(-21, -11 + walkOffset, 7, 3);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(-20, -8 + walkOffset, 5, 18 + armSwing);
        
        // Arms - Right
        ctx.fillStyle = metalBase;
        ctx.fillRect(13, -12 + walkOffset, 9, 22 - armSwing);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(14, -11 + walkOffset, 7, 3);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(15, -8 + walkOffset, 5, 18 - armSwing);
        
        // Gauntlets
        ctx.fillStyle = metalBase;
        ctx.fillRect(-22, 10 + walkOffset + armSwing, 9, 6);
        ctx.fillRect(13, 10 + walkOffset - armSwing, 9, 6);
        ctx.fillStyle = metalShine;
        ctx.fillRect(-21, 11 + walkOffset + armSwing, 7, 2);
        ctx.fillRect(14, 11 + walkOffset - armSwing, 7, 2);
        
        // Legs - Left
        ctx.fillStyle = metalBase;
        ctx.fillRect(-11, 12 + walkOffset, 9, 22 + legOffset);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(-10, 13 + walkOffset, 7, 3);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(-9, 16 + walkOffset, 5, 16 + legOffset);
        
        // Legs - Right
        ctx.fillStyle = metalBase;
        ctx.fillRect(2, 12 + walkOffset, 9, 22 - legOffset);
        ctx.fillStyle = metalHighlight;
        ctx.fillRect(3, 13 + walkOffset, 7, 3);
        ctx.fillStyle = darkMetal;
        ctx.fillRect(4, 16 + walkOffset, 5, 16 - legOffset);
        
        // Knee guards
        ctx.fillStyle = metalBase;
        ctx.fillRect(-12, 20 + walkOffset + legOffset, 10, 6);
        ctx.fillRect(1, 20 + walkOffset - legOffset, 10, 6);
        
        // Boots - Left
        ctx.fillStyle = darkMetal;
        ctx.fillRect(-13, 32 + walkOffset + legOffset, 11, 7);
        ctx.fillStyle = metalBase;
        ctx.fillRect(-12, 33 + walkOffset + legOffset, 9, 2);
        ctx.fillStyle = metalShine;
        ctx.fillRect(-11, 34 + walkOffset + legOffset, 7, 1);
        
        // Boots - Right
        ctx.fillStyle = darkMetal;
        ctx.fillRect(2, 32 + walkOffset - legOffset, 11, 7);
        ctx.fillStyle = metalBase;
        ctx.fillRect(3, 33 + walkOffset - legOffset, 9, 2);
        ctx.fillStyle = metalShine;
        ctx.fillRect(4, 34 + walkOffset - legOffset, 7, 1);
        
        // Shadow Sword - Glowing purple blade
        // Sword glow effect
        ctx.fillStyle = glowColor;
        ctx.fillRect(16, -18 + walkOffset - armSwing, 5, 28);
        
        // Sword blade
        ctx.fillStyle = swordBase;
        ctx.fillRect(17, -17 + walkOffset - armSwing, 3, 26);
        ctx.fillStyle = swordGlow;
        ctx.fillRect(17.5, -16 + walkOffset - armSwing, 2, 24);
        
        // Sword edge highlight
        ctx.fillStyle = metalShine;
        ctx.fillRect(17, -17 + walkOffset - armSwing, 1, 26);
        
        // Sword hilt
        ctx.fillStyle = darkPurple;
        ctx.fillRect(15, -20 + walkOffset - armSwing, 7, 6);
        ctx.fillStyle = purpleAccent;
        ctx.fillRect(16, -19 + walkOffset - armSwing, 5, 4);
        
        // Sword guard
        ctx.fillStyle = metalBase;
        ctx.fillRect(14, -18 + walkOffset - armSwing, 9, 2);
        ctx.fillStyle = metalShine;
        ctx.fillRect(15, -17.5 + walkOffset - armSwing, 7, 1);
        
        // Shield (on left arm) - Dark with purple glow
        if (direction >= 2 && direction <= 6) {
            ctx.fillStyle = metalBase;
            ctx.fillRect(-27, -7 + walkOffset, 10, 18);
            ctx.fillStyle = metalHighlight;
            ctx.fillRect(-26, -6 + walkOffset, 8, 2);
            ctx.fillStyle = darkMetal;
            ctx.fillRect(-25, -4 + walkOffset, 6, 14);
            
            // Shield emblem - Shadow symbol
            ctx.fillStyle = purpleAccent;
            ctx.beginPath();
            ctx.arc(-22, 3 + walkOffset, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = darkPurple;
            ctx.beginPath();
            ctx.arc(-22, 3 + walkOffset, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = swordGlow;
            ctx.beginPath();
            ctx.arc(-22, 3 + walkOffset, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // Legacy support
    drawKnight(ctx, x, y, direction, frame) {
        this.drawShadowKnight(ctx, x, y, direction, frame);
    }

    // Generate Monster Sprite Sheets
    generateMonsterSpriteSheet(type) {
        const canvas = document.createElement('canvas');
        canvas.width = this.spriteSize * this.animationFrames;
        canvas.height = this.spriteSize * this.directions;
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;

        for (let dir = 0; dir < this.directions; dir++) {
            for (let frame = 0; frame < this.animationFrames; frame++) {
                const x = frame * this.spriteSize;
                const y = dir * this.spriteSize;
                
                switch(type) {
                    case 'wolf':
                        this.drawWolf(ctx, x, y, dir, frame);
                        break;
                    case 'goblin':
                        this.drawGoblin(ctx, x, y, dir, frame);
                        break;
                    case 'orc':
                        this.drawOrc(ctx, x, y, dir, frame);
                        break;
                    case 'troll':
                        this.drawTroll(ctx, x, y, dir, frame);
                        break;
                    case 'dragon':
                        this.drawDragon(ctx, x, y, dir, frame);
                        break;
                }
            }
        }

        return canvas;
    }

    drawWolf(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2.5;
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Professional color scheme - Dark wolf with menacing appearance
        const furDark = '#1a1a1a';
        const furBase = '#2a2a2a';
        const furLight = '#3a3a3a';
        const furHighlight = '#4a4a4a';
        const eyeGlow = '#ff4444';
        const eyeCore = '#ff0000';
        const shadowColor = 'rgba(0, 0, 0, 0.4)';

        // Shadow
        ctx.fillStyle = shadowColor;
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 6, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body - Base
        ctx.fillStyle = furBase;
        ctx.fillRect(-16, -12 + walkOffset, 32, 24);
        
        // Body - Highlights
        ctx.fillStyle = furLight;
        ctx.fillRect(-14, -10 + walkOffset, 28, 8);
        ctx.fillRect(-12, -2 + walkOffset, 24, 4);
        
        // Body - Shine
        ctx.fillStyle = furHighlight;
        ctx.fillRect(-12, -8 + walkOffset, 8, 2);
        ctx.fillRect(-10, 0 + walkOffset, 6, 1);
        
        // Head - Base
        ctx.fillStyle = furBase;
        ctx.beginPath();
        ctx.ellipse(0, -20 + walkOffset, 13, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head - Highlights
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.ellipse(0, -22 + walkOffset, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout
        ctx.fillStyle = furDark;
        ctx.fillRect(-5, -15 + walkOffset, 10, 7);
        ctx.fillStyle = furBase;
        ctx.fillRect(-4, -14 + walkOffset, 8, 5);
        
        // Nose
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(0, -12 + walkOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears - Left
        ctx.fillStyle = furDark;
        ctx.beginPath();
        ctx.moveTo(-9, -28 + walkOffset);
        ctx.lineTo(-6, -34 + walkOffset);
        ctx.lineTo(-3, -28 + walkOffset);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = furBase;
        ctx.beginPath();
        ctx.moveTo(-8, -29 + walkOffset);
        ctx.lineTo(-6, -32 + walkOffset);
        ctx.lineTo(-4, -29 + walkOffset);
        ctx.closePath();
        ctx.fill();
        
        // Ears - Right
        ctx.fillStyle = furDark;
        ctx.beginPath();
        ctx.moveTo(9, -28 + walkOffset);
        ctx.lineTo(6, -34 + walkOffset);
        ctx.lineTo(3, -28 + walkOffset);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = furBase;
        ctx.beginPath();
        ctx.moveTo(8, -29 + walkOffset);
        ctx.lineTo(6, -32 + walkOffset);
        ctx.lineTo(4, -29 + walkOffset);
        ctx.closePath();
        ctx.fill();
        
        // Eyes - Glowing red
        ctx.fillStyle = eyeGlow;
        ctx.beginPath();
        ctx.arc(-6, -22 + walkOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -22 + walkOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = eyeCore;
        ctx.beginPath();
        ctx.arc(-6, -22 + walkOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -22 + walkOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs - Front Left
        const legOffset = Math.sin(frame * Math.PI / 2) * 4;
        ctx.fillStyle = furBase;
        ctx.fillRect(-13, 12 + walkOffset, 7, 18 + legOffset);
        ctx.fillStyle = furLight;
        ctx.fillRect(-12, 13 + walkOffset, 5, 4);
        ctx.fillStyle = furDark;
        ctx.fillRect(-11, 17 + walkOffset, 3, 12 + legOffset);
        
        // Legs - Front Right
        ctx.fillStyle = furBase;
        ctx.fillRect(-3, 12 + walkOffset, 7, 18 - legOffset);
        ctx.fillStyle = furLight;
        ctx.fillRect(-2, 13 + walkOffset, 5, 4);
        ctx.fillStyle = furDark;
        ctx.fillRect(-1, 17 + walkOffset, 3, 12 - legOffset);
        
        // Legs - Back Left
        ctx.fillStyle = furBase;
        ctx.fillRect(5, 12 + walkOffset, 7, 18 + legOffset);
        ctx.fillStyle = furLight;
        ctx.fillRect(6, 13 + walkOffset, 5, 4);
        ctx.fillStyle = furDark;
        ctx.fillRect(7, 17 + walkOffset, 3, 12 + legOffset);
        
        // Legs - Back Right
        ctx.fillStyle = furBase;
        ctx.fillRect(15, 12 + walkOffset, 7, 18 - legOffset);
        ctx.fillStyle = furLight;
        ctx.fillRect(16, 13 + walkOffset, 5, 4);
        ctx.fillStyle = furDark;
        ctx.fillRect(17, 17 + walkOffset, 3, 12 - legOffset);
        
        // Paws
        ctx.fillStyle = furDark;
        ctx.fillRect(-13, 28 + walkOffset + legOffset, 7, 4);
        ctx.fillRect(-3, 28 + walkOffset - legOffset, 7, 4);
        ctx.fillRect(5, 28 + walkOffset + legOffset, 7, 4);
        ctx.fillRect(15, 28 + walkOffset - legOffset, 7, 4);
        
        // Tail - Flowing
        ctx.fillStyle = furBase;
        ctx.beginPath();
        ctx.moveTo(17, 2 + walkOffset);
        ctx.quadraticCurveTo(23 + Math.sin(frame * 0.5) * 2, 8 + walkOffset, 20, 14 + walkOffset);
        ctx.lineWidth = 8;
        ctx.strokeStyle = furBase;
        ctx.stroke();
        
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.moveTo(17, 3 + walkOffset);
        ctx.quadraticCurveTo(22 + Math.sin(frame * 0.5) * 2, 9 + walkOffset, 19, 13 + walkOffset);
        ctx.lineWidth = 6;
        ctx.strokeStyle = furLight;
        ctx.stroke();

        ctx.restore();
    }

    drawGoblin(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2;
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 8, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (green)
        ctx.fillStyle = '#4A8A4A';
        ctx.fillRect(-10, -15 + walkOffset, 20, 25);
        
        // Head (larger, green)
        ctx.fillStyle = '#5A9A5A';
        ctx.beginPath();
        ctx.arc(0, -25 + walkOffset, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears (pointed)
        ctx.fillStyle = '#3A7A3A';
        ctx.beginPath();
        ctx.moveTo(-10, -30 + walkOffset);
        ctx.lineTo(-8, -35 + walkOffset);
        ctx.lineTo(-6, -30 + walkOffset);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, -30 + walkOffset);
        ctx.lineTo(8, -35 + walkOffset);
        ctx.lineTo(6, -30 + walkOffset);
        ctx.closePath();
        ctx.fill();
        
        // Eyes (yellow)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-5, -28 + walkOffset, 3, 3);
        ctx.fillRect(2, -28 + walkOffset, 3, 3);
        
        // Mouth
        ctx.fillStyle = '#2A5A2A';
        ctx.fillRect(-4, -22 + walkOffset, 8, 3);
        
        // Arms
        const armSwing = Math.sin(frame * Math.PI / 2) * 2;
        ctx.fillStyle = '#4A8A4A';
        ctx.fillRect(-15, -10 + walkOffset, 6, 18 + armSwing);
        ctx.fillRect(9, -10 + walkOffset, 6, 18 - armSwing);
        
        // Legs
        const legOffset = Math.sin(frame * Math.PI / 2) * 3;
        ctx.fillStyle = '#3A7A3A';
        ctx.fillRect(-8, 10 + walkOffset, 6, 18 + legOffset);
        ctx.fillRect(2, 10 + walkOffset, 6, 18 - legOffset);
        
        // Club (in hand)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, -8 + walkOffset - armSwing, 4, 15);

        ctx.restore();
    }

    drawOrc(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2;
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 8, 20, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (muscular, dark green)
        ctx.fillStyle = '#3A6A3A';
        ctx.fillRect(-14, -18 + walkOffset, 28, 32);
        
        // Chest muscles
        ctx.fillStyle = '#4A7A4A';
        ctx.fillRect(-10, -15 + walkOffset, 20, 15);
        
        // Head
        ctx.fillStyle = '#2A5A2A';
        ctx.beginPath();
        ctx.arc(0, -28 + walkOffset, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Tusks
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-12, -20 + walkOffset, 3, 6);
        ctx.fillRect(9, -20 + walkOffset, 3, 6);
        
        // Eyes (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-6, -30 + walkOffset, 4, 4);
        ctx.fillRect(2, -30 + walkOffset, 4, 4);
        
        // Arms (muscular)
        const armSwing = Math.sin(frame * Math.PI / 2) * 3;
        ctx.fillStyle = '#3A6A3A';
        ctx.fillRect(-20, -12 + walkOffset, 8, 22 + armSwing);
        ctx.fillRect(12, -12 + walkOffset, 8, 22 - armSwing);
        
        // Legs
        const legOffset = Math.sin(frame * Math.PI / 2) * 4;
        ctx.fillStyle = '#2A5A2A';
        ctx.fillRect(-10, 14 + walkOffset, 8, 20 + legOffset);
        ctx.fillRect(2, 14 + walkOffset, 8, 20 - legOffset);
        
        // Axe
        ctx.fillStyle = '#808080';
        ctx.fillRect(15, -10 + walkOffset - armSwing, 3, 20);
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(13, -15 + walkOffset - armSwing, 7, 8);

        ctx.restore();
    }

    drawTroll(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2;
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Shadow (large)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 8, 24, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (large, gray)
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(-18, -20 + walkOffset, 36, 40);
        
        // Belly
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(-14, -5 + walkOffset, 28, 20);
        
        // Head (large)
        ctx.fillStyle = '#4A4A4A';
        ctx.beginPath();
        ctx.arc(0, -32 + walkOffset, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes (glowing)
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(-8, -35 + walkOffset, 5, 5);
        ctx.fillRect(3, -35 + walkOffset, 5, 5);
        
        // Nose
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(-3, -30 + walkOffset, 6, 8);
        
        // Mouth
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(-8, -22 + walkOffset, 16, 4);
        
        // Arms (long)
        const armSwing = Math.sin(frame * Math.PI / 2) * 4;
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(-24, -15 + walkOffset, 10, 30 + armSwing);
        ctx.fillRect(14, -15 + walkOffset, 10, 30 - armSwing);
        
        // Legs (thick)
        const legOffset = Math.sin(frame * Math.PI / 2) * 5;
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(-12, 20 + walkOffset, 10, 22 + legOffset);
        ctx.fillRect(2, 20 + walkOffset, 10, 22 - legOffset);
        
        // Club
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(18, -10 + walkOffset - armSwing, 6, 25);

        ctx.restore();
    }

    drawDragon(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x + this.spriteSize / 2, y + this.spriteSize / 2);
        
        const walkOffset = Math.sin(frame * Math.PI / 2) * 2;
        const angle = (direction * Math.PI * 2) / this.directions;
        ctx.rotate(angle);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.spriteSize / 2 - 8, 28, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (red scales)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(-20, -15 + walkOffset, 40, 30);
        
        // Scales pattern
        ctx.fillStyle = '#A00000';
        for (let i = -18; i < 18; i += 8) {
            for (let j = -12; j < 15; j += 8) {
                ctx.beginPath();
                ctx.arc(i, j + walkOffset, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Head
        ctx.fillStyle = '#7B0000';
        ctx.beginPath();
        ctx.ellipse(0, -28 + walkOffset, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Horns
        ctx.fillStyle = '#5A0000';
        ctx.beginPath();
        ctx.moveTo(-10, -35 + walkOffset);
        ctx.lineTo(-12, -42 + walkOffset);
        ctx.lineTo(-8, -38 + walkOffset);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, -35 + walkOffset);
        ctx.lineTo(12, -42 + walkOffset);
        ctx.lineTo(8, -38 + walkOffset);
        ctx.closePath();
        ctx.fill();
        
        // Eyes (glowing)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-8, -30 + walkOffset, 4, 4);
        ctx.fillRect(4, -30 + walkOffset, 4, 4);
        
        // Wings
        const wingFlap = Math.sin(frame * Math.PI / 2) * 5;
        ctx.fillStyle = '#6B0000';
        ctx.beginPath();
        ctx.moveTo(-18, -10 + walkOffset);
        ctx.lineTo(-30, -20 + walkOffset - wingFlap);
        ctx.lineTo(-25, 0 + walkOffset - wingFlap);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(18, -10 + walkOffset);
        ctx.lineTo(30, -20 + walkOffset - wingFlap);
        ctx.lineTo(25, 0 + walkOffset - wingFlap);
        ctx.closePath();
        ctx.fill();
        
        // Legs
        const legOffset = Math.sin(frame * Math.PI / 2) * 4;
        ctx.fillStyle = '#7B0000';
        ctx.fillRect(-15, 15 + walkOffset, 8, 18 + legOffset);
        ctx.fillRect(-5, 15 + walkOffset, 8, 18 - legOffset);
        ctx.fillRect(5, 15 + walkOffset, 8, 18 + legOffset);
        ctx.fillRect(15, 15 + walkOffset, 8, 18 - legOffset);
        
        // Tail
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(20, 0 + walkOffset);
        ctx.quadraticCurveTo(30 + Math.sin(frame), 5 + walkOffset, 25, 15 + walkOffset);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#8B0000';
        ctx.stroke();

        ctx.restore();
    }

    // Generate Item Sprites - Professional Quality
    generateItemSprites() {
        const canvas = document.createElement('canvas');
        canvas.width = 32 * 5; // 5 items
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // HP Potion
        this.drawHPPotion(ctx, 0, 0);
        // MP Potion
        this.drawMPPotion(ctx, 32, 0);
        // Gold
        this.drawGold(ctx, 64, 0);
        // Sword
        this.drawSwordIcon(ctx, 96, 0);
        // Armor
        this.drawArmorIcon(ctx, 128, 0);

        return canvas;
    }

    drawHPPotion(ctx, x, y) {
        // Red potion bottle
        const redDark = '#8B0000';
        const redBase = '#DC143C';
        const redLight = '#FF6347';
        const glass = '#E0E0E0';
        const glassHighlight = '#FFFFFF';

        // Bottle body
        ctx.fillStyle = redBase;
        ctx.fillRect(x + 8, y + 4, 16, 20);
        
        // Bottle neck
        ctx.fillStyle = glass;
        ctx.fillRect(x + 12, y + 2, 8, 4);
        
        // Bottle cap
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 13, y, 6, 3);
        
        // Liquid highlight
        ctx.fillStyle = redLight;
        ctx.fillRect(x + 10, y + 6, 12, 4);
        
        // Glass shine
        ctx.fillStyle = glassHighlight;
        ctx.fillRect(x + 10, y + 5, 2, 6);
        
        // Potion glow
        ctx.fillStyle = 'rgba(220, 20, 60, 0.3)';
        ctx.fillRect(x + 6, y + 22, 20, 4);
    }

    drawMPPotion(ctx, x, y) {
        // Blue potion bottle
        const blueDark = '#00008B';
        const blueBase = '#4169E1';
        const blueLight = '#87CEEB';
        const glass = '#E0E0E0';
        const glassHighlight = '#FFFFFF';

        // Bottle body
        ctx.fillStyle = blueBase;
        ctx.fillRect(x + 8, y + 4, 16, 20);
        
        // Bottle neck
        ctx.fillStyle = glass;
        ctx.fillRect(x + 12, y + 2, 8, 4);
        
        // Bottle cap
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 13, y, 6, 3);
        
        // Liquid highlight
        ctx.fillStyle = blueLight;
        ctx.fillRect(x + 10, y + 6, 12, 4);
        
        // Glass shine
        ctx.fillStyle = glassHighlight;
        ctx.fillRect(x + 10, y + 5, 2, 6);
        
        // Potion glow
        ctx.fillStyle = 'rgba(65, 105, 225, 0.3)';
        ctx.fillRect(x + 6, y + 22, 20, 4);
    }

    drawGold(ctx, x, y) {
        // Gold coin stack
        const goldDark = '#B8860B';
        const goldBase = '#FFD700';
        const goldLight = '#FFFF00';
        const goldShine = '#FFFFFF';

        // Coin stack - base
        ctx.fillStyle = goldBase;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin stack - shadow
        ctx.fillStyle = goldDark;
        ctx.beginPath();
        ctx.arc(x + 16, y + 18, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin stack - highlight
        ctx.fillStyle = goldLight;
        ctx.beginPath();
        ctx.arc(x + 16, y + 14, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin shine
        ctx.fillStyle = goldShine;
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Additional coins
        ctx.fillStyle = goldBase;
        ctx.beginPath();
        ctx.arc(x + 10, y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 22, y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSwordIcon(ctx, x, y) {
        // Shadow sword icon
        const swordDark = '#2a2a2a';
        const swordBase = '#6a4a8a';
        const swordGlow = '#8a6aff';
        const hilt = '#4a2a2a';

        // Sword blade
        ctx.fillStyle = swordBase;
        ctx.fillRect(x + 14, y + 4, 4, 20);
        
        // Sword glow
        ctx.fillStyle = swordGlow;
        ctx.fillRect(x + 15, y + 5, 2, 18);
        
        // Sword edge
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x + 14, y + 5, 1, 18);
        
        // Sword hilt
        ctx.fillStyle = hilt;
        ctx.fillRect(x + 12, y + 22, 8, 4);
        
        // Hilt guard
        ctx.fillStyle = swordDark;
        ctx.fillRect(x + 10, y + 24, 12, 2);
        
        // Hilt pommel
        ctx.fillStyle = swordGlow;
        ctx.beginPath();
        ctx.arc(x + 16, y + 28, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawArmorIcon(ctx, x, y) {
        // Shield icon
        const shieldDark = '#2a2a2a';
        const shieldBase = '#4a4a4a';
        const shieldLight = '#6a6a6a';
        const emblem = '#8a6aff';

        // Shield shape
        ctx.fillStyle = shieldBase;
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 4);
        ctx.lineTo(x + 8, y + 8);
        ctx.lineTo(x + 6, y + 16);
        ctx.lineTo(x + 8, y + 24);
        ctx.lineTo(x + 16, y + 28);
        ctx.lineTo(x + 24, y + 24);
        ctx.lineTo(x + 26, y + 16);
        ctx.lineTo(x + 24, y + 8);
        ctx.closePath();
        ctx.fill();
        
        // Shield edge
        ctx.strokeStyle = shieldLight;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Shield highlight
        ctx.fillStyle = shieldLight;
        ctx.fillRect(x + 10, y + 6, 12, 4);
        
        // Shield emblem
        ctx.fillStyle = emblem;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = shieldDark;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Emblem glow
        ctx.fillStyle = 'rgba(138, 106, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Generate Skill Icon Sprites
    generateSkillIcons() {
        const canvas = document.createElement('canvas');
        canvas.width = 32 * 3; // 3 skills
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Shadow Sword Skill
        this.drawShadowSwordSkill(ctx, 0, 0);
        // Dark Shield Skill
        this.drawDarkShieldSkill(ctx, 32, 0);
        // Shadow Storm Skill
        this.drawShadowStormSkill(ctx, 64, 0);

        return canvas;
    }

    drawShadowSwordSkill(ctx, x, y) {
        // Shadow sword with energy
        const swordDark = '#1a1a2a';
        const swordBase = '#4a2a6a';
        const swordGlow = '#8a6aff';
        const energy = '#AA88FF';

        // Sword blade
        ctx.fillStyle = swordBase;
        ctx.fillRect(x + 12, y + 6, 8, 18);
        
        // Sword glow
        ctx.fillStyle = swordGlow;
        ctx.fillRect(x + 14, y + 8, 4, 14);
        
        // Energy particles
        ctx.fillStyle = energy;
        for (let i = 0; i < 5; i++) {
            const px = x + 10 + Math.random() * 12;
            const py = y + 8 + Math.random() * 16;
            ctx.fillRect(px, py, 2, 2);
        }
        
        // Sword edge
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x + 12, y + 8, 1, 14);
        
        // Hilt
        ctx.fillStyle = swordDark;
        ctx.fillRect(x + 14, y + 22, 4, 6);
    }

    drawDarkShieldSkill(ctx, x, y) {
        // Dark shield with protection aura
        const shieldDark = '#1a1a2a';
        const shieldBase = '#3a3a4a';
        const shieldGlow = '#6a4a8a';
        const aura = 'rgba(138, 106, 255, 0.4)';

        // Shield shape
        ctx.fillStyle = shieldBase;
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 4);
        ctx.lineTo(x + 8, y + 10);
        ctx.lineTo(x + 6, y + 18);
        ctx.lineTo(x + 8, y + 26);
        ctx.lineTo(x + 16, y + 28);
        ctx.lineTo(x + 24, y + 26);
        ctx.lineTo(x + 26, y + 18);
        ctx.lineTo(x + 24, y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Protection aura
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield emblem
        ctx.fillStyle = shieldGlow;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = shieldDark;
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawShadowStormSkill(ctx, x, y) {
        // Shadow storm with lightning
        const stormDark = '#1a1a2a';
        const stormBase = '#2a2a4a';
        const lightning = '#8a6aff';
        const energy = '#AA88FF';

        // Storm cloud
        ctx.fillStyle = stormBase;
        ctx.beginPath();
        ctx.arc(x + 16, y + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 10, y + 14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 22, y + 14, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Lightning bolts
        ctx.fillStyle = lightning;
        ctx.fillRect(x + 14, y + 18, 2, 8);
        ctx.fillRect(x + 18, y + 20, 2, 6);
        ctx.fillRect(x + 10, y + 22, 2, 4);
        
        // Energy particles
        ctx.fillStyle = energy;
        for (let i = 0; i < 8; i++) {
            const px = x + 6 + Math.random() * 20;
            const py = y + 18 + Math.random() * 10;
            ctx.fillRect(px, py, 1, 1);
        }
        
        // Storm glow
        ctx.fillStyle = 'rgba(138, 106, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 14, 0, Math.PI * 2);
        ctx.fill();
    }

    // Generate Axe Icon for Attack Button
    generateAxeIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Axe colors
        const axeDark = '#2a2a2a';
        const axeBase = '#6a4a2a';
        const axeLight = '#8a6a4a';
        const bladeColor = '#C0C0C0';
        const bladeGlow = '#E0E0E0';

        // Axe handle
        ctx.fillStyle = axeBase;
        ctx.fillRect(14, 8, 4, 20);

        // Handle grip
        ctx.fillStyle = axeDark;
        ctx.fillRect(15, 10, 2, 16);

        // Axe head - blade
        ctx.fillStyle = bladeColor;
        ctx.beginPath();
        ctx.moveTo(18, 6);
        ctx.lineTo(26, 4);
        ctx.lineTo(28, 8);
        ctx.lineTo(24, 12);
        ctx.closePath();
        ctx.fill();

        // Blade edge
        ctx.fillStyle = bladeGlow;
        ctx.fillRect(18, 6, 8, 2);
        ctx.fillRect(26, 4, 2, 4);

        // Axe head - back
        ctx.fillStyle = axeLight;
        ctx.fillRect(18, 12, 6, 4);

        // Axe head - connection
        ctx.fillStyle = axeDark;
        ctx.fillRect(16, 10, 4, 6);

        // Axe glow
        ctx.fillStyle = 'rgba(192, 192, 192, 0.3)';
        ctx.beginPath();
        ctx.moveTo(18, 6);
        ctx.lineTo(26, 4);
        ctx.lineTo(28, 8);
        ctx.lineTo(24, 12);
        ctx.closePath();
        ctx.fill();

        return canvas;
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteGenerator;
}


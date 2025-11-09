// Professional Map Asset Generator
// Dark Forest Valley Theme - High Quality RPG Assets

class MapGenerator {
    constructor() {
        this.tileSize = 32; // 32x32 pixels per tile
        this.treeTypes = 20; // 20 different tree types
    }

    // Generate all map tiles
    generateMapTiles() {
        const tiles = {
            grass: this.generateGrassTiles(),
            dirtRoad: this.generateDirtRoadTiles(),
            grassRoad: this.generateGrassRoadTiles(),
            stoneRoad: this.generateStoneRoadTiles(),
            cobblestoneRoad: this.generateCobblestoneRoadTiles(), // Arnavut taşlı yol
            water: this.generateWaterTiles(),
            river: this.generateRiverTiles(), // Akarsu
            trees: this.generateTreeTiles(),
            bush: this.generateBushTiles(), // Çalı
            grassTrampled: this.generateTrampledGrassTiles(),
            cityCenter: this.generateCityCenterTile(),
            bridge: this.generateBridgeTiles(), // Köprü
            gate: this.generateGateTiles(), // Kapı
            hill: this.generateHillTiles(), // Tümsek
            slope: this.generateSlopeTiles() // Yokuş
        };
        return tiles;
    }

    // Generate grass tiles with variations
    generateGrassTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Base grass color
        const grassDark = '#143214';
        const grassBase = '#265826';
        const grassLight = '#3b7a39';
        const grassHighlight = '#54a854';

        // Base grass
        ctx.fillStyle = grassBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Layered noise for rich texture
        for (let i = 0; i < 250; i++) {
            const x = Math.random() * this.tileSize;
            const y = Math.random() * this.tileSize;
            const n = Math.sin(x * 0.6) * Math.cos(y * 0.5) * 0.5 + 0.5;
            const tone = n < 0.5 ? grassDark : grassLight;
            ctx.fillStyle = tone;
            ctx.fillRect(x, y, 1, 1);
        }

        // Grass highlights
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.tileSize;
            const y = Math.random() * this.tileSize;
            ctx.fillStyle = grassHighlight;
            ctx.fillRect(x, y, 1, 1);
        }

        return canvas;
    }

    // Generate trampled grass (temporary state)
    generateTrampledGrassTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const trampledDark = '#1a2a1a';
        const trampledBase = '#2a3a2a';
        const trampledLight = '#3a4a3a';

        // Base - darker, flatter
        ctx.fillStyle = trampledBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Trampled texture - horizontal lines
        ctx.fillStyle = trampledDark;
        for (let y = 0; y < this.tileSize; y += 2) {
            ctx.fillRect(0, y, this.tileSize, 1);
        }

        // Some remaining grass patches
        ctx.fillStyle = trampledLight;
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.tileSize;
            const y = Math.random() * this.tileSize;
            ctx.fillRect(x, y, 2, 1);
        }

        return canvas;
    }

    // Generate dirt road tiles
    generateDirtRoadTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const dirtDark = '#3a2a1a';
        const dirtBase = '#5a4a2a';
        const dirtLight = '#7a6a4a';

        // Base dirt
        ctx.fillStyle = dirtBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Dirt texture
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.tileSize;
            const y = Math.random() * this.tileSize;
            const size = 1 + Math.random() * 2;
            
            if (Math.random() > 0.5) {
                ctx.fillStyle = dirtDark;
            } else {
                ctx.fillStyle = dirtLight;
            }
            ctx.fillRect(x, y, size, size);
        }

        // Road tracks (wheel marks)
        ctx.fillStyle = dirtDark;
        ctx.fillRect(8, 0, 2, this.tileSize);
        ctx.fillRect(22, 0, 2, this.tileSize);

        return canvas;
    }

    // Generate grass road tiles
    generateGrassRoadTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const grassDark = '#1a3a1a';
        const grassBase = '#2a5a2a';
        const dirtBase = '#5a4a2a';

        // Base grass
        ctx.fillStyle = grassBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Road center (dirt)
        ctx.fillStyle = dirtBase;
        ctx.fillRect(6, 0, 20, this.tileSize);

        // Road edges (mixed)
        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < this.tileSize; y++) {
                if (Math.random() > 0.3) {
                    ctx.fillStyle = grassBase;
                } else {
                    ctx.fillStyle = dirtBase;
                }
                ctx.fillRect(x, y, 1, 1);
            }
        }
        for (let x = 26; x < this.tileSize; x++) {
            for (let y = 0; y < this.tileSize; y++) {
                if (Math.random() > 0.3) {
                    ctx.fillStyle = grassBase;
                } else {
                    ctx.fillStyle = dirtBase;
                }
                ctx.fillRect(x, y, 1, 1);
            }
        }

        return canvas;
    }

    // Generate stone road tiles
    generateStoneRoadTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const stoneDark = '#232429';
        const stoneBase = '#3f4148';
        const stoneLight = '#6f7580';

        // Base stone
        ctx.fillStyle = stoneBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Stone blocks pattern
        const blockW = 8;
        const blockH = 8;
        for (let y = 0; y < this.tileSize; y += blockH) {
            for (let x = 0; x < this.tileSize; x += blockW) {
                const jitter = (Math.random() * 2) | 0;
                ctx.fillStyle = Math.random() > 0.5 ? stoneLight : stoneDark;
                ctx.fillRect(x, y, blockW - 1 - jitter, blockH - 1 - jitter);
            }
        }

        // Stone edges
        ctx.strokeStyle = stoneDark;
        ctx.lineWidth = 1;
        for (let y = 0; y < this.tileSize; y += blockH) {
            for (let x = 0; x < this.tileSize; x += blockW) {
                ctx.strokeRect(x, y, blockW, blockH);
            }
        }

        // Subtle cracks
        ctx.strokeStyle = '#2a2b30';
        if (Math.random() < 0.7) {
            ctx.beginPath();
            ctx.moveTo(2, 4);
            ctx.lineTo(6, 6);
            ctx.lineTo(10, 3);
            ctx.stroke();
        }

        return canvas;
    }

    // Generate water tiles with animation frames
    generateWaterTiles() {
        const frames = 4; // 4 animation frames for water
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize * frames;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (let frame = 0; frame < frames; frame++) {
            const x = frame * this.tileSize;
            this.drawWaterFrame(ctx, x, 0, frame);
        }

        return canvas;
    }

    drawWaterFrame(ctx, x, y, frame) {
        const waterDark = '#12243f';
        const waterBase = '#1f3d66';
        const waterLight = '#2f5f8f';
        const waterHighlight = '#5aa1d6';

        // Base water
        const vertGrad = ctx.createLinearGradient(x, y, x, y + this.tileSize);
        vertGrad.addColorStop(0, waterBase);
        vertGrad.addColorStop(1, waterDark);
        ctx.fillStyle = vertGrad;
        ctx.fillRect(x, y, this.tileSize, this.tileSize);

        // Water waves - animated
        const waveOffset = Math.sin(frame * Math.PI / 2) * 2;
        
        // Horizontal waves
        for (let i = 0; i < 6; i++) {
            const waveY = (i * 8) + waveOffset;
            ctx.fillStyle = waterLight;
            ctx.fillRect(x, (waveY % this.tileSize), this.tileSize, 2);
            ctx.fillStyle = waterDark;
            ctx.fillRect(x, ((waveY + 2) % this.tileSize), this.tileSize, 1);
        }

        // Water highlights
        for (let i = 0; i < 14; i++) {
            const px = x + Math.random() * this.tileSize;
            const py = y + Math.random() * this.tileSize;
            ctx.fillStyle = waterHighlight;
            ctx.fillRect(px, py, 1, 1);
        }

        // Ripples
        ctx.strokeStyle = waterLight;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const centerX = x + this.tileSize / 2 + (Math.random() - 0.5) * 8;
            const centerY = y + this.tileSize / 2 + (Math.random() - 0.5) * 8;
            const radius = 4 + Math.sin(frame * Math.PI / 2 + i) * 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Generate 20 different tree types
    generateTreeTiles() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize * this.treeTypes;
        canvas.height = this.tileSize * 2; // 2 rows for variation
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (let type = 0; type < this.treeTypes; type++) {
            const x = (type % 10) * this.tileSize;
            const y = Math.floor(type / 10) * this.tileSize;
            this.drawTree(ctx, x, y, type);
        }

        return canvas;
    }

    drawTree(ctx, x, y, type) {
        // Different tree styles based on type
        const treeColors = [
            { trunk: '#4a2a1a', leaves: '#2a5a1a', leavesDark: '#1a3a0a', leavesLight: '#3a7a2a' },
            { trunk: '#5a3a2a', leaves: '#3a6a2a', leavesDark: '#2a4a1a', leavesLight: '#4a8a3a' },
            { trunk: '#3a1a0a', leaves: '#1a4a1a', leavesDark: '#0a2a0a', leavesLight: '#2a6a2a' },
            { trunk: '#6a4a3a', leaves: '#4a7a3a', leavesDark: '#3a5a2a', leavesLight: '#5a9a4a' },
            { trunk: '#2a1a0a', leaves: '#0a3a0a', leavesDark: '#0a1a0a', leavesLight: '#1a5a1a' },
            { trunk: '#5a2a1a', leaves: '#3a5a1a', leavesDark: '#2a3a0a', leavesLight: '#4a7a2a' },
            { trunk: '#4a3a2a', leaves: '#2a6a2a', leavesDark: '#1a4a1a', leavesLight: '#3a8a3a' },
            { trunk: '#3a2a1a', leaves: '#1a5a1a', leavesDark: '#0a3a0a', leavesLight: '#2a7a2a' },
            { trunk: '#6a3a2a', leaves: '#4a6a2a', leavesDark: '#3a4a1a', leavesLight: '#5a8a3a' },
            { trunk: '#5a4a3a', leaves: '#3a7a3a', leavesDark: '#2a5a2a', leavesLight: '#4a9a4a' },
            { trunk: '#4a1a0a', leaves: '#2a4a0a', leavesDark: '#1a2a0a', leavesLight: '#3a6a1a' },
            { trunk: '#3a3a2a', leaves: '#1a6a2a', leavesDark: '#0a4a1a', leavesLight: '#2a8a3a' },
            { trunk: '#5a1a0a', leaves: '#3a4a0a', leavesDark: '#2a2a0a', leavesLight: '#4a6a1a' },
            { trunk: '#4a4a3a', leaves: '#2a7a3a', leavesDark: '#1a5a2a', leavesLight: '#3a9a4a' },
            { trunk: '#6a2a1a', leaves: '#4a5a1a', leavesDark: '#3a3a0a', leavesLight: '#5a7a2a' },
            { trunk: '#3a4a3a', leaves: '#1a7a3a', leavesDark: '#0a5a2a', leavesLight: '#2a9a4a' },
            { trunk: '#5a3a1a', leaves: '#3a6a1a', leavesDark: '#2a4a0a', leavesLight: '#4a8a2a' },
            { trunk: '#4a2a0a', leaves: '#2a5a0a', leavesDark: '#1a3a0a', leavesLight: '#3a7a1a' },
            { trunk: '#6a3a3a', leaves: '#4a7a3a', leavesDark: '#3a5a2a', leavesLight: '#5a9a4a' },
            { trunk: '#5a2a0a', leaves: '#3a5a0a', leavesDark: '#2a3a0a', leavesLight: '#4a7a1a' }
        ];

        const colors = treeColors[type % treeColors.length];
        const size = 0.7 + (type % 3) * 0.1; // Vary tree sizes
        const trunkWidth = 3 + (type % 2);
        const trunkHeight = 8 + (type % 4);

        // Trunk
        ctx.fillStyle = colors.trunk;
        ctx.fillRect(x + this.tileSize / 2 - trunkWidth / 2, y + this.tileSize - trunkHeight, trunkWidth, trunkHeight);

        // Trunk shadow
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + this.tileSize / 2 - trunkWidth / 2 + 1, y + this.tileSize - trunkHeight, 1, trunkHeight);

        // Leaves - different shapes based on type
        const leafSize = this.tileSize * 0.6 * size;
        const leafX = x + this.tileSize / 2;
        const leafY = y + this.tileSize - trunkHeight - 2;

        // Main leaves cluster
        ctx.fillStyle = colors.leaves;
        ctx.beginPath();
        ctx.arc(leafX, leafY, leafSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Leaves highlights
        ctx.fillStyle = colors.leavesLight;
        ctx.beginPath();
        ctx.arc(leafX - leafSize / 4, leafY - leafSize / 4, leafSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Leaves shadows
        ctx.fillStyle = colors.leavesDark;
        ctx.beginPath();
        ctx.arc(leafX + leafSize / 4, leafY + leafSize / 4, leafSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Additional leaf clusters for variety
        if (type % 3 === 0) {
            ctx.fillStyle = colors.leaves;
            ctx.beginPath();
            ctx.arc(leafX - leafSize / 3, leafY + leafSize / 4, leafSize / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        if (type % 3 === 1) {
            ctx.fillStyle = colors.leaves;
            ctx.beginPath();
            ctx.arc(leafX + leafSize / 3, leafY - leafSize / 4, leafSize / 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Generate fish sprites for water
    generateFishSprites() {
        const frames = 4; // Swimming animation
        const canvas = document.createElement('canvas');
        canvas.width = 16 * frames; // Fish is 16x8
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (let frame = 0; frame < frames; frame++) {
            const x = frame * 16;
            this.drawFish(ctx, x, 0, frame);
        }

        return canvas;
    }

    drawFish(ctx, x, y, frame) {
        // Fish colors - variety
        const fishColors = [
            { body: '#4a6a8a', fin: '#2a4a6a', eye: '#ff0000' },
            { body: '#6a8aaa', fin: '#4a6a8a', eye: '#ff4444' },
            { body: '#5a7a9a', fin: '#3a5a7a', eye: '#ff2222' }
        ];
        const colors = fishColors[frame % fishColors.length];

        // Tail movement
        const tailOffset = Math.sin(frame * Math.PI / 2) * 2;

        // Fish body
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(x + 8, y + 4, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fish tail
        ctx.fillStyle = colors.fin;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 4);
        ctx.lineTo(x + 6, y + 2 + tailOffset);
        ctx.lineTo(x + 6, y + 6 - tailOffset);
        ctx.closePath();
        ctx.fill();

        // Fish fin (top)
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 2);
        ctx.lineTo(x + 10, y + 1);
        ctx.lineTo(x + 10, y + 3);
        ctx.closePath();
        ctx.fill();

        // Fish eye
        ctx.fillStyle = colors.eye;
        ctx.beginPath();
        ctx.arc(x + 10, y + 3, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Generate dust particle effect
    generateDustParticles() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Dust particles - very subtle
        ctx.fillStyle = 'rgba(100, 80, 60, 0.15)';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 32;
            const y = Math.random() * 32;
            const size = 1 + Math.random();
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        return canvas;
    }

    // Generate City Center Tile - Metin2 style
    generateCityCenterTile() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Metin2 style city center - stone platform
        const stoneDark = '#3a3a3a';
        const stoneBase = '#5a5a5a';
        const stoneLight = '#7a7a7a';
        const stoneHighlight = '#9a9a9a';
        const pattern = '#4a4a4a';

        // Base stone platform
        ctx.fillStyle = stoneBase;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Stone pattern - circular center
        const centerX = this.tileSize / 2;
        const centerY = this.tileSize / 2;
        const radius = this.tileSize / 2 - 2;

        // Outer circle
        ctx.fillStyle = stoneDark;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.fillStyle = stoneBase;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
        ctx.fill();

        // Stone blocks pattern
        ctx.fillStyle = stoneLight;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            const x = centerX + Math.cos(angle) * (radius - 4);
            const y = centerY + Math.sin(angle) * (radius - 4);
            ctx.fillRect(x - 2, y - 2, 4, 4);
        }

        // Center highlight
        ctx.fillStyle = stoneHighlight;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Stone texture lines
        ctx.strokeStyle = pattern;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }

        return canvas;
    }

    // Generate Merchant NPC Sprite
    generateMerchantSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Merchant colors - friendly NPC
        const skinColor = '#D4A574';
        const robeDark = '#2a2a4a';
        const robeBase = '#4a4a6a';
        const robeLight = '#6a6a8a';
        const hatColor = '#8a6a4a';
        const bagColor = '#6a4a2a';

        // Body (torso)
        ctx.fillStyle = robeBase;
        ctx.fillRect(20, 20, 24, 30);

        // Robe highlights
        ctx.fillStyle = robeLight;
        ctx.fillRect(22, 22, 20, 8);
        ctx.fillRect(22, 32, 20, 4);

        // Robe shadows
        ctx.fillStyle = robeDark;
        ctx.fillRect(20, 28, 24, 2);
        ctx.fillRect(20, 38, 24, 2);

        // Head
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(32, 18, 10, 0, Math.PI * 2);
        ctx.fill();

        // Hat
        ctx.fillStyle = hatColor;
        ctx.fillRect(24, 8, 16, 12);
        ctx.fillStyle = '#6a4a2a';
        ctx.fillRect(26, 6, 12, 2);

        // Hat decoration
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(28, 10, 8, 2);

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(28, 16, 2, 2);
        ctx.fillRect(34, 16, 2, 2);

        // Beard
        ctx.fillStyle = '#8a6a4a';
        ctx.fillRect(28, 22, 8, 4);

        // Arms
        ctx.fillStyle = robeBase;
        ctx.fillRect(16, 24, 6, 20);
        ctx.fillRect(42, 24, 6, 20);

        // Hands
        ctx.fillStyle = skinColor;
        ctx.fillRect(14, 42, 8, 6);
        ctx.fillRect(42, 42, 8, 6);

        // Bag (on back)
        ctx.fillStyle = bagColor;
        ctx.fillRect(18, 28, 8, 16);
        ctx.fillStyle = '#4a2a1a';
        ctx.fillRect(20, 30, 4, 12);

        // Legs
        ctx.fillStyle = robeDark;
        ctx.fillRect(22, 48, 8, 14);
        ctx.fillRect(34, 48, 8, 14);

        // Feet
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(20, 60, 10, 4);
        ctx.fillRect(34, 60, 10, 4);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(32, 64, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    // Generate Shop Building Sprite
    generateShopSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 96; // 3 tiles wide
        canvas.height = 128; // 4 tiles tall
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Shop colors - wooden building with stone base
        const woodDark = '#4a2a1a';
        const woodBase = '#6a4a2a';
        const woodLight = '#8a6a4a';
        const stoneDark = '#2a2a2a';
        const stoneBase = '#3a3a3a';
        const stoneLight = '#4a4a4a';
        const roofColor = '#2a1a0a';
        const roofAccent = '#4a2a1a';
        const windowColor = '#ffd700';
        const doorColor = '#3a2a1a';
        const signColor = '#8a6a4a';

        // Stone foundation/base
        ctx.fillStyle = stoneDark;
        ctx.fillRect(0, 100, 96, 28);
        ctx.fillStyle = stoneBase;
        ctx.fillRect(2, 102, 92, 24);
        ctx.fillStyle = stoneLight;
        ctx.fillRect(4, 104, 88, 4);
        ctx.fillRect(4, 112, 88, 4);
        ctx.fillRect(4, 120, 88, 4);

        // Main building body (wooden)
        ctx.fillStyle = woodDark;
        ctx.fillRect(8, 20, 80, 80);
        
        // Wood planks (horizontal)
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = woodBase;
            ctx.fillRect(10, 22 + i * 10, 76, 8);
            ctx.fillStyle = woodLight;
            ctx.fillRect(12, 24 + i * 10, 72, 2);
        }

        // Roof
        ctx.fillStyle = roofColor;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(48, 0);
        ctx.lineTo(96, 20);
        ctx.closePath();
        ctx.fill();
        
        // Roof tiles
        ctx.fillStyle = roofAccent;
        for (let i = 0; i < 8; i++) {
            const x = 4 + i * 11;
            const y = 4 + (i % 2) * 2;
            ctx.fillRect(x, y, 10, 16);
        }

        // Left window
        ctx.fillStyle = windowColor;
        ctx.fillRect(16, 32, 20, 24);
        ctx.fillStyle = woodDark;
        ctx.fillRect(18, 34, 16, 20);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(20, 36, 12, 16);
        // Window frame
        ctx.fillStyle = woodBase;
        ctx.fillRect(16, 32, 20, 2);
        ctx.fillRect(16, 54, 20, 2);
        ctx.fillRect(16, 32, 2, 24);
        ctx.fillRect(34, 32, 2, 24);
        // Window cross
        ctx.fillRect(25, 36, 2, 16);
        ctx.fillRect(20, 44, 12, 2);

        // Right window
        ctx.fillStyle = windowColor;
        ctx.fillRect(60, 32, 20, 24);
        ctx.fillStyle = woodDark;
        ctx.fillRect(62, 34, 16, 20);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(64, 36, 12, 16);
        // Window frame
        ctx.fillStyle = woodBase;
        ctx.fillRect(60, 32, 20, 2);
        ctx.fillRect(60, 54, 20, 2);
        ctx.fillRect(60, 32, 2, 24);
        ctx.fillRect(78, 32, 2, 24);
        // Window cross
        ctx.fillRect(69, 36, 2, 16);
        ctx.fillRect(64, 44, 12, 2);

        // Door
        ctx.fillStyle = doorColor;
        ctx.fillRect(38, 60, 20, 40);
        ctx.fillStyle = woodDark;
        ctx.fillRect(40, 62, 16, 36);
        // Door panels
        ctx.fillStyle = woodBase;
        ctx.fillRect(42, 66, 12, 8);
        ctx.fillRect(42, 78, 12, 8);
        ctx.fillRect(42, 90, 12, 8);
        // Door handle
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(54, 80, 2, 0, Math.PI * 2);
        ctx.fill();
        // Door frame
        ctx.fillStyle = woodBase;
        ctx.fillRect(38, 60, 20, 2);
        ctx.fillRect(38, 98, 20, 2);
        ctx.fillRect(38, 60, 2, 40);
        ctx.fillRect(56, 60, 2, 40);

        // Shop sign
        ctx.fillStyle = signColor;
        ctx.fillRect(30, 8, 36, 12);
        ctx.fillStyle = woodBase;
        ctx.fillRect(32, 10, 32, 8);
        // Sign text area
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(34, 12, 28, 4);
        // Sign border
        ctx.fillStyle = woodDark;
        ctx.fillRect(30, 8, 36, 2);
        ctx.fillRect(30, 18, 36, 2);
        ctx.fillRect(30, 8, 2, 12);

// Shadow
ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
ctx.beginPath();
ctx.ellipse(48, 128, 50, 8, 0, 0, Math.PI * 2);
ctx.fill();

return canvas;
}

// Generate cobblestone road tiles (32x32)
generateCobblestoneRoadTiles() {
const canvas = document.createElement('canvas');
canvas.width = this.tileSize;
canvas.height = this.tileSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Base
ctx.fillStyle = '#5b5b5b';
ctx.fillRect(0, 0, this.tileSize, this.tileSize);

// Rounded cobblestones
ctx.fillStyle = '#777777';
for (let y = 0; y < this.tileSize; y += 8) {
    for (let x = 0; x < this.tileSize; x += 8) {
        ctx.fillRect(x + 1, y + 1, 6, 6);
    }
}

// Shading lines
ctx.strokeStyle = '#3f3f3f';
for (let y = 0; y <= this.tileSize; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.tileSize, y);
    ctx.stroke();
}

return canvas;
}

// River tiles reuse water frames but slightly different hue
generateRiverTiles() {
const frames = 4;
const canvas = document.createElement('canvas');
canvas.width = this.tileSize * frames;
canvas.height = this.tileSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

for (let frame = 0; frame < frames; frame++) {
    const x = frame * this.tileSize;
    // Draw using water frame but add banks tint
    this.drawWaterFrame(ctx, x, 0, frame);
    // Slight overlay to differentiate river
    ctx.fillStyle = 'rgba(20, 40, 80, 0.15)';
    ctx.fillRect(x, 0, this.tileSize, this.tileSize);
}

return canvas;
}

// Bridge tiles (stone 32x32)
generateBridgeTiles() {
    const canvas = document.createElement('canvas');
    canvas.width = this.tileSize;
    canvas.height = this.tileSize;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Base stone color
    ctx.fillStyle = '#5d5d66';
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

    // Stone bricks pattern
    const blockW = 10;
    const blockH = 6;
    for (let y = 0; y < this.tileSize; y += blockH) {
        for (let x = (y / blockH) % 2 === 0 ? 0 : blockW / 2; x < this.tileSize; x += blockW) {
            ctx.fillStyle = '#73737d';
            ctx.fillRect(x + 1, y + 1, blockW - 2, blockH - 2);
        }
    }

    // Mortar lines
    ctx.strokeStyle = '#3c3c42';
    ctx.lineWidth = 1;
    for (let y = 0; y <= this.tileSize; y += blockH) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.tileSize, y);
        ctx.stroke();
    }
    for (let x = 0; x <= this.tileSize; x += blockW) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.tileSize);
        ctx.stroke();
    }

    // Side rails (slightly darker)
    ctx.fillStyle = '#4a4a52';
    ctx.fillRect(0, 0, this.tileSize, 2);
    ctx.fillRect(0, this.tileSize - 2, this.tileSize, 2);

    return canvas;
}

// Gate sprite (96x128) used at map edge
generateGateTiles() {
const canvas = document.createElement('canvas');
canvas.width = 96;
canvas.height = 128;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Stone pillars
ctx.fillStyle = '#5a5a5a';
ctx.fillRect(0, 16, 16, 112);
ctx.fillRect(80, 16, 16, 112);
ctx.fillStyle = '#3a3a3a';
ctx.fillRect(2, 18, 12, 108);
ctx.fillRect(82, 18, 12, 108);

// Arch
ctx.fillStyle = '#6a6a6a';
ctx.fillRect(16, 16, 64, 16);
ctx.fillStyle = '#7a7a7a';
ctx.fillRect(16, 16, 64, 6);

// Wooden gate doors
ctx.fillStyle = '#6a3a1a';
ctx.fillRect(16, 32, 64, 96);
// Wood planks
for (let x = 16; x < 80; x += 8) {
    ctx.fillStyle = '#7a4a2a';
    ctx.fillRect(x, 32, 6, 96);
}
// Metal bands
ctx.fillStyle = '#3a3a3a';
for (let y = 40; y < 120; y += 24) {
    ctx.fillRect(16, y, 64, 4);
}
// Ring handles
ctx.fillStyle = '#c2a36a';
ctx.beginPath();
ctx.arc(36, 80, 4, 0, Math.PI * 2);
ctx.arc(60, 80, 4, 0, Math.PI * 2);
ctx.fill();

return canvas;
}

// Hill tiles (32x32)
generateHillTiles() {
const canvas = document.createElement('canvas');
canvas.width = this.tileSize;
canvas.height = this.tileSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Base grass
ctx.fillStyle = '#2a5a2a';
ctx.fillRect(0, 0, this.tileSize, this.tileSize);
// Hill mound
ctx.fillStyle = '#3a7a3a';
ctx.beginPath();
ctx.arc(16, 20, 12, 0, Math.PI * 2);
ctx.fill();

return canvas;
}

// Slope tiles (32x32)
generateSlopeTiles() {
const canvas = document.createElement('canvas');
canvas.width = this.tileSize;
canvas.height = this.tileSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Base grass
ctx.fillStyle = '#2a5a2a';
ctx.fillRect(0, 0, this.tileSize, this.tileSize);
// Diagonal slope
ctx.fillStyle = '#3a6a2a';
for (let y = 0; y < this.tileSize; y++) {
    ctx.fillRect(0, y, Math.floor((y / this.tileSize) * this.tileSize), 1);
}

return canvas;
}

// Bush tiles (32x32)
generateBushTiles() {
const canvas = document.createElement('canvas');
canvas.width = this.tileSize;
canvas.height = this.tileSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Base grass
ctx.fillStyle = '#2a5a2a';
ctx.fillRect(0, 0, this.tileSize, this.tileSize);
// Bush blob
ctx.fillStyle = '#1f5a1f';
ctx.beginPath();
ctx.arc(16, 18, 10, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#3a8a3a';
ctx.beginPath();
ctx.arc(12, 16, 6, 0, Math.PI * 2);
ctx.arc(20, 16, 6, 0, Math.PI * 2);
ctx.fill();

return canvas;
}
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapGenerator;
}

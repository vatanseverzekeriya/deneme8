// Professional Map System
// Handles tile rendering, animations, and effects

class MapSystem {
    constructor() {
        this.tileSize = 32;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.mapTiles = null;
        this.mapData = null; // 2D array of tile types
        this.grassTrampled = new Map(); // Track trampled grass tiles
        this.dustParticles = []; // Dust particles for roads
        this.fishPositions = []; // Fish positions in water
        this.waterFrame = 0;
        this.waterFrameTimer = 0;
        this.fishFrame = 0;
        this.fishFrameTimer = 0;
        this.generator = new MapGenerator();
        
        // Collision data
        this.collisionMap = []; // For trees, bushes, water
        this.obstaclePositions = []; // Trees and bushes positions
        this.gatePosition = null; // Gate position
        this.bridgePositions = []; // Bridge positions
        this.riverPositions = []; // River positions
        this.riverInnerRadius = 0; // inner radius (safe zone inside river)
        this.riverWidth = 0; // river width in tiles
        this.cobblestoneRoadPositions = []; // Cobblestone road positions
    }

    // Initialize map system
    initialize(canvasWidth, canvasHeight) {
        try {
            console.log('Map system initialize started...');
            // Calculate map size based on player speed
            // Player speed: 5 pixels per frame, ~60 FPS = 300 pixels/second
            // City center: 3 minutes = 180 seconds = 54,000 pixels = ~1700 tiles
            // Full map: 15 minutes = 900 seconds = 270,000 pixels = ~8500 tiles
            
            const playerSpeed = 5; // pixels per frame (increased speed)
            const fps = 60; // frames per second
            const pixelsPerSecond = playerSpeed * fps; // 300 pixels/second
            
            // City center: 3 minutes = 180 seconds (diameter)
            const cityCenterSize = pixelsPerSecond * 180; // 54,000 pixels
            const cityCenterTiles = Math.ceil(cityCenterSize / this.tileSize); // ~1700 tiles
            
            // Full map: 15 minutes = 900 seconds (diagonal)
            // For diagonal, we need to account for sqrt(2) factor
            const mapSize = pixelsPerSecond * 900; // 270,000 pixels
            const mapTiles = Math.ceil(mapSize / this.tileSize); // ~8500 tiles
            
            // Set map dimensions - make it big enough for 15 minutes diagonal travel
            // Diagonal = sqrt(2) * side, so side = diagonal / sqrt(2)
            const mapSideTiles = Math.ceil(mapTiles / Math.sqrt(2)); // ~6000 tiles per side
            // Limit to reasonable size for performance (1000x1000 for faster loading)
            this.mapWidth = Math.min(Math.max(mapSideTiles, 1000), 1000);
            this.mapHeight = Math.min(Math.max(mapSideTiles, 1000), 1000);
            
            console.log('Map size:', this.mapWidth, 'x', this.mapHeight);
        
        // City center radius (3 minutes to cross diameter = radius * 2)
        // So radius = diameter / 2 - make it bigger
        this.cityCenterRadius = Math.ceil(cityCenterTiles / 2); // ~850 tiles radius
        
        // Initialize collision map
        this.collisionMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.collisionMap[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                this.collisionMap[y][x] = false;
            }
        }
        
        // Recalculate city center position to be at map center
        this.cityCenterX = Math.floor(this.mapWidth / 2);
        this.cityCenterY = Math.floor(this.mapHeight / 2);
        
        // Generate all map tiles
        this.mapTiles = this.generator.generateMapTiles();
        
        // Generate fish sprites
        this.fishSprites = this.generator.generateFishSprites();
        
        // Generate dust particles
        this.dustSprite = this.generator.generateDustParticles();
        
        // Generate merchant sprite
        this.merchantSprite = this.generator.generateMerchantSprite();
        
        // Generate shop building sprite
        this.shopSprite = this.generator.generateShopSprite();
        
        // Generate gate sprite
        this.gateSprite = this.generator.generateGateTiles();
        
        // City center position (center of map)
        this.cityCenterX = Math.floor(this.mapWidth / 2);
        this.cityCenterY = Math.floor(this.mapHeight / 2);
        this.cityCenterRadius = 8; // 8 tiles radius - no monsters
        
        // Shop position (at edge of city center, north-east)
        // Shop is 3 tiles wide, so center it
        const shopOffsetX = this.cityCenterRadius - 1;
        const shopOffsetY = -(this.cityCenterRadius - 2);
        this.shopX = (this.cityCenterX + shopOffsetX) * this.tileSize;
        this.shopY = (this.cityCenterY + shopOffsetY) * this.tileSize;
        
        // Merchant position (in front of shop, centered)
        // Merchant stands in front of the shop door
        this.merchantX = this.shopX + (96 / 2); // Center of shop (96px wide)
        this.merchantY = this.shopY + 128 - 20; // In front of shop door (128px tall, door at bottom)
        
        // Create Metin2 style map
        this.generateMetin2StyleMap();
        
        // Initialize fish in water tiles
        this.initializeFish();
        
        console.log('Map system initialization complete');
        return Promise.resolve();
        } catch (error) {
            console.error('Map system initialization error:', error);
            console.error('Error stack:', error.stack);
            return Promise.reject(error);
        }
    }

    // Generate Metin2 style map with city center, exits, bridges, river, obstacles, gate
    generateMetin2StyleMap() {
        try {
            console.log('Generating map...', this.mapWidth, 'x', this.mapHeight);
            this.mapData = [];
            this.obstaclePositions = [];
            this.bridgePositions = [];
            this.riverPositions = [];
            this.cobblestoneRoadPositions = [];
            
            // Initialize map data (optimized for large maps)
            for (let y = 0; y < this.mapHeight; y++) {
                this.mapData[y] = new Array(this.mapWidth).fill('grass');
            }
        
        // 1. Create river around city center (circular river)
        this.riverInnerRadius = this.cityCenterRadius + 20; // River outside city center
        this.riverWidth = 15; // River width in tiles
        
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const distToCenter = Math.sqrt(
                    Math.pow(x - this.cityCenterX, 2) + 
                    Math.pow(y - this.cityCenterY, 2)
                );
                
                // River around city center
                if (distToCenter >= this.riverInnerRadius && distToCenter < this.riverInnerRadius + this.riverWidth) {
                    this.mapData[y][x] = 'river';
                    this.collisionMap[y][x] = true; // Water collision
                    this.riverPositions.push({ x, y });
                }
            }
        }
        
        // 2. Create city center (bigger)
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const distToCenter = Math.sqrt(
                    Math.pow(x - this.cityCenterX, 2) + 
                    Math.pow(y - this.cityCenterY, 2)
                );
                
                // City center - circular area
                if (distToCenter < this.cityCenterRadius) {
                    this.mapData[y][x] = 'cityCenter';
                } else if (distToCenter < this.cityCenterRadius + 5) {
                    // Stone road around city center
                    this.mapData[y][x] = 'stoneRoad';
                }
            }
        }
        
        // 3. Create a single exit with a full-span stone bridge (east direction)
        const exitAngles = [0]; // Single bridge to the east
        const exitDistance = this.riverInnerRadius + this.riverWidth / 2; // Center of river
        
        exitAngles.forEach((angle) => {
            // Build a 3-tile-wide continuous bridge from inner river edge to outer edge
            // Use 1-tile perpendicular offsets so rows touch (no gaps)
            for (let i = -1; i <= 1; i++) {
                for (let t = this.riverInnerRadius - 1; t <= this.riverInnerRadius + this.riverWidth + 1; t++) {
                    const bx = Math.floor(this.cityCenterX + Math.cos(angle) * t + Math.cos(angle + Math.PI / 2) * i);
                    const by = Math.floor(this.cityCenterY + Math.sin(angle) * t + Math.sin(angle + Math.PI / 2) * i);
                    if (bx >= 0 && bx < this.mapWidth && by >= 0 && by < this.mapHeight) {
                        this.mapData[by][bx] = 'bridge';
                        this.collisionMap[by][bx] = false; // Bridge is walkable
                        this.bridgePositions.push({ x: bx, y: by });
                    }
                }
            }

            // Create road from bridge outward to outside area
            const roadLength = 100; // Road length in tiles
            for (let i = 0; i < roadLength; i++) {
                const roadX = Math.floor(this.cityCenterX + Math.cos(angle) * (this.riverInnerRadius + this.riverWidth + i));
                const roadY = Math.floor(this.cityCenterY + Math.sin(angle) * (this.riverInnerRadius + this.riverWidth + i));
                
                if (roadX >= 0 && roadX < this.mapWidth && 
                    roadY >= 0 && roadY < this.mapHeight) {
                    const distToCenter = Math.sqrt(
                        Math.pow(roadX - this.cityCenterX, 2) + 
                        Math.pow(roadY - this.cityCenterY, 2)
                    );
                    
                    if (distToCenter > this.riverInnerRadius + this.riverWidth) {
                        this.mapData[roadY][roadX] = 'stoneRoad';
                    }
                }
            }
        });
        
        // 4. Create gate at map edge (top-right corner)
        const gateX = Math.floor(this.mapWidth * 0.9);
        const gateY = Math.floor(this.mapHeight * 0.1);
        this.gatePosition = { x: gateX, y: gateY };
        
        // Create cobblestone road from gate to city center
        const gateAngle = Math.atan2(
            this.cityCenterY - gateY,
            this.cityCenterX - gateX
        );
        const roadDistance = Math.sqrt(
            Math.pow(gateX - this.cityCenterX, 2) + 
            Math.pow(gateY - this.cityCenterY, 2)
        );
        
        for (let i = 0; i < roadDistance; i++) {
            const roadX = Math.floor(gateX + Math.cos(gateAngle) * i);
            const roadY = Math.floor(gateY + Math.sin(gateAngle) * i);
            
            if (roadX >= 0 && roadX < this.mapWidth && 
                roadY >= 0 && roadY < this.mapHeight) {
                const distToCenter = Math.sqrt(
                    Math.pow(roadX - this.cityCenterX, 2) + 
                    Math.pow(roadY - this.cityCenterY, 2)
                );
                
                // Only place cobblestone road outside river
                if (distToCenter > this.riverInnerRadius + this.riverWidth + 10) {
                    this.mapData[roadY][roadX] = 'cobblestoneRoad';
                    this.cobblestoneRoadPositions.push({ x: roadX, y: roadY });
                }
            }
        }
        
        // 5. Add terrain variations (hills, slopes)
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const distToCenter = Math.sqrt(
                    Math.pow(x - this.cityCenterX, 2) + 
                    Math.pow(y - this.cityCenterY, 2)
                );
                
                // Only add terrain outside city and river
                if (distToCenter > this.riverInnerRadius + this.riverWidth + 10) {
                    const noise = this.simpleNoise(x, y);
                    
                    if (this.mapData[y][x] === 'grass') {
                        if (noise < 0.05) {
                            this.mapData[y][x] = 'hill';
                        } else if (noise < 0.1) {
                            this.mapData[y][x] = 'slope';
                        } else if (noise < 0.15) {
                            this.mapData[y][x] = 'water';
                            this.collisionMap[y][x] = true; // Water collision
                        }
                    }
                }
            }
        }
        
        // 6. Add trees and bushes (not in city center, not on roads, not on water)
        this.treePositions = [];
        const bushPositions = [];
        
        // Reduce tree count for performance (100 instead of 500)
        const treeCount = Math.min(100, Math.floor(this.mapWidth * this.mapHeight / 4000));
        for (let i = 0; i < treeCount; i++) { // Reduced for performance
            let x, y;
            let attempts = 0;
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
                attempts++;
            } while (this.isSafeZone(x * this.tileSize, y * this.tileSize) && attempts < 20);
            
            const distToCenter = Math.sqrt(
                Math.pow(x - this.cityCenterX, 2) + 
                Math.pow(y - this.cityCenterY, 2)
            );
            
            // Only place trees outside city and river
            if (distToCenter > this.riverInnerRadius + this.riverWidth + 5) {
                const tile = this.mapData[y][x];
                
                if (tile === 'grass' || tile === 'hill' || tile === 'slope') {
                    if (Math.random() < 0.7) {
                        // Tree
                        this.treePositions.push({
                            x: x * this.tileSize + this.tileSize / 2,
                            y: y * this.tileSize + this.tileSize / 2,
                            type: Math.floor(Math.random() * 20)
                        });
                        this.collisionMap[y][x] = true; // Tree collision
                    } else {
                        // Bush
                        bushPositions.push({ x, y });
                        this.mapData[y][x] = 'bush';
                        this.collisionMap[y][x] = true; // Bush collision
                    }
                }
            }
        }
        
        this.obstaclePositions = [...this.treePositions, ...bushPositions];
        console.log('Map generation complete');
        } catch (error) {
            console.error('Map generation error:', error);
            throw error;
        }
    }

    // Check if position is in city center (no monsters)
    isInCityCenter(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        const distToCenter = Math.sqrt(
            Math.pow(tileX - this.cityCenterX, 2) + 
            Math.pow(tileY - this.cityCenterY, 2)
        );
        return distToCenter < this.cityCenterRadius;
    }

    // Check if position is inside the inner area bounded by the river (safe zone)
    isInsideInnerRiverArea(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        const distToCenter = Math.sqrt(
            Math.pow(tileX - this.cityCenterX, 2) +
            Math.pow(tileY - this.cityCenterY, 2)
        );
        return distToCenter < this.riverInnerRadius;
    }

    // Check if position is in the river itself (water tiles)
    isInRiver(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        // Check bounds
        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return false;
        }

        const distToCenter = Math.sqrt(
            Math.pow(tileX - this.cityCenterX, 2) +
            Math.pow(tileY - this.cityCenterY, 2)
        );

        // Check if position is in the river ring (between inner radius and outer radius)
        return distToCenter >= this.riverInnerRadius &&
               distToCenter < this.riverInnerRadius + this.riverWidth;
    }

    // Safe zone includes city center and the entire area inside the river
    isSafeZone(x, y) {
        return this.isInCityCenter(x, y) || this.isInsideInnerRiverArea(x, y);
    }

    // Simple noise function for terrain generation
    simpleNoise(x, y) {
        return ((Math.sin(x * 0.1) + Math.cos(y * 0.1) + 
                 Math.sin(x * 0.05 + y * 0.05) * 2) / 4 + 1) / 2;
    }

    // Initialize fish in water tiles
    initializeFish() {
        this.fishPositions = [];
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.mapData[y] && this.mapData[y][x] === 'water') {
                    if (Math.random() < 0.3) { // 30% chance of fish
                        this.fishPositions.push({
                            x: x * this.tileSize + Math.random() * this.tileSize,
                            y: y * this.tileSize + Math.random() * this.tileSize,
                            speed: 0.5 + Math.random() * 0.5,
                            direction: Math.random() * Math.PI * 2,
                            type: Math.floor(Math.random() * 3)
                        });
                    }
                }
            }
        }
    }

    // Update map animations
    update(deltaTime, playerX, playerY) {
        // Update water animation
        this.waterFrameTimer += deltaTime;
        if (this.waterFrameTimer >= 200) { // 200ms per frame
            this.waterFrame = (this.waterFrame + 1) % 4;
            this.waterFrameTimer = 0;
        }

        // Update fish animation
        this.fishFrameTimer += deltaTime;
        if (this.fishFrameTimer >= 150) { // 150ms per frame
            this.fishFrame = (this.fishFrame + 1) % 4;
            this.fishFrameTimer = 0;
        }

        // Update fish positions
        this.fishPositions.forEach(fish => {
            fish.x += Math.cos(fish.direction) * fish.speed;
            fish.y += Math.sin(fish.direction) * fish.speed;
            
            // Bounce off edges
            if (fish.x < 0 || fish.x > this.mapWidth * this.tileSize) {
                fish.direction = Math.PI - fish.direction;
            }
            if (fish.y < 0 || fish.y > this.mapHeight * this.tileSize) {
                fish.direction = -fish.direction;
            }
            
            // Random direction changes
            if (Math.random() < 0.01) {
                fish.direction += (Math.random() - 0.5) * 0.5;
            }
        });

        // Update grass trampling
        this.updateGrassTrampling(playerX, playerY);

        // Update dust particles
        this.updateDustParticles(playerX, playerY);
    }

    // Update grass trampling when player walks on grass
    updateGrassTrampling(playerX, playerY) {
        const tileX = Math.floor(playerX / this.tileSize);
        const tileY = Math.floor(playerY / this.tileSize);
        const key = `${tileX},${tileY}`;

        if (this.mapData[tileY] && this.mapData[tileY][tileX] === 'grass') {
            if (!this.grassTrampled.has(key)) {
                this.grassTrampled.set(key, {
                    time: Date.now(),
                    x: tileX,
                    y: tileY
                });
            } else {
                // Reset timer
                this.grassTrampled.get(key).time = Date.now();
            }
        }

        // Remove old trampled grass (regrow after 3 seconds)
        const now = Date.now();
        for (const [key, data] of this.grassTrampled.entries()) {
            if (now - data.time > 3000) {
                this.grassTrampled.delete(key);
            }
        }
    }

    // Update dust particles on roads
    updateDustParticles(playerX, playerY) {
        const tileX = Math.floor(playerX / this.tileSize);
        const tileY = Math.floor(playerY / this.tileSize);

        if (this.mapData[tileY] && 
            (this.mapData[tileY][tileX] === 'dirtRoad' || 
             this.mapData[tileY][tileX] === 'stoneRoad')) {
            
            // Add dust particle occasionally
            if (Math.random() < 0.1) {
                this.dustParticles.push({
                    x: playerX + (Math.random() - 0.5) * 20,
                    y: playerY + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    life: 1000,
                    maxLife: 1000,
                    size: 1 + Math.random() * 2
                });
            }
        }

        // Update and remove old particles
        this.dustParticles = this.dustParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 16;
            particle.vy -= 0.01; // Gravity
            return particle.life > 0;
        });
    }

    // Draw map
    draw(ctx, cameraX, cameraY) {
        const startX = Math.floor(cameraX / this.tileSize) - 1;
        const startY = Math.floor(cameraY / this.tileSize) - 1;
        const endX = startX + Math.ceil(ctx.canvas.width / this.tileSize) + 2;
        const endY = startY + Math.ceil(ctx.canvas.height / this.tileSize) + 2;

        // Draw tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (y >= 0 && y < this.mapHeight && x >= 0 && x < this.mapWidth) {
                    const tileType = this.mapData[y][x];
                    const screenX = x * this.tileSize - cameraX;
                    const screenY = y * this.tileSize - cameraY;

                    // Check if grass is trampled
                    const key = `${x},${y}`;
                    const isTrampled = this.grassTrampled.has(key);

                    // Draw base tile
                    if (tileType === 'water' || tileType === 'river') {
                        // Draw water/river with animation
                        const sourceX = this.waterFrame * this.tileSize;
                        const waterTile = tileType === 'river' ? this.mapTiles.river : this.mapTiles.water;
                        ctx.drawImage(
                            waterTile,
                            sourceX, 0, this.tileSize, this.tileSize,
                            screenX, screenY, this.tileSize, this.tileSize
                        );
                    } else if (tileType === 'grass' && isTrampled) {
                        // Draw trampled grass
                        ctx.drawImage(
                            this.mapTiles.grassTrampled,
                            0, 0, this.tileSize, this.tileSize,
                            screenX, screenY, this.tileSize, this.tileSize
                        );
                    } else {
                        // Draw normal tile
                        let tile = null;
                        switch(tileType) {
                            case 'grass':
                                tile = this.mapTiles.grass;
                                break;
                            case 'dirtRoad':
                                tile = this.mapTiles.dirtRoad;
                                break;
                            case 'grassRoad':
                                tile = this.mapTiles.grassRoad;
                                break;
                            case 'stoneRoad':
                                tile = this.mapTiles.stoneRoad;
                                break;
                            case 'cobblestoneRoad':
                                tile = this.mapTiles.cobblestoneRoad;
                                break;
                            case 'bridge':
                                tile = this.mapTiles.bridge;
                                break;
                            case 'cityCenter':
                                tile = this.mapTiles.cityCenter;
                                break;
                            case 'hill':
                                tile = this.mapTiles.hill;
                                break;
                            case 'slope':
                                tile = this.mapTiles.slope;
                                break;
                            case 'bush':
                                tile = this.mapTiles.bush;
                                break;
                        }
                        if (tile) {
                            ctx.drawImage(
                                tile,
                                0, 0, this.tileSize, this.tileSize,
                                screenX, screenY, this.tileSize, this.tileSize
                            );
                        }
                    }
                }
            }
        }

        // Draw trees
        if (this.treePositions) {
            this.treePositions.forEach(tree => {
                const screenX = tree.x - cameraX;
                const screenY = tree.y - cameraY;
                
                // Only draw if on screen
                if (screenX > -this.tileSize && screenX < ctx.canvas.width + this.tileSize &&
                    screenY > -this.tileSize && screenY < ctx.canvas.height + this.tileSize) {
                    
                    const sourceX = tree.type * this.tileSize;
                    const sourceY = Math.floor(tree.type / 10) * this.tileSize;
                    
                    ctx.drawImage(
                        this.mapTiles.trees,
                        sourceX, sourceY, this.tileSize, this.tileSize,
                        screenX - this.tileSize / 2, screenY - this.tileSize / 2, 
                        this.tileSize, this.tileSize
                    );
                }
            });
        }

        // Draw fish in water
        this.fishPositions.forEach(fish => {
            const screenX = fish.x - cameraX;
            const screenY = fish.y - cameraY;
            
            if (screenX > -16 && screenX < ctx.canvas.width + 16 &&
                screenY > -8 && screenY < ctx.canvas.height + 8) {
                
                const sourceX = this.fishFrame * 16;
                ctx.drawImage(
                    this.fishSprites,
                    sourceX, 0, 16, 8,
                    screenX - 8, screenY - 4, 16, 8
                );
            }
        });

        // Draw dust particles
        this.dustParticles.forEach(particle => {
            const screenX = particle.x - cameraX;
            const screenY = particle.y - cameraY;
            const alpha = particle.life / particle.maxLife;
            
            if (screenX > -10 && screenX < ctx.canvas.width + 10 &&
                screenY > -10 && screenY < ctx.canvas.height + 10) {
                
                ctx.globalAlpha = alpha * 0.3; // Very subtle
                ctx.drawImage(
                    this.dustSprite,
                    0, 0, 32, 32,
                    screenX - particle.size, screenY - particle.size,
                    particle.size * 2, particle.size * 2
                );
                ctx.globalAlpha = 1.0;
            }
        });

        // Draw shop building (behind merchant)
        const shopScreenX = this.shopX - cameraX;
        const shopScreenY = this.shopY - cameraY;
        
        if (shopScreenX > -96 && shopScreenX < ctx.canvas.width + 96 &&
            shopScreenY > -128 && shopScreenY < ctx.canvas.height + 128) {
            
            ctx.drawImage(
                this.shopSprite,
                0, 0, 96, 128,
                shopScreenX, shopScreenY, 96, 128
            );
        }

        // Draw merchant (in front of shop)
        const merchantScreenX = this.merchantX - cameraX;
        const merchantScreenY = this.merchantY - cameraY;
        
        if (merchantScreenX > -64 && merchantScreenX < ctx.canvas.width + 64 &&
            merchantScreenY > -64 && merchantScreenY < ctx.canvas.height + 64) {
            
            ctx.drawImage(
                this.merchantSprite,
                0, 0, 64, 64,
                merchantScreenX - 32, merchantScreenY - 32, 64, 64
            );
        }

        // Draw gate (at map edge)
        if (this.gatePosition) {
            const gateScreenX = this.gatePosition.x * this.tileSize - cameraX;
            const gateScreenY = this.gatePosition.y * this.tileSize - cameraY;
            
            if (gateScreenX > -96 && gateScreenX < ctx.canvas.width + 96 &&
                gateScreenY > -128 && gateScreenY < ctx.canvas.height + 128) {
                
                ctx.drawImage(
                    this.gateSprite,
                    0, 0, 96, 128,
                    gateScreenX, gateScreenY, 96, 128
                );
            }
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapSystem;
}


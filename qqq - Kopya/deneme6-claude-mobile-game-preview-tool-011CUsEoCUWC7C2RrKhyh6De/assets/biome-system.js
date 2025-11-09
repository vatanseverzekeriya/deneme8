// Biome/Region System for Zone-Based Animal Spawning
// Defines different regions of the map with specific animal types and spawn rates

class BiomeRegion {
    constructor(name, x, y, width, height, color) {
        this.name = name;
        this.x = x; // In world coordinates
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color; // Color for mini-map display

        // Animal types that can spawn in this region with their spawn weights
        this.animalTypes = new Map(); // spriteType -> weight
        this.maxAnimals = 15; // Max animals per region
    }

    // Add an animal type that can spawn in this region
    addAnimalType(spriteType, weight = 1.0) {
        this.animalTypes.set(spriteType, weight);
    }

    // Check if a world position is inside this region
    contains(worldX, worldY) {
        return worldX >= this.x &&
               worldX < this.x + this.width &&
               worldY >= this.y &&
               worldY < this.y + this.height;
    }

    // Get a random animal type from this region based on weights
    getRandomAnimalType() {
        if (this.animalTypes.size === 0) return null;

        // Calculate total weight
        let totalWeight = 0;
        this.animalTypes.forEach(weight => totalWeight += weight);

        // Random selection based on weight
        let random = Math.random() * totalWeight;
        let current = 0;

        for (let [type, weight] of this.animalTypes) {
            current += weight;
            if (random <= current) {
                return type;
            }
        }

        // Fallback to first type
        return this.animalTypes.keys().next().value;
    }

    // Get a random spawn position within this region
    getRandomPosition() {
        return {
            x: this.x + Math.random() * this.width,
            y: this.y + Math.random() * this.height
        };
    }
}

class BiomeSystem {
    constructor(mapWidth, mapHeight, tileSize) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileSize = tileSize;
        this.regions = [];

        // Create default regions
        this.createDefaultRegions();
    }

    createDefaultRegions() {
        const worldWidth = this.mapWidth * this.tileSize;
        const worldHeight = this.mapHeight * this.tileSize;

        // Divide map into 6 regions (3x2 grid)
        const regionWidth = worldWidth / 3;
        const regionHeight = worldHeight / 2;

        // NORTH-WEST: Wolf Territory
        const wolfRegion = new BiomeRegion(
            'Kurt Bölgesi',
            0,
            0,
            regionWidth,
            regionHeight,
            '#8b7355' // Brown
        );
        wolfRegion.addAnimalType('wolf', 1.0);
        wolfRegion.maxAnimals = 20;
        this.regions.push(wolfRegion);

        // NORTH-CENTER: Forest (Bears and Wolves)
        const forestRegion = new BiomeRegion(
            'Orman Bölgesi',
            regionWidth,
            0,
            regionWidth,
            regionHeight,
            '#2d5016' // Dark green
        );
        forestRegion.addAnimalType('bear', 0.7);
        forestRegion.addAnimalType('wolf', 0.3);
        forestRegion.maxAnimals = 15;
        this.regions.push(forestRegion);

        // NORTH-EAST: Mountain (Goblins and Trolls)
        const mountainRegion = new BiomeRegion(
            'Dağ Bölgesi',
            regionWidth * 2,
            0,
            regionWidth,
            regionHeight,
            '#6b7280' // Gray
        );
        mountainRegion.addAnimalType('goblin', 0.6);
        mountainRegion.addAnimalType('troll', 0.4);
        mountainRegion.maxAnimals = 12;
        this.regions.push(mountainRegion);

        // SOUTH-WEST: Farmland (Dogs and Pigs)
        const farmRegion = new BiomeRegion(
            'Çiftlik Bölgesi',
            0,
            regionHeight,
            regionWidth,
            regionHeight,
            '#a3e635' // Light green
        );
        farmRegion.addAnimalType('dog', 0.6);
        farmRegion.addAnimalType('pig', 0.4);
        farmRegion.maxAnimals = 18;
        this.regions.push(farmRegion);

        // SOUTH-CENTER: Plains (Mixed - Dogs, Wolves, Orcs)
        const plainsRegion = new BiomeRegion(
            'Ova Bölgesi',
            regionWidth,
            regionHeight,
            regionWidth,
            regionHeight,
            '#84cc16' // Yellow-green
        );
        plainsRegion.addAnimalType('dog', 0.4);
        plainsRegion.addAnimalType('wolf', 0.3);
        plainsRegion.addAnimalType('orc', 0.3);
        plainsRegion.maxAnimals = 15;
        this.regions.push(plainsRegion);

        // SOUTH-EAST: Wasteland (Orcs and Dragons)
        const wastelandRegion = new BiomeRegion(
            'Çorak Arazi',
            regionWidth * 2,
            regionHeight,
            regionWidth,
            regionHeight,
            '#78350f' // Dark brown
        );
        wastelandRegion.addAnimalType('orc', 0.5);
        wastelandRegion.addAnimalType('dragon', 0.3);
        wastelandRegion.addAnimalType('troll', 0.2);
        wastelandRegion.maxAnimals = 10;
        this.regions.push(wastelandRegion);
    }

    // Get region at a world position
    getRegionAt(worldX, worldY) {
        for (let region of this.regions) {
            if (region.contains(worldX, worldY)) {
                return region;
            }
        }
        return null;
    }

    // Get a valid spawn position in a specific region (avoiding safe zones)
    getValidSpawnPosition(region, mapSystem, maxAttempts = 50) {
        for (let i = 0; i < maxAttempts; i++) {
            const pos = region.getRandomPosition();

            // Check if position is valid (not in safe zone, not in water, etc.)
            if (mapSystem) {
                // Skip safe zones
                if (mapSystem.isSafeZone(pos.x, pos.y)) continue;
                if (mapSystem.isInsideInnerRiverArea && mapSystem.isInsideInnerRiverArea(pos.x, pos.y)) continue;

                // Check tile type
                const tileX = Math.floor(pos.x / this.tileSize);
                const tileY = Math.floor(pos.y / this.tileSize);

                if (tileX < 0 || tileY < 0 || tileX >= this.mapWidth || tileY >= this.mapHeight) continue;

                if (mapSystem.mapData && mapSystem.mapData[tileY] && mapSystem.mapData[tileY][tileX]) {
                    const tile = mapSystem.mapData[tileY][tileX];
                    if (tile === 'water' || tile === 'river' || tile === 'bridge') continue;
                }
            }

            // Valid position found
            return pos;
        }

        // No valid position found, return center of region
        return {
            x: region.x + region.width / 2,
            y: region.y + region.height / 2
        };
    }

    // Spawn animals across all regions
    spawnInitialAnimals(mapSystem, mobTypes) {
        const animals = [];

        for (let region of this.regions) {
            const count = region.maxAnimals;

            for (let i = 0; i < count; i++) {
                const animalType = region.getRandomAnimalType();
                if (!animalType) continue;

                // Find mob type data
                const mobType = mobTypes.find(m => m.spriteType === animalType);
                if (!mobType) continue;

                // Get valid spawn position
                const pos = this.getValidSpawnPosition(region, mapSystem);

                // Create animal
                const animal = {
                    ...mobType,
                    x: pos.x,
                    y: pos.y,
                    maxHP: mobType.hp,
                    size: 56,
                    targetCooldown: 0,
                    dx: 0,
                    dy: 0,
                    groupId: null,
                    isAggressive: false,
                    aggroTarget: null,
                    wanderTarget: null,
                    biomeRegion: region.name // Track which region this animal belongs to
                };

                animals.push(animal);
            }
        }

        return animals;
    }

    // Count animals in a specific region
    countAnimalsInRegion(animals, regionName) {
        return animals.filter(a => a.biomeRegion === regionName).length;
    }

    // Respawn animal in its region if count is low
    shouldRespawnInRegion(animals, regionName) {
        const region = this.regions.find(r => r.name === regionName);
        if (!region) return false;

        const count = this.countAnimalsInRegion(animals, regionName);
        return count < region.maxAnimals * 0.5; // Respawn when below 50% capacity
    }

    // Get region by name
    getRegionByName(name) {
        return this.regions.find(r => r.name === name);
    }

    // Draw regions on mini-map
    drawOnMiniMap(ctx, scale, offsetX = 0, offsetY = 0) {
        this.regions.forEach(region => {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = region.color;
            ctx.fillRect(
                region.x / this.tileSize * scale + offsetX,
                region.y / this.tileSize * scale + offsetY,
                region.width / this.tileSize * scale,
                region.height / this.tileSize * scale
            );
            ctx.restore();

            // Draw region border
            ctx.strokeStyle = region.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.strokeRect(
                region.x / this.tileSize * scale + offsetX,
                region.y / this.tileSize * scale + offsetY,
                region.width / this.tileSize * scale,
                region.height / this.tileSize * scale
            );
            ctx.globalAlpha = 1.0;
            ctx.restore();
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BiomeSystem;
}

// Character Classes - Shadow Knight Theme
const CLASSES = {
    shadowKnight: {
        name: 'Gölge Şövalye',
        spriteType: 'shadowKnight',
        baseHP: 150,
        baseMP: 50,
        baseDamage: 15,
        baseDefense: 10,
        skills: [
            { name: 'Gölge Kılıcı', icon: 'SK', damage: 30, mpCost: 15, cooldown: 3000, key: 'Q' },
            { name: 'Karanlık Kalkan', icon: 'KK', defense: 20, mpCost: 20, cooldown: 5000, key: 'W' },
            { name: 'Gölge Fırtınası', icon: 'GF', damage: 50, mpCost: 30, cooldown: 8000, key: 'E' }
        ]
    }
};

// Mob types - Sprite-based
const MOB_TYPES = [
    { name: 'Kurt', spriteType: 'wolf', hp: 50, damage: 8, xp: 25, gold: 10, speed: 1.5 },
    { name: 'Köpek', spriteType: 'dog', hp: 40, damage: 6, xp: 20, gold: 8, speed: 1.6 },
    { name: 'Domuz', spriteType: 'pig', hp: 45, damage: 5, xp: 15, gold: 12, speed: 1.3 },
    { name: 'Ayı', spriteType: 'bear', hp: 100, damage: 18, xp: 50, gold: 25, speed: 1.0 },
    { name: 'Goblin', spriteType: 'goblin', hp: 60, damage: 10, xp: 30, gold: 15, speed: 1.2 },
    { name: 'Ork', spriteType: 'orc', hp: 80, damage: 12, xp: 40, gold: 20, speed: 1.0 },
    { name: 'Troll', spriteType: 'troll', hp: 120, damage: 15, xp: 60, gold: 30, speed: 0.8 },
    { name: 'Ejderha', spriteType: 'dragon', hp: 200, damage: 25, xp: 100, gold: 50, speed: 0.6 }
];

// Items - No emojis, using text symbols
const ITEMS = [
    { name: 'Can İksiri', icon: 'HP', type: 'potion', heal: 50 },
    { name: 'Mana İksiri', icon: 'MP', type: 'potion', mana: 50 },
    { name: 'Altın', icon: 'AU', type: 'gold', value: 10 },
    { name: 'Kılıç', icon: 'SW', type: 'weapon', damage: 5 },
    { name: 'Zırh', icon: 'AR', type: 'armor', defense: 5 }
];

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.player = null;
        this.mobs = [];
        this.projectiles = [];
        this.drops = [];
        this.inventory = Array(50).fill(null); // Larger inventory for 40 potions + weapon
        this.merchantUI = null;
        this.deathUI = null;
        this.isDead = false;
        this.deathTimer = 0;
        this.deathX = 0;
        this.deathY = 0;
        this.miniMapUI = null;
        this.fullMapUI = null;
        this.autoMoveTarget = null; // Auto-move target position

        this.keys = {};
        this.joystickActive = false;
        this.joystickAngle = 0;
        this.joystickPower = 0;

        // Sprite system
        this.spriteManager = new SpriteManager();
        this.lastFrameTime = performance.now();
        this.playerDx = 0;
        this.playerDy = 0;

        // Map system
        this.mapSystem = new MapSystem();
        this.cameraX = 0;
        this.cameraY = 0;

        // Biome system - will be initialized after map system
        this.biomeSystem = null;

        // Initialize sprites and map
        this.initialized = false;
        console.log('Starting game initialization...');
        
        Promise.all([
            this.spriteManager.initialize().then(() => {
                console.log('Sprite manager initialized');
                return Promise.resolve();
            }).catch(err => {
                console.error('Sprite manager init error:', err);
                throw err;
            }),
            this.mapSystem.initialize(this.canvas.width, this.canvas.height).then(() => {
                console.log('Map system initialized');
                return Promise.resolve();
            }).catch(err => {
                console.error('Map system init error:', err);
                throw err;
            })
        ]).then(() => {
            console.log('All systems initialized');

            // Initialize biome system after map is ready
            this.biomeSystem = new BiomeSystem(
                this.mapSystem.mapWidth,
                this.mapSystem.mapHeight,
                this.mapSystem.tileSize
            );
            console.log('Biome system initialized');

            this.initialized = true;
            this.setupControls();
            console.log('Game ready!');
        }).catch((error) => {
            console.error('Initialization error:', error);
            console.error('Error stack:', error.stack);
            alert('Oyun yüklenirken bir hata oluştu: ' + error.message + '\n\nLütfen sayfayı yenileyin.');
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    selectCharacter(className) {
        console.log('selectCharacter called with:', className);
        console.log('Game initialized:', this.initialized);
        console.log('Map system exists:', !!this.mapSystem);
        console.log('Map data exists:', !!(this.mapSystem && this.mapSystem.mapData));
        
        // Check if game is initialized
        if (!this.initialized) {
            console.warn('Game not initialized yet, waiting...');
            // Wait a bit and try again
            setTimeout(() => {
                if (this.initialized) {
                    this.selectCharacter(className);
                } else {
                    alert('Oyun henüz yüklenmedi. Lütfen bekleyin...\n\nConsole\'u açıp hata mesajlarını kontrol edin (F12).');
                }

                // Prevent mobs from entering the inner river area (safe zone inside river)
                if (this.mapSystem) {
                    const nextX = mob.x + mobDx;
                    const nextY = mob.y + mobDy;
                    if (this.mapSystem.isInsideInnerRiverArea(nextX, nextY)) {
                        // Block entry; if already inside due to spawn/teleport, push outward to river edge
                        const centerWX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                        const centerWY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                        const pushAngle = Math.atan2(nextY - centerWY, nextX - centerWX);
                        const safeR = (this.mapSystem.riverInnerRadius * this.mapSystem.tileSize) + 12;
                        const distToCenter = Math.sqrt(Math.pow(nextX - centerWX, 2) + Math.pow(nextY - centerWY, 2));
                        if (distToCenter < safeR * 0.98) {
                            mob.x = centerWX + Math.cos(pushAngle) * safeR;
                            mob.y = centerWY + Math.sin(pushAngle) * safeR;
                        }
                        mobDx = 0;
                        mobDy = 0;
                        mob.wanderTarget = null;
                    }
                }
            }, 100);
            return;
        }

        if (!this.mapSystem || !this.mapSystem.mapData) {
            console.error('Map system not ready');
            console.error('Map system:', this.mapSystem);
            alert('Harita sistemi henüz hazır değil. Lütfen sayfayı yenileyin.\n\nConsole\'u açıp hata mesajlarını kontrol edin (F12).');
            return;
        }

        const classData = CLASSES[className];
        if (!classData) {
            console.error('Invalid character class:', className);
            alert('Geçersiz karakter sınıfı: ' + className);
            return;
        }
        
        console.log('Starting character selection...');

        // Spawn player at city center (actual center, not merchant position)
        const spawnX = this.mapSystem ? 
            (this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2) : 
            this.canvas.width / 2;
        const spawnY = this.mapSystem ? 
            (this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2) : 
            this.canvas.height / 2;

        this.player = {
            class: className,
            name: classData.name,
            spriteType: classData.spriteType,
            x: spawnX,
            y: spawnY,
            size: 64,

            level: 1,
            xp: 0,
            xpToLevel: 100,

            hp: classData.baseHP,
            maxHP: classData.baseHP,
            mp: classData.baseMP,
            maxMP: classData.baseMP,

            baseDamage: classData.baseDamage,
            damage: classData.baseDamage,
            defense: classData.baseDefense,

            speed: 5, // Increased speed for faster movement
            skills: classData.skills.map(s => ({...s, cooldownRemaining: 0})),

            gold: 0,
            shibCoins: 0, // Shib coin currency
            attackCooldown: 0,
            basicAttackCooldown: 0,
            comboCount: 0, // Combo system
            comboTimer: 0, // Combo reset timer
            equippedWeapon: null, // Equipped weapon
            dx: 0,
            dy: 0
        };

        // Initialize inventory with starting items
        this.initializeStartingInventory();

        try {
            this.updateHUD();
            this.createSkillButtons();
            this.createAttackButton();
            this.createMiniMap();

            // Initialize camera
            this.cameraX = this.player.x - this.canvas.width / 2;
            this.cameraY = this.player.y - this.canvas.height / 2;

            const charSelect = document.getElementById('charSelect');
            const gameScreen = document.getElementById('gameScreen');
            
            if (charSelect) charSelect.classList.add('hidden');
            if (gameScreen) gameScreen.classList.add('active');

            this.spawnMobs();
            this.gameLoop();
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Oyun başlatılırken hata: ' + error.message + '\n\nLütfen sayfayı yenileyin.');
        }
    }

    initializeStartingInventory() {
        // Starting weapon (can kill wolves)
        const startingWeapon = {
            name: 'Başlangıç Kılıcı',
            icon: 'SW',
            type: 'weapon',
            damage: 10, // Enough to kill wolves (50 HP)
            equipped: false
        };

        // Add starting weapon to inventory
        this.inventory[0] = startingWeapon;
        
        // Equip starting weapon
        this.equipWeapon(0);

        // Add 20 HP potions (stacked in slot 1)
        this.inventory[1] = {
            name: 'Can İksiri',
            icon: 'HP',
            type: 'potion',
            heal: 50,
            count: 20
        };

        // Add 20 MP potions (stacked in slot 2)
        this.inventory[2] = {
            name: 'Mana İksiri',
            icon: 'MP',
            type: 'potion',
            mana: 50,
            count: 20
        };

        this.updateInventory();
    }

    findEmptyInventorySlot() {
        for (let i = 0; i < this.inventory.length; i++) {
            if (!this.inventory[i]) {
                return i;
            }
        }
        return -1;
    }

    equipWeapon(slot) {
        const item = this.inventory[slot];
        if (!item || item.type !== 'weapon') return;

        // Unequip current weapon
        if (this.player.equippedWeapon !== null) {
            const oldWeapon = this.inventory[this.player.equippedWeapon];
            if (oldWeapon) {
                oldWeapon.equipped = false;
            }
        }

        // Equip new weapon
        this.player.equippedWeapon = slot;
        item.equipped = true;
        this.player.damage = this.player.baseDamage + item.damage;
        
        this.updateInventory();
        this.updateHUD();
    }

    createAttackButton() {
        const attackBtn = document.getElementById('attackBtn');
        if (!attackBtn) return;

        const axeIcon = document.getElementById('axeIcon');
        if (axeIcon) {
            const ctx = axeIcon.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            
            // Draw axe icon
            const axeSprite = this.spriteManager.generator.generateAxeIcon();
            ctx.drawImage(axeSprite, 0, 0, 32, 32, 0, 0, 32, 32);
        }

        attackBtn.onclick = () => this.basicAttack();
    }

    createMiniMap() {
        // Create mini map UI
        const miniMapDiv = document.createElement('div');
        miniMapDiv.id = 'miniMap';
        miniMapDiv.className = 'mini-map';
        miniMapDiv.innerHTML = `
            <canvas id="miniMapCanvas" width="200" height="200"></canvas>
        `;
        document.body.appendChild(miniMapDiv);
        this.miniMapUI = miniMapDiv;

        // Add click handler to open full map
        miniMapDiv.onclick = () => this.showFullMap();
        
        // Update mini map
        this.updateMiniMap();
    }

    updateMiniMap() {
        const miniMapCanvas = document.getElementById('miniMapCanvas');
        if (!miniMapCanvas || !this.mapSystem || !this.player) return;

        const ctx = miniMapCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // Clear canvas
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(0, 0, 200, 200);
        
        // Calculate scale
        const scaleX = 200 / this.mapSystem.mapWidth;
        const scaleY = 200 / this.mapSystem.mapHeight;
        const scale = Math.min(scaleX, scaleY);
        
        // Draw map tiles (simplified - show area around player)
        const tileSize = this.mapSystem.tileSize * scale;
        const viewRadius = 50; // Show 50 tiles around player
        const startX = Math.max(0, Math.floor((this.player.x / this.mapSystem.tileSize) - viewRadius));
        const startY = Math.max(0, Math.floor((this.player.y / this.mapSystem.tileSize) - viewRadius));
        const endX = Math.min(this.mapSystem.mapWidth, Math.ceil((this.player.x / this.mapSystem.tileSize) + viewRadius));
        const endY = Math.min(this.mapSystem.mapHeight, Math.ceil((this.player.y / this.mapSystem.tileSize) + viewRadius));
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.mapSystem.mapData && this.mapSystem.mapData[y] && this.mapSystem.mapData[y][x]) {
                    const tile = this.mapSystem.mapData[y][x];
                    const screenX = x * tileSize;
                    const screenY = y * tileSize;
                    
                    // Draw tile based on type
                    if (tile === 'cityCenter') {
                        ctx.fillStyle = '#4a4a6a';
                    } else if (tile === 'stoneRoad') {
                        ctx.fillStyle = '#6a6a6a';
                    } else if (tile === 'dirtRoad') {
                        ctx.fillStyle = '#5a4a3a';
                    } else if (tile === 'water') {
                        ctx.fillStyle = '#2a4a6a';
                    } else {
                        ctx.fillStyle = '#2a5a2a';
                    }
                    
                    ctx.fillRect(screenX, screenY, tileSize, tileSize);
                }
            }
        }
        
        // Draw biome regions (if available)
        if (this.biomeSystem) {
            this.biomeSystem.drawOnMiniMap(ctx, scale);
        }

        // Draw city center circle
        const cityCenterX = this.mapSystem.cityCenterX * tileSize;
        const cityCenterY = this.mapSystem.cityCenterY * tileSize;
        const cityRadius = this.mapSystem.cityCenterRadius * tileSize;
        ctx.strokeStyle = '#8a6aff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cityCenterX, cityCenterY, cityRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw merchant/shop
        const shopX = (this.mapSystem.shopX / this.mapSystem.tileSize) * tileSize;
        const shopY = (this.mapSystem.shopY / this.mapSystem.tileSize) * tileSize;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(shopX - 2, shopY - 2, 4, 4);

        // Draw all mobs/animals in real-time with color-coding
        this.mobs.forEach(mob => {
            const mobX = (mob.x / this.mapSystem.tileSize) * tileSize;
            const mobY = (mob.y / this.mapSystem.tileSize) * tileSize;

            // Color based on animal type
            let mobColor = '#ff0000'; // default red
            switch(mob.spriteType) {
                case 'wolf': mobColor = '#8b7355'; break;
                case 'dog': mobColor = '#b5926b'; break;
                case 'pig': mobColor = '#ffc0cb'; break;
                case 'bear': mobColor = '#5a4a3a'; break;
                case 'goblin': mobColor = '#4A8A4A'; break;
                case 'orc': mobColor = '#556B2F'; break;
                case 'troll': mobColor = '#8B7355'; break;
                case 'dragon': mobColor = '#8B0000'; break;
            }

            ctx.fillStyle = mobColor;
            ctx.beginPath();
            ctx.arc(mobX, mobY, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw player on top
        const playerX = (this.player.x / this.mapSystem.tileSize) * tileSize;
        const playerY = (this.player.y / this.mapSystem.tileSize) * tileSize;
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw auto-move target
        if (this.autoMoveTarget) {
            const targetX = (this.autoMoveTarget.x / this.mapSystem.tileSize) * tileSize;
            const targetY = (this.autoMoveTarget.y / this.mapSystem.tileSize) * tileSize;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(targetX, targetY, 5, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw line from player to target
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(playerX, playerY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    showFullMap() {
        if (this.fullMapUI) {
            this.hideFullMap();
            return;
        }
        
        // Create full map UI
        const fullMapDiv = document.createElement('div');
        fullMapDiv.id = 'fullMap';
        fullMapDiv.className = 'full-map';
        fullMapDiv.innerHTML = `
            <div class="full-map-header">
                <div class="full-map-title">Harita</div>
                <div class="full-map-close" id="closeFullMap">✕</div>
            </div>
            <canvas id="fullMapCanvas" width="800" height="800"></canvas>
        `;
        document.body.appendChild(fullMapDiv);
        this.fullMapUI = fullMapDiv;

        // Close button
        document.getElementById('closeFullMap').onclick = () => this.hideFullMap();
        
        // Update full map
        this.updateFullMap();
        
        // Add click handler to canvas
        const fullMapCanvas = document.getElementById('fullMapCanvas');
        fullMapCanvas.onclick = (e) => {
            const rect = fullMapCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convert screen coordinates to world coordinates
            const scaleX = this.mapSystem.mapWidth / 800;
            const scaleY = this.mapSystem.mapHeight / 800;
            const worldX = x * scaleX * this.mapSystem.tileSize;
            const worldY = y * scaleY * this.mapSystem.tileSize;
            
            // Set auto-move target
            this.autoMoveTarget = { x: worldX, y: worldY };
            
            // Close full map
            this.hideFullMap();
        };
    }

    updateFullMap() {
        const fullMapCanvas = document.getElementById('fullMapCanvas');
        if (!fullMapCanvas || !this.mapSystem || !this.player) return;

        const ctx = fullMapCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // Clear canvas
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(0, 0, 800, 800);
        
        // Calculate scale
        const scaleX = 800 / this.mapSystem.mapWidth;
        const scaleY = 800 / this.mapSystem.mapHeight;
        const scale = Math.min(scaleX, scaleY);
        
        // Draw all map tiles
        const tileSize = this.mapSystem.tileSize * scale;
        
        for (let y = 0; y < this.mapSystem.mapHeight; y++) {
            for (let x = 0; x < this.mapSystem.mapWidth; x++) {
                if (this.mapSystem.mapData && this.mapSystem.mapData[y] && this.mapSystem.mapData[y][x]) {
                    const tile = this.mapSystem.mapData[y][x];
                    const screenX = x * tileSize;
                    const screenY = y * tileSize;
                    
                    // Draw tile based on type
                    if (tile === 'cityCenter') {
                        ctx.fillStyle = '#4a4a6a';
                    } else if (tile === 'stoneRoad') {
                        ctx.fillStyle = '#6a6a6a';
                    } else if (tile === 'dirtRoad') {
                        ctx.fillStyle = '#5a4a3a';
                    } else if (tile === 'water') {
                        ctx.fillStyle = '#2a4a6a';
                    } else {
                        ctx.fillStyle = '#2a5a2a';
                    }
                    
                    ctx.fillRect(screenX, screenY, tileSize, tileSize);
                }
            }
        }
        
        // Draw biome regions (if available)
        if (this.biomeSystem) {
            this.biomeSystem.drawOnMiniMap(ctx, scale);
        }

        // Draw city center circle
        const cityCenterX = this.mapSystem.cityCenterX * tileSize;
        const cityCenterY = this.mapSystem.cityCenterY * tileSize;
        const cityRadius = this.mapSystem.cityCenterRadius * tileSize;
        ctx.strokeStyle = '#8a6aff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cityCenterX, cityCenterY, cityRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw merchant/shop
        const shopX = (this.mapSystem.shopX / this.mapSystem.tileSize) * tileSize;
        const shopY = (this.mapSystem.shopY / this.mapSystem.tileSize) * tileSize;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(shopX - 3, shopY - 3, 6, 6);

        // Draw all mobs/animals in real-time with color-coding
        this.mobs.forEach(mob => {
            const mobX = (mob.x / this.mapSystem.tileSize) * tileSize;
            const mobY = (mob.y / this.mapSystem.tileSize) * tileSize;

            // Color based on animal type
            let mobColor = '#ff0000'; // default red
            switch(mob.spriteType) {
                case 'wolf': mobColor = '#8b7355'; break;
                case 'dog': mobColor = '#b5926b'; break;
                case 'pig': mobColor = '#ffc0cb'; break;
                case 'bear': mobColor = '#5a4a3a'; break;
                case 'goblin': mobColor = '#4A8A4A'; break;
                case 'orc': mobColor = '#556B2F'; break;
                case 'troll': mobColor = '#8B7355'; break;
                case 'dragon': mobColor = '#8B0000'; break;
            }

            ctx.fillStyle = mobColor;
            ctx.beginPath();
            ctx.arc(mobX, mobY, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw player on top
        const playerX = (this.player.x / this.mapSystem.tileSize) * tileSize;
        const playerY = (this.player.y / this.mapSystem.tileSize) * tileSize;
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw auto-move target
        if (this.autoMoveTarget) {
            const targetX = (this.autoMoveTarget.x / this.mapSystem.tileSize) * tileSize;
            const targetY = (this.autoMoveTarget.y / this.mapSystem.tileSize) * tileSize;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw line from player to target
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(playerX, playerY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    hideFullMap() {
        if (this.fullMapUI) {
            this.fullMapUI.remove();
            this.fullMapUI = null;
        }
    }

    createSkillButtons() {
        const skillsDiv = document.getElementById('skills');
        skillsDiv.innerHTML = '';

        this.player.skills.forEach((skill, index) => {
            const btn = document.createElement('div');
            btn.className = 'skill-btn';
            btn.id = `skill${index}`;
            
            // Create icon container
            const iconContainer = document.createElement('div');
            iconContainer.className = 'skill-icon-canvas';
            
            // Create canvas for skill icon
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 32;
            iconCanvas.height = 32;
            const iconCtx = iconCanvas.getContext('2d');
            iconCtx.imageSmoothingEnabled = false;
            this.spriteManager.drawSkillIcon(iconCtx, index, 16, 16, 32);
            
            iconContainer.appendChild(iconCanvas);
            
            // Create key label
            const keyLabel = document.createElement('div');
            keyLabel.className = 'skill-key';
            keyLabel.textContent = skill.key;
            
            btn.appendChild(iconContainer);
            btn.appendChild(keyLabel);
            btn.onclick = () => this.useSkill(index);
            skillsDiv.appendChild(btn);
        });
    }

    setupControls() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Basic attack (Space or Q)
            if (e.key === ' ' || e.key.toLowerCase() === 'q') {
                e.preventDefault();
                this.basicAttack();
            }

            // Skills (only if Q is not used for attack)
            if (e.key.toLowerCase() === 'w') this.useSkill(1);
            if (e.key.toLowerCase() === 'e') this.useSkill(2);

            // Use potion
            if (e.key >= '1' && e.key <= '5') {
                this.useItem(parseInt(e.key) - 1);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Joystick
        const joystick = document.getElementById('joystick');
        const stick = document.getElementById('joystickStick');

        const handleJoystickStart = (e) => {
            e.preventDefault();
            this.joystickActive = true;
        };

        const handleJoystickMove = (e) => {
            if (!this.joystickActive) return;
            e.preventDefault();

            const touch = e.touches ? e.touches[0] : e;
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;

            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 35);
            this.joystickAngle = Math.atan2(deltaY, deltaX);
            this.joystickPower = distance / 35;

            const stickX = Math.cos(this.joystickAngle) * distance;
            const stickY = Math.sin(this.joystickAngle) * distance;

            stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
        };

        const handleJoystickEnd = (e) => {
            e.preventDefault();
            this.joystickActive = false;
            this.joystickPower = 0;
            stick.style.transform = 'translate(-50%, -50%)';
        };

        joystick.addEventListener('touchstart', handleJoystickStart);
        joystick.addEventListener('touchmove', handleJoystickMove);
        joystick.addEventListener('touchend', handleJoystickEnd);

        joystick.addEventListener('mousedown', handleJoystickStart);
        document.addEventListener('mousemove', handleJoystickMove);
        document.addEventListener('mouseup', handleJoystickEnd);
    }

    spawnMobs() {
        // Use biome system to spawn animals in their respective regions
        if (this.biomeSystem) {
            console.log('Spawning animals using biome system...');
            const animals = this.biomeSystem.spawnInitialAnimals(this.mapSystem, MOB_TYPES);
            this.mobs = animals;
            console.log(`Spawned ${animals.length} animals across all biomes`);
        } else {
            console.warn('Biome system not initialized, falling back to random spawning');
            // Fallback to old system
            const groupCount = 20 + Math.floor(this.player.level / 2);
            for (let i = 0; i < groupCount; i++) {
                this.spawnMobGroup();
            }
        }

        // Continue spawning mobs throughout the map
        this.continuousSpawnMobs();
    }

    continuousSpawnMobs() {
        // Spawn mobs continuously using biome system to maintain animal distribution
        setInterval(() => {
            if (this.mobs.length < 100 && this.biomeSystem) {
                // Check each region and respawn if needed
                this.biomeSystem.regions.forEach(region => {
                    if (this.biomeSystem.shouldRespawnInRegion(this.mobs, region.name)) {
                        // Spawn one animal in this region
                        const animalType = region.getRandomAnimalType();
                        if (animalType) {
                            const mobType = MOB_TYPES.find(m => m.spriteType === animalType);
                            if (mobType) {
                                const pos = this.biomeSystem.getValidSpawnPosition(region, this.mapSystem);
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
                                    biomeRegion: region.name
                                };
                                this.mobs.push(animal);
                            }
                        }
                    }
                });
            }
        }, 10000); // Check every 10 seconds
    }

    spawnMobGroupAt(centerX, centerY) {
        const typeIndex = Math.min(
            Math.floor(this.player.level / 3),
            MOB_TYPES.length - 1
        );
        const type = MOB_TYPES[Math.floor(Math.random() * (typeIndex + 1))];

        // Generate unique group ID
        const groupId = Date.now() + Math.random();

        // Spawn 3 mobs in a triangle formation
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2 / 3) + Math.PI / 6; // Triangle formation
            const offset = 40; // Distance from center
            const x = centerX + Math.cos(angle) * offset;
            const y = centerY + Math.sin(angle) * offset;

            // Don't spawn in city/safe zone or on bridge/water
            if (this.mapSystem && (
                this.mapSystem.isSafeZone(x, y) ||
                (() => {
                    const tx = Math.floor(x / this.mapSystem.tileSize);
                    const ty = Math.floor(y / this.mapSystem.tileSize);
                    if (tx < 0 || ty < 0 || tx >= this.mapSystem.mapWidth || ty >= this.mapSystem.mapHeight) return true;
                    const tile = this.mapSystem.mapData[ty][tx];
                    return tile === 'bridge' || tile === 'river' || tile === 'water';
                })()
            )) {
                continue;
            }

            const mob = {
                ...type,
                x, y,
                maxHP: type.hp,
                size: 56,
                targetCooldown: 0,
                dx: 0,
                dy: 0,
                groupId: groupId,
                isAggressive: false,
                aggroTarget: null,
                wanderTarget: null
            };

            this.mobs.push(mob);
        }
    }

    spawnMob() {
        const typeIndex = Math.min(
            Math.floor(this.player.level / 3),
            MOB_TYPES.length - 1
        );
        const type = MOB_TYPES[Math.floor(Math.random() * (typeIndex + 1))];

        // Spawn mobs around player in world space (NOT in city center)
        let x, y;
        let attempts = 0;
        do {
            const margin = 200;
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * margin;
            x = this.player.x + Math.cos(angle) * distance;
            y = this.player.y + Math.sin(angle) * distance;
            attempts++;
        } while (this.mapSystem && (
            this.mapSystem.isSafeZone(x, y) ||
            (() => {
                const tx = Math.floor(x / this.mapSystem.tileSize);
                const ty = Math.floor(y / this.mapSystem.tileSize);
                if (tx < 0 || ty < 0 || tx >= this.mapSystem.mapWidth || ty >= this.mapSystem.mapHeight) return true;
                const tile = this.mapSystem.mapData[ty][tx];
                return tile === 'bridge' || tile === 'river' || tile === 'water';
            })()
        ) && attempts < 20);

        this.mobs.push({
            ...type,
            x, y,
            maxHP: type.hp,
            size: 56, // 64 * 0.9 scale
            targetCooldown: 0,
            dx: 0,
            dy: 0,
            groupId: null, // Will be assigned to group
            isAggressive: false, // Passive until attacked
            aggroTarget: null // Target when attacked
        });
    }

    // Spawn mobs in groups of 3
    spawnMobGroup() {
        const typeIndex = Math.min(
            Math.floor(this.player.level / 3),
            MOB_TYPES.length - 1
        );
        const type = MOB_TYPES[Math.floor(Math.random() * (typeIndex + 1))];

        // Find spawn location (NOT in city center)
        let centerX, centerY;
        let attempts = 0;
        do {
            const margin = 300;
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * margin;
            centerX = this.player.x + Math.cos(angle) * distance;
            centerY = this.player.y + Math.sin(angle) * distance;
            attempts++;
        } while (this.mapSystem && this.mapSystem.isSafeZone(centerX, centerY) && attempts < 30);

        // Generate unique group ID
        const groupId = Date.now() + Math.random();

        // Spawn 3 mobs in a triangle formation
        const groupMobs = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2 / 3) + Math.PI / 6; // Triangle formation
            const offset = 40; // Distance from center
            const x = centerX + Math.cos(angle) * offset;
            const y = centerY + Math.sin(angle) * offset;

            const mob = {
                ...type,
                x, y,
                maxHP: type.hp,
                size: 56,
                targetCooldown: 0,
                dx: 0,
                dy: 0,
            groupId: groupId,
            isAggressive: false,
            aggroTarget: null,
            wanderTarget: null // For wandering behavior
        };

            this.mobs.push(mob);
            groupMobs.push(mob);
        }

        return groupMobs;
    }

    useSkill(index) {
        if (!this.player) return;

        const skill = this.player.skills[index];

        if (skill.cooldownRemaining > 0) return;
        if (this.player.mp < skill.mpCost) return;

        this.player.mp -= skill.mpCost;
        skill.cooldownRemaining = skill.cooldown;

        // Skill effects
        if (skill.damage) {
            const nearestMob = this.findNearestMob();
            if (nearestMob) {
                const distance = this.getDistance(this.player, nearestMob);
                if (distance < 300) {
                    this.damageEnemy(nearestMob, skill.damage + this.player.damage);

                    if (skill.lifesteal) {
                        this.player.hp = Math.min(
                            this.player.maxHP,
                            this.player.hp + skill.damage * skill.lifesteal
                        );
                    }
                }
            }
        }

        if (skill.heal) {
            this.player.hp = Math.min(this.player.maxHP, this.player.hp + skill.heal);
        }

        this.updateHUD();
        this.updateSkillUI(index);
    }

    updateSkillUI(index) {
        const btn = document.getElementById(`skill${index}`);
        const skill = this.player.skills[index];

        btn.classList.add('cooldown');

        const overlay = document.createElement('div');
        overlay.className = 'cooldown-overlay';
        overlay.textContent = Math.ceil(skill.cooldownRemaining / 1000);
        btn.appendChild(overlay);

        const interval = setInterval(() => {
            const remaining = Math.ceil(skill.cooldownRemaining / 1000);
            overlay.textContent = remaining;

            if (remaining <= 0) {
                btn.classList.remove('cooldown');
                overlay.remove();
                clearInterval(interval);
            }
        }, 100);
    }

    findNearestMob() {
        let nearest = null;
        let minDist = Infinity;

        this.mobs.forEach(mob => {
            const dist = this.getDistance(this.player, mob);
            if (dist < minDist) {
                minDist = dist;
                nearest = mob;
            }
        });

        return nearest;
    }

    getDistance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    damageEnemy(enemy, damage) {
        enemy.hp -= damage;
        this.showDamage(enemy.x, enemy.y, damage);

        // Aggro system - if mob is in a group, aggro entire group
        if (enemy.groupId) {
            this.mobs.forEach(mob => {
                if (mob.groupId === enemy.groupId && !mob.isAggressive) {
                    mob.isAggressive = true;
                    mob.aggroTarget = this.player;
                }
            });
        } else {
            // Single mob aggro
            enemy.isAggressive = true;
            enemy.aggroTarget = this.player;
        }

        if (enemy.hp <= 0) {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        const index = this.mobs.indexOf(enemy);
        if (index > -1) {
            this.mobs.splice(index, 1);
        }

        // XP
        this.player.xp += enemy.xp;
        if (this.player.xp >= this.player.xpToLevel) {
            this.levelUp();
        }

        // Shib coins reward (based on enemy level/type)
        const shibReward = Math.floor(enemy.xp / 2) + Math.floor(Math.random() * 5) + 1;
        this.player.shibCoins += shibReward;
        this.showNotification(`+${shibReward} Shib Coin`);

        // Drop
        if (Math.random() < 0.4) {
            const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
            this.drops.push({
                ...item,
                x: enemy.x,
                y: enemy.y,
                size: 25
            });
        }

        // Spawn new mob group (not in city center)
        setTimeout(() => this.spawnMobGroup(), 5000);

        this.updateHUD();
    }

    levelUp() {
        this.player.level++;
        this.player.xp = 0;
        this.player.xpToLevel = Math.floor(this.player.xpToLevel * 1.5);

        this.player.maxHP += 20;
        this.player.hp = this.player.maxHP;
        this.player.maxMP += 10;
        this.player.mp = this.player.maxMP;
        this.player.damage += 3;
        this.player.defense += 2;

        this.showNotification('LEVEL UP! ' + this.player.level);
        this.updateHUD();
    }

    showDamage(x, y, damage) {
        const dmg = document.createElement('div');
        dmg.className = 'damage-number';
        dmg.textContent = '-' + damage;
        dmg.style.left = x + 'px';
        dmg.style.top = y + 'px';
        dmg.style.color = '#ff4444';
        document.body.appendChild(dmg);

        setTimeout(() => dmg.remove(), 1000);
    }

    showNotification(text) {
        const notif = document.getElementById('lootNotif');
        notif.textContent = text;
        notif.style.display = 'flex';

        setTimeout(() => {
            notif.style.display = 'none';
        }, 2000);
    }

    pickupDrop(drop) {
        const index = this.drops.indexOf(drop);
        if (index > -1) {
            this.drops.splice(index, 1);
        }

        // Add to inventory
        for (let i = 0; i < this.inventory.length; i++) {
            if (!this.inventory[i]) {
                this.inventory[i] = drop;
                this.updateInventory();
                this.showNotification(`+1 ${drop.name}`);
                break;
            }
        }
    }

    useItem(slot) {
        const item = this.inventory[slot];
        if (!item) return;

        if (item.type === 'potion') {
            if (item.heal) {
                this.player.hp = Math.min(this.player.maxHP, this.player.hp + item.heal);
            }
            if (item.mana) {
                this.player.mp = Math.min(this.player.maxMP, this.player.mp + item.mana);
            }

            // Handle stacked items
            if (item.count && item.count > 1) {
                item.count--;
            } else {
                this.inventory[slot] = null;
            }
            
            this.updateInventory();
            this.updateHUD();
        }
    }

    updateInventory() {
        // Update visible slots (first 5)
        for (let i = 0; i < 5; i++) {
            const slot = document.getElementById(`slot${i}`);
            if (!slot) continue;
            
            const item = this.inventory[i];
            if (item) {
                // Create canvas for item icon
                const iconCanvas = document.createElement('canvas');
                iconCanvas.width = 32;
                iconCanvas.height = 32;
                const iconCtx = iconCanvas.getContext('2d');
                iconCtx.imageSmoothingEnabled = false;
                
                // Draw item sprite
                this.spriteManager.drawItemIcon(iconCtx, item.icon, 16, 16, 32);
                
                slot.innerHTML = '';
                slot.appendChild(iconCanvas);
                slot.classList.add('has-item');
                
                // Show item count for stackable items
                if (item.count && item.count > 1) {
                    const countDiv = document.createElement('div');
                    countDiv.className = 'item-count';
                    countDiv.textContent = item.count;
                    slot.appendChild(countDiv);
                }
                
                // Show equipped indicator for weapons
                if (item.type === 'weapon' && item.equipped) {
                    const equippedIndicator = document.createElement('div');
                    equippedIndicator.className = 'equipped-indicator';
                    equippedIndicator.textContent = 'E';
                    slot.appendChild(equippedIndicator);
                }
                
                // Add click handler for equipping weapons
                if (item.type === 'weapon') {
                    slot.onclick = () => this.equipWeapon(i);
                } else {
                    slot.onclick = () => this.useItem(i);
                }
            } else {
                slot.innerHTML = '';
                slot.classList.remove('has-item');
                slot.onclick = null;
            }
        }
    }

    update() {
        if (!this.player) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // Update death timer and check auto-respawn
        if (this.isDead) {
            this.deathTimer += deltaTime;
            this.updateDeathUI();
            this.checkAutoRespawn();
        }

        // Don't update game if dead
        if (this.isDead) {
            return;
        }

        // Auto-move system
        if (this.autoMoveTarget) {
            const distToTarget = Math.sqrt(
                Math.pow(this.player.x - this.autoMoveTarget.x, 2) + 
                Math.pow(this.player.y - this.autoMoveTarget.y, 2)
            );
            
            if (distToTarget < 10) {
                // Reached target
                this.autoMoveTarget = null;
            } else {
                // Move towards target
                const angle = Math.atan2(this.autoMoveTarget.y - this.player.y, this.autoMoveTarget.x - this.player.x);
                const moveSpeed = this.player.speed;
                
                // Check for speed bonus on cobblestone road
                let speedMultiplier = 1.0;
                if (this.mapSystem) {
                    const tileX = Math.floor(this.player.x / this.mapSystem.tileSize);
                    const tileY = Math.floor(this.player.y / this.mapSystem.tileSize);
                    
                    if (tileX >= 0 && tileX < this.mapSystem.mapWidth &&
                        tileY >= 0 && tileY < this.mapSystem.mapHeight) {
                        const tile = this.mapSystem.mapData[tileY][tileX];
                        if (tile === 'cobblestoneRoad') {
                            speedMultiplier = 1.3; // 30% speed bonus on cobblestone road
                        } else if (tile === 'stoneRoad' || tile === 'dirtRoad' || 
                                   tile === 'grassRoad' || tile === 'bridge') {
                            speedMultiplier = 1.15; // 15% speed bonus on other roads
                        }
                    }
                }
                
                const newX = this.player.x + Math.cos(angle) * moveSpeed * speedMultiplier;
                const newY = this.player.y + Math.sin(angle) * moveSpeed * speedMultiplier;
                
                // Check collision
                let canMove = true;
                if (this.mapSystem) {
                    const newTileX = Math.floor(newX / this.mapSystem.tileSize);
                    const newTileY = Math.floor(newY / this.mapSystem.tileSize);
                    
                    if (newTileX >= 0 && newTileX < this.mapSystem.mapWidth &&
                        newTileY >= 0 && newTileY < this.mapSystem.mapHeight) {
                        
                        // Check collision map (trees, bushes)
                        if (this.mapSystem.collisionMap[newTileY][newTileX]) {
                            canMove = false;
                        }
                        
                        // Check tile type (water, river - but bridge is walkable)
                        const tile = this.mapSystem.mapData[newTileY][newTileX];
                        if (tile === 'water' || tile === 'river') {
                            // Check if there's a bridge
                            const isBridge = this.mapSystem.bridgePositions.some(
                                bridge => bridge.x === newTileX && bridge.y === newTileY
                            );
                            if (!isBridge) {
                                canMove = false;
                            }
                        }
                    }
                }
                
                if (canMove) {
                    this.player.x = newX;
                    this.player.y = newY;
                }
                
                // Update direction for animation
                this.player.dx = Math.cos(angle) * moveSpeed * speedMultiplier;
                this.player.dy = Math.sin(angle) * moveSpeed * speedMultiplier;
                
                // Update camera
                this.cameraX = this.player.x - this.canvas.width / 2;
                this.cameraY = this.player.y - this.canvas.height / 2;
                
                // Update HUD
                this.updateHUD();
                this.updateMiniMap();
                
                return; // Skip manual movement when auto-moving
            }
        }

        // Player movement
        let dx = 0, dy = 0;

        if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
        if (this.keys['arrowright'] || this.keys['d']) dx += 1;
        if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
        if (this.keys['arrowdown'] || this.keys['s']) dy += 1;
        
        // Cancel auto-move on manual input
        if (dx !== 0 || dy !== 0) {
            this.autoMoveTarget = null;
        }

        // Joystick
        if (this.joystickActive) {
            dx = Math.cos(this.joystickAngle) * this.joystickPower;
            dy = Math.sin(this.joystickAngle) * this.joystickPower;
        }

        // Store movement direction for animation
        this.playerDx = dx;
        this.playerDy = dy;

        if (dx || dy) {
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / magnitude) * this.player.speed;
            dy = (dy / magnitude) * this.player.speed;
            
            // Check for speed bonus on cobblestone road
            let speedMultiplier = 1.0;
            if (this.mapSystem) {
                const tileX = Math.floor(this.player.x / this.mapSystem.tileSize);
                const tileY = Math.floor(this.player.y / this.mapSystem.tileSize);
                
                if (tileX >= 0 && tileX < this.mapSystem.mapWidth &&
                    tileY >= 0 && tileY < this.mapSystem.mapHeight) {
                    const tile = this.mapSystem.mapData[tileY][tileX];
                    if (tile === 'cobblestoneRoad') {
                        speedMultiplier = 1.3; // 30% speed bonus on cobblestone road
                    } else if (tile === 'stoneRoad' || tile === 'dirtRoad' || 
                               tile === 'grassRoad' || tile === 'bridge') {
                        speedMultiplier = 1.15; // 15% speed bonus on other roads
                    }
                }
            }
            
            const newX = this.player.x + dx * speedMultiplier;
            const newY = this.player.y + dy * speedMultiplier;
            
            // Check collision with obstacles
            let canMove = true;
            if (this.mapSystem) {
                const newTileX = Math.floor(newX / this.mapSystem.tileSize);
                const newTileY = Math.floor(newY / this.mapSystem.tileSize);
                
                if (newTileX >= 0 && newTileX < this.mapSystem.mapWidth &&
                    newTileY >= 0 && newTileY < this.mapSystem.mapHeight) {
                    
                    // Check collision map (trees, bushes)
                    if (this.mapSystem.collisionMap[newTileY][newTileX]) {
                        canMove = false;
                    }
                    
                    // Check tile type (water, river - but bridge is walkable)
                    const tile = this.mapSystem.mapData[newTileY][newTileX];
                    if (tile === 'water' || tile === 'river') {
                        // Check if there's a bridge
                        const isBridge = this.mapSystem.bridgePositions.some(
                            bridge => bridge.x === newTileX && bridge.y === newTileY
                        );
                        if (!isBridge) {
                            canMove = false;
                        }
                    }
                }
            }
            
            if (canMove) {
                this.player.x = newX;
                this.player.y = newY;
                this.player.dx = dx * speedMultiplier;
                this.player.dy = dy * speedMultiplier;
            } else {
                // Stop movement if collision
                this.player.dx = 0;
                this.player.dy = 0;
            }

            // Update camera to follow player
            this.cameraX = this.player.x - this.canvas.width / 2;
            this.cameraY = this.player.y - this.canvas.height / 2;
        } else {
            // No movement
            this.player.dx = 0;
            this.player.dy = 0;
        }

        // Update mobs
        this.mobs.forEach(mob => {
            // Mobs are passive - only attack if player attacks them or their group
            if (!mob.isAggressive) {
                // Wander around in groups
                let mobDx = 0;
                let mobDy = 0;
                
                // Group wandering system
                if (mob.groupId) {
                    // Find other mobs in the same group
                    const groupMobs = this.mobs.filter(m => m.groupId === mob.groupId && m !== mob);
                    
                    if (groupMobs.length > 0) {
                        // Calculate group center
                        let groupCenterX = 0;
                        let groupCenterY = 0;
                        groupMobs.forEach(gm => {
                            groupCenterX += gm.x;
                            groupCenterY += gm.y;
                        });
                        groupCenterX /= groupMobs.length;
                        groupCenterY /= groupMobs.length;
                        
                        // Calculate distance from group center
                        const distFromCenter = Math.sqrt(
                            Math.pow(mob.x - groupCenterX, 2) + 
                            Math.pow(mob.y - groupCenterY, 2)
                        );
                        
                        // Max distance from group center (100 pixels)
                        const maxGroupDistance = 100;
                        
                        if (distFromCenter > maxGroupDistance) {
                            // Move back towards group center
                            const angle = Math.atan2(groupCenterY - mob.y, groupCenterX - mob.x);
                            mobDx = Math.cos(angle) * mob.speed * 0.5;
                            mobDy = Math.sin(angle) * mob.speed * 0.5;
                        } else {
                            // Wander around group center
                            if (!mob.wanderTarget || Math.random() < 0.01) {
                                // Set new wander target near group center
                                const wanderAngle = Math.random() * Math.PI * 2;
                                const wanderDistance = 30 + Math.random() * 50;
                                mob.wanderTarget = {
                                    x: groupCenterX + Math.cos(wanderAngle) * wanderDistance,
                                    y: groupCenterY + Math.sin(wanderAngle) * wanderDistance
                                };
                            }
                            
                            // Move towards wander target
                            if (mob.wanderTarget) {
                                const distToTarget = Math.sqrt(
                                    Math.pow(mob.x - mob.wanderTarget.x, 2) + 
                                    Math.pow(mob.y - mob.wanderTarget.y, 2)
                                );
                                
                                if (distToTarget > 5) {
                                    const angle = Math.atan2(mob.wanderTarget.y - mob.y, mob.wanderTarget.x - mob.x);
                                    mobDx = Math.cos(angle) * mob.speed * 0.3;
                                    mobDy = Math.sin(angle) * mob.speed * 0.3;
                                } else {
                                    // Reached target, clear it
                                    mob.wanderTarget = null;
                                }
                            }
                        }
                    } else {
                        // No group members, just wander randomly
                        if (!mob.wanderTarget || Math.random() < 0.02) {
                            const wanderAngle = Math.random() * Math.PI * 2;
                            const wanderDistance = 50 + Math.random() * 100;
                            mob.wanderTarget = {
                                x: mob.x + Math.cos(wanderAngle) * wanderDistance,
                                y: mob.y + Math.sin(wanderAngle) * wanderDistance
                            };
                        }
                        
                        if (mob.wanderTarget) {
                            const distToTarget = Math.sqrt(
                                Math.pow(mob.x - mob.wanderTarget.x, 2) + 
                                Math.pow(mob.y - mob.wanderTarget.y, 2)
                            );
                            
                            if (distToTarget > 5) {
                                const angle = Math.atan2(mob.wanderTarget.y - mob.y, mob.wanderTarget.x - mob.x);
                                mobDx = Math.cos(angle) * mob.speed * 0.3;
                                mobDy = Math.sin(angle) * mob.speed * 0.3;
                            } else {
                                mob.wanderTarget = null;
                            }
                        }
                    }
                } else {
                    // Single mob, just wander randomly
                    if (!mob.wanderTarget || Math.random() < 0.02) {
                        const wanderAngle = Math.random() * Math.PI * 2;
                        const wanderDistance = 50 + Math.random() * 100;
                        mob.wanderTarget = {
                            x: mob.x + Math.cos(wanderAngle) * wanderDistance,
                            y: mob.y + Math.sin(wanderAngle) * wanderDistance
                        };
                    }
                    
                    if (mob.wanderTarget) {
                        const distToTarget = Math.sqrt(
                            Math.pow(mob.x - mob.wanderTarget.x, 2) + 
                            Math.pow(mob.y - mob.wanderTarget.y, 2)
                        );
                        
                        if (distToTarget > 5) {
                            const angle = Math.atan2(mob.wanderTarget.y - mob.y, mob.wanderTarget.x - mob.x);
                            mobDx = Math.cos(angle) * mob.speed * 0.3;
                            mobDy = Math.sin(angle) * mob.speed * 0.3;
                        } else {
                            mob.wanderTarget = null;
                        }
                    }
                }
                
                // Check if mob is in city center and push out
                if (this.mapSystem && this.mapSystem.isInCityCenter(mob.x, mob.y)) {
                    const cityCenterWorldX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    const cityCenterWorldY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    
                    const pushAngle = Math.atan2(
                        mob.y - cityCenterWorldY,
                        mob.x - cityCenterWorldX
                    );
                    
                    const safeDistance = this.mapSystem.cityCenterRadius * this.mapSystem.tileSize + 30;
                    mob.x = cityCenterWorldX + Math.cos(pushAngle) * safeDistance;
                    mob.y = cityCenterWorldY + Math.sin(pushAngle) * safeDistance;
                    mobDx = 0;
                    mobDy = 0;
                    mob.wanderTarget = null; // Reset wander target
                }

                // Prevent mobs from entering inner river area (safe zone inside river)
                if (this.mapSystem) {
                    const nextX = mob.x + mobDx;
                    const nextY = mob.y + mobDy;
                    if (this.mapSystem.isInsideInnerRiverArea(nextX, nextY)) {
                        // Push mob outward to inner river edge
                        const centerWX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                        const centerWY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                        const pushAngle = Math.atan2(nextY - centerWY, nextX - centerWX);
                        const safeR = (this.mapSystem.riverInnerRadius * this.mapSystem.tileSize) + 12;
                        const distToCenter = Math.sqrt(Math.pow(nextX - centerWX, 2) + Math.pow(nextY - centerWY, 2));
                        if (distToCenter < safeR * 0.98) {
                            mob.x = centerWX + Math.cos(pushAngle) * safeR;
                            mob.y = centerWY + Math.sin(pushAngle) * safeR;
                        }
                        mobDx = 0;
                        mobDy = 0;
                        mob.wanderTarget = null;
                    }
                }
                
                mob.x += mobDx;
                mob.y += mobDy;
                mob.dx = mobDx;
                mob.dy = mobDy;
                return; // Don't attack if not aggressive
            }

            // Aggressive mobs chase player
            const dist = this.getDistance(this.player, mob);

            if (dist < 400) {
                const angle = Math.atan2(this.player.y - mob.y, this.player.x - mob.x);
                let mobDx = Math.cos(angle) * mob.speed;
                let mobDy = Math.sin(angle) * mob.speed;
                
                // Prevent mobs from entering city center - STRICT RULE
                const newX = mob.x + mobDx;
                const newY = mob.y + mobDy;
                
                if (this.mapSystem && this.mapSystem.isInCityCenter(newX, newY)) {
                    // Calculate distance to city center
                    const cityCenterWorldX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    const cityCenterWorldY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    
                    const distToCenter = Math.sqrt(
                        Math.pow(newX - cityCenterWorldX, 2) + 
                        Math.pow(newY - cityCenterWorldY, 2)
                    );
                    
                    const cityCenterRadiusWorld = this.mapSystem.cityCenterRadius * this.mapSystem.tileSize;
                    
                    // If mob is trying to enter city center, push it away
                    if (distToCenter < cityCenterRadiusWorld) {
                        // Calculate push away direction (away from city center)
                        const pushAngle = Math.atan2(
                            newY - cityCenterWorldY,
                            newX - cityCenterWorldX
                        );
                        
                        // Push mob away from city center
                        mobDx = Math.cos(pushAngle) * mob.speed * 2; // Stronger push
                        mobDy = Math.sin(pushAngle) * mob.speed * 2;
                        
                        // If mob is already inside, teleport it outside
                        if (distToCenter < cityCenterRadiusWorld * 0.8) {
                            const safeDistance = cityCenterRadiusWorld + 20;
                            mob.x = cityCenterWorldX + Math.cos(pushAngle) * safeDistance;
                            mob.y = cityCenterWorldY + Math.sin(pushAngle) * safeDistance;
                            mobDx = 0;
                            mobDy = 0;
                        }
                    }
                }
                
                // Also check current position - if already in city center, push out
                if (this.mapSystem && this.mapSystem.isInCityCenter(mob.x, mob.y)) {
                    const cityCenterWorldX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    const cityCenterWorldY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    
                    const pushAngle = Math.atan2(
                        mob.y - cityCenterWorldY,
                        mob.x - cityCenterWorldX
                    );
                    
                    const safeDistance = this.mapSystem.cityCenterRadius * this.mapSystem.tileSize + 30;
                    mob.x = cityCenterWorldX + Math.cos(pushAngle) * safeDistance;
                    mob.y = cityCenterWorldY + Math.sin(pushAngle) * safeDistance;
                    mobDx = 0;
                    mobDy = 0;
                }

                // Prevent mobs from entering inner river area while chasing
                if (this.mapSystem && this.mapSystem.isInsideInnerRiverArea(newX, newY)) {
                    const centerWX = this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    const centerWY = this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2;
                    const pushAngle = Math.atan2(newY - centerWY, newX - centerWX);
                    const safeR = (this.mapSystem.riverInnerRadius * this.mapSystem.tileSize) + 12;
                    if (Math.sqrt(Math.pow(newX - centerWX, 2) + Math.pow(newY - centerWY, 2)) < safeR * 0.98) {
                        mob.x = centerWX + Math.cos(pushAngle) * safeR;
                        mob.y = centerWY + Math.sin(pushAngle) * safeR;
                    }
                    mobDx = 0;
                    mobDy = 0;
                }
                
                mob.x += mobDx;
                mob.y += mobDy;
                mob.dx = mobDx;
                mob.dy = mobDy;

                // Attack player
                if (dist < 50) {
                    if (mob.targetCooldown <= 0) {
                        const damage = Math.max(1, mob.damage - this.player.defense);
                        this.player.hp -= damage;
                        this.showDamage(this.player.x, this.player.y - 40, damage);
                        mob.targetCooldown = 1000;

                        if (this.player.hp <= 0 && !this.isDead) {
                            this.handleDeath();
                        }

                        this.updateHUD();
                    }
                }
            }

            if (mob.targetCooldown > 0) {
                mob.targetCooldown -= 16;
            }
        });

        // Update drops
        this.drops.forEach(drop => {
            if (this.getDistance(this.player, drop) < 40) {
                this.pickupDrop(drop);
            }
        });

        // Update cooldowns
        this.player.skills.forEach(skill => {
            if (skill.cooldownRemaining > 0) {
                skill.cooldownRemaining -= 16;
            }
        });

        // Basic attack cooldown
        if (this.player.basicAttackCooldown > 0) {
            this.player.basicAttackCooldown -= 16;
        }

        // Combo timer (reset combo after 1 second)
        if (this.player.comboTimer > 0) {
            this.player.comboTimer -= 16;
        } else if (this.player.comboCount > 0) {
            this.player.comboCount = 0; // Reset combo
        }

        // MP regen
        if (this.player.mp < this.player.maxMP) {
            this.player.mp = Math.min(this.player.maxMP, this.player.mp + 0.1);
            if (Math.random() < 0.1) this.updateHUD();
        }

        // Update map system
        if (this.mapSystem) {
            this.mapSystem.update(deltaTime, this.player.x, this.player.y);
        }

        // Check merchant interaction
        if (this.mapSystem) {
            const distToMerchant = this.getDistance(
                this.player,
                { x: this.mapSystem.merchantX, y: this.mapSystem.merchantY }
            );
            if (distToMerchant < 50 && !this.merchantUI) {
                this.showMerchantUI();
            } else if (distToMerchant >= 50 && this.merchantUI) {
                this.hideMerchantUI();
            }
        }
    }

    draw() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;

        // Draw map first
        if (this.mapSystem) {
            this.mapSystem.draw(this.ctx, this.cameraX, this.cameraY);
        } else {
            // Fallback background
            this.ctx.fillStyle = '#1a1a2e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw death overlay if dead
        if (this.isDead) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Drops (screen space) - Use sprite icons
        this.drops.forEach(drop => {
            const screenX = drop.x - this.cameraX;
            const screenY = drop.y - this.cameraY;
            
            if (screenX > -50 && screenX < this.canvas.width + 50 &&
                screenY > -50 && screenY < this.canvas.height + 50) {
                // Draw item sprite
                this.spriteManager.drawItemIcon(
                    this.ctx,
                    drop.icon,
                    screenX,
                    screenY,
                    drop.size
                );
            }
        });

        // Mobs (world space)
        this.mobs.forEach((mob, index) => {
            const screenX = mob.x - this.cameraX;
            const screenY = mob.y - this.cameraY;
            
            // Only draw if on screen
            if (screenX > -100 && screenX < this.canvas.width + 100 &&
                screenY > -100 && screenY < this.canvas.height + 100) {
                
                const isMoving = Math.abs(mob.dx) > 0.1 || Math.abs(mob.dy) > 0.1;
                
                // Save context for world space drawing
                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.translate(-mob.x, -mob.y);
                
                this.spriteManager.drawMonster(
                    this.ctx,
                    mob.spriteType,
                    mob.x,
                    mob.y,
                    mob.dx,
                    mob.dy,
                    isMoving,
                    deltaTime,
                    index
                );
                
                this.ctx.restore();

                // HP bar (screen space)
                const barWidth = 50;
                const barHeight = 5;
                const hpPercent = mob.hp / mob.maxHP;

                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(screenX - barWidth/2, screenY - mob.size/2 - 15, barWidth, barHeight);

                this.ctx.fillStyle = hpPercent > 0.5 ? '#4ade80' : hpPercent > 0.25 ? '#fbbf24' : '#ef4444';
                this.ctx.fillRect(screenX - barWidth/2, screenY - mob.size/2 - 15, barWidth * hpPercent, barHeight);
            }
        });

        // Player (world space, but centered on screen)
        if (this.player) {
            const isMoving = Math.abs(this.playerDx) > 0.1 || Math.abs(this.playerDy) > 0.1;
            
            // Draw player at screen center (camera follows player)
            const screenX = this.canvas.width / 2;
            const screenY = this.canvas.height / 2;
            
            this.ctx.save();
            this.ctx.translate(screenX, screenY);
            this.ctx.translate(-this.player.x, -this.player.y);
            
            this.spriteManager.drawCharacter(
                this.ctx,
                this.player.spriteType,
                this.player.x,
                this.player.y,
                this.playerDx,
                this.playerDy,
                isMoving,
                deltaTime
            );
            
            this.ctx.restore();
        }
    }

    updateDeathUI() {
        if (!this.deathUI) return;
        
        const quickTimer = document.getElementById('quickTimer');
        const cityTimer = document.getElementById('cityTimer');
        const quickOption = document.getElementById('respawnQuick');
        const cityOption = document.getElementById('respawnCity');
        
        if (quickTimer) {
            const remaining = Math.max(0, 4 - Math.floor(this.deathTimer / 1000));
            quickTimer.textContent = remaining;
            
            if (remaining === 0) {
                quickOption.classList.add('ready');
            } else {
                quickOption.classList.remove('ready');
            }
        }
        
        if (cityTimer) {
            const remaining = Math.max(0, 6 - Math.floor(this.deathTimer / 1000));
            cityTimer.textContent = remaining;
            
            if (remaining === 0) {
                cityOption.classList.add('ready');
            } else {
                cityOption.classList.remove('ready');
            }
        }
    }

    updateHUD() {
        if (!this.player) return;

        document.getElementById('playerName').textContent = this.player.name;
        document.getElementById('playerLevel').textContent = `Seviye: ${this.player.level}`;

        const hpPercent = (this.player.hp / this.player.maxHP) * 100;
        const mpPercent = (this.player.mp / this.player.maxMP) * 100;
        const xpPercent = (this.player.xp / this.player.xpToLevel) * 100;

        document.getElementById('hpBar').style.width = hpPercent + '%';
        document.getElementById('mpBar').style.width = mpPercent + '%';
        document.getElementById('xpBar').style.width = xpPercent + '%';

        document.getElementById('hpText').textContent =
            `HP: ${Math.floor(this.player.hp)}/${this.player.maxHP}`;
        document.getElementById('mpText').textContent =
            `MP: ${Math.floor(this.player.mp)}/${this.player.maxMP}`;
        document.getElementById('xpText').textContent =
            `XP: ${this.player.xp}/${this.player.xpToLevel}`;

        // Update Shib coins display
        const shibDisplay = document.getElementById('shibCoins');
        if (shibDisplay) {
            shibDisplay.textContent = `Shib: ${this.player.shibCoins}`;
        }
        
        // Update mini map
        this.updateMiniMap();
    }

    // Basic attack (no mana cost) with combo system
    basicAttack() {
        if (!this.player) return;
        if (this.player.basicAttackCooldown > 0) return;

        this.player.basicAttackCooldown = 300; // 300ms cooldown for faster attacks
        this.player.comboTimer = 1000; // 1 second to maintain combo

        const nearestMob = this.findNearestMob();
        if (nearestMob) {
            const distance = this.getDistance(this.player, nearestMob);
            if (distance < 100) { // Attack range
                // Calculate combo damage
                let damage = this.player.damage;
                
                // Combo system: max 5 combos, each adds 3% damage
                if (this.player.comboCount > 0) {
                    const comboMultiplier = 1 + (this.player.comboCount * 0.03);
                    damage = Math.floor(damage * comboMultiplier);
                }

                // Increase combo count (max 5)
                if (this.player.comboCount < 5) {
                    this.player.comboCount++;
                }

                this.damageEnemy(nearestMob, damage);
                
                // Show combo notification
                if (this.player.comboCount > 1) {
                    this.showComboNotification(this.player.comboCount);
                }
            } else {
                // Miss - reset combo
                this.player.comboCount = 0;
            }
        } else {
            // No target - reset combo
            this.player.comboCount = 0;
        }
    }

    showComboNotification(combo) {
        // Create visual combo animation instead of text
        const comboCanvas = document.createElement('canvas');
        comboCanvas.width = 200;
        comboCanvas.height = 200;
        comboCanvas.className = 'combo-animation';
        comboCanvas.style.position = 'fixed';
        comboCanvas.style.left = (this.canvas.width / 2 - 100) + 'px';
        comboCanvas.style.top = (this.canvas.height / 2 - 100) + 'px';
        comboCanvas.style.pointerEvents = 'none';
        comboCanvas.style.zIndex = '2000';
        document.body.appendChild(comboCanvas);

        const ctx = comboCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Draw combo animation
        let frame = 0;
        const maxFrames = 60; // 1 second at 60fps

        const animate = () => {
            ctx.clearRect(0, 0, 200, 200);
            
            const progress = frame / maxFrames;
            const scale = 0.5 + progress * 0.5; // Scale from 0.5 to 1
            const alpha = 1 - progress; // Fade out
            
            ctx.save();
            ctx.translate(100, 100);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
            
            // Draw combo number with visual effects
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#ff6b00';
            ctx.lineWidth = 4;
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffd700';
            ctx.fillText(combo + 'x', 0, -20);
            ctx.strokeText(combo + 'x', 0, -20);
            
            // Draw "COMBO" text
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.fillText('COMBO', 0, 40);
            ctx.strokeText('COMBO', 0, 40);
            
            // Draw particles
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + progress * Math.PI * 2;
                const distance = 30 + progress * 50;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                ctx.fillStyle = `rgba(255, ${215 - i * 20}, 0, ${1 - progress})`;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            
            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                comboCanvas.remove();
            }
        };

        animate();
    }

    // Merchant UI
    showMerchantUI() {
        if (this.merchantUI) return;
        
        const merchantDiv = document.createElement('div');
        merchantDiv.id = 'merchantUI';
        merchantDiv.className = 'merchant-ui';
        merchantDiv.innerHTML = `
            <div class="merchant-header">Satıcı</div>
            <div class="merchant-item" data-item="HP">
                <div class="merchant-item-icon"></div>
                <div class="merchant-item-info">
                    <div class="merchant-item-name">Can İksiri</div>
                    <div class="merchant-item-price">10 Shib</div>
                </div>
            </div>
            <div class="merchant-item" data-item="MP">
                <div class="merchant-item-icon"></div>
                <div class="merchant-item-info">
                    <div class="merchant-item-name">Mana İksiri</div>
                    <div class="merchant-item-price">10 Shib</div>
                </div>
            </div>
        `;
        document.body.appendChild(merchantDiv);
        this.merchantUI = merchantDiv;

        // Draw item icons and add click handlers
        const items = merchantDiv.querySelectorAll('.merchant-item');
        items.forEach((item, index) => {
            const icon = item.querySelector('.merchant-item-icon');
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            const itemType = index === 0 ? 'HP' : 'MP';
            this.spriteManager.drawItemIcon(ctx, itemType, 16, 16, 32);
            icon.appendChild(canvas);
            
            // Add click handler
            item.onclick = () => this.buyItem(itemType);
        });
    }

    hideMerchantUI() {
        if (this.merchantUI) {
            this.merchantUI.remove();
            this.merchantUI = null;
        }
    }

    buyItem(itemType) {
        if (!this.player) return;

        const price = 10; // 10 Shib coins per potion
        if (this.player.shibCoins < price) {
            this.showNotification('Yetersiz Shib Coin!');
            return;
        }

        // Find empty inventory slot
        for (let i = 0; i < this.inventory.length; i++) {
            if (!this.inventory[i]) {
                this.player.shibCoins -= price;
                this.inventory[i] = {
                    name: itemType === 'HP' ? 'Can İksiri' : 'Mana İksiri',
                    icon: itemType,
                    type: 'potion',
                    heal: itemType === 'HP' ? 50 : 0,
                    mana: itemType === 'MP' ? 50 : 0
                };
                this.updateInventory();
                this.updateHUD();
                this.showNotification(`+1 ${this.inventory[i].name}`);
                break;
            }
        }
    }

    handleDeath() {
        this.isDead = true;
        this.deathX = this.player.x;
        this.deathY = this.player.y;
        this.deathTimer = 0;
        
        // Show death UI
        this.showDeathUI();
        
        // Stop player movement
        this.playerDx = 0;
        this.playerDy = 0;
        this.player.dx = 0;
        this.player.dy = 0;
    }

    showDeathUI() {
        if (this.deathUI) return;
        
        const deathDiv = document.createElement('div');
        deathDiv.id = 'deathUI';
        deathDiv.className = 'death-ui';
        deathDiv.innerHTML = `
            <div class="death-title">ÖLDÜN!</div>
            <div class="death-options">
                <div class="death-option" id="respawnQuick">
                    <div class="death-option-title">Hemen Doğ</div>
                    <div class="death-option-desc">4 saniye içinde</div>
                    <div class="death-option-timer" id="quickTimer">4</div>
                </div>
                <div class="death-option" id="respawnCity">
                    <div class="death-option-title">Şehir Merkezinde Doğ</div>
                    <div class="death-option-desc">6 saniye sonra</div>
                    <div class="death-option-timer" id="cityTimer">6</div>
                </div>
            </div>
        `;
        document.body.appendChild(deathDiv);
        this.deathUI = deathDiv;

        // Add click handlers
        document.getElementById('respawnQuick').onclick = () => this.respawnQuick();
        document.getElementById('respawnCity').onclick = () => this.respawnCity();
    }

    hideDeathUI() {
        if (this.deathUI) {
            this.deathUI.remove();
            this.deathUI = null;
        }
    }

    respawnQuick() {
        if (this.deathTimer < 4000) return; // Must wait 4 seconds
        
        this.respawn(this.deathX, this.deathY);
    }

    respawnCity() {
        if (this.deathTimer < 6000) return; // Must wait 6 seconds
        
        // Respawn at city center
        const spawnX = this.mapSystem ? 
            (this.mapSystem.cityCenterX * this.mapSystem.tileSize + this.mapSystem.tileSize / 2) : 
            this.canvas.width / 2;
        const spawnY = this.mapSystem ? 
            (this.mapSystem.cityCenterY * this.mapSystem.tileSize + this.mapSystem.tileSize / 2) : 
            this.canvas.height / 2;
        
        this.respawn(spawnX, spawnY);
    }

    // Check if respawn options are ready (no auto-respawn, player must choose)
    checkAutoRespawn() {
        // No auto-respawn - player must choose manually
        // This function just updates UI state
    }

    respawn(x, y) {
        this.isDead = false;
        this.deathTimer = 0;
        
        // Respawn player
        this.player.x = x;
        this.player.y = y;
        this.player.hp = this.player.maxHP;
        this.player.mp = this.player.maxMP;
        
        // Reset combo
        this.player.comboCount = 0;
        this.player.comboTimer = 0;
        
        // Update camera
        this.cameraX = this.player.x - this.canvas.width / 2;
        this.cameraY = this.player.y - this.canvas.height / 2;
        
        // Hide death UI
        this.hideDeathUI();
        
        // Update HUD
        this.updateHUD();
        this.updateMiniMap();
        
        this.showNotification('Yeniden Doğdun!');
    }

    gameOver() {
        // Legacy support - now uses respawn system
        this.handleDeath();
    }

    gameLoop() {
        try {
            if (this.player) {
                this.update();
                this.draw();
            }
            requestAnimationFrame(() => this.gameLoop());
        } catch (error) {
            console.error('Game loop error:', error);
            alert('Oyun hatası: ' + error.message);
        }
    }
}

// Initialize game
const game = new Game();

function selectCharacter(className) {
    game.selectCharacter(className);
}

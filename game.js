class Game {
    constructor() {
        this.player = {
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
            gold: 100,
            exp: 0,
            expNeeded: 100,
            x: 7,
            y: 7,
            inventory: [],
            equipped: {
                weapon: null,
                armor: null,
                accessory: null
            },
            potions: 3,
            storage: [],
            defeatedBosses: [] // Track which boss floors have been cleared
        };

        this.dungeon = {
            floor: 1,
            map: [],
            monsters: [],
            items: [],
            stairs: null,
            discovered: [],
            allEnemiesDefeated: false
        };

        this.monsterTypes = [
            { emoji: '🐀', name: 'Rat', baseHp: 20, baseAttack: 5, baseDefense: 2, expValue: 10 },
            { emoji: '🦇', name: 'Bat', baseHp: 25, baseAttack: 7, baseDefense: 3, expValue: 15 },
            { emoji: '🕷️', name: 'Spider', baseHp: 30, baseAttack: 8, baseDefense: 4, expValue: 20 },
            { emoji: '🐺', name: 'Wolf', baseHp: 40, baseAttack: 12, baseDefense: 5, expValue: 30 },
            { emoji: '👹', name: 'Goblin', baseHp: 50, baseAttack: 15, baseDefense: 7, expValue: 40 },
            { emoji: '🧟', name: 'Zombie', baseHp: 60, baseAttack: 18, baseDefense: 8, expValue: 50 },
            { emoji: '👻', name: 'Ghost', baseHp: 45, baseAttack: 20, baseDefense: 5, expValue: 60 },
            { emoji: '🦴', name: 'Skeleton', baseHp: 70, baseAttack: 22, baseDefense: 10, expValue: 70 },
            { emoji: '🧛', name: 'Vampire', baseHp: 80, baseAttack: 25, baseDefense: 12, expValue: 80 },
            { emoji: '🐉', name: 'Dragon', baseHp: 150, baseAttack: 40, baseDefense: 20, expValue: 200 }
        ];

        this.bossTypes = [
            { emoji: '🐀👑', name: 'Rat King', baseHp: 200, baseAttack: 30, baseDefense: 15, expValue: 500 },
            { emoji: '🕷️👑', name: 'Spider Queen', baseHp: 300, baseAttack: 40, baseDefense: 20, expValue: 750 },
            { emoji: '👺', name: 'Ogre Lord', baseHp: 400, baseAttack: 50, baseDefense: 25, expValue: 1000 },
            { emoji: '💀', name: 'Lich', baseHp: 500, baseAttack: 60, baseDefense: 30, expValue: 1500 },
            { emoji: '🧙‍♂️', name: 'Dark Wizard', baseHp: 600, baseAttack: 70, baseDefense: 35, expValue: 2000 },
            { emoji: '🦇🧛', name: 'Vampire Lord', baseHp: 800, baseAttack: 85, baseDefense: 40, expValue: 3000 },
            { emoji: '🐲', name: 'Ancient Dragon', baseHp: 1000, baseAttack: 100, baseDefense: 50, expValue: 4000 },
            { emoji: '👹🔥', name: 'Demon Prince', baseHp: 1200, baseAttack: 120, baseDefense: 60, expValue: 5000 },
            { emoji: '🌑', name: 'Shadow Lord', baseHp: 1500, baseAttack: 140, baseDefense: 70, expValue: 7000 },
            { emoji: '👑💀', name: 'Death Emperor', baseHp: 2000, baseAttack: 200, baseDefense: 100, expValue: 10000 }
        ];

        this.itemTypes = {
            weapons: [
                { emoji: '🗡️', name: 'Dagger', type: 'weapon', attack: 5, rarity: 'common' },
                { emoji: '⚔️', name: 'Sword', type: 'weapon', attack: 10, rarity: 'common' },
                { emoji: '🏹', name: 'Bow', type: 'weapon', attack: 8, rarity: 'common' },
                { emoji: '🔨', name: 'Hammer', type: 'weapon', attack: 15, rarity: 'rare' },
                { emoji: '🪓', name: 'Battle Axe', type: 'weapon', attack: 20, rarity: 'rare' },
                { emoji: '🔱', name: 'Trident', type: 'weapon', attack: 25, rarity: 'epic' },
                { emoji: '⚡', name: 'Lightning Staff', type: 'weapon', attack: 35, rarity: 'epic' },
                { emoji: '🌟', name: 'Celestial Blade', type: 'weapon', attack: 50, rarity: 'legendary' }
            ],
            armor: [
                { emoji: '👕', name: 'Cloth Shirt', type: 'armor', defense: 3, rarity: 'common' },
                { emoji: '🦺', name: 'Leather Vest', type: 'armor', defense: 5, rarity: 'common' },
                { emoji: '🛡️', name: 'Iron Shield', type: 'armor', defense: 10, rarity: 'rare' },
                { emoji: '🏛️', name: 'Knight Armor', type: 'armor', defense: 15, rarity: 'rare' },
                { emoji: '💎', name: 'Crystal Armor', type: 'armor', defense: 20, rarity: 'epic' },
                { emoji: '🌟', name: 'Celestial Robe', type: 'armor', defense: 30, rarity: 'legendary' }
            ],
            accessories: [
                { emoji: '💍', name: 'Ring', type: 'accessory', attack: 2, defense: 2, rarity: 'common' },
                { emoji: '📿', name: 'Amulet', type: 'accessory', hp: 20, rarity: 'common' },
                { emoji: '👑', name: 'Crown', type: 'accessory', attack: 5, defense: 5, rarity: 'rare' },
                { emoji: '🔮', name: 'Orb', type: 'accessory', attack: 10, rarity: 'epic' },
                { emoji: '✨', name: 'Divine Charm', type: 'accessory', attack: 10, defense: 10, hp: 50, rarity: 'legendary' }
            ]
        };

        this.inBattle = false;
        this.currentEnemy = null;
        this.currentView = 'town';
        this.monsterMoveInterval = null;
        this.autoSaveInterval = null;
        this.selectedFloor = null;

        // Load saved game if exists
        this.loadGame();
        
        this.init();
        this.setupKeyboardControls();
        this.setupAutoSave();
    }

    init() {
        if (this.currentView === 'dungeon' && this.dungeon.map.length > 0) {
            // If we loaded in the dungeon, render it
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById('dungeon-view').classList.add('active');
            this.renderDungeon();
            this.startMonsterMovement();
        } else {
            // Otherwise show town
            this.showTown();
        }
        
        this.updateStats();
        
        if (this.savedGameLoaded) {
            this.addMessage("🔄 Welcome back! Your progress has been restored.");
        } else {
            this.addMessage("🏘️ Welcome to the town! Prepare for your dungeon adventure!");
            this.addMessage("💡 Tip: Use WASD or click to move in the dungeon!");
        }
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveGame();
        }, 30000);

        // Save when tab is about to close
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }

    saveGame() {
        const saveData = {
            player: this.player,
            dungeon: {
                floor: this.dungeon.floor,
                map: this.dungeon.map,
                monsters: this.dungeon.monsters,
                items: this.dungeon.items,
                stairs: this.dungeon.stairs,
                discovered: this.dungeon.discovered,
                allEnemiesDefeated: this.dungeon.allEnemiesDefeated
            },
            currentView: this.currentView,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('emojiDungeonSave', JSON.stringify(saveData));
            // Don't show message for auto-saves, only manual ones if we add that feature
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    loadGame() {
        try {
            const savedData = localStorage.getItem('emojiDungeonSave');
            if (savedData) {
                const saveData = JSON.parse(savedData);
                
                // Restore player data
                this.player = saveData.player;
                
                // Ensure defeatedBosses exists for older saves
                if (!this.player.defeatedBosses) {
                    this.player.defeatedBosses = [];
                }
                
                // Restore dungeon data
                this.dungeon = saveData.dungeon;
                
                // Restore current view
                this.currentView = saveData.currentView || 'town';
                
                this.savedGameLoaded = true;
                
                // Recalculate stats to ensure equipment bonuses are applied
                this.recalculateStats();
            }
        } catch (e) {
            console.error('Failed to load saved game:', e);
            this.savedGameLoaded = false;
        }
    }

    deleteSave() {
        if (confirm('Are you sure you want to delete your saved game? This cannot be undone!')) {
            localStorage.removeItem('emojiDungeonSave');
            location.reload();
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Only allow movement in dungeon view and when not in battle
            if (this.currentView !== 'dungeon' || this.inBattle) return;

            let dx = 0, dy = 0;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                    dy = -1;
                    break;
                case 'a':
                    dx = -1;
                    break;
                case 's':
                    dy = 1;
                    break;
                case 'd':
                    dx = 1;
                    break;
                default:
                    return; // Exit if not a movement key
            }

            // Calculate new position
            const newX = this.player.x + dx;
            const newY = this.player.y + dy;

            // Move player to the new position
            this.movePlayer(newX, newY);
            
            // Prevent default browser behavior for these keys
            e.preventDefault();
        });
    }

    generateDungeon() {
        const size = 15;
        this.dungeon.map = [];
        this.dungeon.monsters = [];
        this.dungeon.items = [];
        this.dungeon.discovered = [];
        this.dungeon.allEnemiesDefeated = false;

        // Initialize map with all walls
        for (let y = 0; y < size; y++) {
            this.dungeon.map[y] = [];
            this.dungeon.discovered[y] = [];
            for (let x = 0; x < size; x++) {
                this.dungeon.map[y][x] = '#';
                this.dungeon.discovered[y][x] = false;
            }
        }

        // Generate rooms and corridors
        this.generateRoomsAndCorridors();
        
        // Ensure all floor tiles are connected
        this.ensureConnectivity();

        // Place stairs in a reachable location
        this.placeStairs();

        // Check if boss floor
        if (this.dungeon.floor % 10 === 0) {
            this.placeBoss();
        } else {
            // Place monsters
            const monsterCount = 5 + Math.floor(this.dungeon.floor / 10);
            for (let i = 0; i < monsterCount; i++) {
                this.placeMonster();
            }
        }

        // Place items
        const itemCount = 3 + Math.floor(this.dungeon.floor / 20);
        for (let i = 0; i < itemCount; i++) {
            this.placeItem();
        }

        // Reset player position
        this.player.x = 7;
        this.player.y = 7;

        // Start monster movement
        this.startMonsterMovement();

        // Save after generating new floor
        this.saveGame();
    }

    generateRoomsAndCorridors() {
        const size = 15;
        const rooms = [];
        const numRooms = 5 + Math.floor(Math.random() * 3);

        // Generate rooms
        for (let i = 0; i < numRooms; i++) {
            const roomWidth = 3 + Math.floor(Math.random() * 4);
            const roomHeight = 3 + Math.floor(Math.random() * 4);
            const x = 1 + Math.floor(Math.random() * (size - roomWidth - 2));
            const y = 1 + Math.floor(Math.random() * (size - roomHeight - 2));

            const room = { x, y, width: roomWidth, height: roomHeight };
            
            // Check if room overlaps with existing rooms
            let overlaps = false;
            for (const existingRoom of rooms) {
                if (this.roomsOverlap(room, existingRoom)) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                rooms.push(room);
                // Carve out the room
                for (let rx = x; rx < x + roomWidth; rx++) {
                    for (let ry = y; ry < y + roomHeight; ry++) {
                        this.dungeon.map[ry][rx] = '.';
                    }
                }
            }
        }

        // Ensure player starting position is in a room
        this.dungeon.map[7][7] = '.';
        
        // Connect rooms with corridors
        for (let i = 0; i < rooms.length - 1; i++) {
            const roomA = rooms[i];
            const roomB = rooms[i + 1];
            
            const startX = Math.floor(roomA.x + roomA.width / 2);
            const startY = Math.floor(roomA.y + roomA.height / 2);
            const endX = Math.floor(roomB.x + roomB.width / 2);
            const endY = Math.floor(roomB.y + roomB.height / 2);
            
            this.createCorridor(startX, startY, endX, endY);
        }

        // Connect first and last room to ensure no isolated areas
        if (rooms.length > 2) {
            const firstRoom = rooms[0];
            const lastRoom = rooms[rooms.length - 1];
            const startX = Math.floor(firstRoom.x + firstRoom.width / 2);
            const startY = Math.floor(firstRoom.y + firstRoom.height / 2);
            const endX = Math.floor(lastRoom.x + lastRoom.width / 2);
            const endY = Math.floor(lastRoom.y + lastRoom.height / 2);
            this.createCorridor(startX, startY, endX, endY);
        }

        // Connect player position to nearest room
        if (rooms.length > 0) {
            const nearestRoom = rooms[0];
            const roomCenterX = Math.floor(nearestRoom.x + nearestRoom.width / 2);
            const roomCenterY = Math.floor(nearestRoom.y + nearestRoom.height / 2);
            this.createCorridor(7, 7, roomCenterX, roomCenterY);
        }
    }

    roomsOverlap(roomA, roomB) {
        const padding = 1; // Add padding to prevent rooms from touching
        return !(roomA.x + roomA.width + padding <= roomB.x ||
                 roomB.x + roomB.width + padding <= roomA.x ||
                 roomA.y + roomA.height + padding <= roomB.y ||
                 roomB.y + roomB.height + padding <= roomA.y);
    }

    createCorridor(startX, startY, endX, endY) {
        let x = startX;
        let y = startY;

        // Create L-shaped corridor
        if (Math.random() < 0.5) {
            // Horizontal first, then vertical
            while (x !== endX) {
                this.dungeon.map[y][x] = '.';
                x += x < endX ? 1 : -1;
            }
            while (y !== endY) {
                this.dungeon.map[y][x] = '.';
                y += y < endY ? 1 : -1;
            }
        } else {
            // Vertical first, then horizontal
            while (y !== endY) {
                this.dungeon.map[y][x] = '.';
                y += y < endY ? 1 : -1;
            }
            while (x !== endX) {
                this.dungeon.map[y][x] = '.';
                x += x < endX ? 1 : -1;
            }
        }
        this.dungeon.map[endY][endX] = '.';
    }

    ensureConnectivity() {
        // Flood fill from player position to find all reachable tiles
        const size = 15;
        const visited = [];
        for (let y = 0; y < size; y++) {
            visited[y] = new Array(size).fill(false);
        }

        const reachableTiles = [];
        const queue = [{ x: 7, y: 7 }];
        visited[7][7] = true;

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            reachableTiles.push({ x, y });

            const directions = [
                { dx: 0, dy: -1 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 }
            ];

            for (const { dx, dy } of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < size && ny >= 0 && ny < size &&
                    !visited[ny][nx] && this.dungeon.map[ny][nx] === '.') {
                    visited[ny][nx] = true;
                    queue.push({ x: nx, y: ny });
                }
            }
        }

        // Store reachable tiles for later use
        this.reachableTiles = reachableTiles;
    }

    getRandomReachableTile() {
        if (!this.reachableTiles || this.reachableTiles.length === 0) {
            // Fallback to any floor tile
            const floorTiles = [];
            for (let y = 0; y < 15; y++) {
                for (let x = 0; x < 15; x++) {
                    if (this.dungeon.map[y][x] === '.') {
                        floorTiles.push({ x, y });
                    }
                }
            }
            if (floorTiles.length > 0) {
                return floorTiles[Math.floor(Math.random() * floorTiles.length)];
            }
            return { x: 7, y: 7 }; // Last resort
        }
        
        return this.reachableTiles[Math.floor(Math.random() * this.reachableTiles.length)];
    }

    placeStairs() {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const tile = this.getRandomReachableTile();
            if (tile.x !== this.player.x || tile.y !== this.player.y) {
                this.dungeon.stairs = { x: tile.x, y: tile.y };
                placed = true;
            }
            attempts++;
        }

        // Fallback - place stairs at first available reachable tile
        if (!placed) {
            for (const tile of this.reachableTiles) {
                if (tile.x !== this.player.x || tile.y !== this.player.y) {
                    this.dungeon.stairs = { x: tile.x, y: tile.y };
                    break;
                }
            }
        }
    }

    placeMonster() {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const tile = this.getRandomReachableTile();
            if ((tile.x !== this.player.x || tile.y !== this.player.y) && !this.getMonsterAt(tile.x, tile.y)) {
                const monsterType = this.getMonsterForFloor();
                const monster = {
                    ...monsterType,
                    x: tile.x,
                    y: tile.y,
                    hp: Math.floor(monsterType.baseHp * (1 + this.dungeon.floor / 20)),
                    maxHp: Math.floor(monsterType.baseHp * (1 + this.dungeon.floor / 20)),
                    attack: Math.floor(monsterType.baseAttack * (1 + this.dungeon.floor / 15)),
                    defense: Math.floor(monsterType.baseDefense * (1 + this.dungeon.floor / 25))
                };
                this.dungeon.monsters.push(monster);
                placed = true;
            }
            attempts++;
        }
    }

    placeBoss() {
        const bossIndex = Math.floor((this.dungeon.floor / 10) - 1);
        const bossType = this.bossTypes[Math.min(bossIndex, this.bossTypes.length - 1)];
        
        // Find a suitable location for the boss (not too close to player start)
        let bossX = 7, bossY = 7;
        let bestDistance = 0;
        
        for (const tile of this.reachableTiles) {
            const distance = Math.abs(tile.x - 7) + Math.abs(tile.y - 7);
            if (distance > bestDistance && distance > 5) {
                bestDistance = distance;
                bossX = tile.x;
                bossY = tile.y;
            }
        }
        
        const boss = {
            ...bossType,
            x: bossX,
            y: bossY,
            hp: Math.floor(bossType.baseHp * (1 + this.dungeon.floor / 50)),
            maxHp: Math.floor(bossType.baseHp * (1 + this.dungeon.floor / 50)),
            attack: Math.floor(bossType.baseAttack * (1 + this.dungeon.floor / 30)),
            defense: Math.floor(bossType.baseDefense * (1 + this.dungeon.floor / 40)),
            isBoss: true
        };
        this.dungeon.monsters.push(boss);
    }

    getMonsterForFloor() {
        const tier = Math.min(Math.floor(this.dungeon.floor / 10), this.monsterTypes.length - 1);
        const availableMonsters = this.monsterTypes.slice(0, tier + 1);
        return availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
    }

    placeItem() {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const tile = this.getRandomReachableTile();
            if (!this.getItemAt(tile.x, tile.y)) {
                const item = this.generateItem();
                this.dungeon.items.push({ ...item, x: tile.x, y: tile.y });
                placed = true;
            }
            attempts++;
        }
    }

    generateItem() {
        const allItems = [
            ...this.itemTypes.weapons,
            ...this.itemTypes.armor,
            ...this.itemTypes.accessories
        ];

        // Rarity chances based on floor
        const rarityChance = Math.random() * 100;
        let rarity;
        if (this.dungeon.floor < 20) {
            rarity = rarityChance < 80 ? 'common' : 'rare';
        } else if (this.dungeon.floor < 50) {
            rarity = rarityChance < 50 ? 'common' : rarityChance < 85 ? 'rare' : 'epic';
        } else {
            rarity = rarityChance < 30 ? 'common' : rarityChance < 60 ? 'rare' : rarityChance < 85 ? 'epic' : 'legendary';
        }

        const itemsOfRarity = allItems.filter(item => item.rarity === rarity);
        const baseItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];

        // Scale item stats based on floor
        const scaleFactor = 1 + (this.dungeon.floor / 50);
        const item = { ...baseItem };
        
        if (item.attack) item.attack = Math.floor(item.attack * scaleFactor);
        if (item.defense) item.defense = Math.floor(item.defense * scaleFactor);
        if (item.hp) item.hp = Math.floor(item.hp * scaleFactor);

        // Set value based on rarity and floor
        const baseValues = { common: 50, rare: 150, epic: 500, legendary: 1500 };
        item.value = Math.floor(baseValues[rarity] * scaleFactor);

        return item;
    }

    startMonsterMovement() {
        if (this.monsterMoveInterval) {
            clearInterval(this.monsterMoveInterval);
        }

        this.monsterMoveInterval = setInterval(() => {
            if (this.currentView === 'dungeon' && !this.inBattle) {
                this.moveMonsters();
            }
        }, 1000);
    }

    moveMonsters() {
        this.dungeon.monsters.forEach(monster => {
            if (!monster.isBoss) {
                const directions = [
                    { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 }
                ];

                const validMoves = directions.filter(dir => {
                    const newX = monster.x + dir.dx;
                    const newY = monster.y + dir.dy;
                    return newX >= 0 && newX < 15 && newY >= 0 && newY < 15 &&
                           this.dungeon.map[newY][newX] === '.' &&
                           !this.getMonsterAt(newX, newY) &&
                           (newX !== this.player.x || newY !== this.player.y);
                });

                if (validMoves.length > 0) {
                    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                    monster.x += move.dx;
                    monster.y += move.dy;
                }
            }
        });

        this.renderDungeon();
    }

    checkAllEnemiesDefeated() {
        if (this.dungeon.monsters.length === 0) {
            this.dungeon.allEnemiesDefeated = true;
            this.addMessage("✅ All enemies on this floor have been defeated! You can now proceed to the next floor.");
            this.saveGame();
        }
    }

    renderDungeon() {
        const mapDiv = document.getElementById('dungeon-map');
        mapDiv.innerHTML = '';

        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                // Fog of war
                const distance = Math.abs(x - this.player.x) + Math.abs(y - this.player.y);
                if (distance <= 3) {
                    this.dungeon.discovered[y][x] = true;
                }

                if (!this.dungeon.discovered[y][x]) {
                    tile.style.background = '#000';
                } else if (x === this.player.x && y === this.player.y) {
                    tile.textContent = '🧙';
                    tile.classList.add('current');
                } else if (this.dungeon.map[y][x] === '#') {
                    tile.classList.add('wall');
                } else {
                    const monster = this.getMonsterAt(x, y);
                    const item = this.getItemAt(x, y);
                    
                    if (monster && distance <= 3) {
                        tile.textContent = monster.emoji;
                    } else if (item && distance <= 3) {
                        tile.textContent = '📦';
                    } else if (this.dungeon.stairs && x === this.dungeon.stairs.x && y === this.dungeon.stairs.y) {
                        if (this.dungeon.allEnemiesDefeated) {
                            tile.textContent = '🪜';
                            tile.style.filter = 'none';
                        } else {
                            tile.textContent = '🔒';
                            tile.style.filter = 'grayscale(1)';
                        }
                    }
                    
                    tile.classList.add('visited');
                }

                tile.onclick = () => this.movePlayer(x, y);
                mapDiv.appendChild(tile);
            }
        }

        // Update floor info with enemy count
        const remainingEnemies = this.dungeon.monsters.length;
        document.getElementById('enemy-count').textContent = remainingEnemies;
    }

    movePlayer(targetX, targetY) {
        if (this.inBattle) return;

        const dx = targetX - this.player.x;
        const dy = targetY - this.player.y;
        
        // Only allow movement to adjacent tiles
        if (Math.abs(dx) + Math.abs(dy) !== 1) return;
        
        // Check if target is within bounds
        if (targetX < 0 || targetX >= 15 || targetY < 0 || targetY >= 15) return;
        
        // Check if target is walkable
        if (this.dungeon.map[targetY][targetX] === '#') return;

        // Check for monster
        const monster = this.getMonsterAt(targetX, targetY);
        if (monster) {
            this.startBattle(monster);
            return;
        }

        // Move player
        this.player.x = targetX;
        this.player.y = targetY;

        // Check for items
        const item = this.getItemAt(targetX, targetY);
        if (item) {
            this.showLoot(item);
        }

        // Check for stairs
        if (this.dungeon.stairs && targetX === this.dungeon.stairs.x && targetY === this.dungeon.stairs.y) {
            if (this.dungeon.allEnemiesDefeated) {
                this.nextFloor();
            } else {
                this.addMessage("🔒 The stairs are locked! Defeat all enemies on this floor first.");
            }
        }

        this.renderDungeon();
        this.saveGame();
    }

    getMonsterAt(x, y) {
        return this.dungeon.monsters.find(m => m.x === x && m.y === y);
    }

    getItemAt(x, y) {
        return this.dungeon.items.find(i => i.x === x && i.y === y);
    }

    startBattle(monster) {
        this.inBattle = true;
        this.currentEnemy = monster;
        
        if (monster.isBoss) {
            this.addMessage(`⚔️ Boss battle with ${monster.name}!`);
        } else {
            this.addMessage(`⚔️ Battle with ${monster.name}!`);
        }

        document.getElementById('enemy-emoji').textContent = monster.emoji;
        document.getElementById('enemy-name').textContent = monster.name;
        document.getElementById('battle-enemy-hp').textContent = monster.hp;
        document.getElementById('battle-player-hp').textContent = this.player.hp;
        
        document.getElementById('battle-modal').classList.add('active');
    }

    attack() {
        if (!this.currentEnemy) return;

        // Player attacks
        const playerDamage = Math.max(1, this.player.attack - this.currentEnemy.defense);
        this.currentEnemy.hp -= playerDamage;
        this.addMessage(`⚔️ You deal ${playerDamage} damage!`);

        if (this.currentEnemy.hp <= 0) {
            this.winBattle();
            return;
        }

        // Enemy attacks
        const enemyDamage = Math.max(1, this.currentEnemy.attack - this.player.defense);
        this.player.hp -= enemyDamage;
        this.addMessage(`💥 ${this.currentEnemy.name} deals ${enemyDamage} damage!`);

        this.updateStats();
        document.getElementById('battle-enemy-hp').textContent = this.currentEnemy.hp;
        document.getElementById('battle-player-hp').textContent = this.player.hp;

        if (this.player.hp <= 0) {
            this.gameOver();
        }
    }

    flee() {
        if (Math.random() < 0.5) {
            this.addMessage("🏃 You fled successfully!");
            this.inBattle = false;
            document.getElementById('battle-modal').classList.remove('active');
            
            // Move player back
            const directions = [
                { dx: 0, dy: -1 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 }
            ];
            
            for (const dir of directions) {
                const newX = this.player.x + dir.dx;
                const newY = this.player.y + dir.dy;
                if (newX >= 0 && newX < 15 && newY >= 0 && newY < 15 && 
                    this.dungeon.map[newY][newX] === '.' && !this.getMonsterAt(newX, newY)) {
                    this.player.x = newX;
                    this.player.y = newY;
                    break;
                }
            }
            
            this.renderDungeon();
            this.saveGame();
        } else {
            this.addMessage("❌ Failed to flee!");
            this.attack(); // Enemy gets free attack
        }
    }

    winBattle() {
        const expGained = this.currentEnemy.expValue;
        const goldGained = Math.floor(this.currentEnemy.expValue * (1 + this.dungeon.floor / 10));
        const wasBoss = this.currentEnemy.isBoss;
        
        this.player.exp += expGained;
        this.player.gold += goldGained;
        
        this.addMessage(`✨ Victory! Gained ${expGained} EXP and ${goldGained} gold!`);
        
        // Remove monster
        const index = this.dungeon.monsters.indexOf(this.currentEnemy);
        this.dungeon.monsters.splice(index, 1);
        
        // Check if all enemies defeated
        this.checkAllEnemiesDefeated();
        
        // If it was a boss, add this floor to defeated bosses
        if (wasBoss && !this.player.defeatedBosses.includes(this.dungeon.floor)) {
            this.player.defeatedBosses.push(this.dungeon.floor);
            this.addMessage(`🏆 Boss defeated! You can now start from floor ${this.dungeon.floor} when entering the dungeon!`);
        }
        
        // Check level up
        while (this.player.exp >= this.player.expNeeded) {
            this.levelUp();
        }
        
        // Chance for item drop
        if (Math.random() < 0.3 + (wasBoss ? 0.4 : 0)) {
            const item = this.generateItem();
            this.showLoot(item);
        } else {
            this.inBattle = false;
            document.getElementById('battle-modal').classList.remove('active');
        }
        
        this.updateStats();
        this.renderDungeon();
        this.saveGame();
    }

    levelUp() {
        this.player.level++;
        this.player.exp -= this.player.expNeeded;
        this.player.expNeeded = Math.floor(this.player.expNeeded * 1.5);
        
        const hpGain = 20;
        const attackGain = 3;
        const defenseGain = 2;
        
        this.player.maxHp += hpGain;
        this.player.hp = this.player.maxHp;
        this.player.attack += attackGain;
        this.player.defense += defenseGain;
        
        this.addMessage(`🎉 Level up! You are now level ${this.player.level}!`);
    }

    showLoot(item) {
        document.getElementById('loot-info').innerHTML = `
            <div class="item-card ${item.rarity}">
                <div>${item.emoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.attack ? `⚔️ Attack: +${item.attack}` : ''}
                    ${item.defense ? `🛡️ Defense: +${item.defense}` : ''}
                    ${item.hp ? `❤️ HP: +${item.hp}` : ''}
                    <br>💰 Value: ${item.value} gold
                </div>
            </div>
        `;
        
        this.currentLoot = item;
        document.getElementById('battle-modal').classList.remove('active');
        document.getElementById('loot-modal').classList.add('active');
    }

    takeLoot() {
        if (this.player.inventory.length < 20) {
            this.player.inventory.push(this.currentLoot);
            this.addMessage(`📦 Picked up ${this.currentLoot.name}!`);
            
            // Remove from dungeon
            const index = this.dungeon.items.findIndex(i => 
                i.x === this.currentLoot.x && i.y === this.currentLoot.y
            );
            if (index !== -1) {
                this.dungeon.items.splice(index, 1);
            }
        } else {
            this.addMessage("❌ Inventory full!");
        }
        
        this.inBattle = false;
        document.getElementById('loot-modal').classList.remove('active');
        this.renderDungeon();
        this.saveGame();
    }

    leaveLoot() {
        this.inBattle = false;
        document.getElementById('loot-modal').classList.remove('active');
    }

    usePotion() {
        if (this.player.potions > 0 && this.player.hp < this.player.maxHp) {
            const healing = 50;
            this.player.hp = Math.min(this.player.hp + healing, this.player.maxHp);
            this.player.potions--;
            this.addMessage(`🧪 Used potion! Healed ${healing} HP!`);
            this.updateStats();
            this.saveGame();
        } else if (this.player.potions === 0) {
            this.addMessage("❌ No potions left!");
        } else {
            this.addMessage("❌ Already at full health!");
        }
    }

    nextFloor() {
        this.dungeon.floor++;
        this.addMessage(`🪜 Descended to floor ${this.dungeon.floor}!`);
        
        if (this.dungeon.floor % 10 === 0) {
            this.showBossWarning();
        } else {
            this.generateDungeon();
            this.renderDungeon();
        }
        
        document.getElementById('current-floor').textContent = this.dungeon.floor;
    }

    showBossWarning() {
        const bossIndex = Math.floor((this.dungeon.floor / 10) - 1);
        const bossType = this.bossTypes[Math.min(bossIndex, this.bossTypes.length - 1)];
        
        document.getElementById('boss-preview').textContent = bossType.emoji;
        document.getElementById('boss-modal').classList.add('active');
    }

    enterBossFloor() {
        document.getElementById('boss-modal').classList.remove('active');
        this.generateDungeon();
        this.renderDungeon();
    }

    fleeBossFloor() {
        document.getElementById('boss-modal').classList.remove('active');
        this.dungeon.floor--;
        document.getElementById('current-floor').textContent = this.dungeon.floor;
    }

    showInventory() {
        this.currentView = 'inventory';
        this.renderInventory();
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('inventory-view').classList.add('active');
    }

    renderInventory() {
        // Render equipped items
        ['weapon', 'armor', 'accessory'].forEach(slot => {
            const item = this.player.equipped[slot];
            const slotDiv = document.getElementById(`equipped-${slot}`);
            
            if (item) {
                slotDiv.innerHTML = `
                    <div class="item-card ${item.rarity}" onclick="game.unequip('${slot}')">
                        <div>${item.emoji} ${item.name}</div>
                        <div class="item-stats">
                            ${item.attack ? `⚔️ +${item.attack}` : ''}
                            ${item.defense ? `🛡️ +${item.defense}` : ''}
                            ${item.hp ? `❤️ +${item.hp}` : ''}
                        </div>
                    </div>
                `;
            } else {
                slotDiv.textContent = 'Empty';
            }
        });

        // Render inventory items
        const inventoryDiv = document.getElementById('inventory-items');
        inventoryDiv.innerHTML = '<h3>🎒 Backpack</h3>';
        
        this.player.inventory.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = `item-card ${item.rarity}`;
            itemCard.innerHTML = `
                <div>${item.emoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.attack ? `⚔️ +${item.attack}` : ''}
                    ${item.defense ? `🛡️ +${item.defense}` : ''}
                    ${item.hp ? `❤️ +${item.hp}` : ''}
                    <br>💰 ${item.value} gold
                </div>
            `;
            itemCard.onclick = () => this.equipItem(index);
            inventoryDiv.appendChild(itemCard);
        });
    }

    equipItem(index) {
        const item = this.player.inventory[index];
        const slot = item.type;
        
        // Unequip current item if any
        if (this.player.equipped[slot]) {
            this.player.inventory.push(this.player.equipped[slot]);
        }
        
        // Equip new item
        this.player.equipped[slot] = item;
        this.player.inventory.splice(index, 1);
        
        this.recalculateStats();
        this.renderInventory();
        this.addMessage(`✅ Equipped ${item.name}!`);
        this.saveGame();
    }

    unequip(slot) {
        const item = this.player.equipped[slot];
        if (item && this.player.inventory.length < 20) {
            this.player.inventory.push(item);
            this.player.equipped[slot] = null;
            this.recalculateStats();
            this.renderInventory();
            this.addMessage(`📦 Unequipped ${item.name}`);
            this.saveGame();
        }
    }

    recalculateStats() {
        // Reset to base stats
        const baseStats = {
            attack: 10 + (this.player.level - 1) * 3,
            defense: 5 + (this.player.level - 1) * 2,
            maxHp: 100 + (this.player.level - 1) * 20
        };

        // Add equipment bonuses
        Object.values(this.player.equipped).forEach(item => {
            if (item) {
                if (item.attack) baseStats.attack += item.attack;
                if (item.defense) baseStats.defense += item.defense;
                if (item.hp) baseStats.maxHp += item.hp;
            }
        });

        this.player.attack = baseStats.attack;
        this.player.defense = baseStats.defense;
        this.player.maxHp = baseStats.maxHp;
        
        this.updateStats();
    }

    closeInventory() {
        this.currentView = 'dungeon';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('dungeon-view').classList.add('active');
    }

    returnToTown() {
        if (this.inBattle) {
            this.addMessage("❌ Cannot return to town during battle!");
            return;
        }
        
        clearInterval(this.monsterMoveInterval);
        this.showTown();
        this.saveGame();
    }

    showTown() {
        this.currentView = 'town';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('town-view').classList.add('active');
        this.addMessage("🏘️ Returned to town");
    }

    showFloorSelection() {
        // Create floor selection modal content
        let floorOptions = '<option value="1">Floor 1 - Starting Floor</option>';
        
        // Add defeated boss floors
        this.player.defeatedBosses.sort((a, b) => a - b).forEach(floor => {
            const bossIndex = Math.floor((floor / 10) - 1);
            const bossName = this.bossTypes[Math.min(bossIndex, this.bossTypes.length - 1)].name;
            floorOptions += `<option value="${floor}">Floor ${floor} - ${bossName} Defeated</option>`;
        });

        const floorSelectionHtml = `
            <div style="text-align: center; padding: 20px;">
                <h3>🏰 Select Starting Floor</h3>
                <select id="floor-select" style="
                    padding: 10px;
                    font-size: 16px;
                    margin: 20px 0;
                    background: #0f3460;
                    color: white;
                    border: 2px solid #e94560;
                    border-radius: 5px;
                    width: 80%;
                ">
                    ${floorOptions}
                </select>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="game.enterDungeonAtFloor()">Enter Dungeon</button>
                    <button onclick="game.cancelFloorSelection()">Cancel</button>
                </div>
            </div>
        `;

        // Create and show the modal
        const modal = document.createElement('div');
        modal.id = 'floor-selection-modal';
        modal.className = 'modal active';
        modal.innerHTML = `<div class="modal-content">${floorSelectionHtml}</div>`;
        document.body.appendChild(modal);
    }

    enterDungeonAtFloor() {
        const selectedFloor = parseInt(document.getElementById('floor-select').value);
        this.dungeon.floor = selectedFloor;
        
        // Remove the modal
        const modal = document.getElementById('floor-selection-modal');
        if (modal) modal.remove();
        
        // Enter the dungeon
        this.currentView = 'dungeon';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('dungeon-view').classList.add('active');
        
        this.generateDungeon();
        this.renderDungeon();
        this.addMessage(`🏰 Entered dungeon at floor ${this.dungeon.floor}`);
        this.saveGame();
    }

    cancelFloorSelection() {
        const modal = document.getElementById('floor-selection-modal');
        if (modal) modal.remove();
    }

    enterDungeon() {
        // If player has defeated bosses, show floor selection
        if (this.player.defeatedBosses && this.player.defeatedBosses.length > 0) {
            this.showFloorSelection();
        } else {
            // Otherwise, start at floor 1 as normal
            this.currentView = 'dungeon';
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById('dungeon-view').classList.add('active');
            
            if (!this.dungeon.map.length) {
                this.dungeon.floor = 1;
                this.generateDungeon();
            }
            
            this.renderDungeon();
            this.addMessage(`🏰 Entered dungeon floor ${this.dungeon.floor}`);
            this.saveGame();
        }
    }

    enterShop() {
        this.currentView = 'shop';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('shop-view').classList.add('active');
        this.renderShop();
    }

    renderShop() {
        const shopItemsDiv = document.getElementById('shop-items');
        shopItemsDiv.innerHTML = '<h3>🛒 For Sale</h3>';
        
        // Generate shop items
        const shopItems = [];
        for (let i = 0; i < 6; i++) {
            shopItems.push(this.generateItem());
        }
        
        shopItems.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = `item-card ${item.rarity}`;
            itemCard.innerHTML = `
                <div>${item.emoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.attack ? `⚔️ +${item.attack}` : ''}
                    ${item.defense ? `🛡️ +${item.defense}` : ''}
                    ${item.hp ? `❤️ +${item.hp}` : ''}
                    <br>💰 ${Math.floor(item.value * 1.5)} gold
                </div>
            `;
            itemCard.onclick = () => this.buyItem(item, Math.floor(item.value * 1.5));
            shopItemsDiv.appendChild(itemCard);
        });

        // Render sellable items
        const sellItemsDiv = document.getElementById('sellable-items');
        sellItemsDiv.innerHTML = '';
        
        this.player.inventory.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = `item-card ${item.rarity}`;
            itemCard.innerHTML = `
                <div>${item.emoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.attack ? `⚔️ +${item.attack}` : ''}
                    ${item.defense ? `🛡️ +${item.defense}` : ''}
                    ${item.hp ? `❤️ +${item.hp}` : ''}
                    <br>💰 Sell: ${item.value} gold
                </div>
            `;
            itemCard.onclick = () => this.sellItem(index);
            sellItemsDiv.appendChild(itemCard);
        });
    }

    buyItem(item, price) {
        if (this.player.gold >= price && this.player.inventory.length < 20) {
            this.player.gold -= price;
            this.player.inventory.push(item);
            this.addMessage(`✅ Bought ${item.name} for ${price} gold!`);
            this.updateStats();
            this.renderShop();
            this.saveGame();
        } else if (this.player.gold < price) {
            this.addMessage("❌ Not enough gold!");
        } else {
            this.addMessage("❌ Inventory full!");
        }
    }

    sellItem(index) {
        const item = this.player.inventory[index];
        this.player.gold += item.value;
        this.player.inventory.splice(index, 1);
        this.addMessage(`💰 Sold ${item.name} for ${item.value} gold!`);
        this.updateStats();
        this.renderShop();
        this.saveGame();
    }

    enterInn() {
        this.currentView = 'inn';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('inn-view').classList.add('active');
    }

    restAtInn() {
        if (this.player.gold >= 50) {
            this.player.gold -= 50;
            this.player.hp = this.player.maxHp;
            this.addMessage("💤 You feel refreshed! HP fully restored!");
            this.updateStats();
            this.saveGame();
        } else {
            this.addMessage("❌ Not enough gold!");
        }
    }

    buyPotion() {
        if (this.player.gold >= 30) {
            this.player.gold -= 30;
            this.player.potions++;
            this.addMessage("🧪 Bought a potion!");
            this.updateStats();
            this.saveGame();
        } else {
            this.addMessage("❌ Not enough gold!");
        }
    }

    enterQuarters() {
        this.currentView = 'quarters';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('quarters-view').classList.add('active');
        this.renderStorage();
    }

    renderStorage() {
        const storageDiv = document.getElementById('storage-items');
        storageDiv.innerHTML = '';
        
        this.player.storage.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = `item-card ${item.rarity}`;
            itemCard.innerHTML = `
                <div>${item.emoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.attack ? `⚔️ +${item.attack}` : ''}
                    ${item.defense ? `🛡️ +${item.defense}` : ''}
                    ${item.hp ? `❤️ +${item.hp}` : ''}
                </div>
            `;
            itemCard.onclick = () => this.retrieveFromStorage(index);
            storageDiv.appendChild(itemCard);
        });

        // Add store button for inventory items
        if (this.player.inventory.length > 0) {
            const storeButton = document.createElement('button');
            storeButton.textContent = '📦 Store Items from Inventory';
            storeButton.onclick = () => this.storeItems();
            storageDiv.appendChild(storeButton);
        }

        // Add delete save button
        const deleteSaveButton = document.createElement('button');
        deleteSaveButton.textContent = '🗑️ Delete Save Game';
        deleteSaveButton.style.background = '#dc3545';
        deleteSaveButton.style.marginTop = '20px';
        deleteSaveButton.onclick = () => this.deleteSave();
        storageDiv.appendChild(deleteSaveButton);
    }

    storeItems() {
        // Simple implementation - stores first item
        if (this.player.inventory.length > 0 && this.player.storage.length < 50) {
            const item = this.player.inventory.shift();
            this.player.storage.push(item);
            this.addMessage(`📦 Stored ${item.name} in quarters`);
            this.renderStorage();
            this.saveGame();
        }
    }

    retrieveFromStorage(index) {
        if (this.player.inventory.length < 20) {
            const item = this.player.storage[index];
            this.player.inventory.push(item);
            this.player.storage.splice(index, 1);
            this.addMessage(`📦 Retrieved ${item.name} from storage`);
            this.renderStorage();
            this.saveGame();
        } else {
            this.addMessage("❌ Inventory full!");
        }
    }

    gameOver() {
        this.addMessage("💀 You have been defeated!");
        
        // Close battle modal
        document.getElementById('battle-modal').classList.remove('active');
        
        // Reset player HP to 1
        this.player.hp = 1;
        
        // Lose half gold as penalty
        const goldLost = Math.floor(this.player.gold / 2);
        this.player.gold -= goldLost;
        this.addMessage(`💸 Lost ${goldLost} gold...`);
        
        // Clear dungeon state
        this.dungeon.map = [];
        this.dungeon.monsters = [];
        this.dungeon.items = [];
        this.dungeon.discovered = [];
        this.dungeon.allEnemiesDefeated = false;
        this.inBattle = false;
        this.currentEnemy = null;
        
        // Clear monster movement interval
        if (this.monsterMoveInterval) {
            clearInterval(this.monsterMoveInterval);
        }
        
        // Return to town
        this.showTown();
        this.addMessage("🏘️ You wake up in the town inn, barely alive...");
        this.addMessage("💡 Visit the inn to heal before returning to the dungeon!");
        
        this.updateStats();
        this.saveGame();
    }

    updateStats() {
        document.getElementById('player-level').textContent = this.player.level;
        document.getElementById('player-hp').textContent = this.player.hp;
        document.getElementById('player-max-hp').textContent = this.player.maxHp;
        document.getElementById('player-attack').textContent = this.player.attack;
        document.getElementById('player-defense').textContent = this.player.defense;
        document.getElementById('player-gold').textContent = this.player.gold;
        document.getElementById('player-exp').textContent = this.player.exp;
        document.getElementById('exp-needed').textContent = this.player.expNeeded;
        document.getElementById('potion-count').textContent = this.player.potions;
        if (document.getElementById('current-floor')) {
            document.getElementById('current-floor').textContent = this.dungeon.floor;
        }
        if (document.getElementById('enemy-count')) {
            document.getElementById('enemy-count').textContent = this.dungeon.monsters.length;
        }
    }

    addMessage(text) {
        const messagesDiv = document.getElementById('messages');
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        messagesDiv.appendChild(message);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Keep only last 50 messages
        while (messagesDiv.children.length > 50) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }
    }
}

// Start the game
const game = new Game();

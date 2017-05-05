function Map(game, width, height) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.itemsContainer = this.game.add.group();
    this.add(this.itemsContainer);

    this.blocksContainer = this.game.add.group();
    this.add(this.blocksContainer);

    this.onHitTaken = new Phaser.Signal();
    this.onCoinsTaken = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    /* Create the removable blocks */
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let block = this.createTile(gridX, gridY, "tile:grass");
            block.frame = (gridY == 0 ? 0 : 1);
            this.blocksContainer.addChild(block);

            block.inputEnabled = true;
            block.events.onInputDown.add(this.onBlockInputDown, this);
            block.events.onInputOut.add(this.onBlockInputOut, this);
            block.events.onInputUp.add(this.onBlockInputUp, this);
        }
    }

    /* Create the grass faded background bellow the tile */
    let background = this.game.add.tileSprite(0, 0, this.blocksContainer.width/GAME.scale.sprite, this.blocksContainer.height/GAME.scale.sprite, "tile:grass");
    background.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    background.frame = 1;
    background.alpha = 0.6;
    this.backgroundContainer.addChild(background);

    /* Configure the item types */
    let itemTypes = {
        hazard: {
            limit: Math.floor(Math.random() * 3) + 1,
            sprite: 'lava',
            scale: GAME.scale.sprite,
            probabilities: [0, 0, 0, 2, 8, 90]
        },
        enemy: {
            limit: 6,
            sprite: 'ghost',
            scale: 4,
            probabilities: [15, 15, 15, 15, 15, 25]
        }, 
        gem: {
            limit: 6,
            sprite: 'gold',
            scale: 4,
            probabilities: [15, 15, 15, 15, 15, 25]
        }
    };

    for (let type in itemTypes) {
        for (let i=0; i<itemTypes[type].limit; i++) {
            let probabilityTotal = 0;
            /* Get all empty tiles, splitted in probabilities */
            let tilesProbabilities = {};
            this.getTilesEmpty().forEach(function(tile) {
                let tileProbability = itemTypes[type].probabilities[tile.gridY];
                if (tileProbability > 0) {
                    if (tileProbability != null) {
                        if (tilesProbabilities[tileProbability] == undefined) {
                            probabilityTotal += tileProbability;
                            tilesProbabilities[tileProbability] = new Array();
                        }
                        tilesProbabilities[tileProbability].push(tile);
                    }
                }
            }, this);

            /* Pick a tile based on their probabilities AND the number of tiles */
            let tile = null;
            let index = Math.floor(Math.random() * (probabilityTotal-1));
            let lastProbability = 0;
            for (let tileProbability in tilesProbabilities) {
                if (index <= (parseInt(tileProbability) + lastProbability)) {
                    let tiles = tilesProbabilities[tileProbability];
                    tile = tiles[Math.floor(Math.random() * (tiles.length-1))];
                    break;
                }
                lastProbability = parseInt(tileProbability);
            }

            /* Create the item if it's possible */
            if (tile != null) {
                let item = this.createTile(tile.gridX, tile.gridY, "tile:" + itemTypes[type].sprite);
                item.scale.setTo(itemTypes[type].scale, itemTypes[type].scale);
                item.type = type;
                item.alpha = 0;
                this.itemsContainer.addChild(item);
            }
        }
    }
};

/* Helpers */

Map.prototype.createTile = function(gridX, gridY, spriteName) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    tile.anchor.set(0.5, 0.5);
    tile.x = tile.width * gridX;
    tile.y = tile.height * gridY;

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    tile.gridX = gridX;
    tile.gridY = gridY;

    return tile;
};

Map.prototype.getTileAt = function(gridX, gridY, container) {
    let wantedTile = null;

    container.forEach(function(tile) {
        if (tile.gridX == gridX && tile.gridY == gridY) {
            wantedTile = tile;
        }
    }, this);

    return wantedTile;
};

Map.prototype.getTilesEmpty = function() {
    let tiles = new Array();
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (this.getTileAt(gridX, gridY, this.itemsContainer) == null) {
                tiles.push({gridX:gridX, gridY:gridY});
            }
        }
    }
    return tiles;
};

Map.prototype.getTileAtRandom = function() {
    let tiles = this.getTilesEmpty();

    return tiles[Math.floor(Math.random() * (tiles.length-1))];
};

/* Events */

/* Destroy the previously highlighted block */
Map.prototype.onBlockInputUp = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.inputEnabled = false;
        tile.alpha = 0;
        
        /* Show the items (if any) in this tile */
        let item = this.getTileAt(tile.gridX, tile.gridY, this.itemsContainer);
        if (item != null) {
            if (item.type == "enemy") {
                this.onHitTaken.dispatch(item, 1);
            } else if (item.type == "hazard") {
                this.onHitTaken.dispatch(item, 2);
            } else if (item.type == "gem") {
                let coins = 1;
                let emitter = this.game.add.emitter(tile.x, tile.y, coins);
                emitter.makeParticles('tile:coins');

                this.addChild(emitter);

                let speed = 100;
                let lifetime = 800;
                emitter.minParticleSpeed.setTo(speed * -1, speed * -1);
                emitter.minParticleScale = emitter.maxParticleScale = 4;
                emitter.maxParticleSpeed.setTo(speed, speed);

                emitter.start(true, lifetime, 1, 20);
                this.onCoinsTaken.dispatch(item, 1);
            }
            item.alpha = 1;
        }

        /* Change the tile bellow (if any) to show a hole is now visible */
        let tileUnder = this.getTileAt(tile.gridX, tile.gridY+1, this.blocksContainer);
        if (tileUnder != null) {
            tileUnder.frame = 0;
        }
    }
};

/* Highlight the tile */
Map.prototype.onBlockInputDown = function(tile, pointer) {
    tile.alpha = 0.5;
};

/* Restore the previously highlighted tile */
Map.prototype.onBlockInputOut = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.alpha = 1;
    }
};

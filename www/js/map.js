function Map(game, width, height) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.itemsContainer = this.game.add.group();
    this.add(this.itemsContainer);

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.onHitTaken = new Phaser.Signal();
    this.onCoinsTaken = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    let blackBackground = this.backgroundContainer.create(0, 0, 'tile:grass');
    blackBackground.tint = 0x000000;

    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            if (y == (this.gridHeight-1) && Math.floor(Math.random() * 100) <= 30) {
                let item = this.createTile(x, y, 'tile:lava');
                item.type = "hazard";
                item.animations.add("idle", [0, 1], 4, true);
                item.animations.play("idle");
                this.itemsContainer.addChild(item);
            }

            let background = this.createTile(x, y, 'tile:grass');
            background.frame = 1;
            background.alpha = 0.6;
            this.backgroundContainer.addChild(background);

            let tile = this.createTile(x, y, 'tile:grass');
            tile.frame = (y == 0 ? 0 : 1);
            this.tilesContainer.addChild(tile);

            tile.inputEnabled = true;
            tile.events.onInputDown.add(this.onMapTileSelected, this);
            tile.events.onInputOut.add(this.onMapTileOut, this);
            tile.events.onInputUp.add(this.onMapTileClicked, this);
        }
    }

    blackBackground.width = this.tilesContainer.width;
    blackBackground.height = this.tilesContainer.height;

    /* Generate items */
    let items = new Array();
    for (let i=0; i<6; i++) {
        items.push('ghost');
    }
    for (let i=0; i<6; i++) {
        items.push('gold');
    }

    items.forEach(function(singleItem) {
        let position = this.getRandomEmptyTile();

        let item = this.createTile(position.gridX, position.gridY, "tile:" + singleItem);
        item.scale.setTo(4, 4);
        //item.x += (item.width/2);
        item.type = singleItem;
        this.itemsContainer.addChild(item);
        item.alpha = 0;
    }, this);
};

/* Helpers */

Map.prototype.createTile = function(gridX, gridY, spriteName) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(6, 6);
    tile.anchor.set(0.5, 0.5);
    tile.x = tile.width * gridX;
    tile.y = tile.height * gridY;

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    tile.gridX = gridX;
    tile.gridY = gridY;

    return tile;
};

Map.prototype.getItemAt = function(gridX, gridY) {
    let wantedItem = null;

    this.itemsContainer.forEach(function(Item) {
        if (Item.gridX == gridX && Item.gridY == gridY) {
            wantedItem = Item;
        }
    }, this);

    return wantedItem;
};

Map.prototype.getTileAt = function(gridX, gridY) {
    let wantedTile = null;

    this.tilesContainer.forEach(function(tile) {
        if (tile.gridX == gridX && tile.gridY == gridY) {
            wantedTile = tile;
        }
    }, this);

    return wantedTile;
};

Map.prototype.getRandomEmptyTile = function() {
    let tiles = new Array();
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let isEmpty = true;
            this.itemsContainer.forEach(function(item) {
                if (item.gridX == gridX && item.gridY == gridY) {
                    isEmpty = false;
                }
            }, this);

            if (isEmpty) {
                tiles.push({gridX:gridX, gridY:gridY});
            }
        }
    }

    return tiles[Math.floor(Math.random() * (tiles.length-1))];
};

/* Events */

Map.prototype.onMapTileClicked = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.inputEnabled = false;
        tile.alpha = 0;
        
        let item = this.getItemAt(tile.gridX, tile.gridY);
        if (item != null) {
            if (item.type == "ghost") {
                this.onHitTaken.dispatch(item, 1);
            } else if (item.type == "hazard") {
                this.onHitTaken.dispatch(item, 2);
            } else if (item.type == "gold") {
                let coins = 1;
                let emitter = this.game.add.emitter(tile.x + (tile.width/2), tile.y + (tile.height/2), coins);
                emitter.makeParticles('panel:coins');

                this.addChild(emitter);

                let speed = 100;
                let lifetime = 800;
                emitter.minParticleSpeed.setTo(speed * -1, speed * -1);
                emitter.maxParticleSpeed.setTo(speed, speed);

                emitter.start(true, lifetime, 1, 20);
                this.onCoinsTaken.dispatch(item, 1);
            }
            item.alpha = 1;
        }

        let tileUnder = this.getTileAt(tile.gridX, tile.gridY+1);
        if (tileUnder != null) {
            tileUnder.frame = 0;
        }
    }


};

Map.prototype.onMapTileSelected = function(tile, pointer) {
    tile.alpha = 0.5;
};

Map.prototype.onMapTileOut = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.alpha = 1;
    }
};

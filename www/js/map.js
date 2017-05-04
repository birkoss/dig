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

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    let blackBackground = this.backgroundContainer.create(0, 0, 'tile:dirt');
    blackBackground.tint = 0x000000;

    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            if (y == (this.gridHeight-1) && Math.floor(Math.random() * 100) <= 30) {
                let item = this.createTile(x, y, 'tile:lava');
                this.itemsContainer.addChild(item);
            }

            let background = this.createTile(x, y, 'tile:dirt');
            background.alpha = 0.6;
            this.backgroundContainer.addChild(background);

            let tile = this.createTile(x, y, 'tile:' + (y > 0 ? 'dirt' : 'dirt-top'));
            this.tilesContainer.addChild(tile);

            tile.inputEnabled = true;
            tile.events.onInputDown.add(this.onMapTileClicked, this);
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
        this.itemsContainer.addChild(item);
    }, this);
};

/* Helpers */

Map.prototype.createTile = function(gridX, gridY, spriteName) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.width = tile.height = 42;
    tile.x = tile.width * gridX;
    tile.y = tile.height * gridY;

    tile.gridX = gridX;
    tile.gridY = gridY;

    return tile;
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
    if (tile.frame != 011) {
        tile.inputEnabled = false;
        tile.alpha = 0;

        let tileUnder = this.getTileAt(tile.gridX, tile.gridY+1);
        if (tileUnder != null) {
            tileUnder.loadTexture("tile:dirt-top");
            tileUnder.frame = 0;
        }
    }
};

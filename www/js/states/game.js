var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.lives = 3;
        this.coins = 0;

        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.createMap();

        this.createButton();

        this.panelContainer = this.game.add.group();

        this.heartsContainer = this.game.add.group();
        this.createHearts(this.lives);

        this.coinsContainer = this.game.add.group();
        this.createCoins();
    },
    update: function() {
    },

    /* Misc methods */

    createButton: function() {
        let button = this.game.add.button(0, 0, 'btn:quit', this.onBtnQuitClicked, this, 1, 0, 1, 0);
        button.x = (this.game.width - button.width)/2;

        button.y = ((this.game.height - this.mapContainer.y - this.mapContainer.height)/2) - (button.height/2) + this.mapContainer.y + this.mapContainer.height;
    },
    createCoins: function() {
        let icon = this.coinsContainer.create(0, 0, 'panel:coins');
        icon.scale.setTo(GAME.RATIO, GAME.RATIO);
        icon.x = this.game.width - icon.width;

        let label = this.game.add.bitmapText(0, 0, 'font:guiOutline', "x", 20);
        label.anchor.set(1, 0.5);
        label.x = icon.x;
        label.y = icon.height/2;
        this.coinsContainer.addChild(label);

        this.coinsLabel = this.game.add.bitmapText(0, 0, 'font:guiOutline', "0", 20);
        this.coinsLabel.anchor.set(1, 0.5);
        this.coinsLabel.x = label.x - label.width;
        this.coinsLabel.y = icon.height/2;
        this.coinsContainer.addChild(this.coinsLabel);
    },
    createHearts: function(maxHearts) {
        for (let i=0; i<maxHearts; i++) {
            let background = this.heartsContainer.create(0, 0, 'panel:hearts');
            background.frame = 2;
            background.scale.setTo(GAME.RATIO, GAME.RATIO);
            background.x = i * background.width;

            let icon = this.heartsContainer.create(0, 0, 'panel:hearts');
            icon.anchor.set(0.5, 0.5);
            icon.x = Math.floor(icon.width/2);
            icon.y = Math.floor(icon.height/2);
            background.addChild(icon);
        }
    },
    createMap: function() {
        this.map = new Map(this.game, 6, 6);
        this.map.onHitTaken.add(this.onMapHitTaken, this);
        this.map.onCoinsTaken.add(this.onMapCoinsTaken, this);

        console.log(this.map.width + "x" + this.map.height);

        let mapSize = (this.map.width) / 6;
        mapSize += 2;
        let background = this.game.add.tileSprite(0, 0, mapSize, mapSize, "tile:stone");
        background.scale.setTo(6, 6);

        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.mapContainer.width - this.map.width)/2;
        this.map.y = (this.mapContainer.height - this.map.height)/2;

        this.mapContainer.x = (this.game.width - this.mapContainer.width)/2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height)/2;
    },

    refreshHearts: function() {
        for (let i=this.heartsContainer.children.length-1; i>=this.lives; i--) {
            let heart = this.heartsContainer.getChildAt(i).getChildAt(0);
            if (heart.alpha == 1) {
                this.game.add.tween(heart.scale).to({x:3, y:3}).start();
                this.game.add.tween(heart).to({alpha:0}).start();
            }
        }
    },

    onBtnQuitClicked: function(tile, pointer) {
        this.state.restart();
    },
    onMapCoinsTaken: function(tile, amount) {
        this.coins += amount;
        this.coinsLabel.text = this.coins;
    },
    onMapHitTaken: function(tile, amount) {
        this.lives = Math.max(0, this.lives - amount);
        this.refreshHearts();
    }
};

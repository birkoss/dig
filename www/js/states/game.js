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

        this.createPanel();
    },
    update: function() {
    },

    /* Misc methods */

    createButton: function() {
        let button = this.game.add.button(0, 0, 'btn:quit', this.onBtnQuitClicked, this, 1, 0, 1, 0);
        button.x = (this.game.width - button.width)/2;

        button.y = ((this.game.height - this.mapContainer.y - this.mapContainer.height)/2) - (button.height/2) + this.mapContainer.y + this.mapContainer.height;
    },
    createCoins: function(container) {
        let icon = container.create(0, 0, "tile:coins");
        icon.scale.setTo(GAME.scale.normal + 1, GAME.scale.normal + 1);
        icon.anchor.set(1, 0.5);
        console.log(GAME.scale.normal);
        icon.x = 0;
        icon.y = icon.height/2;
        //icon.x = this.game.width - icon.width;

        let label = this.game.add.bitmapText(0, 0, "font:gui", "x", 20);
        label.anchor.set(1, 0.5);
        label.x = icon.x - icon.width - 4;
        label.y = icon.height/2;
        label.y--;
        container.addChild(label);

        this.coinsLabel = this.game.add.bitmapText(0, 0, "font:gui", "0", 20);
        this.coinsLabel.anchor.set(1, 0.5);
        this.coinsLabel.x = label.x - label.width - 4;
        this.coinsLabel.y = icon.height/2;
        this.coinsLabel.y --;
        container.addChild(this.coinsLabel);
    },
    createHearts: function(container, maxHearts) {
        for (let i=0; i<maxHearts; i++) {
            let background = container.create(0, 0, "tile:heart");
            background.scale.setTo(GAME.scale.normal + 1, GAME.scale.normal + 1);
            background.anchor.set(0.5, 0.5);
            background.x = i * background.width;
            background.tint = 0x000000;

            background.x += background.width/2;
            background.y += background.height/2;

            let icon = container.create(0,0, "tile:heart");
            icon.anchor.set(0.5, 0.5);
            background.addChild(icon);
        }
    },
    createMap: function() {
        this.map = new Map(this.game, 6, 6);
        this.map.onHitTaken.add(this.onMapHitTaken, this);
        this.map.onCoinsTaken.add(this.onMapCoinsTaken, this);

        console.log(this.map.width + "x" + this.map.height);

        let mapSize = (this.map.width) / GAME.scale.sprite;
        mapSize += 2;
        let background = this.game.add.tileSprite(0, 0, mapSize, mapSize, "tile:stone");
        background.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);

        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.mapContainer.width - this.map.width)/2;
        this.map.y = (this.mapContainer.height - this.map.height)/2;

        this.mapContainer.x = (this.game.width - this.mapContainer.width)/2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height)/2;
    },
    createPanel: function() {
        let panel = this.panelContainer.create(0, 0, 'tile:blank');

        this.heartsContainer = this.game.add.group();
        this.panelContainer.add(this.heartsContainer);
        this.createHearts(this.heartsContainer, 3);
        this.heartsContainer.x = this.heartsContainer.y = GAME.scale.sprite;

        let coinsContainer = this.game.add.group();
        this.panelContainer.add(coinsContainer);
        this.createCoins(coinsContainer);
        coinsContainer.y = GAME.scale.sprite;
        coinsContainer.x = this.game.width - GAME.scale.sprite;

        panel.tint = 0xff00ff;
        panel.width = this.game.width;
        panel.height = this.heartsContainer.height + (GAME.scale.sprite * 2);
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

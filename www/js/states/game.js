var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.lives = 3;
        this.coins = 0;

        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.createMap();

        this.panelContainer = this.game.add.group();

        this.createPanel();

        this.createButtonLeave();
    },
    update: function() {
    },

    /* Misc methods */

    createButton: function(buttonLabel, callback) {
        let button = this.game.add.button(0, 0, 'btn:large', callback, this, 1, 0, 1, 0);
        button.x = (this.game.width - button.width)/2;

        button.y = ((this.game.height - this.mapContainer.y - this.mapContainer.height)/2) - (button.height/2) + this.mapContainer.y + this.mapContainer.height;
        button.originalY = button.y;
        button.y = this.game.height;

        let label = this.game.add.bitmapText(0, 0, "font:gui", buttonLabel, 20);
        label.anchor.set(0.5, 0.5);
        label.x = button.width/2;
        label.y = button.height/2;
        button.addChild(label);

        this.buttonsContainer.addChild(button);

        return button;
    },
    createButtonLeave: function() {
        let button = this.createButton("Partir", this.onBtnLeaveClicked);
        this.showButton(button);
    },
    createButtonQuit: function() {
        let button = this.createButton("Quitter", this.onBtnQuitClicked);
        this.showButton(button);
    },
    createCoins: function(container) {
        this.coinsIcon = container.create(0, 0, "tile:coins");
        this.coinsIcon.scale.setTo(GAME.scale.normal + 1, GAME.scale.normal + 1);
        this.coinsIcon.anchor.set(1, 0.5);
        this.coinsIcon.x = 0;
        this.coinsIcon.y = this.coinsIcon.height/2;

        let label = this.game.add.bitmapText(0, 0, "font:gui", "x", 20);
        label.anchor.set(1, 0.5);
        label.x = this.coinsIcon.x - this.coinsIcon.width - 4;
        label.y = this.coinsIcon.height/2;
        label.y--;
        container.addChild(label);

        this.coinsLabel = this.game.add.bitmapText(0, 0, "font:gui", "0", 20);
        this.coinsLabel.anchor.set(1, 0.5);
        this.coinsLabel.x = label.x - label.width - 4;
        this.coinsLabel.y = this.coinsIcon.height/2;
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

        let mapSize = (this.map.width) / GAME.scale.sprite;
        mapSize += 4;
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

    disableMap: function() {
        console.log('disableMap');
        /* Reset coins */
        if (this.coins > 0) {
            let emitter = this.game.add.emitter(this.coinsIcon.worldPosition.x, this.coinsIcon.worldPosition.y, this.coins);
            emitter.makeParticles('tile:coins');

            emitter.setRotation(0, 0);
            emitter.minParticleScale = emitter.maxParticleScale = 4;
            emitter.start(false, 2000, null, this.coins);

            this.coins = 0;
            this.coinsLabel.text = this.coins;
        }

        /* Disable the map and show fade the blocks */
        this.map.disableInput();

        /* Hide the existing buttons */
        this.buttonsContainer.forEach(function(button) {
            let tween = this.game.add.tween(button).to({y:this.game.height}, 1000, Phaser.Easing.Elastic.In);

            tween.onComplete.add(function(button) {
                button.destroy();
                this.createButtonQuit();
            }, this);

            tween.start();
        }, this);
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
    
    showButton: function(button) {
        this.game.add.tween(button).to({y:button.originalY}, 1000, Phaser.Easing.Elastic.Out).start();
    },

    onBtnLeaveClicked: function(tile, pointer) {
        if (this.lives > 0) {
            GAME.config.coins += this.coins;
            this.state.start("Main");
        }
    },
    onBtnQuitClicked: function(tile, pointer) {
        this.state.start("Main");
    },
    onMapCoinsTaken: function(tile, amount) {
        this.coins += amount;
        this.coinsLabel.text = this.coins;

        let emitter = this.game.add.emitter(tile.worldPosition.x, tile.worldPosition.y, amount);
        console.log(tile);
        emitter.makeParticles('tile:coins');

        let speed = 100;
        let lifetime = 800;
        emitter.minParticleSpeed.setTo(speed * -1, speed * -1);
        emitter.minParticleScale = emitter.maxParticleScale = 4;
        emitter.maxParticleSpeed.setTo(speed, speed);

        emitter.start(true, lifetime, 1, 20);
    },
    onMapHitTaken: function(tile, amount) {
        this.lives = Math.max(0, this.lives - amount);
        this.refreshHearts();
        if (this.lives <= 0) {
            this.disableMap();
        }
    }
};

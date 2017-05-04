var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('map:background', 'images/map.png');

        this.load.image('tile:dirt-top', 'images/tiles/dirt-top.png');
        this.load.image('tile:dirt', 'images/tiles/dirt.png');
        this.load.image('tile:stone', 'images/tiles/stone.png');
        this.load.image('tile:lava', 'images/tiles/lava.png');

        this.load.image('tile:gold', 'images/tiles/gold.png');
        this.load.image('tile:ghost', 'images/tiles/ghost.png');
    },
    create: function() {
        this.state.start('Game'); /* Game/Debug */
    }
};

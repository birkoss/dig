var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:blank', 'images/tiles/blank.png');

        this.load.spritesheet('tile:grass', 'images/tiles/grass.png', 8, 8);
        this.load.spritesheet('tile:lava', 'images/tiles/lava.png', 8, 8);
        this.load.image('tile:stone', 'images/tiles/stone.png');

        this.load.image('tile:gold', 'images/tiles/gold.png');
        this.load.image('tile:ghost', 'images/tiles/ghost.png');

        this.load.image('tile:heart', 'images/tiles/heart.png');
        this.load.image('tile:coins', 'images/tiles/coins.png');

        this.load.spritesheet('btn:quit', 'images/gui/btn-quit.png', 190, 49);
        this.load.spritesheet('btn:small', 'images/gui/button-small.png', 140, 40);
        this.load.spritesheet('btn:large', 'images/gui/button-large.png', 220, 40);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');
    },
    create: function() {
        this.state.start('Main'); /* Game/Debug */
    }
};

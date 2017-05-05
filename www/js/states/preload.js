var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('map:background', 'images/map.png');

        this.load.spritesheet('tile:grass', 'images/tiles/grass.png', 21, 21);
        this.load.image('tile:lava', 'images/tiles/lava.png');

        this.load.image('tile:gold', 'images/tiles/gold.png');
        this.load.image('tile:ghost', 'images/tiles/ghost.png');

        this.load.spritesheet('panel:hearts', 'images/tiles/hearts.png', 21, 21);
        this.load.image('panel:coins', 'images/tiles/coins.png');

        this.load.spritesheet('btn:quit', 'images/gui/btn-quit.png', 190, 49);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');
    },
    create: function() {
        this.state.start('Game'); /* Game/Debug */
    }
};

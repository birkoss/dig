var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();

        this.createMap();

    },
    update: function() {
    },

    /* Misc methods */

    createMap: function() {
        let background = this.mapContainer.create(0, 0, 'map:background');

        this.map = new Map(this.game, 6, 6);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.game.width - this.map.width)/2;
        background.x = (this.game.width - background.width)/2;
        this.map.y = (background.height - this.map.height)/2;
    },

    onMapTileClicked: function(tile, pointer) {
        if (tile.frame == 0) {
            tile.destroy();
        }
    }
};

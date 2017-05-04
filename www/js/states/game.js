var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.createMap();

        this.createButton();

    },
    update: function() {
    },

    /* Misc methods */

    createButton: function() {
        let button = this.game.add.button(0, 0, 'btn:quit', this.onBtnQuitClicked, this, 1, 0, 1, 0);
        button.x = (this.game.width - button.width)/2;

        button.y = ((this.game.height - this.mapContainer.y - this.mapContainer.height)/2) - (button.height/2) + this.mapContainer.y + this.mapContainer.height;
    },

    createMap: function() {
        let background = this.mapContainer.create(0, 0, 'map:background');

        this.map = new Map(this.game, 6, 6);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.mapContainer.width - this.map.width)/2;
        this.map.y = (this.mapContainer.height - this.map.height)/2;

        this.mapContainer.x = (this.game.width - this.mapContainer.width)/2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height)/2;
    },


    onBtnQuitClicked: function(tile, pointer) {
        if (tile.frame == 0) {
            tile.destroy();
        }
    }
};

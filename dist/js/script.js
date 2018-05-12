var app = new Vue({
    el: "#app",
    data: {
        game: {
            global: {},
            local: {}
        },
        local: {}
    },
    mounted: function () {
        window.conn = new WebSocket('ws://127.0.0.1:8080');

        conn.onopen = function (e) {
            app.local.connected = true;
            if (Cookies.get('id')) {
                app.game.local.id = Cookies.get('id');
                conn.send(JSON.stringify(app.game.local));
            }
        };

        conn.onmessage = function (e) {
            app.game = JSON.parse(e.data);
            if (!Cookies.get('id')) {
                Cookies.set('id', app.game.local.id);
            }
        };
    },
    methods: {

        isHost: function () {
            return this.game.local.id == this.game.global.hostid;
        },

        gameCanStart: function () {
            return this.getActivePlayerCount() >= 2;
        },

        startGame: function () {
            console.log('start game');
        },

        getActivePlayerCount: function () {
            var count = 0;
            if (!this.game.global.players) {
                return 0;
            }
            this.game.global.players.forEach(function (player) {
                if (player.connected) {
                    count += 1;
                }
            });
            return count;
        }

    }

});

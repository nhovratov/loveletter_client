var app = new Vue({
    el: "#app",
    data: {
        loveletter: {
            global: {},
            local: {}
        },
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

            if (Cookies.get('name') && Cookies.get('id')) {
                app.game.local.name = Cookies.get('name');
                conn.send(JSON.stringify(app.game.local));
            }
        };

        conn.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.dataType === "game") {
                app.loveletter = data;
            } else {
                app.game = JSON.parse(e.data);
            }
            if (!Cookies.get('id')) {
                Cookies.set('id', app.game.local.id, { expires: 30 });
                conn.send(JSON.stringify(app.game.local));
            }
        };
    },
    methods: {

        isHost: function () {
            if (this.game.global.hostid) {
                return this.game.local.id == this.game.global.hostid;
            }
            return false;
        },

        isPlayersTurn: function (id) {
            if (this.game.local.id == this.loveletter.global.playerTurn) {
                return true;
            }
            return false;
        },

        gameCanStart: function () {
            return this.getActivePlayerCount() >= 2;
        },

        startGame: function () {
            window.conn.send(JSON.stringify({
                "action": "start"
            }));
        },

        selectFirstPlayer: function (id) {
            window.conn.send(JSON.stringify({
                "action": "selectFirstPlayer",
                "params": {
                    "id": id
                }
            }));
        },

        chooseCard: function (index) {
            window.conn.send(JSON.stringify({
                "action": "chooseCard",
                "params": {
                    "index": index
                }
            }));
        },

        selectPlayerForEffect: function (id) {
            window.conn.send(JSON.stringify({
                "action": "selectPlayerForEffect",
                "params": {
                    "id": id
                }
            }));
        },

        discardActiveCard: function () {
            window.conn.send(JSON.stringify({
                "action": "discardActiveCard"
            }));
        },

        selectGuardianEffectCard: function (card) {
            window.conn.send(JSON.stringify({
                "action": "selectGuardianEffectCard",
                "params": {
                    "card": card
                }
            }));
        },

        finishLookingAtCard: function () {
            window.conn.send(JSON.stringify({
                "action": "finishLookingAtCard"
            }));
        },

        isOutOfGame: function (id) {
            return this.loveletter.global.outOfGamePlayers.indexOf(id) !== -1;
        },

        isGameFinished: function () {
          return this.loveletter.global.gameFinished;
        },

        isWinner: function (id) {
          return id == this.loveletter.global.winner;
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
        },

        setName: function () {
            Cookies.set('name', $('#username').val(), { expires: 30 });
            app.game.local.name = Cookies.get('name');
            conn.send(JSON.stringify(app.game.local));
        },

        hasUsername: function () {
            return Cookies.get('name');
        }

    }

});

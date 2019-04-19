var app = new Vue({
    el: "#app",
    data: {
        loveletter: {
            global: {},
            local: {
                cards: {},
                openEffectCards: [],
                priestEffectVisibleCard: []
            }
        },
        game: {
            global: {},
            local: {}
        },
        local: {}
    },
    mounted: function () {
        window.conn = new WebSocket('ws://192.168.178.22:8080');

        conn.onopen = function (e) {
            app.local.connected = true;
            if (Cookies.get('id')) {
                app.game.local.id = Cookies.get('id');
                if (Cookies.get('name')) {
                    app.game.local.name = Cookies.get('name');
                }
                conn.send(JSON.stringify(app.game.local));
            }

        };

        conn.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.dataType === "game") {
                app.loveletter.global = data.global;
                app.loveletter.local.openEffectCards = data.local.openEffectCards;
                app.loveletter.local.priestEffectVisibleCard = data.local.priestEffectVisibleCard;
                app.fetchCards(data.local.cards);
            } else {
                app.game = JSON.parse(e.data);
            }
            if (!Cookies.get('id')) {
                Cookies.set('id', app.game.local.id, {expires: 30});
                if (Cookies.get('name')) {
                    app.game.local.name = Cookies.get('name');
                }
                conn.send(JSON.stringify(app.game.local));
            }
        };
    },
    methods: {

        fetchCards: function (cards) {
            var currentCards = this.loveletter.local.cards;
            for (var key in currentCards) {
                if (!cards.hasOwnProperty(key)) {
                    delete currentCards[key];
                }
            }
            for (var key in cards) {
                if (!currentCards.hasOwnProperty(key)) {
                    currentCards[key] = cards[key];
                }
            }
        },

        isHost: function () {
            if (this.game.global.hostid) {
                return this.game.local.id == this.game.global.hostid;
            }
            return false;
        },

        isPlayerTurn: function () {
            if (this.game.local.id == this.loveletter.global.playerTurn) {
                return true;
            }
            return false;
        },

        isProtected: function (id) {
            return this.loveletter.global.protectedPlayers.indexOf(id) !== -1;
        },

        canPressDiscard: function () {
            return this.isPlayerTurn()
                && !this.isGameFinished()
                && (
                    this.getWaitFor() === 'confirmDiscardCard'
                    || (this.getWaitFor() === 'choosePlayer' && !this.selectablePlayerExists())
                )
        },

        selectablePlayerExists: function () {
            return (this.getIngamePlayersCount() - this.getUnselectablePlayersCount()) > 1;
        },

        preventedByCountess: function (cardname) {
            var cards = [];
            var mustPlayCards = ['König', 'Prinz'];
            for (var key in app.loveletter.local.cards) {
                cards.push(app.loveletter.local.cards[key]['name']);
            }
            if (cards.indexOf('Gräfin') === -1) {
                return false;
            }
            return mustPlayCards.indexOf(cardname) !== -1;
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

        chooseCard: function (key) {
            window.conn.send(JSON.stringify({
                "action": "chooseCard",
                "params": {
                    "key": key
                }
            }));
        },

        choosePlayer: function (id) {
            window.conn.send(JSON.stringify({
                "action": this.loveletter.global.waitFor,
                "params": {
                    "id": id
                }
            }));
        },

        confirmDiscardCard: function () {
            window.conn.send(JSON.stringify({
                "action": "confirmDiscardCard"
            }));
        },

        chooseGuardianEffectCard: function (card) {
            window.conn.send(JSON.stringify({
                "action": "chooseGuardianEffectCard",
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

        placeMaidCard: function () {
            window.conn.send(JSON.stringify({
                "action": "placeMaidCard"
            }));
        },

        isOutOfGame: function (id) {
            return this.loveletter.global.outOfGamePlayers.indexOf(id) !== -1;
        },

        isGameFinished: function () {
            return this.loveletter.global.gameFinished;
        },

        isWinner: function (id) {
            return this.loveletter.global.winners.indexOf(id) !== -1;
        },

        getActivePlayerCount: function () {
            var count = 0;
            if (!this.getPlayers()) {
                return 0;
            }
            this.getPlayers().forEach(function (player) {
                if (player.connected) {
                    count += 1;
                }
            });
            return count;
        },

        getPlayers: function () {
            return this.game.global.players;
        },

        getIngamePlayers: function () {
            return this.loveletter.global.players;
        },

        setName: function () {
            Cookies.set('name', $('#username').val(), {expires: 30});
            app.game.local.name = Cookies.get('name');
            conn.send(JSON.stringify(app.game.local));
        },

        hasUsername: function () {
            return Cookies.get('name');
        },

        getProtectedPlayers: function () {
            return this.loveletter.global.protectedPlayers;
        },

        getIngamePlayersCount: function () {
            return this.getIngamePlayers().length;
        },

        getOutOfGamePlayers: function () {
            return this.loveletter.global.outOfGamePlayers;
        },

        getProtectedPlayersCount: function () {
            return this.getProtectedPlayers().length;
        },

        getOutOfGamePlayersCount: function () {
            return this.getOutOfGamePlayers().length;
        },

        getUnselectablePlayersCount: function () {
            return this.getProtectedPlayersCount() + this.getOutOfGamePlayersCount()
        },

        getWaitFor: function () {
            return this.loveletter.global.waitFor;
        }

    }

});

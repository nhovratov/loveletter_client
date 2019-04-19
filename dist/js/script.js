var app = new Vue({
    el: "#app",
    data: {
        loveletter: {
            global: {
                winners: {},
                outOfGameCards: [],
                guardianEffectChosenPlayer: '',
                waitFor: '',
                outOfGamePlayers: [],
                protectedPlayers: [],
                gameStarted: false,
                gameFinished: false,
                playerTurn: '',
                guardianEffectSelectableCards: [],
                activeCard: {},
                discardPile: {}
            },
            local: {
                cards: {},
                openEffectCards: [],
                priestEffectVisibleCard: []
            }
        },
        game: {
            global: {
                players: [],
                hostid: ''
            },
            local: {}
        },
        local: {}
    },
    mounted: function () {
        window.conn = new WebSocket('ws://192.168.178.34:8080');

        conn.onopen = function (e) {
            app.local.connected = true;
            if (Cookies.get('id')) {
                app.setId(Cookies.get('id'));
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
                Cookies.set('id', app.getId(), {expires: 30});
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
            if (this.getHostId()) {
                return this.getId() === this.getHostId();
            }
            return false;
        },

        isPlayerTurn: function () {
            if (this.getId() === this.getPlayerTurn()) {
                return true;
            }
            return false;
        },

        isProtected: function (id) {
            return this.getProtectedPlayers().includes(id);
        },

        canPressStartGame: function () {
            return !this.isGameStarted() && this.isHost() && this.isGameReady()
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
            var handCards = this.getCards();
            for (var key in handCards) {
                if (handCards.hasOwnProperty(key)) {
                    cards.push(handCards[key]['name']);
                }
            }
            if (!cards.includes('Gräfin')) {
                return false;
            }
            return mustPlayCards.includes(cardname);
        },

        isGameReady: function () {
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
            return this.loveletter.global.winners.includes(id);
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
        },

        isConnected: function () {
            return this.local.connected;
        },

        isPlayerConnected: function (id) {
            var connected = false;
            this.getPlayers().forEach(function (player) {
                if (player.id === id) {
                    connected = player.connected;
                }
            });
            return connected;
        },

        getName: function () {
            return this.game.local.name;
        },

        getId: function () {
            return this.game.local.id;
        },

        setId: function (id) {
            this.game.local.id = id;
        },

        getStatus: function () {
            return this.game.global.status;
        },

        getHostId: function () {
            return this.game.global.hostid;
        },

        isGameStarted: function () {
            return this.loveletter.global.gameStarted;
        },

        getWinners: function () {
            return this.loveletter.global.winners;
        },

        isBoardVisible: function () {
            return this.isGameStarted() || this.getWinners().length > 0
        },

        getGameStatus: function () {
            return this.loveletter.global.status;
        },

        canSelectedFirstPlayer: function () {
            return this.getWaitFor() === 'selectFirstPlayer' && this.isHost();
        },

        canLookAtPlayerCard: function () {
            return this.getWaitFor() === 'finishLookingAtCard' && this.isPlayerTurn()
        },

        getPriestEffectVisibleCard: function () {
            return this.loveletter.local.priestEffectVisibleCard;
        },

        isOutOfGameCardsVisible: function () {
            return this.getOutOfGameCards().length > 0
        },

        getOutOfGameCards: function () {
            return this.loveletter.global.outOfGameCards;
        },

        getPlayerTurn: function () {
            return this.loveletter.global.playerTurn;
        },

        canChoosePlayer: function (id) {
            return ['choosePlayer', 'chooseAnyPlayer'].includes(this.getWaitFor())
                && this.isPlayerTurn()
                && !this.isProtected(id)
                && !this.isOutOfGame(id)
                && (id !== this.getId() || this.getWaitFor() === 'chooseAnyPlayer');
        },

        canSelectFirstPlayer: function () {
            return this.getWaitFor() === 'selectFirstPlayer' && this.isHost();
        },

        canSelectGuardianEffect: function () {
            return this.getWaitFor() === 'chooseGuardianEffectCard' && this.isPlayerTurn()
        },

        getGuardianEffectChosenPlayer: function () {
            return this.loveletter.global.guardianEffectChosenPlayer;
        },

        getGuardianEffectSelectableCards: function () {
            return this.loveletter.global.guardianEffectSelectableCards;
        },

        canChooseCard: function (card) {
            return this.getWaitFor() === 'chooseCard'
                && this.getPlayerTurn() === this.getId()
                && !this.isOutOfGame(this.getId())
                && !this.isGameFinished()
                && !this.preventedByCountess(card.name)
        },

        getCards: function () {
            return this.loveletter.local.cards;
        },

        getActiveCard: function () {
            return this.loveletter.global.activeCard;
        },

        canPlaceMaidCard: function () {
            return this.getWaitFor() === 'placeMaidCard'
                && this.isPlayerTurn()
                && !this.isGameFinished()
        },

        getDiscardPile: function () {
            return this.loveletter.global.discardPile;
        }
    },

    computed: {}
});

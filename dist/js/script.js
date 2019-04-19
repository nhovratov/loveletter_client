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
            return this.getId() === this.getPlayerTurn();
        },

        isProtected: function (id) {
            return this.getProtectedPlayers().includes(id);
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

        send: function (params) {
            window.conn.send(JSON.stringify({
                'action': '',
                params: params || {}
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

        setName: function () {
            Cookies.set('name', $('#username').val(), {expires: 30});
            app.game.local.name = Cookies.get('name');
            conn.send(JSON.stringify(app.game.local));
        },

        hasUsername: function () {
            return Cookies.get('name');
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

        setId: function (id) {
            this.game.local.id = id;
        },

        isGameStarted: function () {
            return this.loveletter.global.gameStarted;
        },

        canChoosePlayer: function (id) {
            return ['choosePlayer', 'chooseAnyPlayer'].includes(this.getWaitFor())
                && this.isPlayerTurn()
                && !this.isProtected(id)
                && !this.isOutOfGame(id)
                && (id !== this.getId() || this.getWaitFor() === 'chooseAnyPlayer');
        },

        canChooseCard: function (card) {
            return this.getWaitFor() === 'chooseCard'
                && this.getPlayerTurn() === this.getId()
                && !this.isOutOfGame(this.getId())
                && !this.isGameFinished()
                && !this.preventedByCountess(card.name)
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

        getUnselectablePlayersCount: function () {
            return this.getProtectedPlayersCount() + this.getOutOfGamePlayersCount()
        },

        getProtectedPlayersCount: function () {
            return this.getProtectedPlayers().length;
        },

        getOutOfGamePlayersCount: function () {
            return this.getOutOfGamePlayers().length;
        },

        getIngamePlayersCount: function () {
            return this.getIngamePlayers().length;
        },

        getName: function () {
            return this.game.local.name;
        },

        getId: function () {
            return this.game.local.id;
        },

        getStatus: function () {
            return this.game.global.status;
        },

        getHostId: function () {
            return this.game.global.hostid;
        },

        getPlayers: function () {
            return this.game.global.players;
        },

        getCards: function () {
            return this.loveletter.local.cards;
        },

        getPriestEffectVisibleCard: function () {
            return this.loveletter.local.priestEffectVisibleCard;
        },

        getDiscardPile: function () {
            return this.loveletter.global.discardPile;
        },

        getActiveCard: function () {
            return this.loveletter.global.activeCard;
        },

        getGuardianEffectChosenPlayer: function () {
            return this.loveletter.global.guardianEffectChosenPlayer;
        },

        getGuardianEffectSelectableCards: function () {
            return this.loveletter.global.guardianEffectSelectableCards;
        },

        getOutOfGameCards: function () {
            return this.loveletter.global.outOfGameCards;
        },

        getPlayerTurn: function () {
            return this.loveletter.global.playerTurn;
        },

        getGameStatus: function () {
            return this.loveletter.global.status;
        },

        getWinners: function () {
            return this.loveletter.global.winners;
        },

        getWaitFor: function () {
            return this.loveletter.global.waitFor;
        },

        getProtectedPlayers: function () {
            return this.loveletter.global.protectedPlayers;
        },

        getOutOfGamePlayers: function () {
            return this.loveletter.global.outOfGamePlayers;
        },

        getIngamePlayers: function () {
            return this.loveletter.global.players;
        },
    },

    computed: {
        canPressDiscard: function () {
            return this.isPlayerTurn()
                && !this.isGameFinished()
                && (
                    this.getWaitFor() === 'confirmDiscardCard'
                    || (this.getWaitFor() === 'choosePlayer' && !this.selectablePlayerExists())
                )
        },

        canPlaceMaidCard: function () {
            return this.getWaitFor() === 'placeMaidCard'
                && this.isPlayerTurn()
                && !this.isGameFinished()
        },

        canSelectFirstPlayer: function () {
            return this.getWaitFor() === 'selectFirstPlayer' && this.isHost();
        },

        canSelectGuardianEffect: function () {
            return this.getWaitFor() === 'chooseGuardianEffectCard' && this.isPlayerTurn()
        },

        canSelectedFirstPlayer: function () {
            return this.getWaitFor() === 'selectFirstPlayer' && this.isHost();
        },

        canLookAtPlayerCard: function () {
            return this.getWaitFor() === 'finishLookingAtCard' && this.isPlayerTurn()
        },

        canPressStartGame: function () {
            return !this.isGameStarted() && this.isHost() && this.isGameReady()
        },

        isOutOfGameCardsVisible: function () {
            return this.getOutOfGameCards().length > 0
        },

        isBoardVisible: function () {
            return this.isGameStarted() || this.getWinners().length > 0
        },
    }
});

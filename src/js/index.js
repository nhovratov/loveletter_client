import Vue from 'vue';
import Cookies from 'js-cookie';

import badge from './components/badge';
import lobby from './components/lobby';

var conn;
var app = new Vue({
    el: "#app",
    components: {
        badge,
        lobby
    },
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
                priestEffectVisibleCard: [],
                allowedAction: ''
            }
        },
        game: {
            global: {
                players: [],
                hostid: 0
            },
            local: {
                id: 0,
                name: ''
            }
        },
        local: {
            connected: false
        }
    },
    mounted: function () {
        conn = new WebSocket('ws://192.168.178.63:8080');
        console.log('Create new connection.');

        conn.onopen = function (e) {
            console.log('START Onopen event');
            app.local.connected = true;
            if (Cookies.get('id')) {
                console.log('cookie with id exists.');
                if (Cookies.get('name')) {
                    console.log('cookie with name exists. set the name');
                    app.game.local.name = Cookies.get('name');
                }
            }
            app.send();
            console.log('END Onopen');
        };

        conn.onmessage = function (e) {
            console.log('START onmessage');
            var data = JSON.parse(e.data);
            console.log('Received new data: ', data);
            if (data.dataType === "game") {
                app.loveletter.global = data.global;
                app.loveletter.local = data.local;
                app.fetchCards(data.local.cards);
            } else {
                app.game = data;
            }
            if (data.local.newId) {
                console.log('server responded with newId.');
                Cookies.set('id', data.local.newId, {expires: 30});
            }
            if (!Cookies.get('id')) {
                console.log('No id with cookie is set. Set id from newId');
                Cookies.set('id', data.local.newId, {expires: 30});
                if (Cookies.get('name')) {
                    console.log('name from cookie exists, set it in game.local');
                    app.game.local.name = Cookies.get('name');
                }
                app.send();
            }
            console.log('END onmessage');
        };
    },
    methods: {
        send: function (params = {}, action = '') {
            var id = '';
            var name = '';
            if (Cookies.get('id')) {
                id = Cookies.get('id');
            }
            if (Cookies.get('name')) {
                name = Cookies.get('name');
            }
            var data = {
                id: id,
                name: name,
                action: action,
                params: params
            };
            conn.send(JSON.stringify(data));
            console.log('send identity to server', data);
        },

        startGame: function () {
            this.send({}, 'start');
        },

        fetchCards: function (cards) {
            this.setCards(cards);
        },

        getUsername: function () {
            return Cookies.get('name');
        },

        setUsername: function () {
            Cookies.set('name', document.getElementById('username').value, {expires: 30});
            this.game.local.name = Cookies.get('name');
            this.send();
        },

        isUserConnected: function (id) {
            var connected = false;
            this.getPlayers().forEach(function (player) {
                if (player.id === id) {
                    connected = player.connected;
                }
            });
            return connected;
        },

        getId: function () {
            return this.game.local.id;
        },

        getCanStartGame: function () {
            return this.game.local.canStartGame;
        },

        getHostId: function () {
            return this.game.global.hostid;
        },

        getPlayers: function () {
            return this.game.global.players;
        },

        can: function (action) {
            return action === this.getAllowedAction();
        },

        canChoosePlayer: function (id) {
            return ['choosePlayer', 'chooseAnyPlayer'].includes(this.getAllowedAction())
                && !this.isProtected(id)
                && !this.isOutOfGame(id)
                && (id !== this.getId() || this.getAllowedAction() === 'chooseAnyPlayer');
        },

        canChooseCard: function (card) {
            return this.getAllowedAction() === 'chooseCard' && !this.isPreventedByCountess(card.name);
        },

        isPreventedByCountess: function (cardname) {
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

        isProtected: function (id) {
            return this.getProtectedPlayers().includes(id);
        },

        isOutOfGame: function (id) {
            return this.getOutOfGamePlayers().includes(id);
        },

        isWinner: function (id) {
            return this.getWinners().includes(id);
        },

        isGameStarted: function () {
            return this.loveletter.global.gameStarted;
        },

        getAllowedAction: function () {
            return this.loveletter.local.allowedAction;
        },

        getCards: function () {
            return this.loveletter.local.cards;
        },

        setCards: function (cards) {
            return this.loveletter.local.cards = cards;
        },

        getOutOfGameCards: function () {
            return this.loveletter.global.outOfGameCards;
        },

        getProtectedPlayers: function () {
            return this.loveletter.global.protectedPlayers;
        },

        getOutOfGamePlayers: function () {
            return this.loveletter.global.outOfGamePlayers;
        },

        getWinners: function () {
            return this.loveletter.global.winners;
        }
    },

    computed: {
        canStartGame: function () {
            return this.getCanStartGame() && !this.isGameStarted();
        },

        isOutOfGameCardsVisible: function () {
            return this.getOutOfGameCards().length > 0
        },

        isBoardVisible: function () {
            return this.isGameStarted() || this.getWinners().length > 0
        },

        isHost: function () {
            return this.getId() === this.getHostId();
        },

        isGameFinished: function () {
            return this.loveletter.global.gameFinished;
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

        getPlayerTurn: function () {
            return this.loveletter.global.playerTurn;
        },

        getGameStatus: function () {
            return this.loveletter.global.status;
        },

        getIngamePlayers: function () {
            return this.loveletter.global.players;
        },
    }
});

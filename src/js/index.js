import Vue from 'vue';
import Cookies from 'js-cookie';

import badge from './components/badge';
import lobby from './components/lobby';
import game from './components/game';

var conn;
var app = new Vue({
    el: "#app",
    components: {
        badge,
        lobby,
        game,
    },
    data: {
        loveletter: {
            global: {
                winners: {},
                outOfGameCards: [],
                guardianEffectChosenPlayer: 0,
                waitFor: '',
                status: '',
                outOfGamePlayers: [],
                protectedPlayers: [],
                gameStarted: false,
                gameFinished: false,
                playerTurn: 0,
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

        getUsername: function () {
            return Cookies.get('name');
        },

        setUsername: function () {
            Cookies.set('name', document.getElementById('username').value, {expires: 30});
            this.game.local.name = Cookies.get('name');
            this.send();
        },
    },
    computed: {
        isHost: function () {
            return this.game.local.id === this.game.global.hostid;
        },
    }
});

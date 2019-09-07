import Vue from 'vue';
import Cookies from 'js-cookie';

import lobby from './components/lobby';
import game from './components/game';
import headerbar from './components/headerbar';
import gameStart from './components/gameStart';

var conn;
var app = new Vue({
    el: "#app",
    components: {
        lobby,
        game,
        headerbar,
        gameStart,
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
            },
            local: {
                cards: {},
                openEffectCards: [],
                effectVisibleCard: [],
                allowedAction: ''
            }
        },
        game: {
            global: {
                players: [],
                hostid: 0,
                status: ''
            },
            local: {
                id: 0,
                name: '',
                canStartGame: false,
                isHost: false
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
                app.send();
            }
            console.log('END onmessage');
        };
    },
    methods: {
        send: function (action = '', params = {}) {
            var id = '';
            if (Cookies.get('id')) {
                id = Cookies.get('id');
            }
            var data = {
                id: id,
                name: this.game.local.name,
                action: action,
                params: params
            };
            conn.send(JSON.stringify(data));
            console.log('send identity to server', data);
        },

        setUsername: function () {
            this.game.local.name = document.getElementById('username').value;
            this.send();
        },
    },
    computed: {
        isHost: function () {
            return this.game.local.id === this.game.global.hostid;
        },
    }
});

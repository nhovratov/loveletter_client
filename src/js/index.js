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
        config: window.config,
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
        conn = new WebSocket(`ws://${this.config.server}:${this.config.port}`);

        conn.onopen = function (e) {
            app.local.connected = true;
            app.send();
        };

        conn.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.dataType === "game") {
                app.loveletter.global = data.global;
                app.loveletter.local = data.local;
            } else {
                app.game = data;
            }
            if (data.local.newId) {
                Cookies.set('id', data.local.newId, {expires: 30});
            }
            if (!Cookies.get('id')) {
                Cookies.set('id', data.local.newId, {expires: 30});
                app.send();
            }
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

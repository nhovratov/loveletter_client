import Vue from 'vue';

export default Vue.component(
    'lobby',
    {
        props: {
            global: Object,
            local: Object,
            players: Array,
            isHost: Boolean,
            gameStarted: Boolean
        },
        computed: {
            getActivePlayerCount: function () {
                var count = 0;
                if (!this.global.players) {
                    return 0;
                }
                this.global.players.forEach(function (player) {
                    if (player.connected) {
                        count += 1;
                    }
                });
                return count;
            },

            gameIsReadyAndCanStart: function () {
                return this.players.length >= 2 && !this.gameStarted && this.isHost;
            },
        },
        template: `
           <div class="lobby">
            <h2 class="lobby__header">Lobby</h2>
            <!-- Game status -->
            <span>{{global.status}}</span>

            <!-- Username enter -->
            <div v-if="!local.name">
                <label for="username">Dein Name:</label>
                <input @keyup.enter="$emit('set-username')" class="form-control" type="text" id="username">
            </div>

            <!-- Player num -->
            <div class="lobby__connections">Spieler online: {{getActivePlayerCount}}</div>

            <!-- Connection list -->
            <ul>
                <li class="font-weight-bold">
                    <span v-if="local.name">{{local.name}}</span>
                    #{{local.id}}
                    <span class="badge badge-info" v-if="isHost">Host</span>
                </li>
                <li
                    v-for="player in global.players"
                    v-if="global.players && player.id !== local.id"
                >
                    <span v-if="player.name">{{player.name}}</span>
                    #{{player.id}}
                    <span class="badge badge-info" v-if="player.id === global.hostid">Host</span>
                    <span class="badge badge-danger" v-if="!player.connected">disconnected</span>
                </li>
            </ul>

            <!-- Start game button, smash it! -->
            <button
                class="btn btn-primary"
                v-if="gameIsReadyAndCanStart"
                @click="$emit('start-game')"
            >
                Spiel starten
            </button>
        </div>
   `
    }
);

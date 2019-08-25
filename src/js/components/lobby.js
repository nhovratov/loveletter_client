import Vue from 'vue';

export default Vue.component(
    'lobby',
    {
        props: {
            status: String,
            players: Array,
            hostid: Number,
            playercount: Number,
            name: String,
            id: Number,
            username: String,
            isHost: Boolean,
            canStartGame: Boolean,
            gameStarted: Boolean,
            setUsername: Function
        },
        computed: {
            getActivePlayerCount: function () {
                var count = 0;
                if (!this.players) {
                    return 0;
                }
                this.players.forEach(function (player) {
                    if (player.connected) {
                        count += 1;
                    }
                });
                return count;
            },

            gameIsReady: function () {
                return this.canStartGame && !this.gameStarted;
            },
        },
        template: `
           <div class="lobby">
            <h2 class="lobby__header">Lobby</h2>
            <!-- Game status -->
            <span>{{status}}</span>

            <!-- Username enter -->
            <div v-if="!username">
                <label for="username">Dein Name:</label>
                <input @keyup.enter="setUsername" class="form-control" type="text" id="username">
            </div>

            <!-- Player num -->
            <div class="lobby__connections">Spieler online: {{getActivePlayerCount}}</div>

            <!-- Connection list -->
            <ul>
                <li class="font-weight-bold">
                    <span v-if="name">{{name}}</span>
                    #{{id}}
                    <span class="badge badge-info" v-if="isHost">Host</span>
                </li>
                <li
                    v-for="player in players"
                    v-if="players && player.id !== id"
                >
                    <span v-if="player.name">{{player.name}}</span>
                    #{{player.id}}
                    <span class="badge badge-info" v-if="player.id === hostid">Host</span>
                    <span class="badge badge-danger" v-if="!player.connected">disconnected</span>
                </li>
            </ul>

            <!-- Start game button, smash it! -->
            <button
                class="btn btn-primary"
                v-if="gameIsReady"
                v-on:click="$emit('start-game')"
            >
                Spiel starten
            </button>
        </div>
   `
    }
);

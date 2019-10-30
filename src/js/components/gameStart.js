import Vue from 'vue';

export default Vue.component(
    'game-start',
    {
        props: {
            players: Array,
            gameStarted: Boolean,
            isHost: Boolean
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

            gameIsReadyAndCanStart: function () {
                return this.getActivePlayerCount >= 2 && !this.gameStarted;
            },

            getActivePlayers: function () {
                var players = [];
                if (!this.players) {
                    return players;
                }
                this.players.forEach(function (player) {
                    if (player.connected) {
                        players.push(player);
                    }
                });
                return players;
            }
        },
        template: `
        <div v-if="!gameStarted" class="window window--center game-start">
        <div class="window__header">Mitspieler</div>
            <div class="window__body">
                <div class="game-start__rules">
                    <div class="game-start__allowed">Erlaubt: 2 - 4 Spieler</div>
                    <div class="game-start__size">{{getActivePlayerCount}} / 4</div>
                </div>
                <div class="window__players">
                    <div v-for="player in getActivePlayers" class="window__player button">{{player.name}} #{{player.id}}</div>
                </div>
            </div>
            <div
                v-if="isHost"
                class="game-start__footer"
            >
                <div
                    v-if="gameIsReadyAndCanStart"
                    @click="$emit('start-game')"
                    class="button button--primary"
                >
                    Spiel starten
                </div>
            </div>
        </div>
    `
    }
);

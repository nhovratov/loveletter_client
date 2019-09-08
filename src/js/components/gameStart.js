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
                return this.players.length >= 2 && !this.gameStarted && this.isHost;
            },
        },
        template: `
        <div v-if="!gameStarted" class="game-start">
        <div class="game-start__header">Mitspieler</div>
            <div class="game-start__body">
                <div class="game-start__rules">
                    <div class="game-start__allowed">Erlaubt: 2 - 4 Spieler</div>
                    <div class="game-start__size">{{getActivePlayerCount}} / 4</div>
                </div>
                <div class="game-start__players">
                    <div v-for="player in players" class="game-start__player button">{{player.name}} #{{player.id}}</div>
                </div>
            </div>
            <div>
                <div class="game-start__footer">
                    <div
                        v-if="gameIsReadyAndCanStart"
                        @click="$emit('start-game')"
                        class="button button--primary"
                    >
                        Spiel starten
                    </div>
                </div>
            </div>
        </div>
    `
    }
);

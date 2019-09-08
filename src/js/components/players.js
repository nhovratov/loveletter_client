import Vue from 'vue';

export default Vue.component(
    'players',
    {
        props: {
            global: Object,
            id: Number,
        },
        methods: {

            isWinner: function (id) {
                return this.global.winners.includes(id);
            },

            isProtected: function (id) {
                return this.global.protectedPlayers.includes(id);
            },

            isOutOfGame: function (id) {
                return this.global.outOfGamePlayers.includes(id);
            },
        },
        template: `
            <ul class="list-group mb-4">
                <li
                    class="list-group-item d-flex align-items-center"
                    v-for="player in global.players"
                    :class="[{
                        active: player.id === global.playerTurn
                    }]"
                >
                    {{player.name}} #{{player.id}}
                    <span
                        class="ml-2 badge badge-dark"
                        v-if="isOutOfGame(player.id)"
                    >
                        ausgeschieden
                    </span>
                    <span
                        class="ml-2 badge badge-success"
                        v-if="isWinner(player.id)"
                    >
                        gewonnen
                    </span>
                    <span
                        class="ml-2 badge badge-info"
                        v-if="isProtected(player.id)"
                    >
                        geschützt
                    </span>
                </li>
            </ul>
    `
    }
);

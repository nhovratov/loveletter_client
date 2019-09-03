import Vue from 'vue';

export default Vue.component(
    'players',
    {
        props: {
            global: Object,
            local: Object,
            id: Number,
            can: Function,
        },
        methods: {
            canChoosePlayer: function (id) {
                let allowedAction = this.local.allowedAction;
                return ['choosePlayer', 'chooseAnyPlayer'].includes(allowedAction)
                    && !this.isProtected(id)
                    && !this.isOutOfGame(id)
                    && (id !== this.id || allowedAction === 'chooseAnyPlayer');
            },

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
                    <button
                        class="btn btn-sm btn-warning ml-auto"
                        v-if="canChoosePlayer(player.id)"
                        @click="$emit('send', {action: 'choosePlayer', params: {id: player.id}})"
                    >
                        auswählen
                    </button>
                    <button
                        class="ml-2 btn btn-primary btn-sm"
                        v-if="can('selectFirstPlayer')"
                        @click="$emit('send', {action: 'selectFirstPlayer', params: {id: player.id}})"
                    >
                        auswählen
                    </button>
                </li>
            </ul>
    `
    }
);

import Vue from 'vue';

export default Vue.component(
    'choose-player',
    {
        props: {
            global: Object,
            local: Object,
            id: Number,
        },
        methods: {
            canChoosePlayer: function (id) {
                let allowedAction = this.local.allowedAction;
                return ['choosePlayer', 'chooseAnyPlayer'].includes(allowedAction)
                    && !this.isProtected(id)
                    && !this.isOutOfGame(id)
                    && (id !== this.id || allowedAction === 'chooseAnyPlayer');
            },

            isProtected: function (id) {
                return this.global.protectedPlayers.includes(id);
            },

            isOutOfGame: function (id) {
                return this.global.outOfGamePlayers.includes(id);
            },
        },
        template: `
            <div class="window">
                <div class="window__header">Wähle einen Spieler</div>
                    <div class="window__body">
                        <div class="window__players">
                            <div
                                v-for="player in global.players"
                                v-if="canChoosePlayer(player.id)"
                                :class="['window__player', 'button']"
                                @click="$emit('send', {action: 'choosePlayer', params: {id: player.id}})"
                            >
                                {{player.name}} #{{player.id}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `
    }
);

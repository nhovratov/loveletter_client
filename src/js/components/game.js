import Vue from 'vue';

import players from './players';
import guardian from './guardian';
import cards from './cards';
import active from './active';
import removed from './removed';
import visibleCard from './visibleCard';
import chooseFirstPlayer from './chooseFirstPlayer';
import choosePlayer from './choosePlayer';
import next from './next';

export default Vue.component(
    'game',
    {
        props: {
            global: Object,
            local: Object,
            id: Number
        },
        components: {
            players,
            guardian,
            cards,
            active,
            removed,
            visibleCard,
            chooseFirstPlayer,
            choosePlayer,
            next,
        },
        methods: {
            can: function (action) {
                return action === this.local.allowedAction;
            },
        },
        computed: {
            isBoardVisible: function () {
                return this.global.gameStarted || this.global.winners.length > 0
            },

            canChoosePlayer: function () {
                return ['choosePlayer', 'chooseAnyPlayer'].includes(this.local.allowedAction);
            }
        },
        template: `
            <div class="loveletter" v-if="isBoardVisible">
            
                <visible-card
                    v-if="local.effectVisibleCard.name"
                    :effectVisibleCard="local.effectVisibleCard"
                >
                </visible-card>
    
                <removed
                    :outOfGameCards="global.outOfGameCards"
                >
                </removed>
                
                <players
                    :global="global"
                    :id="id"
                >
                </players>
                
                <choose-first-player
                    v-if="can('selectFirstPlayer')"
                    :global="global"
                    :id="id"
                    @send="$emit('send', $event)"
                >
                </choose-first-player>
                
                <choose-player
                    v-if="canChoosePlayer"
                    :global="global"
                    :local="local"
                    :id="id"
                    @send="$emit('send', $event)"
                >
                </choose-player>
                
                <guardian
                    v-if="can('chooseGuardianEffectCard')"
                    :global="global"
                    @send="$emit('send', $event)"
                >
                </guardian>
                
                <p>Deine Karten:</p>
                <cards
                    :global="global"
                    :local="local"
                    @send="$emit('send', $event)"
                >
                </cards>
                
                <p>Aktive Karte:</p>
                <active
                    :active-card="global.activeCard"
                >
                </active>
                
                <next
                    v-if="global.gameStarted"
                    @send="$emit('send', $event)"
                >
                </next>
            </div>
        </div>
        `
    }
);

import Vue from 'vue';

import players from './players';
import guardian from './guardian';
import cards from './cards';
import active from './active';
import removed from './removed';
import visibleCard from './visibleCard';

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
        },
        template: `
            <div class="loveletter" v-if="isBoardVisible">
                <!-- Select first player -->
                <div class="mb-2" v-if="can('selectFirstPlayer')">
                    <p>Der Spieler der als letztes ein Rendezvous hatte beginnt:</p>
                </div>
                
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
                    :local="local"
                    :can="can"
                    :id="id"
                    @send="$emit('send', $event)"
                >
                </players>
                
                <guardian
                    :global="global"
                    :can="can"
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
            </div>
        </div>
        `
    }
);

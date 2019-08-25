import Vue from 'vue';

import players from './players';
import guardian from './guardian';
import cards from './cards';
import active from './active';
import discard from './discard';
import removed from './removed';
import priest from './priest';

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
            discard,
            removed,
            priest,
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
                <!-- Game status -->
                <div v-if="global.status" class="alert alert-info">{{global.status}}</div>
    
                <!-- Select first player -->
                <div class="mb-2" v-if="can('selectFirstPlayer')">
                    <p>Der Spieler der als letztes ein Rendezvous hatte beginnt:</p>
                </div>
                
                <priest
                    v-if="can('finishLookingAtCard')"
                    :priestEffectVisibleCard="local.priestEffectVisibleCard"
                    @send="$emit('send')"
                >
                </priest>
    
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
                    :can="can"
                    @send="$emit('send', $event)"
                >
                </active>
    
                <p>Ablagestapel:</p>
                <discard
                    v-for="card in global.discardPile"
                    :key="card.id"
                    :card="card"
                >
                </discard>
            </div>
        </div>
        `
    }
);

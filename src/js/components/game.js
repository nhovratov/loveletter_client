import Vue from 'vue';

import players from './players';
import guardian from './guardian';
import cards from './cards';
import active from './active';
import discard from './discard';

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
        },
        methods: {
            can: function (action) {
                return action === this.local.allowedAction;
            },
        },
        computed: {
            isOutOfGameCardsVisible: function () {
                return this.global.outOfGameCards.length > 0
            },

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
    
                <div
                    class="alert alert-success d-flex align-items-center"
                    v-if="can('finishLookingAtCard')"
                >
                    Diese Karte wurde durch den Priester aufgedeckt: {{local.priestEffectVisibleCard}}
                    <button
                            class="btn btn-success ml-auto"
                            @click="$emit('send')"
                    >
                        Fertig mit angucken
                    </button>
                </div>
    
                <!-- Removed cards (if only 2 people play) -->
                <div
                    class="alert alert-warning"
                    v-if="isOutOfGameCardsVisible"
                >
                    <span>Karten, die aus dem Spiel sind: </span>
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item" v-for="card in global.outOfGameCards">{{card.name}}</li>
                    </ul>
                </div>
                
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

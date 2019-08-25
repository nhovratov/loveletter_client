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
                            v-on:click="$emit('send')"
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
                    v-bind:global="global"
                    v-bind:local="local"
                    v-bind:can="can"
                    v-bind:id="id"
                    v-on:send="$emit('send', $event)"
                >
                </players>
                
                <guardian
                    v-bind:global="global"
                    v-bind:can="can"
                    v-on:send="$emit('send', $event)"
                >
                </guardian>
                
                <p>Deine Karten:</p>
                <cards
                    v-bind:global="global"
                    v-bind:local="local"
                    v-on:send="$emit('send', $event)"
                >
                </cards>
                
                <p>Aktive Karte:</p>
                <active
                    v-bind:active-card="global.activeCard"
                    v-bind:can="can"
                    v-on:send="$emit('send', $event)"
                >
                </active>
    
                <p>Ablagestapel:</p>
                <discard
                    v-for="card in global.discardPile"
                    v-bind:key="card.id"
                    v-bind:card="card"
                >
                </discard>
            </div>
        </div>
        `
    }
);

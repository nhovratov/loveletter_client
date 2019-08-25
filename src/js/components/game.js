import Vue from 'vue';

import players from './players';
import guardian from './guardian';

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
        },
        methods: {
            can: function (action) {
                return action === this.local.allowedAction;
            },

            canChooseCard: function (card) {
                return this.local.allowedAction === 'chooseCard' && !this.isPreventedByCountess(card.name);
            },

            isPreventedByCountess: function (cardname) {
                var cards = [];
                var handCards = this.local.cards;
                for (var key in handCards) {
                    if (handCards.hasOwnProperty(key)) {
                        cards.push(handCards[key]['name']);
                    }
                }
                if (!cards.includes('Gräfin')) {
                    return false;
                }
                return ['König', 'Prinz'].includes(cardname);
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
                    v-bind:local="local"
                    v-bind:can="can"
                    v-on:send="$emit('send', $event)"
                >
                </guardian>
    
                <!-- Hand cards -->
                <p>Deine Karten:</p>
                <transition-group
                        tag="div"
                        class="mb-4 d-flex"
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                >
                    <div class="card mr-2" v-for="(card, key) in local.cards" :key="card.cardnumber">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{card.name}} ({{card.value}})
                            </h5>
                            <p class="card-text">
                                {{card.text}}
                            </p>
                            <button
                                    v-if="canChooseCard(card)"
                                    v-on:click="$emit('send', {key: key})"
                                    class="btn btn-primary"
                            >
                                Karte spielen
                            </button>
                        </div>
                    </div>
                </transition-group>
    
                <!-- card on field -->
                <p>Spielfeld:</p>
                <div class="d-flex mb-4">
                    <div class="card" v-if="global.activeCard">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{global.activeCard.name}} ({{global.activeCard.value}})
                            </h5>
                            <p class="card-text">
                                {{global.activeCard.text}}
                            </p>
                            <button
                                class="btn btn-danger"
                                v-if="can('confirmDiscardCard')"
                                v-on:click="$emit('send')"
                            >
                                Auf Ablagestapel
                            </button>
                            <button
                                class="btn btn-success"
                                v-if="can('placeMaidCard')"
                                v-on:click="$emit('send')"
                            >
                                Offen vor dich hinlegen
                            </button>
                        </div>
                    </div>
                </div>
    
                <p>Ablagestapel:</p>
                <div v-for="card in global.discardPile">
                    <div class="d-flex">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{card.name}} ({{card.value}})
                                </h5>
                                <p class="card-text">
                                    {{card.text}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
);

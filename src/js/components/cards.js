import Vue from 'vue';

export default Vue.component(
    'cards',
    {
        props: {
            global: Object,
            local: Object
        },
        methods: {
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
        template: `
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
                                @click="$emit('send', {action: 'chooseCard', params: {key: key}})"
                                class="btn btn-primary"
                        >
                            Karte spielen
                        </button>
                    </div>
                </div>
            </transition-group>
    `
    }
);

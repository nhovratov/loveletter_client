import Vue from 'vue';

export default Vue.component(
    'cards',
    {
        props: {
            global: Object,
            local: Object
        },
        methods: {
            isPreventedByCountess: function (cardname) {
                var cards = [];
                var handCards = this.local.cards;
                for (var key in handCards) {
                    if (handCards.hasOwnProperty(key)) {
                        cards.push(handCards[key]['name']);
                    }
                }
                if (!cards.includes('countess')) {
                    return false;
                }
                return ['king', 'prince'].includes(cardname);
            },
        },
        template: `
            <transition-group
                    class="cards"
                    tag="div"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
            >
                <img
                    :src="'/res/img/cards/' + card.name + '.png'"
                    :class="['card', {disabled: isPreventedByCountess(card.name)}]"
                    v-for="(card, key) in local.cards"
                    :key="card.cardnumber"
                    @click="$emit('send', {action: 'chooseCard', params: {key: key}})"
                />
            </transition-group>
    `
    }
);

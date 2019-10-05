import Vue from 'vue';

export default Vue.component(
    'removed',
    {
        props: {
            outOfGameCards: Array
        },
        template: `
            <div class="removed-cards" v-if="outOfGameCards.length > 0">
                <div
                    v-for="card in outOfGameCards"
                    :class="['removed-cards__item', 'removed-cards__item--' + card.value]"
                    :title="card.name"
                >
                {{card.value}}
                </div>
            </div>
    `
    }
);

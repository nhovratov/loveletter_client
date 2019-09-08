import Vue from 'vue';

export default Vue.component(
    'visibleCard',
    {
        props: {
            effectVisibleCard: Object
        },
        template: `
            <div class="visible-card">
                <div class="visible-card__header">
                    Aufgedeckte Karte
                </div>
                <img
                    :src="'/res/img/cards/' + effectVisibleCard.name + '.png'"
                    :class="['visible-card__card']"
                />
            </div>
    `
    }
);

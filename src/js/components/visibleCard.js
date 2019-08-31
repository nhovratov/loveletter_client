import Vue from 'vue';

export default Vue.component(
    'visibleCard',
    {
        props: {
            effectVisibleCard: Array
        },
        template: `
            <div class="alert alert-success d-flex align-items-center">
                Diese Karte wurde aufgedeckt: {{effectVisibleCard.name}} ({{effectVisibleCard.value}})
            </div>
    `
    }
);

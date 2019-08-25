import Vue from 'vue';

export default Vue.component(
    'priest',
    {
        props: {
            priestEffectVisibleCard: String
        },
        template: `
            <div class="alert alert-success d-flex align-items-center">
                Diese Karte wurde durch den Priester aufgedeckt: {{priestEffectVisibleCard}}
                <button
                    class="btn btn-success ml-auto"
                    @click="$emit('send')"
                >
                    Fertig mit angucken
                </button>
            </div>
    `
    }
);

import Vue from 'vue';

export default Vue.component(
    'priest',
    {
        props: {
            effectVisibleCard: String
        },
        template: `
            <div class="alert alert-success d-flex align-items-center">
                Diese Karte wurde durch den Priester aufgedeckt: {{effectVisibleCard}}
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

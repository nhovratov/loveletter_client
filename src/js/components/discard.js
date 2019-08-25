import Vue from 'vue';

export default Vue.component(
    'discard',
    {
        props: {
            card: Object,
        },
        template: `
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
    `
    }
);

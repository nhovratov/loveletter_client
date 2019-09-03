import Vue from 'vue';

export default Vue.component(
    'active',
    {
        props: {
            activeCard: Object
        },
        template: `
            <div class="d-flex mb-4">
                <div class="card" v-if="activeCard">
                    <div class="card-body">
                        <h5 class="card-title">
                            {{activeCard.name}} ({{activeCard.value}})
                        </h5>
                        <p class="card-text">
                            {{activeCard.text}}
                        </p>
                    </div>
                </div>
            </div>
    `
    }
);

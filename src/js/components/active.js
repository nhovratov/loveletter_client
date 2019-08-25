import Vue from 'vue';

export default Vue.component(
    'active',
    {
        props: {
            activeCard: Object,
            can: Function
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
                        <button
                            class="btn btn-danger"
                            v-if="can('confirmDiscardCard')"
                            @click="$emit('send')"
                        >
                            Auf Ablagestapel
                        </button>
                        <button
                            class="btn btn-success"
                            v-if="can('placeMaidCard')"
                            @click="$emit('send')"
                        >
                            Offen vor dich hinlegen
                        </button>
                    </div>
                </div>
            </div>
    `
    }
);

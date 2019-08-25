import Vue from 'vue';

export default Vue.component(
    'removed',
    {
        props: {
            outOfGameCards: Array
        },
        template: `
            <div
                class="alert alert-warning"
                v-if="outOfGameCards.length > 0"
            >
                <span>Karten, die aus dem Spiel sind: </span>
                <ul class="list-inline mb-0">
                    <li class="list-inline-item" v-for="card in outOfGameCards">{{card.name}}</li>
                </ul>
            </div>
    `
    }
);

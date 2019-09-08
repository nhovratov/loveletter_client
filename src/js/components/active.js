import Vue from 'vue';

export default Vue.component(
    'active',
    {
        props: {
            activeCard: Object
        },
        template: `
            <img
                v-if="activeCard"
                :src="'/res/img/cards/' + activeCard.name + '.png'"
                :class="['active-card']"
            />
    `
    }
);

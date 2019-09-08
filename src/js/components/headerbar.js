import Vue from 'vue';

export default Vue.component(
    'headerbar',
    {
        props: {
            status: String
        },
        template: `
        <div class="headerbar">
            <div class="headerbar__logo">
                Love Letter
            </div>
            <div v-if="status" class="headerbar__text">{{status}}</div>
            <div v-else class="headerbar__text">Warte auf Mitspieler...</div>
        </div>
    `
    }
);

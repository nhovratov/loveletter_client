import Vue from 'vue';

export default Vue.component(
    'badge',
    {
        props: ['name', 'id'],
        template: '<div class="badge badge-success mb-4">verbunden <span v-if="name">{{name}}</span> #{{id}}</div>'
    }
);

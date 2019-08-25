import Vue from 'vue';

export default Vue.component(
    'badge',
    {
        props: {
          name: String,
          id: Number,
          isHost: Boolean
        },
        template: `
            <div>
                <div class="badge badge-success mb-4">verbunden <span v-if="name">{{name}}</span> #{{id}}</div>
                <div class="badge badge-info mb-4" v-if="isHost">Host</div>
            </div>
        `
    }
);

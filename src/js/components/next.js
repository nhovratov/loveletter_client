import Vue from 'vue';

export default Vue.component(
    'next',
    {
        template: `
        <div
            class="next button button--primary button--inverse"
            @click="$emit('send', {action: 'next'})"
        >
            Weiter
        </div>
    `
    }
);

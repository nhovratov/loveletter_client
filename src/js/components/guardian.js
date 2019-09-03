import Vue from 'vue';

export default Vue.component(
    'guardian',
    {
        props: {
            global: Object,
            can: Function
        },
        template: `
            <div v-if="can('chooseGuardianEffectCard')">
                <p>Wähle die Karte, die {{global.guardianEffectChosenPlayer}} auf der Hand hält!</p>
                <ul class="list-group mb-4">
                    <li
                        class="list-group-item d-flex align-items-center"
                        v-for="card in global.guardianEffectSelectableCards"
                    >
                        {{card}}
                        <button
                            class="btn btn-sm btn-success ml-auto"
                            @click="$emit('send', {action: 'chooseGuardianEffectCard', params: {card: card}})"
                        >
                            auswählen
                        </button>
                    </li>
                </ul>
            </div>
    `
    }
);

import Vue from 'vue';

export default Vue.component(
    'guardian',
    {
        props: {
            global: Object,
        },

        data: function() {
            return {
                translation: {
                    'priest': 'Priester',
                    'baron': 'Baron',
                    'maid': 'Zofe',
                    'prince': 'Prinz',
                    'king': 'König',
                    'countess': 'Gäfin',
                    'princess': 'Prinzessin'
                }
            }
        },
        template: `
            <div class="window">
                <div class="window__header">Wähle die Karte, die {{global.guardianEffectChosenPlayer}} auf der Hand hält!</div>
                <div class="window__body">
                    <div class="window__players">
                        <div
                            class="window__player button"
                            v-for="card in global.guardianEffectSelectableCards"
                            @click="$emit('send', {action: 'chooseGuardianEffectCard', params: {card: card}})"
                        >
                        {{translation[card]}}
                        </div>
                    </div>
                </div>
            </div>
    `
    }
);

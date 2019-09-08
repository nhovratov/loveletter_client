import Vue from 'vue';

export default Vue.component(
    'choose-first-player',
    {
        props: {
            global: Object,
            id: Number,
        },
        template: `
            <div class="window window--center">
                <div class="window__header">Der Spieler der als letztes ein Rendezvous hatte beginnt</div>
                    <div class="window__body">
                        <div class="window__players">
                        <div
                            v-for="player in global.players"
                            :class="['window__player', 'button']"
                            @click="$emit('send', {action: 'selectFirstPlayer', params: {id: player.id}})"
                        >
                            {{player.name}} #{{player.id}}
                        </div>
                    </div>
                </div>
            </div>
    `
    }
);

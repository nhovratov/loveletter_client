import Vue from 'vue';

export default Vue.component(
    'lobby',
    {
        data: () => {
            return {
                closed: false
            }
        },
        props: {
            global: Object,
            local: Object,
            players: Array,
            isHost: Boolean,
            gameStarted: Boolean
        },
        methods: {
            toggle: function () {
                this.closed = !this.closed;
            }
        },
        template: `
           <div class="lobby" :class="{'lobby--closed': closed}">
            <div class="lobby__header">
                <div v-if="!local.name">
                    <input @keyup.enter="$emit('set-username')" class="form-control lobby__name-input" type="text" id="username" placeholder="Namen eingeben...">
                </div>
                <div v-if="local.name">
                    <div class="lobby__name">{{local.name}} #{{local.id}}</div>
                </div>
                <div class="lobby-status">
                    <div class="lobby-status__item">
                        <div class="dot dot--online"></div>
                    </div>
                    <div v-if="isHost" class="lobby-status__item">
                        <i class="fas fa-user-tie lobby-status__icon--host"></i>
                    </div>
                </div>
                <div class="lobby__toggle" @click="toggle()">
                    <i class="fas lobby__toggle-icon" :class="[closed ? 'fa-plus' : 'fa-minus']"></i>
                </div>
            </div>

            <!-- Connection list -->
            <ul class="lobby__connections">
                <li
                    class="lobby__connection"
                    v-for="player in global.players"
                    v-if="global.players && player.id !== local.id"
                >
                    <span v-if="player.name">{{player.name}} #{{player.id}}</span>
                    <span v-if="!player.name">Anonymous #{{player.id}}</span>
                    <div class="lobby-status lobby-status--sm">
                        <div class="lobby-status__item">
                            <div class="dot" :class="[player.connected ? 'dot--online' : 'dot--offline']"></div>
                        </div>
                        <div class="lobby-status__item" v-if="player.id === global.hostid">
                            <i class="fas fa-user-tie lobby-status__icon--host"></i>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Start game button, smash it! -->
<!--            <button-->
<!--                class="btn btn-primary"-->
<!--                v-if="gameIsReadyAndCanStart"-->
<!--                @click="$emit('start-game')"-->
<!--            >-->
<!--                Spiel starten-->
<!--            </button>-->
        </div>
   `
    }
);

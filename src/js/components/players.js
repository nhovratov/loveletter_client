import Vue from 'vue';

export default Vue.component(
    'players',
    {
        props: {
            global: Object,
            id: Number,
        },
        methods: {

            isWinner: function (id) {
                return this.global.winners.includes(id);
            },

            isProtected: function (id) {
                return this.global.protectedPlayers.includes(id);
            },

            isOutOfGame: function (id) {
                return this.global.outOfGamePlayers.includes(id);
            },
        },
        template: `
            <div class="players">
                <div
                    class="players__player"
                    v-for="player in global.players"
                    :class="[{
                        'players__player--active': player.id === global.playerTurn,
                        'players__player--protected': isProtected(player.id),
                        'players__player--out': isOutOfGame(player.id),
                        'players__player--won': isWinner(player.id),
                    }]"
                >
                    <div class="players__left">
                        <div class="players__top">
                            <div class="players__name">
                                {{player.name}} #{{player.id}}
                            </div>
                            <div class="players__wins">
                                <i v-for="n in player.wins" class="players__win fas fa-heart"></i>
                            </div>
                        </div>
                        <div class="players__bottom">
                            <i class="players__discard-icon fas fa-layer-minus"></i>
                            <div class="players__discards">
                                <div v-for="card in player.discardPile" :class="['players__discard', 'players__discard--' + card.value]">{{card.value}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="players__status"></div>
                </div>
            </div>
    `
    }
);

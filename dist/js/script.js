var app = new Vue({
    el: "#app",
    data: {
        game: {
            global: {},
            local: {}
        },
        local: {}
    },
    mounted: function () {
        window.conn = new WebSocket('ws://127.0.0.1:8080');

        conn.onopen = function (e) {
            app.local.connected = true;
            if (Cookies.get('id')) {
                app.game.local.id = Cookies.get('id');
                conn.send(JSON.stringify(app.game.local));
            }
        };

        conn.onmessage = function (e) {
            app.game = JSON.parse(e.data);
            if (!Cookies.get('id')) {
                Cookies.set('id', app.game.local.id);
            }
        };
    }

});

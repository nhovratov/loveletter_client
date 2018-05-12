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
        };

        conn.onmessage = function (e) {
            app.game = JSON.parse(e.data);
        };
    }

});

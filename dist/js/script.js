var app = new Vue({
    el: "#app",
    data: {
        connected: false,
        cards: []
    },
    beforeMount: function () {
        window.conn = new WebSocket('ws://127.0.0.1:8080');

        conn.onopen = function (e) {
            app.connected = true;
        };

        conn.onmessage = function (e) {
            app.cards = JSON.parse(e.data);
        };
    }

});

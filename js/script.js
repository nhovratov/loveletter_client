var conn = (function () {
    var conn = new WebSocket('ws://127.0.0.1:8080');

    conn.onopen = function (e) {
        document.getElementById('messages').innerHTML += "<p>Du bist verbunden!</p>";
    };

    conn.onmessage = function (e) {

    };
    return conn;
}());

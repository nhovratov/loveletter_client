# Loveletter client app

This is the client side application of the loveletter card game.
Wikipedia: https://de.wikipedia.org/wiki/Love_Letter_(Spiel)

Here you can find the server side app: https://github.com/nhovratov/loveletter_server

## Websocket
This app uses websockets to connect to the game server in order exchange data between players.

## Vue
Vue is used as the frontend rendering framework

## Run locally

`docker run -d --name loveletter_client -p 8888:80 nikitah/loveletter_client`

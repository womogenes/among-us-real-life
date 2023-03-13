# Welcome to Colyseus!

This project has been created using [⚔️ `create-colyseus-app`](https://github.com/colyseus/create-colyseus-app/) - an npm init template for kick starting a Colyseus project.

[Colyseus documentation](http://docs.colyseus.io/)

## Usage

Make sure you've `cd`'d into the `server` folder.

`npm start` to start the server (see **Structure** below)

Alternatively, `npm run dev` to start the server with nodemon.

## Structure

- `index.js`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `src/rooms/MyRoom.js`: an empty room handler for you to implement your logic
- `src/rooms/schema/MyRoomState.js`: an empty schema used on your room's state.
- `package.json`:
  - `scripts`:
    - `npm start`: runs `node index.js`
    - `npm test`: runs mocha test suite
    - `npm run loadtest`: runs the [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/) tool for testing the connection, using the `loadtest/example.js` script.
    - `npm run dev`: runs `nodemon index.js` so that server is auto-reloaded with every change (more on nodemon: https://www.npmjs.com/package/nodemon)

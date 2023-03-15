import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';

import { GameRoom } from './rooms/GameRoom.js';
import { LobbyRoom } from './rooms/LobbyRoom.js';

export default Arena.default({
  getId: () => 'Your Colyseus App',

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('lobby', LobbyRoom);

    // Declare all possible game codes
    for (let i = 0; i < 10000; i++) {
      const code = i.toString().padStart(4, '0');
      gameServer.define(code, GameRoom, { code });
    }
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     */
    app.get('/', (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use('/colyseus', monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});

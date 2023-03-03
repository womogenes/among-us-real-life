import { Room } from '@colyseus/core';

import { GameRoomState } from './schema/GameRoomState.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState());

    /* this.onMessage('pingServer', (client, message) => {
      console.log(`Server pinged at ${Date.now()}`);
      client.send('pong', null);
    }); */

    this.onMessage('location', (client, loc) => {
      console.log(client.sessionId, loc.timestamp);
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

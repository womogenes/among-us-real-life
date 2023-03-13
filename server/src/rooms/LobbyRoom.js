import { Room } from '@colyseus/core';

import { LobbyRoomState } from './schema/LobbyRoomState.js';

export class LobbyRoom extends Room {
  onCreate(options) {
    this.setState(new LobbyRoomState());

    this.onMessage('createNewRoom', () => {
      console.log('hello');
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined lobby!');
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

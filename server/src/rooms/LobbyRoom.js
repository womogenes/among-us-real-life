import { Room } from '@colyseus/core';

import { LobbyRoomState } from './schema/LobbyRoomState.js';

export let onCreateGameRoom;

export class LobbyRoom extends Room {
  onCreate(options) {
    this.setState(new LobbyRoomState());

    this.onMessage('createNewGame', (client, message) => {
      // Generate new room
      const code = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      console.log(code);

      client.send('gameCreated', code);
    });

    onCreateGameRoom = (client, room) => {
      this.state.rooms.push(room);
    };
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

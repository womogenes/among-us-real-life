import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';
import { onCreateGameRoom } from './LobbyRoom.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState());

    this.onMessage('location', (client, loc) => {
      this.state.players[client.sessionId].location.update(loc.coords);
    });

    onCreateGameRoom(this);
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
    this.state.players.set(client.sessionId, new Player(client.sessionId));
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

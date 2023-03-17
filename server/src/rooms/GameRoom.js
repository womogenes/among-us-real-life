import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';
import { onCreateGameRoom, onDisposeGameRoom } from './LobbyRoom.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState(options.code));

    this.onMessage('location', (client, loc) => {
      this.state.players[client.sessionId].location.update(loc.coords);
    });

    // Notify the lobby that this room has been created
    onCreateGameRoom(this);
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
    const isHost = this.state.players.size == 0;
    this.state.players.set(
      client.sessionId,
      new Player(client.sessionId, isHost)
    );

    this.state.refresh += 1;
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }

  async onDispose() {
    console.log('Game room', this.roomId, 'disposing...');
    onDisposeGameRoom(this.state.code);
  }
}

import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';
import { onCreateGameRoom, onDisposeGameRoom } from './LobbyRoom.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setMetadata({ code: options.code });
    this.setState(new GameRoomState(options.code));

    this.onMessage('location', (client, loc) => {
      this.state.players[client.sessionId].location.update(loc.coords);
    });

    onCreateGameRoom(this);

    this.state.refresh += 1;
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
    this.state.players.set(client.sessionId, new Player(client.sessionId));
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

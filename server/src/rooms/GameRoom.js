import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';
import { onCreateGameRoom, onDisposeGameRoom } from './LobbyRoom.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState(options.code));

    this.onMessage('location', (client, loc) => {
      this.state.players
        .find((p) => p.sessionId === client.sessionId)
        .location.update(loc.coords);
    });

    this.onMessage('setUsername', (client, username) => {
      const idx = this.state.players.findIndex(
        (p) => p.sessionId === client.sessionId
      );
      this.state.players[idx].username = username;
    });

    this.onMessage('startGame', (client) => {
      // Verify that only host can start the game
      if (
        client.sessionId !== this.state.players.find((p) => p.isHost).sessionId
      ) {
        return;
      }

      this.broadcast('gameStarted');
    });

    // Notify the lobby that this room has been created
    onCreateGameRoom(this);
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
    const isHost = this.state.players.length === 0;
    this.state.players.push(new Player(client.sessionId, isHost));

    this.state.refresh += 1;
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
    const removeIdx = this.state.players.findIndex(
      (p) => p.sessionId === client.sessionId
    );
    this.state.players.splice(removeIdx, 1);

    if (this.state.players.size > 0) {
      this.state.players[0].isHost = true;
    }
  }

  async onDispose() {
    console.log('Game room', this.roomId, 'disposing...');
    onDisposeGameRoom(this.state.code);
  }
}

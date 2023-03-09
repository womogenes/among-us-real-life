import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState());

    this.onMessage('location', (client, loc) => {
      const clientIndex = this.state.players.findIndex(
        (player) => player.sessionId == client.sessionId
      );
      this.state.players[clientIndex].location.update(loc.coords);
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');

    this.state.players.push(new Player(client.sessionId));
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
    const clientIndex = this.state.players.findIndex(
      (player) => player.sessionId === client.sessionId
    );
    this.state.players.splice(clientIndex, 1);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

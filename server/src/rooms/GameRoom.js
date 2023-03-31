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

    this.onMessage('startGame', (client, settings) => {
      console.log(`client ${client.sessionId} started`);

      // Verify that only host can start the game
      const isHost =
        client.sessionId === this.state.players.find((p) => p.isHost).sessionId;
      if (!isHost) {
        return;
      }

      this.broadcast('gameStarted');
      this.state.gameStarted = true;

      // Save the settings given by client

      this.state.settings = settings;
      console.log(this.state.settings);
      console.log('YESS');
    });

    this.onMessage('settingsUpdated', (client, settings) => {
      console.log(settings);
      console.log('hello');
      this.state.settings = settings;
    });

    this.onMessage('endGame', (client) => {
      const isHost =
        client.sessionId === this.state.players.find((p) => p.isHost).sessionId;
      if (!isHost) {
        return;
      }
      this.broadcast('gameEnded');
      this.disconnect();
    });

    // Notify the lobby that this room has been created
    onCreateGameRoom(this);
  }

  onAuth(client, options, request) {
    return !this.state.gameStarted;
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
    const isHost = this.state.players.length === 0;
    this.state.players.push(new Player(client.sessionId, isHost));

    this.state.refresh += 1;
    this.broadcast('updateClientSettings', this.state.settings);
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

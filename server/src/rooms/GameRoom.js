import { Room } from '@colyseus/core';

import { GameRoomState, Player } from './schema/GameRoomState.js';
import {
  onCreateGameRoom,
  onDisposeGameRoom,
  onGameStart,
} from './LobbyRoom.js';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState(options.code));

    this.onMessage('location', (client, loc) => {
      // !! HACK !! to catch incorrectly formatted client data
      const newCoords = loc.coords || loc;

      this.state.players
        .find((p) => p.sessionId === client.sessionId)
        .location.update(newCoords);
    });

    this.onMessage('deltaLocation', (client, dLoc) => {
      // dLoc is of the form {latitude: ..., longitude: ...}
      this.state.players
        .find((p) => p.sessionId === client.sessionId)
        .location.deltaUpdate(dLoc);
    });

    this.onMessage('completeTask', (client, taskId) => {
      const playerIdx = this.state.players.findIndex(
        (p) => p.sessionId === client.sessionId
      );
      const taskIdx = this.state.players[playerIdx].tasks.findIndex(
        (task) => task.taskId === taskId
      );

      this.state.players[playerIdx].tasks[taskIdx].complete = true;
    });

    this.onMessage('setUsername', (client, username) => {
      this.state.players.find(
        (p) => p.sessionId === client.sessionId
      ).username = username;
    });

    this.onMessage('playerDeath', (client, sessionId) => {
      let player = this.state.players.find((p) => p.sessionId === sessionId);
      player.isAlive = false;
      player.lastAliveLocation = player.location;
      this.broadcast('emergencyMeeting');
    });

    this.onMessage('startGame', (client) => {
      console.log(`client ${client.sessionId} started`);

      // Verify that only host can start the game
      const hostSessionId = this.state.players.find((p) => p.isHost).sessionId;
      const isHost = client.sessionId === hostSessionId;
      if (!isHost) {
        return;
      }

      // Assign an impostor (for now, make it the host)
      this.state.players.find((p) => p.isHost).isImpostor = true;

      // Extremely hacky and bad
      // Necessary to make impostor assignment work
      setTimeout(() => {
        this.broadcast('gameStarted');
      }, 100);

      this.state.gameStarted = true;
      this.state.gameState = 'normal';
      onGameStart(this);
    });

    this.onMessage('settingsUpdated', (client, settings) => {
      this.state.settings.update(settings);
      this.state.refresh++;
    });

    // Currently not used
    this.onMessage('endGame', (client) => {
      const isHost =
        client.sessionId === this.state.players.find((p) => p.isHost).sessionId;
      if (!isHost) {
        return;
      }
      this.broadcast('gameEnded');
      this.disconnect();
    });

    this.onMessage('startVoting', () => {
      this.state.votes = new Map();
    });

    this.onMessage('vote', (client, vote) => {
      let voter = Object.keys(vote)[0];
      let target = vote[voter];
      this.state.votes.set(voter, target);
      // console.log(this.state.votes.$items);
    });

    // Notify the lobby that this room has been created
    onCreateGameRoom(this);
  }

  onAuth(client, options, request) {
    return true;

    // Temporarily allow joining an in-progress game for the sake of testing
    return !this.state.gameStarted;
  }

  onJoin(client, options) {
    console.log(`${client.sessionId} joined room ${this.state.code}!`);
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

    if (this.state.players.length > 0) {
      this.state.players[0].isHost = true;
    }
  }

  async onDispose() {
    console.log('Game room', this.roomId, 'disposing...');
    onDisposeGameRoom(this.state.code);
  }
}

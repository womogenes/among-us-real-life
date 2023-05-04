import { Room } from '@colyseus/core';

import {
  GameRoomState,
  Player,
  Task,
  Location,
} from './schema/GameRoomState.js';
import {
  onCreateGameRoom,
  onDisposeGameRoom,
  onGameStart,
} from './LobbyRoom.js';

import { nanoid } from 'nanoid';

export class GameRoom extends Room {
  onCreate(options) {
    this.setState(new GameRoomState(options.code));

    this.onMessage('location', (client, loc) => {
      const player = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      player.trueLocation.update(loc);
      if (player.isAlive) player.location.update(loc);
    });

    this.onMessage('deltaLocation', (client, dLoc) => {
      // dLoc is of the form {latitude: ..., longitude: ...}
      const player = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      player.trueLocation.deltaUpdate(dLoc);
      if (player.isAlive) player.location.deltaUpdate(dLoc);
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
      player.location.update(player.location);
    });

    this.onMessage('startEmergencyMeeting', (client) => {
      this.state.gameState = 'emergency';
      this.broadcast('emergencyMeeting');
      console.log('emergency meeting started');
    });

    this.onMessage('o2', () => {
      console.log('sabotage!!!!');
      const newId1 = nanoid();
      const newTask1 = new Task(
        'o2',
        new Location(47.731386, -122.327199, 0),
        newId1
      );
      const newId2 = nanoid();
      const newTask2 = new Task(
        'o2',
        new Location(47.737305, -122.33942, 0),
        newId2
      );
      this.state.players.forEach((p) => {
        p.tasks.push(newTask1);
        p.tasks.push(newTask2);
      });
    });

    function emergencyDist(playerCoords, emCoords) {
      /* 111139 converts lat and long in degrees to meters */
      const x =
        111139 *
        Math.abs(Math.abs(playerCoords.latitude) - Math.abs(emCoords.latitude));
      const y =
        111139 *
        Math.abs(
          Math.abs(playerCoords.longitude) - Math.abs(emCoords.longitude)
        );
      const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      return dist;
    }

    this.onMessage('emergencyMeetingLoc', (client, emergencyMeetingLoc) => {
      let inMeetingCount = 0;
      let playerCount = 0;
      for (let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].isAlive == true) {
          playerCount++;
          let dist = emergencyDist(
            this.state.players[i].location,
            emergencyMeetingLoc
          );
          if (dist < 200) {
            console.log('YEAHHHHH');
            inMeetingCount++;
          }
        }
      }
      if (playerCount == inMeetingCount) {
        console.log('Begin emergency meeting yay');
        this.broadcast('beginEmerMeeting');
      }
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

    const availIcons = ['blue', 'green', 'red', 'white'];
    const usedIcons = this.state.players.map((player) => player.icon);
    const icon = availIcons.find((i) => !usedIcons.includes(i));

    const isHost = this.state.players.length === 0;
    this.state.players.push(new Player(client.sessionId, isHost, icon));

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

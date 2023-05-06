import { Room } from '@colyseus/core';
import * as schema from '@colyseus/schema';
const { MapSchema } = schema;

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
import { findDist } from '../utils.js';

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

      checkCanStartVoting();
    });

    this.onMessage('deltaLocation', (client, dLoc) => {
      // dLoc is of the form {latitude: ..., longitude: ...}
      const player = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      player.trueLocation.deltaUpdate(dLoc);
      if (player.isAlive) player.location.deltaUpdate(dLoc);

      checkCanStartVoting();
    });

    // Check if everyone is in range to begin voting
    const checkCanStartVoting = () => {
      if (this.state.gameState !== 'emergency') return;
      if (!this.state.emergencyMeetingLocation) return;

      // Check if all players are within 30m of emergency location
      const allInRange = this.state.players.every(
        (player) =>
          !player.isAlive ||
          findDist(player.location, this.state.emergencyMeetingLocation) < 30
      );
      if (allInRange) {
        startVoting();
      }
    };

    const startVoting = () => {
      this.state.votes = new MapSchema();
      this.state.gameState = 'voting';
      this.state.votingTimer = this.state.settings.votingTimer; // Reset the timer
      this.broadcast('startVoting');
      this.refresh += 1;

      let handle = setInterval(() => {
        this.state.votingTimer--;

        if (this.state.votingTimer <= 0) {
          // End condition
          clearInterval(handle);

          // Determine who gets killed
          let countsObj = {};
          for (let vote of this.state.votes.values()) {
            countsObj[vote] = countsObj[vote] ? countsObj[vote] + 1 : 1;
          }
          let counts = Object.entries(countsObj);
          counts.sort((a, b) => a[1] < b[1]);

          // Is there a tie?
          const isTie =
            counts.length === 0 ||
            (counts.length >= 2 && counts[0][1] === counts[1][1]);

          if (isTie) {
            this.broadcast('playerKilled', null);
          } else {
            const killed = counts[0][0];
            this.state.players.find(
              (p) => p.sessionId === killed
            ).isAlive = false;
            this.broadcast('playerKilled', killed);
          }

          this.state.gameState = 'normal';
          this.state.emergencyMeetingLocation = new Location();
        }
      }, 1000);
    };

    this.onMessage('startVoting', () => {
      if (this.state.gameState === 'voting') return;

      this.state.votes = new Map();
      startVoting();
    });

    this.onMessage('vote', (client, vote) => {
      let voter = client.sessionId;

      // Double vote effectively cancels
      if (vote === this.state.votes.get(voter)) {
        this.state.votes.delete(voter);
      } else {
        this.state.votes.set(voter, vote);
      }
    });

    this.onMessage('completeTask', (client, taskId) => {
      const playerIdx = this.state.players.findIndex(
        (p) => p.sessionId === client.sessionId
      );
      const taskIdx = this.state.players[playerIdx].tasks.findIndex(
        (task) => task.taskId === taskId
      );

      if (taskIdx === -1) return; // Probably a dev task

      this.state.players[playerIdx].tasks[taskIdx].complete = true;
      const sabotageTaskIndex = this.state.sabotageTaskList.findIndex(
        (task) => task.taskId === taskId
      );

      if (this.state.players[playerIdx].tasks[taskIdx].name === 'o2') {
        this.broadcast('task complete', taskId);
      }

      if (sabotageTaskIndex != -1) {
        this.state.sabotageTaskList.splice(sabotageTaskIndex, 1);
      }

      if (this.state.sabotageTaskList.length == 0) {
        this.broadcast('sabotageOver');
        this.state.players.forEach((p) => {
          let taskIndex = 0;
          while (taskIndex != -1) {
            taskIndex = p.tasks.findIndex((task) => task.name === 'o2');
            if (taskIndex != -1) {
              p.tasks.splice(taskIndex, 1);
            }
          }
        });
      }
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

    this.onMessage('callEmergency', (client, location) => {
      this.state.gameState = 'emergency';
      this.state.emergencyMeetingLocation.update(location);

      console.log('emergency meeting called');
    });

    this.onMessage('o2', () => {
      this.broadcast('sabotage');
      console.log('sabotage!!!!');
      const newId1 = nanoid();
      const newTask1 = new Task(
        'o2',
        new Location(47.731502, -122.32804, 0), // 47.73731712202693, -122.3394061888169 Felix's Coords
        newId1
      );
      const newId2 = nanoid();
      const newTask2 = new Task(
        'o2',
        new Location(47.731518, -122.327982, 0), // 47.737305, -122.33942 Felix's Coords
        newId2
      );
      this.state.sabotageTaskList.push(newTask1);
      this.state.sabotageTaskList.push(newTask2);
      this.state.players.forEach((p) => {
        p.tasks.push(newTask1);
        p.tasks.push(newTask2);
      });
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
      }, 1000);

      this.state.gameStarted = true;
      this.state.gameState = 'normal';
      onGameStart(this);
    });

    this.onMessage('settingsUpdated', (client, settings) => {
      this.state.settings.update(settings);
      this.state.refresh += 1;
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
      if (this.state.gameState === 'voting') return;

      this.state.votes = new Map();
      startVoting();
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

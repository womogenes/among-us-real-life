import { Room } from '@colyseus/core';
import * as schema from '@colyseus/schema';
const { MapSchema } = schema;

import {
  GameRoomState,
  Skin,
  Hat,
  Icon,
  Player,
  Task,
  EmergencyButton,
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

    this.onMessage('updateSkin', (client, skin) => {
      const player = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      player.icon.update(new Skin(skin), player.icon.hat);
    });

    this.onMessage('updateHat', (client, hat) => {
      const player = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      player.icon.update(player.icon.skin, new Hat(hat));
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

    const endSabotage = () => {
      this.broadcast('sabotageOver');
      this.state.gameState = 'normal';
      this.state.sabotageCooldown = true;
      this.state.players.forEach((p) => {
        let taskIndex = 0;
        while (taskIndex != -1) {
          taskIndex = p.tasks.findIndex(
            (task) => task.name === 'o2' || task.name === 'reactor'
          );
          if (taskIndex != -1) {
            p.tasks.splice(taskIndex, 1);
          }
        }
      });
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
          counts.sort((a, b) => b[1] - a[1]);

          // Is there a tie?
          const isTie =
            counts.length === 0 ||
            (counts.length >= 2 && counts[0][1] === counts[1][1]);

          if (isTie) {
            this.broadcast('playerEjected', null);
          } else {
            const killed = counts[0][0];

            if (killed != 'skip') {
              // If most players vote to skip, don't update state
              this.state.players.find(
                (p) => p.sessionId === killed
              ).isAlive = false;
            }

            this.broadcast('playerEjected', killed);
          }

          this.state.players.forEach((p) => {
            // Clears all the bodies
            if (!p.isAlive) {
              p.location.update({ latitude: 0, longitude: 0, altitude: 0 });
            }
          });

          this.state.gameState = 'normal';
          this.state.emergencyMeetingLocation = new Location();

          let crewCount = 0;
          let impostorCount = 0;
          for (let i = 0; i < this.state.players.length; i++) {
            if (this.state.players[i].isAlive == true) {
              if (this.state.players[i].isImpostor == false) {
                crewCount++;
              } else {
                impostorCount++;
              }
            }
          }
          if (crewCount <= impostorCount) {
            this.broadcast('endedGame', 'impostor');
          } else if (impostorCount == 0) {
            this.broadcast('endedGame', 'crewmate');
          }
        }
      }, 1000);
    };

    this.onMessage('startVoting', () => {
      if (this.state.gameState === 'voting') return;

      this.state.votes = new Map();
      startVoting();
    });

    this.onMessage('vote', (client, vote) => {
      const voter = client.sessionId;
      const { isAlive } = this.state.players.find(
        (p) => p.sessionId === client.sessionId
      );
      if (!isAlive) return;

      // Double vote effectively cancels
      if (vote === this.state.votes.get(voter)) {
        this.state.votes.delete(voter);
      } else {
        this.state.votes.set(voter, vote);
      }
    });

    this.onMessage('completeTask', (client, taskId, sabotageActive) => {
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

      if (
        this.state.players[playerIdx].tasks[taskIdx].name === 'o2' ||
        this.state.players[playerIdx].tasks[taskIdx].name === 'reactor'
      ) {
        this.broadcast('task complete', taskId);
      }

      if (sabotageTaskIndex != -1) {
        this.state.sabotageTaskList.splice(sabotageTaskIndex, 1);
      }

      if (this.state.sabotageTaskList.length == 0 && sabotageActive) {
        endSabotage();
      }

      let totalTaskCount = 0;
      for (let player of this.state.players) {
        totalTaskCount += player.isImpostor ? 0 : player.tasks.length;
      }
      let completedTaskCount = 0;
      for (let player of this.state.players) {
        if (player.isImpostor) continue;
        for (let task of player.tasks) {
          completedTaskCount += task.complete ? 1 : 0;
        }
      }

      if (totalTaskCount == completedTaskCount) {
        // Crewmates completed all the tasks and win!
        this.broadcast('endedGame', 'crewmate');
      }
    });

    this.onMessage('completeFakeTask', (client, taskId) => {
      const playerIdx = this.state.players.findIndex(
        (p) => p.sessionId === client.sessionId
      );
      const taskIdx = this.state.players[playerIdx].tasks.findIndex(
        (task) => task.taskId === taskId
      );

      if (taskIdx === -1) return; // Probably a dev task

      this.state.players[playerIdx].tasks[taskIdx].complete = true;
    });

    this.onMessage('setUsername', (client, username) => {
      this.state.players.find(
        (p) => p.sessionId === client.sessionId
      ).username = username;
    });

    this.onMessage('playerDeath', (client, sessionId) => {
      let player = this.state.players.find((p) => p.sessionId === sessionId);
      this.broadcast('you died', { sessionId: sessionId, client: client });

      player.isAlive = false;

      player.location.update(player.location);
      let crewCount = 0;
      let impostorCount = 0;
      for (let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].isAlive == true) {
          if (this.state.players[i].isImpostor == false) {
            crewCount++;
          } else {
            impostorCount++;
          }
        }
      }
      if (crewCount <= impostorCount) {
        this.broadcast('endedGame', 'impostor');
      }
    });

    this.onMessage('callEmergency', (client, message) => {
      if (this.state.gameState === 'sabotage') {
        if (message.type === 'report') {
          endSabotage();
          this.state.gameState = 'emergency';
          this.state.emergencyMeetingLocation.update(message.location);
          let player = this.state.players.find(
            (p) => p.sessionId === client.sessionId
          );
          this.broadcast('emergency called', {
            caller: player,
            body: message.body,
          });
        }
      } else {
        console.log('emergency');
        this.state.gameState = 'emergency';
        this.state.emergencyMeetingLocation.update(message.location);
        let player = this.state.players.find(
          (p) => p.sessionId === client.sessionId
        );
        if (message.type === 'button') {
          player.emergency[0].uses = player.emergency[0].uses - 1;
        }
        this.broadcast('emergency called', {
          caller: player,
          body: message.body,
        });
      }
    });

    this.onMessage('o2', () => {
      this.state.gameState = 'sabotage';
      this.broadcast('sabotage');
      const newId1 = nanoid();
      const newTask1 = new Task(
        'o2',
        new Location(47.732916, -122.328263, 0),
        newId1
      );
      const newId2 = nanoid();
      const newTask2 = new Task(
        'o2',
        new Location(47.732511, -122.328258, 0),
        newId2
      );
      this.state.sabotageTaskList.push(newTask1);
      this.state.sabotageTaskList.push(newTask2);
      this.state.players.forEach((p) => {
        p.tasks.push(newTask1);
        p.tasks.push(newTask2);
      });
    });

    this.onMessage('reactor', () => {
      this.state.gameState = 'sabotage';
      this.broadcast('sabotage');
      const newId1 = nanoid();
      const newTask1 = new Task(
        'reactor',
        new Location(47.73376422882705, -122.3279082321323, 0), // 47.73731941803852, -122.33940977513485 Felix 47.73376422882705, -122.3279082321323 AAC
        newId1
      );
      const newId2 = nanoid();
      const newTask2 = new Task(
        'reactor',
        new Location(47.73365688882325, -122.32840790712194, 0), // 47.737304536128356, -122.33942251562718 Felix 47.73365688882325, -122.32840790712194 AAC
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

      let impostorNum = this.state.settings.impostorNum;

      if (impostorNum != 0) {
        const set = new Set();
        while (set.size < impostorNum) {
          set.add(Math.floor(Math.random() * this.state.players.length));
        }
        for (let i of set) {
          this.state.players[i].isImpostor = true;
        }
      }

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

    this.onMessage('startVoting', () => {
      if (this.state.gameState === 'voting') return;

      this.state.votes = new Map();
      startVoting();
    });

    this.onMessage('sabotageDeath', () => {
      this.broadcast('endedGame', 'impostor');
    });

    // Notify the lobby that this room has been created
    onCreateGameRoom(this);
  }

  onAuth(client, options, request) {

    if(this.state.players.length >= 18) { // Player limit of 18
      return false;
    }
    return !this.state.gameStarted;
  }

  onJoin(client, options) {
    console.log(`${client.sessionId} joined room ${this.state.code}!`);

    const randSkin = this.state.skinList.filter(
      (skin) => !this.state.players.find((p) => p.icon.skin === skin)
    )[0]; // Picks first skin from array of unused skins

    const isHost = this.state.players.length === 0;
    this.state.players.push(
      new Player(client.sessionId, isHost, new Icon(randSkin, new Hat('none')))
    );

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

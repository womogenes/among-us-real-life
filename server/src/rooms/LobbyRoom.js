import { Room } from '@colyseus/core';
import { LobbyRoomState } from './schema/LobbyRoomState.js';

export let onCreateGameRoom, onDisposeGameRoom;

export class LobbyRoom extends Room {
  onCreate(options) {
    this.setState(new LobbyRoomState());
    this.rooms = new Map();

    this.onMessage('createNewGame', (client, message) => {
      // Generate new room
      const code = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      client.send('gameCreated', code);
    });

    // Function to track other rooms' creation
    onCreateGameRoom = (room) => {
      console.log(`Game room ${room.state.code} registered with Colyseus`);

      // console.log('this state rooms:', this.state.rooms);
      this.state.rooms.push(room.metadata.code);
    };

    onDisposeGameRoom = (code) => {
      this.rooms.delete(code);
      this.state.rooms.splice(this.state.rooms.indexOf(code), 1);

      console.log(`Game room ${code} disposed.`);
    };

    console.log('Game room creation/disposal handlers registered');
  }

  onJoin(client, options) {
    console.log('Client', client.sessionId, 'joined lobby!');
  }

  onLeave(client, consented) {
    console.log('Client', client.sessionId, 'left!');
  }

  onDispose() {
    console.log('Lobby room', this.roomId, 'disposing...');
  }
}

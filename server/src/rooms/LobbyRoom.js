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
      console.log(`Game room ${room.metadata?.code} registered with Colyseus`);
      this.rooms.set(room.metadata.code, room);

      // console.log('this state rooms:', this.state.rooms);
      this.state.rooms.push(room.metadata.code);
    };

    onDisposeGameRoom = (room, code) => {
      console.log(`Game room ${code} disposed`);
      this.rooms.delete(code);
      this.state.rooms.splice(
        this.state.rooms.findIndex((r) => code === r.metadata.code),
        1
      );
    };

    console.log('Game room creation/disposal handlers registered');
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined lobby!');
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

import { Room } from '@colyseus/core';
// import { TestRoomState } from './schema/TestRoomState.js';

export class TestRoom extends Room {
  onCreate(options) {
    // this.setState(new TestRoomState());

    this.onMessage('pingServer', (client, message) => {
      console.log(`Server pinged at ${Date.now()}`);
      client.send('pong', null);
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

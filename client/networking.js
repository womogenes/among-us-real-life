import * as Colyseus from 'colyseus.js';
import Constants from 'expo-constants';

const { serverAddr } = Constants.expoConfig;
const client = new Colyseus.Client(`ws://${serverAddr}`);

let getLobbyRoom = () => {
  // Eventually, this can be promise-ified
  console.log('Not connected to server yet.');
};

console.log('Connecting to server...');
client.joinOrCreate('lobby').then((lobby) => {
  console.log(`Joined room ${lobby.sessionId}, name: ${lobby.name}`);

  lobby.onMessage('rooms', (message) => {
    console.log(message);
  });

  getLobbyRoom = () => {
    return lobby;
  };
});

export { serverAddr, getLobbyRoom };

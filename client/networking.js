import * as Colyseus from 'colyseus.js';
import Constants from 'expo-constants';

const { serverAddr } = Constants.expoConfig;
const client = new Colyseus.Client(`ws://${serverAddr}`);

let getLobbyRoom = () => {
  // Eventually, this can be promise-ified
  console.log('Not connected to server yet.');
};

let getGameRoom = () => {
  // This can also be promise-ified
  console.log('Not connected to server yet.');
};

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client
      .joinOrCreate(code)
      .then((gameRoom) => {
        console.log(`Joined game room ${gameRoom.sessionId}, name: ${code}`);
        getGameRoom = () => gameRoom;

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

console.log('Connecting to server...');
client.joinOrCreate('lobby').then((lobby) => {
  console.log(`Joined room ${lobby.sessionId}, name: ${lobby.name}`);

  lobby.onMessage('rooms', (message) => {
    console.log(message);
  });

  getLobbyRoom = () => lobby;
});

export { serverAddr, getLobbyRoom, connectToGameRoom, getGameRoom };

import * as Colyseus from 'colyseus.js';
import Constants from 'expo-constants';

const { serverAddr } = Constants.expoConfig;
const client = new Colyseus.Client(`ws://${serverAddr}`);

// Game room needs to be able to be changed
let getGameRoom = () => {};

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client.joinOrCreate(code).then((gameRoom) => {
      console.log(`Joined game room ${gameRoom.sessionId}, code: ${code}`);

      getGameRoom = () => gameRoom;
      resolve(gameRoom);
    });
  });
};

const leaveGameRoom = () => {
  getGameRoom()?.leave();
  getGameRoom = () => {};
};

let getLobbyRoom = () => {};

console.log('Connecting to server...');
client.joinOrCreate('lobby').then((lobby) => {
  console.log(`Joined room ${lobby.sessionId}, name: ${lobby.name}`);

  lobby.onMessage('rooms', (message) => {
    console.log(message);
  });

  getLobbyRoom = () => lobby;
});

export {
  serverAddr,
  getLobbyRoom,
  connectToGameRoom,
  getGameRoom,
  leaveGameRoom,
};

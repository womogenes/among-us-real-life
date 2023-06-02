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
  console.log('trying to leave room');
  getGameRoom()?.leave();
  console.log('left game room');
  getGameRoom = () => {};
};

let getLobbyRoom = () => {};

const connectToServer = () => {
  return new Promise((resolve, reject) => {
    console.log('Connecting to server...');
    client.joinOrCreate('lobby').then((lobby) => {
      console.log(`Joined room ${lobby.sessionId}, name: ${lobby.name}`);

      lobby.onMessage('rooms', (message) => {
        console.log(message);
      });

      getLobbyRoom = () => lobby;
      resolve();
    });
  });
};

export {
  serverAddr,
  getLobbyRoom,
  connectToGameRoom,
  connectToServer,
  getGameRoom,
  leaveGameRoom,
};

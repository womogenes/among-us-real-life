import * as Colyseus from 'colyseus.js';

const client = new Colyseus.Client(`ws://10.83.27.133:2567`);

export default async function createRoom() {
  var newRoomCode = document.getElementById('newRoomCode').value;
  await connectToGameRoom(newRoomCode);
  document.getElementById('createRoommsg').innerHTML = newRoomCode;
}

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client.joinOrCreate(code).then((gameRoom) => {
      console.log(`Joined game room ${gameRoom.sessionId}, code: ${code}`);

      getGameRoom = () => gameRoom;
      resolve(gameRoom);
    });
  });
};

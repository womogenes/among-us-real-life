import { connectToGameRoom } from '../../../client/networking';

async function createRoom() {
  var newRoomCode = document.getElementById('newRoomCode').value;
  await connectToGameRoom(newRoomCode);
  document.getElementById('createRoommsg').innerHTML = newRoomCode;
}

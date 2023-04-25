const client = new Colyseus.Client(`ws://${window.location.host}`);
const $ = document.querySelector.bind(document);

let getGameRoom = () => {};

// Set some default room code
$('#new-room-code').value = '1234';

// Join the lobby
const lobbyRoom = client.joinOrCreate('lobby');
$(
  '#status-message'
).innerHTML = `Connected to <code>${window.location.host}</code>`;

// Join a game room
$('#join-game-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#new-room-btn').disabled = true;
  $('#new-room-code').disabled = true;

  const code = $('#new-room-code').value;
  const gameRoom = await connectToGameRoom(code);

  $('#room-session-id').innerText = gameRoom.sessionId;
  gameRoom.send('setUsername', 'web test client');

  gameRoom.onStateChange((state) => {
    $('#room-state-output').innerText = JSON.stringify(state, null, 2);

    $('#start-game-btn').disabled =
      state.gameStarted ||
      !state.players.find((p) => p.sessionId === gameRoom.sessionId).isHost;
  }, 100);

  gameRoom.onMessage('gameStarted', () => {
    // Game has started, send random locations
    console.log('Game started');
  });
});

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client.joinOrCreate(code).then((gameRoom) => {
      console.log(`Joined game room ${gameRoom.sessionId}, code: ${code}`);

      resolve(gameRoom);
      getGameRoom = () => gameRoom;
      sendCoords;
    });
  });
};

const startGame = () => {
  getGameRoom().send('startGame');
};

// Listen for input changes
const sendCoords = () => {
  getGameRoom().send('location', {
    latitude: parseFloat($('#latitude').value),
    longitude: parseFloat($('#longitude').value),
  });
};

$('#latitude').addEventListener('input', sendCoords);
$('#longitude').addEventListener('input', sendCoords);

$('#latitude').value = 47.731417;
$('#longitude').value = -122.328147;

const client = new Colyseus.Client(`ws://${window.location.host}`);
const $ = document.querySelector.bind(document);

const round = (x, n) => Math.round(x * Math.pow(10, n)) / Math.pow(10, n);

let getGameRoom = () => {};

// Set some default room code
$('#new-room-code').value = '1234';
$('#latitude').value = 47.731417;
$('#longitude').value = -122.328147;

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
    const me = state.players.find((p) => p.sessionId === gameRoom.sessionId);

    $('#room-state-output').innerText = JSON.stringify(state, null, 2);
    $('#start-game-btn').disabled = state.gameStarted || !me.isHost;

    $('#latitude').value = me.trueLocation.latitude;
    $('#longitude').value = me.trueLocation.longitude;
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
      sendCoords();
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
    altitude: 0,
  });
};

$('#latitude').addEventListener('input', sendCoords);
$('#longitude').addEventListener('input', sendCoords);

// Handlers for moving
const keyMap = {}; // You could also use an array
onkeydown =
  onpress =
  onkeyup =
    function (e) {
      keyMap[e.key] = e.type == 'keydown';
      checkKeys();
    };

let [dLatCache, dLongCache] = [0, 0];
const deltaUpdate = (dLat, dLong) => {
  dLatCache += dLat;
  dLongCache += dLong;
};

window.setInterval(() => {
  getGameRoom()?.send('deltaLocation', {
    latitude: dLatCache,
    longitude: dLongCache,
  });

  dLatCache = 0;
  dLongCache = 0;
}, 100);

const checkKeys = () => {
  const delta = 1e-4;
  if (keyMap['ArrowDown']) {
    deltaUpdate(-delta, 0);
  }
  if (keyMap['ArrowUp']) {
    deltaUpdate(delta, 0);
  }
  if (keyMap['ArrowLeft']) {
    deltaUpdate(0, -delta);
  }
  if (keyMap['ArrowRight']) {
    deltaUpdate(0, delta);
  }
};

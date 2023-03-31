const client = new Colyseus.Client(`ws://${window.location.host}`);
const $ = document.querySelector.bind(document);

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
  }, 100);

  gameRoom.onMessage('gameStarted', () => {
    // Game has started, send random locations
    window.setInterval(() => {
      gameRoom.send('location', {
        coords: {
          latitude: 47.6375873 + Math.cos(Date.now() * 1e-4) * 1e-4,
          longitude: -122.1697458 + Math.sin(Date.now() * 1e-4) * 1e-4,
        },
      });
    }, 100);
  });
});

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client.joinOrCreate(code).then((gameRoom) => {
      console.log(`Joined game room ${gameRoom.sessionId}, code: ${code}`);

      resolve(gameRoom);
    });
  });
};

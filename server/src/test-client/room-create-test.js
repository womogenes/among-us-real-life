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
    const baseLocation = {
      latitude: 47.7313982,
      longitude: -122.3283326,
    };

    const handle = window.setInterval(() => {
      try {
        gameRoom.send('location', {
          coords: {
            latitude:
              baseLocation.latitude + Math.cos(Date.now() * 1e-4) * 1e-4,
            longitude:
              baseLocation.longitude + Math.sin(Date.now() * 1e-4) * 1e-4,
          },
        });
      } catch {
        window.clearInterval(handle);
      }
    }, 200);
  });
});

const connectToGameRoom = (code) => {
  return new Promise((resolve, reject) => {
    client.joinOrCreate(code).then((gameRoom) => {
      console.log(`Joined game room ${gameRoom.sessionId}, code: ${code}`);

      resolve(gameRoom);
      getGameRoom = () => gameRoom;
    });
  });
};

const startGame = () => {
  getGameRoom().send('startGame');
};

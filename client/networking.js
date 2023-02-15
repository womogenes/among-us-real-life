import * as Colyseus from 'colyseus.js';
import Constants from 'expo-constants';

const { serverAddr } = Constants.expoConfig;
const client = new Colyseus.Client(`ws://${serverAddr}`);

// Placeholder functions
let pushMessage = (message) => {
  console.log('Not subscribed yet');
};
let getLobby = () => {
  console.log('Not connected to server yet.');
};

// The root component calls this on some state handler,
//   so that we can get access to the state handler.
//   State handler is kept in the pushMessage variable (above)
const subscribeToMessages = (fun) => {
  // Subscribe to message provided by root React Native component
  console.log('Root component subscribed!');
  pushMessage = fun;
};

console.log('Connecting to server...');
client.joinOrCreate('lobby').then((lobby) => {
  const joinMessage = `Joined room ${lobby.sessionId}, name: ${lobby.name}`;
  console.log(joinMessage);

  getLobby = () => {
    return lobby;
  };

  // This might happen before pushMessage is subscribed to
  pushMessage(joinMessage);

  // Get server ping times
  let pingStart;

  const pingServer = () => {
    pingStart = Date.now();
    lobby.send('pingServer');
  };
  lobby.onMessage('pong', (message) => {
    console.log('message received');

    let delay = Date.now() - pingStart;
    pushMessage(delay);
    setTimeout(pingServer, 1000);
  });

  // Begin the ping loop
  pingServer();
});

export { serverAddr, subscribeToMessages, getLobby };

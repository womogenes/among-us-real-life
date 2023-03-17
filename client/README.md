# Client documentation

## Lobby room

This is not the game lobby: that's technically just an abstraction within a Colyseus `GameRoom`. This `LobbyRoom` is what the client connects to initially. The flow looks like this:

1. Client connects to a `LobbyRoom`.
2. Client can either:
   1. Request to create a new room
   2. Request to join a room
3. The server then allows the client to join a room

`networking.js` exports a couple things, one of which is `lobbyRoom`. This contains a Colyseus client lobby room instance. Usage:

```js
import { lobbyRoom } from 'networking.js';

// ... some in-between code

// This needs to be in an async function:
(await lobbyRoom).someRandomMethod(...);
```

### Connecting to game room

All game rooms from `0000` to `9999` are open by default. You can connect to any one of them by doing

```js
import { connectToGameRoom } from 'networking.js';

// ... stuff

// Needs to be a string inside
// This evaluates to a GameRoom object if needed
await connectToGameRoom('1234');
```

Important: `connectToGameRoom` is an async function!

### Getting all available rooms

Getting all rooms can be done with

```js
(await lobbyRoom).rooms;
```

This is a Colyseus state object that automatically updates.

## Game room

`networking.js` exports a couple things, one of which is `gameRoom`. This contains a Colyseus client game room instance. You can import this in other files with

```js
import { gameRoom } from 'networking.js';

// ... some in-between code

// This needs to be in an async function
(await gameRoom).doStuff(...);
```

(Replace `networking.js` with the appropriate relative path, if the file that's importing is in a different directory.)

This is a (Promise that resolves to) a Colyseus room object.

### Sending stuff

To send stuff to the server, use

```js
room.send('messageType', messageObject);
```

#### Location updates

To update the server on the client's location, do

```js
(await lobbyRoom).send('location', loc);
```

where `loc` is a location object. (TODO: document format of `loc` object)

### State

Room also contains state in the `room.state` object. **State is read-only** and automatically updated by the server.

1. A list of players is stored in `room.state.player`.

### To implement

# Client documentation

## Lobby room

This is not the game lobby: that's technically just an abstraction within a Colyseus `GameRoom`. This `LobbyRoom` is what the client connects to initially. The flow looks like this:

1. Client connects to a `LobbyRoom`.
2. Client can either:
   1. Request to create a new room
   2. Request to join a room
3. The server then allows the client to join a room

`networking.js` exports a couple functions, one of which is `getLobbyRoom`. This contains a Colyseus client lobby room instance. Usage:
```js
import { getLobbyRoom } from 'networking.js';

// ... some in-between code

const room = getLobbyRoom();
```

### Methods

Todo:
1. `createGameRoom`
2. `getAllRooms`



## Game room

`networking.js` exports a couple functions, one of which is `getGameRoom`. This contains a Colyseus client game room instance. You can import this in other files

```js
import { getGameRoom } from 'networking.js';

// ... some in-between code

const room = getGameRoom();
```

(Replace `networking.js` with the appropriate relative path, if the file that's importing is in a different directory.)

### Sending stuff

To send stuff to the server, use

```js
room.send('messageType', messageObject);
```

### State

Room also contains state in the `room.state` object. **State is read-only** and automatically updated by the server.

1. A list of players is stored in `room.state.player`.

### To implement

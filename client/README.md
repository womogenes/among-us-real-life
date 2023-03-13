# Client documentation

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

Room also contains state in the `room.state` object.

1. A list of players is stored in `room.state.player`.

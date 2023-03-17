# Client documentation

Some documentation for the client, in a Q&A format.

This is somewhat incomplete right now, can flesh out later.

## What do you want to do?

### Fetch list of players in the game lobby (in GameRoom)

```js
import { getGameRoom } from 'networking.js';

// Some code...
const memberList = getGameRoom().state.players;
```

### Send location to server

```js
import { getGameRoom } from 'networking.js';

// Some code...
const memberList = getGameRoom().send('location', {
  timestamp: 1679090909999.8792,
  coords: {
    speed: 0,
    heading: -1,
    longitude: -122.3280333346209,
    accuracy: 5.023469692405724,
    latitude: 47.731519833268536,
    altitudeAccuracy: 2.930748928562455,
    altitude: 126.38087734766304,
  },
});
```

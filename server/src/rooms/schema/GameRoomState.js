import * as schema from '@colyseus/schema';
const { Schema, ArraySchema } = schema;

// Location schema
class Location extends Schema {
  constructor() {
    super();

    this.latitude = 0;
    this.longitude = 0;
    this.altitude = 0;
  }

  update(coords) {
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    this.altitude = coords.altitude;
  }
}
schema.defineTypes(Location, {
  latitude: 'number', // Latitude
  longitude: 'number', // Longitude
  altitude: 'number', // altitude
});

// Player schema
export class Player extends Schema {
  constructor(sessionId, isHost) {
    super();

    this.sessionId = sessionId;
    this.username = 'Anonymous';
    this.location = new Location();
    this.isHost = isHost;
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  username: 'string',
  location: Location,
  isHost: 'boolean',
});

// Settings schema
class Settings extends Schema {
  constructor(settings) {
    Object.assign(settings, this);
  }
}
schema.defineTypes(Settings, {
  killRadius: 'number',
  killCooldown: 'number',
});

// Final schema
export class GameRoomState extends Schema {
  constructor(code) {
    super();

    this.refresh = 0;

    this.players = new ArraySchema();
    this.code = code;
    this.gameStarted = false;
  }
}
schema.defineTypes(GameRoomState, {
  refresh: 'number',

  players: [Player],
  code: 'string',
  gameStarted: 'boolean',
});

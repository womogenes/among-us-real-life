import * as schema from '@colyseus/schema';
const { Schema, ArraySchema } = schema;

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

export class Player extends Schema {
  constructor(sessionId, isHost) {
    super();

    this.sessionId = sessionId;
    this.location = new Location();
    this.isHost = isHost;
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  location: Location,
  isHost: 'boolean',
});

export class GameRoomState extends Schema {
  constructor(code) {
    super();

    this.players = new ArraySchema();
    this.code = code;
    this.refresh = 0;
  }
}

schema.defineTypes(GameRoomState, {
  players: [Player],
  code: 'string',
  refresh: 'number',
});

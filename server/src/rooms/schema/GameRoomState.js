import * as schema from '@colyseus/schema';
const { Schema, MapSchema } = schema;

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
  constructor(sessionId) {
    super();

    this.sessionId = sessionId;
    this.location = new Location();
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  location: Location,
});

export class GameRoomState extends Schema {
  constructor() {
    super();

    this.players = new MapSchema();
  }
}

schema.defineTypes(GameRoomState, {
  players: { map: Player },
});

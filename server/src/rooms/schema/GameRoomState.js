import * as schema from '@colyseus/schema';
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class Location extends Schema {
  constructor() {
    super();

    this.lat = 0;
    this.long = 0;
    this.alt = 0;
  }

  update(coords) {
    this.lat = coords.latitude;
    this.long = coords.longitude;
    this.alt = coords.altitude;
  }
}
schema.defineTypes(Location, {
  lat: 'number', // Latitude
  long: 'number', // Longitude
  alt: 'number', // altitude
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

    this.players = new ArraySchema();
  }
}

schema.defineTypes(GameRoomState, {
  players: [Player],
});

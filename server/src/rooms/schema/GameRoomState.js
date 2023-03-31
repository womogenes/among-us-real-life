import * as schema from '@colyseus/schema';
const { Schema, ArraySchema } = schema;

// Location schema
class Location extends Schema {
  constructor(latitude = 0, longitude = 0, altitude = 0) {
    super();

    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
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

class Task extends Schema {
  constructor(name, location) {
    super();

    this.name = name;
    this.location = location;
    this.complete = false;
  }
}
schema.defineTypes(Task, {
  name: 'string',
  location: Location,
  complete: 'boolean',
});

// Player schema
export class Player extends Schema {
  constructor(sessionId, isHost) {
    super();

    this.sessionId = sessionId;
    this.username = 'Anonymous';
    this.location = new Location();
    this.isHost = isHost;
    this.isImpostor = false;

    // Make a default test task
    this.tasks = new ArraySchema();
    this.tasks.push(
      new Task('reCaptcha', new Location(47.731475, -122.328036, 0)), // AG
      new Task('reCaptcha', new Location(47.731265, -122.327709, 0)), // Lower-right of AG
      new Task('reCaptcha', new Location(47.731838, -122.327802, 0)), // Fix
      new Task('reCaptcha', new Location(47.731639, -122.327612, 0)) // Red square
    );
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  username: 'string',
  location: Location,
  isHost: 'boolean',
  isImpostor: 'boolean',

  tasks: [Task],
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

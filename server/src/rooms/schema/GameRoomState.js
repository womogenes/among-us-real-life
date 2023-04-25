import * as schema from '@colyseus/schema';
const { Schema, ArraySchema, MapSchema } = schema;

import { nanoid } from 'nanoid';

// Location schema
export class Location extends Schema {
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

  deltaUpdate(coords) {
    this.latitude += coords.latitude;
    this.longitude += coords.longitude;
  }
}
schema.defineTypes(Location, {
  latitude: 'number', // Latitude
  longitude: 'number', // Longitude
  altitude: 'number', // altitude
});

export class Task extends Schema {
  constructor(name, location) {
    super();

    this.name = name;
    this.taskId = nanoid();
    this.location = location;
    this.complete = false;
  }
}
schema.defineTypes(Task, {
  name: 'string',
  taskId: 'string',
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
    this.lastAliveLocation = new Location();
    this.isHost = isHost;
    this.isImpostor = false;
    this.isAlive = true;

    // Make a default test task
    this.tasks = new ArraySchema();
    this.tasks.push(
      new Task('reCaptcha', new Location(47.731475, -122.328036, 0)), // AG
      new Task('reCaptcha', new Location(47.731392, -122.327791, 0)), // East end of AG
      new Task('reCaptcha', new Location(47.732346, -122.326806, 0)), // Moore
      new Task('reCaptcha', new Location(47.731639, -122.327612, 0)), // Red square
      new Task('reCaptcha', new Location(47.731779, -122.32705, 0)), // Bliss

      new Task('reCaptcha', new Location(47.73206, -122.326362, 0)), // St. Nicks

      new Task('reCaptcha', new Location(47.63754, -122.169789, 0)), // William's house

      new Task('reCaptcha', new Location(47.737305, -122.33942, 0)), // Felix's house

      new Task(
        'reCaptcha',
        new Location(47.64096865628356, -122.24140723628969, 0)
      ), // Brandon's house

      new Task('reCaptcha', new Location(47.731317, -122.327169, 0)) // LS Library
    );
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  username: 'string',
  location: Location,
  lastAliveLocation: Location,
  isHost: 'boolean',
  isImpostor: 'boolean',
  isAlive: 'boolean',
  tasks: [Task],
});

// Settings schema
class Settings extends Schema {
  constructor() {
    super();

    this.killRadius = 5;
    this.killCooldown = 10;
  }

  update(newSettings) {
    for (let key in newSettings) {
      if (newSettings[key]) this[key] = newSettings[key];
    }
  }
}
schema.defineTypes(Settings, {
  killRadius: 'number',
  killCooldown: 'number',
});

// Big game room schema
export class GameRoomState extends Schema {
  constructor(code) {
    super();

    this.refresh = 0;
    this.code = code;
    this.gameStarted = false;
    /*
      Necessary states:
        lobby (Join.js)
        normal
        emergency (everyone moving to location)
        voting
    */
    this.gameState = 'lobby';

    this.settings = new Settings();

    this.players = new ArraySchema();
    this.votes = new MapSchema();
  }
}
schema.defineTypes(GameRoomState, {
  refresh: 'number',
  code: 'string',
  gameStarted: 'boolean',
  gameState: 'string',
  settings: Settings,

  players: [Player],
  votes: { map: 'string' },
});

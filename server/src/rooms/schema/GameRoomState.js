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


// COSMETICS
export class Skin extends Schema {
  constructor(name) {
    super();

    this.name = name;
  }
}

schema.defineTypes(Skin, {
  name: 'string',
});

export class Hat extends Schema {
  constructor(name) {
    super();

    this.name = name;
  }
}

schema.defineTypes(Hat, {
  name: 'string',
});

export class Icon extends Schema {
  constructor(skin, hat) {
    super();

    this.skin = skin;
    this.hat = hat;
  }
  update(newSkin, newHat){
    if(newSkin){
      this.skin = newSkin;
    }
    if(newHat){
      this.hat = newHat;
    }
  }
}

schema.defineTypes(Icon, {
  skin: Skin,
  hat: Hat,
});

export class Task extends Schema {
  constructor(name, location, taskId) {
    super();

    this.name = name;
    if (taskId) {
      this.taskId = taskId;
    } else {
      this.taskId = nanoid();
    }
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

export class EmergencyButton extends Schema {
  constructor(location, uses) {
    super();

    this.name = 'emergency';
    this.taskId = nanoid();
    this.location = location;
    this.uses = uses;
    
  }
}
schema.defineTypes(EmergencyButton, {
  name: 'string',
  taskId: 'string',
  location: Location,
  uses: 'number',
});

// Player schema
export class Player extends Schema {
  constructor(sessionId, isHost, icon) {
    super();

    this.sessionId = sessionId;
    this.username = 'Anonymous';
    this.icon = icon;
    this.location = new Location();
    this.trueLocation = new Location();
    this.isHost = isHost;
    this.isImpostor = false;
    this.isAlive = true;

    // Make a default test task
    this.tasks = new ArraySchema();
    this.tasks.push(
      new Task('electricity', new Location(47.731017, -122.327879, 0)), // Behind AG
      new Task('calibrate', new Location(47.732253, -122.326931, 0)), // Moore
      new Task('reCaptcha', new Location(47.731639, -122.327612, 0)), // Red square
      new Task('memory', new Location(47.731779, -122.32705, 0)), // Bliss
      new Task('reCaptcha', new Location(47.733402, -122.327814, 0)), // AAC
      new Task('reCaptcha', new Location(47.73264, -122.327554, 0)), // Quad
      new Task('electricity', new Location(47.732325, -122.326288, 0)), // Behind St. Nick's
      new Task('memory', new Location(47.733534, -122.326878, 0)) // East side of AAC
    );

    // Set emergency button location
    this.emergency = new ArraySchema();
    this.emergency.push(
      new EmergencyButton(
        new Location(47.73259494636459, -122.32835682174914, 0),
        1
      ) //47.737302938766845, -122.33941788971003 Felix 47.73259494636459, -122.32835682174914 Field
    );
  }
}
schema.defineTypes(Player, {
  sessionId: 'string',
  username: 'string',
  icon: Icon,
  location: Location,
  trueLocation: Location,
  isHost: 'boolean',
  isImpostor: 'boolean',
  isAlive: 'boolean',
  tasks: [Task],
  emergency: [EmergencyButton],
});

// Settings schema
class Settings extends Schema {
  constructor() {
    super();

    this.killRadius = 10;
    this.killCooldown = 40;
    this.saboCooldown = 180;
    this.impostorNum = 1;
    this.votingTimer = 50;
    this.playerSight = 100;
    this.anonVotes = false;
  }

  update(newSettings) {
    for (let key in newSettings) {
      if (newSettings[key] != null) this[key] = newSettings[key];
    }
  }
}
schema.defineTypes(Settings, {
  killRadius: 'number',
  killCooldown: 'number',
  saboCooldown: 'number',
  impostorNum: 'number',
  votingTimer: 'number',
  playerSight: 'number',
  anonVotes: 'boolean',
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
    this.emergencyMeetingLocation = new Location();

    this.settings = new Settings();

    this.players = new ArraySchema();
    this.sabotageTaskList = new ArraySchema();
    this.votes = new MapSchema();
    this.votingTimer = this.settings.votingTimer;
    this.skinList = new ArraySchema();
    this.skinList.push(
      new Skin('banana'),
      new Skin('yellow'),
      new Skin('rose'),
      new Skin('pink'),
      new Skin('orange'),
      new Skin('coral'),
      new Skin('red'),
      new Skin('maroon'),
      new Skin('cyan'),
      new Skin('blue'),
      new Skin('purple'),
      new Skin('lime'),
      new Skin('green'),
      new Skin('tan'),
      new Skin('brown'),
      new Skin('white'),
      new Skin('gray'),
      new Skin('black'),
    )
    this.hatList = new ArraySchema();
    this.hatList.push(
      new Hat('none'),
      new Hat('bandana'),
      new Hat('bandana2'),
      new Hat('cap'),
      new Hat('doctor'),
      new Hat('fedora'),
      new Hat('general'),
      new Hat('goggles'),
      new Hat('halo'),
      new Hat('nest'),
      new Hat('oldcap'),
      new Hat('paper'),
      new Hat('russian'),
      new Hat('slippery'),
      new Hat('soldier'),
      new Hat('sprout'),
      new Hat('toilet'),
    )
  }

}
schema.defineTypes(GameRoomState, {
  refresh: 'number',
  code: 'string',
  gameStarted: 'boolean',
  gameState: 'string',
  emergencyMeetingLocation: Location,

  settings: Settings,

  players: [Player],
  sabotageTaskList: [Task],
  votes: { map: 'string' },
  votingTimer: 'number',
  skinList: [Skin],
  hatList: [Hat]
});

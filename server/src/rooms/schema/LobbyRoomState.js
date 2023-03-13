import * as schema from '@colyseus/schema';
const { Schema, MapSchema } = schema;

export class LobbyRoomState extends Schema {
  constructor() {
    super();

    this.rooms = new MapSchema();
  }
}

schema.defineTypes(LobbyRoomState, {
  rooms: { map: String },
});

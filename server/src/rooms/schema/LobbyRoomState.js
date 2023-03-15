import * as schema from '@colyseus/schema';
const { Schema, ArraySchema } = schema;

export class LobbyRoomState extends Schema {
  constructor() {
    super();

    this.rooms = new ArraySchema();
  }
}

schema.defineTypes(LobbyRoomState, {
  rooms: ['string'],
});

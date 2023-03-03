import * as schema from '@colyseus/schema';

export class GameRoomState extends schema.Schema {
  constructor() {
    super();
    this.players = [];
  }
}

schema.defineTypes(GameRoomState, {
  players: ['string'],
});

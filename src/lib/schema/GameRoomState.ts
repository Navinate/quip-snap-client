// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.48
// 

import { Schema, type, ArraySchema, MapSchema} from '@colyseus/schema';
import { Player } from './Player'
import { Round } from './Round'
import { GameSettings } from './GameSettings';

export class GameRoomState extends Schema {
    @type("number") public roundIndex!: number;
    @type("string") public hostID!: string;
    @type("number") public maxPlayers!: number;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ Round ]) public rounds: ArraySchema<Round> = new ArraySchema<Round>();
    @type(GameSettings) settings = new GameSettings();
}

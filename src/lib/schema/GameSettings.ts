// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.48
// 

import { Schema, type} from '@colyseus/schema';


export class GameSettings extends Schema {
    @type("number") public photoTime!: number;
    @type("number") public voteTime!: number;
    @type("number") public numRounds!: number;
}

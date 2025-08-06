//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 3.0.48
//

import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
	@type('boolean') public connected!: boolean;
	@type('string') public name!: string;
	@type('number') public score!: number;
}

// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.48
// 

import { Schema, type, ArraySchema} from '@colyseus/schema';
import { Photo } from './Photo'

export class Round extends Schema {
    @type("string") public prompt!: string;
    @type("number") public photoTimeLeft!: number;
    @type("number") public voteTimeLeft!: number;
    @type([ Photo ]) public photos = new ArraySchema<Photo>();
}

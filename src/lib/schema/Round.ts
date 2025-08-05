// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.48
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Photo } from './Photo'

export class Round extends Schema {
    @type("string") public prompt!: string;
    @type({ map: Photo }) public photos: MapSchema<Photo> = new MapSchema<Photo>();
}

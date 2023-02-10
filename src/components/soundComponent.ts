import { Component } from "../entityComponent";

export class SoundComponent extends Component { 
    public static COMPONENT_ID: string = "Sound";

    public loadedSounds: Array<string> = [];

    constructor(imageURL: string) {
        super();
    }
}
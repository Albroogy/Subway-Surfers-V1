import { Component } from "../entityComponent";

export class SoundComponent extends Component { 
    public static COMPONENT_ID: string = "Sound";

    private _loadedSounds: Record<string, HTMLAudioElement> = {};

    constructor(sounds: Record<string, HTMLAudioElement>) {
        super();
        this._loadedSounds = sounds;
    }
    public playSound(soundName: string){
        this._loadedSounds[soundName].play();
    }
    public playSoundOnLoop(soundName: string){
        this.playSound(soundName);
    }
}
import { Component } from "../entityComponent";
import { OFFSET } from "../global";

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
        this._loadedSounds[soundName].loop = true;
    }
    public stopLooping(soundName: string){
        this._loadedSounds[soundName].loop = false;
    }
    public playSounds(sounds: Array<string>){
        this.playSound(sounds[0]);
        const curriedAudioTrackEnded = audioTrackEnded.bind(undefined, sounds, 1, this);
        this._loadedSounds[sounds[0]].addEventListener("ended", curriedAudioTrackEnded);
    }
    public get loadedSounds(){
        return this._loadedSounds;
    }
}

function audioTrackEnded(sounds: Array<string>, nextSoundNumber: number, soundComponent: SoundComponent){
    if (nextSoundNumber > sounds.length - OFFSET){
        return;
    }
    soundComponent.playSound(sounds[nextSoundNumber]);
    const curriedAudioTrackEnded = audioTrackEnded.bind(undefined, sounds, nextSoundNumber + OFFSET, soundComponent);
    soundComponent.loadedSounds[nextSoundNumber].addEventListener("ended", curriedAudioTrackEnded);
}
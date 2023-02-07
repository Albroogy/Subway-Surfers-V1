import { Entity } from "./entityComponent";

const ORIGINAL_FALL_SPEED: number = 150;
export let fallSpeed: number = ORIGINAL_FALL_SPEED;

export const ORIGINAL_SPAWN_DELAY: number = 1500;
export let spawnDelay: number = ORIGINAL_SPAWN_DELAY;

export let score: number = 0;
export let highScore: number = 0;

export const objects: Array<Entity> = [];

export function addScore(scoreIncreaseValue: number): void {
    score += scoreIncreaseValue;
}

export function changeSpawnDelay(spawnIncrement: number): void {
    spawnDelay -= spawnIncrement;
}

export function changeFallSpeed(fallIncrement: number): void {
    fallSpeed += fallIncrement;
}

export function resetValues(){
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}

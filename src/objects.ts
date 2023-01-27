import { equippedInventory, equipStarterItems } from "./components/inventoryComponent";
import PlayerComponent, { StartingStats } from "./components/playerComponent";
import { player as playerCharacter } from "./components/playerComponent";
import { Entity } from "./entityComponent";


export let playerComponent = playerCharacter.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;

const ORIGINAL_FALL_SPEED: number = 150;
export let fallSpeed: number = ORIGINAL_FALL_SPEED;

export const ORIGINAL_SPAWN_DELAY: number = 1000;
export let spawnDelay: number = ORIGINAL_SPAWN_DELAY;

export let score: number = 0;
export let highScore: number = 0;

export function resetGame(){
    objects.splice(0);
    playerComponent.lane = 2;
    playerComponent.setLane();
    playerComponent.stats = StartingStats;
    equippedInventory.resetInventory();
    equipStarterItems(playerCharacter);
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}

export const objects: Array<Entity> = [];

export function addScore(scoreIncreaseSpeed: number): void {
    score += scoreIncreaseSpeed;
}

export function changeSpawnDelay(spawnIncrement: number): void {
    spawnDelay -= spawnIncrement;
}

export function changeFallSpeed(fallIncrement: number): void {
    fallSpeed += fallIncrement;
}

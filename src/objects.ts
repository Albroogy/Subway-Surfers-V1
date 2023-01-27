import PlayerComponent from "./components/playerComponent";
import { player as playerCharacter } from "./components/playerComponent";

export let fallSpeed: number = ORIGINAL_FALL_SPEED;

let playerComponent = playerCharacter.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;

export function resetGame(){
    objects.splice(0);
    playerComponent.lane = 2;
    playerComponent.setLane();
    playerComponent.stats = StartingStats;
    equippedInventory.resetInventory();
    equipStarterItems(player);
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}

export const objects: Array<Entity> = [];

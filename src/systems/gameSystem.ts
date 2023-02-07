import { StateMachine } from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { allPressedKeys, KEYS } from "../global";

export enum GameState {
    Playing = "playing",
    InventoryMenu = "inventoryMenu"
}
export let gameState: Object = GameState.Playing;

// Adding the states for gameSM
const onPlayingActivation = () => {
    gameState = GameState.Playing;
    console.log(GameState.Playing);
}
const onPlayingUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.SpaceBar]){
        return GameState.InventoryMenu;
    }
}
const onPlayingDeactivation = () => {
}
const onInventoryMenuActivation = () => {
    gameState = GameState.InventoryMenu;
    // EventListener to see if mouse clicked
    document.addEventListener('click', mouseClicked);
    let mouseX = null;
    let mouseY = null;
    function mouseClicked(e: { clientX: number; clientY: number; }) {
        // Maybe give the variable e a better name?
        mouseX = e.clientX;
        mouseY = e.clientY;
        console.log(`${e.clientX} ${e.clientY}`);
        // if (equippedInventory.isColliding(e.clientX, e.clientY)){
            
        // }
    }
    console.log(GameState.InventoryMenu);
}
const onInventoryMenuUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.Escape]){
        return GameState.Playing;
    }
}
const onInventoryMenuDeactivation = () => {
    // document.removeEventListener('click', mouseClicked);
    // mouseClicked is not defined
}

// Setting up state machine
export const gameSM = new StateMachine<GameState>();
gameSM.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
gameSM.addState(GameState.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);

// Activating state machines
gameSM.activeState = gameSM.states[GameState.Playing];
gameSM.activeState.onActivation(null as unknown as Entity);

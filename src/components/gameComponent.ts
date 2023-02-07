import { Component } from "../entityComponent";
import { allPressedKeys, KEYS } from "../global";
import StateMachineComponent from "./stateMachineComponent";

export enum GameState {
    Playing = "playing",
    InventoryMenu = "inventoryMenu"
}
export let gameState: Object = GameState.Playing;

export default class GameComponent extends Component {
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GameState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
        stateMachineComponent.stateMachine.addState(GameState.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);
        stateMachineComponent.activate(GameState.Playing);
    }
}

// Adding the states for gameSM
export const onPlayingActivation = () => {
    gameState = GameState.Playing;
    console.log(GameState.Playing);
}
export const onPlayingUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.SpaceBar]){
        return GameState.InventoryMenu;
    }
}
export const onPlayingDeactivation = () => {
}
export const onInventoryMenuActivation = () => {
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
export const onInventoryMenuUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.Escape]){
        return GameState.Playing;
    }
}
export const onInventoryMenuDeactivation = () => {
    // document.removeEventListener('click', mouseClicked);
    // mouseClicked is not defined
}
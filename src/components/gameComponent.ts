import { Component, Entity } from "../entityComponent";
import { allPressedKeys, KEYS } from "../global";
import { images } from "../objects";
import CollisionSystem from "../systems/collisionSystem";
import { ImageComponent } from "./imageComponent";
import { InventoryComponent, ItemInfo } from "./inventoryComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum GameState {
    Playing = "playing",
    InventoryMenu = "inventoryMenu"
}
export let gameState: GameState = GameState.Playing;

export default class GameComponent extends Component {
    public static COMPONENT_ID: string = "Game";

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
    addEventListener('mousedown', mouseDown);
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

export type slot = { row: number, column: number };

function mouseDown(e: { clientX: number; clientY: number; }) {
    // Maybe give the variable e a better name?
    const mouse = {
        x: e.clientX,
        y: e.clientY,
        width: 25,
        height: 25
    }

    const inventoryComponent = player.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;

    for (const inventory of inventoryComponent.inventories){
        if (
            mouse.x - mouse.width/2 <= inventory.x + inventory.width * inventory.itemSize.width/2 &&
            mouse.x + mouse.width/2 >= inventory.x - inventory.width * inventory.itemSize.width/2 &&
            mouse.y + mouse.height/2 >= inventory.y - inventory.height * inventory.itemSize.height/2 &&
            mouse.y - mouse.height/2 <= inventory.y + inventory.height * inventory.itemSize.height/2
        ){
            console.log(`${e.clientX} ${e.clientY}`);
            const inventorySlotPosition: slot = {
                column: Math.floor((mouse.x - inventory.x + inventory.width * inventory.itemSize.width/2) / inventory.itemSize.width),
                row: Math.floor((mouse.y - inventory.y + inventory.height * inventory.itemSize.height/2) / inventory.itemSize.height)
            }
            console.log(inventorySlotPosition);
            const inventoryItem = inventory.searchInventory(inventorySlotPosition);
            if (inventoryItem!){
               inventory.hideItem(inventoryItem.name);
               const item = new Entity();
               item.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(mouse.x, mouse.y, inventoryItem.width * 50, inventoryItem.height * 50, 0));
               item.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(ItemInfo[inventoryItem.name].src));
               images.push(item);
            }
        }
    }
}




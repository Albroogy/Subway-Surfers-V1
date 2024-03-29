import { Component, Entity } from "../entityComponent";
import { allPressedKeys, EntityName, KEYS } from "../global";
import { images } from "../objects";
import { ImageComponent } from "./imageComponent";
import { Inventory, InventoryComponent, InventoryItem, ItemInfo, slot } from "./inventoryComponent";
import { player, PlayerComponent } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";


export enum GameState {
    Playing = "playing",
    InventoryMenu = "inventoryMenu",
    AchievementsMenu = "AchievementsMenu"
}
export let gameState: GameState = GameState.Playing;

export default class GameComponent extends Component {
    public static COMPONENT_ID: string = "Game";

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GameState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
        stateMachineComponent.stateMachine.addState(GameState.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);
        stateMachineComponent.stateMachine.addState(GameState.AchievementsMenu, onAchievementsMenuActivation, onAchievementsMenuUpdate, onAchievementsMenuDeactivation);
        stateMachineComponent.activate(GameState.Playing);
    }
}

// Adding the states for gameSM
export const onPlayingActivation = () => {
    gameState = GameState.Playing;
    console.log(GameState.Playing);
}
export const onPlayingUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.One]){
        return GameState.InventoryMenu;
    }
    if (allPressedKeys[KEYS.Two]){
        return GameState.AchievementsMenu;
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
    removeEventListener('mousedown', mouseDown);
}

export const onAchievementsMenuActivation = () => {
    gameState = GameState.AchievementsMenu;
}
export const onAchievementsMenuUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.Escape]){
        return GameState.Playing;
    }
}
export const onAchievementsMenuDeactivation = () => {
}

let mouseDownBoolean = true;

type MouseData = { x: number, y: number, width: number, height: number };
type MouseEventFunction = (e: MouseEvent) => void;

let curriedMouseMove: MouseEventFunction;
let curriedMouseUp: MouseEventFunction;

function mouseDown(e: MouseEvent) {
    removeEventListener('mouseup', curriedMouseUp);
    mouseDownBoolean = true;
    
    let mouse: MouseData = {
        x: e.clientX,
        y: e.clientY,
        width: 25,
        height: 25
    }

    const inventoryComponent = player.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;

    for (const inventory of inventoryComponent.inventories){
        if (checkMouseCollision(mouse, inventory)) {
            const inventorySlotPosition = calculateInventorySlotPosition(mouse, inventory)
            const inventoryItem = inventory.searchInventory(inventorySlotPosition);

            if (inventoryItem!){
                inventory.hideItem(inventoryItem.name);

                const item = new Entity(EntityName.ItemFrame);
                item.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(mouse.x, mouse.y, inventoryItem.width * 50, inventoryItem.height * 50, 0));
                item.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(inventoryItem.image.src));
                images.push(item);

                const positionComponent = images[0].getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;

                curriedMouseMove = mouseMove.bind(undefined, mouse, positionComponent, inventoryComponent);
                curriedMouseUp = mouseUp.bind(undefined, mouse, inventoryComponent, inventory, inventoryItem);
                addEventListener('mousemove', curriedMouseMove);
                addEventListener('mouseup', curriedMouseUp);
            }
        }
    }
}

function mouseMove(
    mouse: MouseData,
    positionComponent: PositionComponent,
    inventoryComponent: InventoryComponent,
    e: MouseEvent
    ) {
    setObjectToClientXY(positionComponent, e);

    setObjectToClientXY(mouse, e);

    for (const selectedInventory of inventoryComponent.inventories){
        if (checkMouseCollision(mouse, selectedInventory)) {
            selectedInventory.highlight = true;
        }
        else if (selectedInventory.highlight == true){
            selectedInventory.highlight = false;
        }
    }
}

function mouseUp(
    mouse: MouseData,
    inventoryComponent: InventoryComponent,
    inventory: Inventory,
    inventoryItem: InventoryItem,
    e: MouseEvent
    ) {
    removeEventListener('mousemove', curriedMouseMove);
    mouseDownBoolean = false;

    setObjectToClientXY(mouse, e);

    for (const placeInventory of inventoryComponent.inventories){
        if (placeInventory.highlight == true){
            placeInventory.highlight = false;
        }
        if (checkMouseCollision(mouse, placeInventory)) {
            const newInventorySlotPosition = calculateInventorySlotPositionWithOffset(mouse, placeInventory, inventoryItem!);
            newInventorySlotPosition.column = checkNumberSmallerThanZero(newInventorySlotPosition.column);
            newInventorySlotPosition.row = checkNumberSmallerThanZero(newInventorySlotPosition.row);

            if (placeInventory.placeItemCheck(inventoryItem!, newInventorySlotPosition.row, newInventorySlotPosition.column)){
                console.log(inventoryItem);
                inventory.removeItem(inventoryItem!);
                placeInventory.placeItem(inventoryItem!, newInventorySlotPosition.row, newInventorySlotPosition.column);
                
                const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;
                playerComponent.updateStats();
                playerComponent.updateAnimationBasedOnWeapon();
            }
        }
    }
    
    images.splice(0, 1);
    inventory.hideItem("");
}

function checkMouseCollision(mouse: Record<string, number>, inventory: Inventory){
    return (
        mouse.x - mouse.width/2 <= inventory.x + inventory.width * inventory.itemSize.width/2 &&
        mouse.x + mouse.width/2 >= inventory.x - inventory.width * inventory.itemSize.width/2 &&
        mouse.y + mouse.height/2 >= inventory.y - inventory.height * inventory.itemSize.height/2 &&
        mouse.y - mouse.height/2 <= inventory.y + inventory.height * inventory.itemSize.height/2
    )
}

function calculateInventorySlotPosition(mouse: Record<string, number>, inventory: Inventory): slot{
    return {
        row: Math.floor((mouse.x - inventory.x + inventory.width * inventory.itemSize.width/2) / inventory.itemSize.width),
        column: Math.floor((mouse.y - inventory.y + inventory.height * inventory.itemSize.height/2) / inventory.itemSize.height)
    }
}
function calculateInventorySlotPositionWithOffset(mouse: Record<string, number>, inventory: Inventory, inventoryItem: InventoryItem): slot{
    return {
        row: Math.floor((mouse.x - inventory.x + inventory.width * inventory.itemSize.width/2 - 25 * (inventoryItem.width - 1)) / inventory.itemSize.width),
        column: Math.floor((mouse.y - inventory.y + inventory.height * inventory.itemSize.height/2 - 25 * (inventoryItem.height - 1)) / inventory.itemSize.height)
    }
}

function checkNumberSmallerThanZero(number: number){
    if (number < 0){
        number = 0;
    }
    return number;
}

function setObjectToClientXY(object: Record<string, number> | PositionComponent, event: {clientX: number, clientY: number}){
    object.x = event.clientX;
    object.y = event.clientY;
}

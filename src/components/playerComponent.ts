import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";
import {AnimatedComponent, AnimationInfo} from "./animatedComponent";
import { allPressedKeys, canvas, checkTime, context, KEYS, LANE, mouseDown, OFFSET, sleep, Tag} from "../global";
import StateMachineComponent from "./stateMachineComponent";
import { objects } from "../objects";
import { equipStarterItems, Inventory, InventoryComponent, InventoryItemStat, ItemList } from "./inventoryComponent";
import { resetValues } from "../main";
import { TagComponent } from "./tagComponent";
import { generateArrow } from "../entityGenerator";
import SaveGameSystem, { SaveKey } from "../systems/saveGameSystem";


export enum PlayerState {
    Running = "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping = "jumping",
    Ducking = "ducking",
    Roll = "roll",
    Dying = "dying"
};

export const PlayerAnimationName = {
    RunningBack: "runningBack",
    Jumping: "jumping",
    Ducking: "ducking",
    RollingLeft: "rollingLeft",
    RollingRight: "rollingRight",
    Dying: "dying"
}

export class PlayerComponent extends Component{ 
    public static COMPONENT_ID: string = "Player";

    public stats: Record <InventoryItemStat, number>;
    public weapon: string | null;
    public weaponAnimations: Record <string, string>;
    public directionChange: number;
    public attacking: boolean;
    public lane: number;
    public state: PlayerState;
    public PREPARE_SPEAR_FRAMES: number;
    public aura: boolean;

    constructor(lane: number, state: PlayerState, startingStats: Record<InventoryItemStat, number>, weaponAnimations: Record <string, string>) {
        super();
        this.stats = startingStats;
        this.weapon = null;
        this.weaponAnimations = weaponAnimations;
        this.directionChange = 0;
        this.attacking = false;
        this.lane = lane;
        this.state = state;
        this.PREPARE_SPEAR_FRAMES = 4;
        this.aura = false;
    }

    public onAttached(): void {
        super.onAttached();
        this.setLane();
    }
    
    roll(deltaTime: number){
        if (this._entity == null){
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        positionComponent!.x += this.stats[InventoryItemStat.RollSpeed] * deltaTime/1000 * this.directionChange;
    }

    updateStats(): void{
        if (this._entity == null) {
            return;
        }
        const inventoryComponent = this._entity.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID);
        this.stats = inventoryComponent!.inventories[0].updateStats({
            [InventoryItemStat.Lives]: 1,
            [InventoryItemStat.RollSpeed]: 400,
            [InventoryItemStat.AttackSpeed]: 2
        });
    }
    updateAnimationBasedOnWeapon(): void {
        if (this._entity == null) {
            return;
        }
        const animated = this._entity.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
        const inventoryComponent = this._entity.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID);
        const equippedInventory = inventoryComponent!.inventories[0];
        if (equippedInventory.isEquipped(ItemList.Spear)){
            this.weapon = this.weaponAnimations.Spear;
            animated!.animationInfo = playerSpearAnimationInfo;
        }
        else if (equippedInventory.isEquipped(ItemList.Bow)){
            this.weapon = this.weaponAnimations.Bow;
            animated!.animationInfo = playerBowAnimationInfo;
        }
        if (this.weapon != null){
            animated!.spritesheet.src = this.weapon;
        }
    }
    setLane(): void {
        console.assert(this._entity != null);
        const positionComponent = this._entity!.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        positionComponent.x = this.lane * LANE.WIDTH - LANE.WIDTH/2;
    }
    draw() {
        if (this.aura){
            const aura = new Image();
            aura.src = "assets/images/aura.png";
            context.drawImage(aura, 
                positionComponent!.x - positionComponent!.width/2, 
                positionComponent!.y - positionComponent!.height/2, 
                100, 100
            )
        }
    }
}
// Player Information
const weaponAnimations: Record <string, string> = {
    Spear: "assets/images/player.png",
    Bow: "assets/images/playerBow.png"
}
export const StartingStats: Record <InventoryItemStat, number> = {
    [InventoryItemStat.Lives]: 1,
    [InventoryItemStat.RollSpeed]: 400,
    [InventoryItemStat.AttackSpeed]: 2
}
const PLAYER_MOVEMENT_COOLDOWN: number = 10;
const CLICK_DELAY: number = 300; //This is in milliseconds

let lastClick = Date.now();

// Player Animation Information
export const playerSpearAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    maxAnimationFrameCount: 13,
    animations: {
        [PlayerAnimationName.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Jumping]: {
            rowIndex: 0,
            frameCount: 7,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Ducking]: {
            rowIndex: 4,
            frameCount: 7,
            framesPerSecond: 7
        },
        [PlayerAnimationName.RollingLeft]: {
            rowIndex: 9,
            frameCount: 9,
            framesPerSecond: 7
        },
        [PlayerAnimationName.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Dying]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};
export const playerBowAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    maxAnimationFrameCount: 13,
    animations: {
        [PlayerAnimationName.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Jumping]: {
            rowIndex: 0,
            frameCount: 7,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Ducking]: {
            rowIndex: 16,
            frameCount: 13,
            framesPerSecond: 14
        },
        [PlayerAnimationName.RollingLeft]: {
            rowIndex: 9,
            frameCount: 9,
            framesPerSecond: 7
        },
        [PlayerAnimationName.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Dying]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};

// Figure out how to combine these two animation info dictionaries

export const PLAYER: Record <string, number> = {
    WIDTH: 100,
    HEIGHT: 100,
}

const itemSize = {
    width: 50,
    height: 50
}

export const equippedInventory = new Inventory(5, 3, 200, 200, itemSize, true);
export const itemsFound = new Inventory(10, 5, canvas.width * 3/4, 200, itemSize);
if (SaveGameSystem.Instance.loadData(SaveKey.FoundItems) != null){
    itemsFound.cells = SaveGameSystem.Instance.loadData(SaveKey.FoundItems)!;
    console.log(itemsFound.cells);
}

export const playerInventory = [equippedInventory, itemsFound];

export const player = new Entity("Player");

player.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(canvas.width/2, canvas.width/3, PLAYER.WIDTH, PLAYER.HEIGHT, 0));
player.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent(weaponAnimations.Bow, playerBowAnimationInfo));
player.addComponent(PlayerComponent.COMPONENT_ID, new PlayerComponent(1, PlayerState.Running, StartingStats, weaponAnimations));
player.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent<PlayerState>());
player.addComponent(InventoryComponent.COMPONENT_ID, new InventoryComponent(playerInventory));
player.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Player]));

// Player States
const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID);
const animatedComponent = player.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
const positionComponent =  player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
const smComponent = player.getComponent<StateMachineComponent<PlayerState>>(StateMachineComponent.COMPONENT_ID)!;


const onRunningActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<PlayerState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    animatedComponent!.playAnimation(PlayerAnimationName.RunningBack);
    playerComponent!.state = PlayerState.Running;
    animatedComponent!.currentAnimationFrame = 0;
};
const onRunningUpdate = (deltatime: number, currentObject: Entity): PlayerState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<PlayerState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    playerComponent!.directionChange = ~~(allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]) -
        ~~(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]);
    return checkInput(stateStart);
};
const onRunningDeactivation = () => {
};

const onJumpingActivation = () => {
    animatedComponent!.playAnimation(PlayerAnimationName.Jumping);
    playerComponent!.state = PlayerState.Jumping;
    animatedComponent!.currentAnimationFrame = 0;
}
const onJumpingUpdate = (): PlayerState | undefined => {
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return PlayerState.Running;
    }
}
const onJumpingDeactivation = () => {
}

const onDuckingActivation = () => {
    animatedComponent!.playAnimation(PlayerAnimationName.Ducking);
    playerComponent!.state = PlayerState.Ducking;
    animatedComponent!.currentAnimationFrame = 0;
}
const onDuckingUpdate = () => { 
    // if (playerComponent!.weapon == playerComponent!.weaponAnimations.Spear){
    //     if (animatedComponent!.currentAnimationFrame >= playerComponent!.PREPARE_SPEAR_FRAMES - OFFSET){
    //         playerComponent!.attacking = true;
    //         const spearAttackY = canvas.width/3 - positionComponent!.height/2;
    //         positionComponent!.y = spearAttackY;
    //     }
    // }
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return PlayerState.Running;
    }
}
const onDuckingDeactivation = () => {
    if (playerComponent!.attacking != false){
        playerComponent!.attacking = false;
        const playerWalkingY = canvas.width/3;
        positionComponent!.y = playerWalkingY;
    }
    if (playerComponent!.weapon == playerComponent!.weaponAnimations.Bow){
        generateArrow(positionComponent!);
    }
}

const onRollActivation = () => {
    if (playerComponent!.directionChange >= 1){
        animatedComponent!.playAnimation(PlayerAnimationName.RollingRight);  
    }
    else{
        animatedComponent!.playAnimation(PlayerAnimationName.RollingLeft);  
    }
    animatedComponent!.currentAnimationFrame = 0;
    playerComponent!.state = PlayerState.Roll;
}
const onRollUpdate = (deltaTime: number): PlayerState | undefined => {
    const currentLaneX = playerComponent!.lane * LANE.WIDTH - LANE.WIDTH/2;
    if (playerComponent!.directionChange >= 1){
        if (positionComponent!.x > currentLaneX){
            positionComponent!.x = currentLaneX;
            return PlayerState.Running;
        }
        else if (positionComponent!.x < currentLaneX - LANE.WIDTH/2){
            if (checkRollInput() == PlayerState.Roll){
                return PlayerState.Roll;
            }
        }
    }
    else if (playerComponent!.directionChange <= -1){
        if (positionComponent!.x < currentLaneX){
            positionComponent!.x = currentLaneX;
            return PlayerState.Running;
        }
        else if (positionComponent!.x > currentLaneX + LANE.WIDTH/2){
            if (checkRollInput() == PlayerState.Roll){
                return PlayerState.Roll;
            }
        }
    }
    playerComponent!.roll(deltaTime);
}
const onRollDeactivation = () => {
}
const onDyingActivation = () => {
    animatedComponent!.playAnimation(PlayerAnimationName.Dying);
    animatedComponent!.currentAnimationFrame = 0;
}
const onDyingUpdate = (): PlayerState | undefined => {
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        sleep(1000);
        return PlayerState.Running; 
    }
}
const onDyingDeactivation = () => {
    resetGame();
}

smComponent.stateMachine.addState(PlayerState.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
smComponent.stateMachine.addState(PlayerState.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
smComponent.stateMachine.addState(PlayerState.Ducking, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation);
smComponent.stateMachine.addState(PlayerState.Roll, onRollActivation, onRollUpdate, onRollDeactivation);
smComponent.stateMachine.addState(PlayerState.Dying, onDyingActivation, onDyingUpdate, onDyingDeactivation);
smComponent.activate(PlayerState.Running);

export function resetGame(): void {
    // LOAD GAME STATE HERE
    const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;
    const inventoryComponent = player.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!
    objects.splice(0);
    objects.push(player);
    playerComponent.lane = 2;
    playerComponent.setLane();
    for (const inventory of inventoryComponent.inventories){
        inventory.resetInventory();
    }
    equipStarterItems(player);
    playerComponent.updateStats();
    playerComponent.updateAnimationBasedOnWeapon();
    smComponent.activate(PlayerState.Running);
    resetValues();
}

function checkInput(stateStart: number): PlayerState | undefined {
    if (checkRollInput() == PlayerState.Roll){
        return PlayerState.Roll;
    }
    // else if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)) {
    //     return PlayerState.Ducking;
    // }
    else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp] && checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)) {
        return PlayerState.Jumping;
    }
    else if (playerComponent!.stats[InventoryItemStat.Lives] <= 0 && checkTime(200, stateStart) || playerComponent!.stats[InventoryItemStat.Lives] <= -3){
        return PlayerState.Dying;
        // Game mechanic: As long as you keep on moving, you will never die, no matter your lives count.
    }
    else if (mouseDown == true && checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)){
        return PlayerState.Ducking
    }
}

function checkRollInput(): PlayerState | undefined {
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
        if (checkTime(CLICK_DELAY, lastClick) && playerComponent!.lane + playerComponent!.directionChange <= LANE.COUNT && playerComponent!.lane + playerComponent!.directionChange >= 1){
            if (playerComponent!.directionChange != 0){
                playerComponent!.lane += playerComponent!.directionChange;
                lastClick = Date.now();
                return PlayerState.Roll;
            }
        }
    }
}
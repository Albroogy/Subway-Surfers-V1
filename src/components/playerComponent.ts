import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";
import {AnimatedComponent, AnimationInfo} from "./animatedComponent";
import { allPressedKeys, canvas, checkTime, KEYS, LANE, OFFSET, sleep, timeStart } from "../global";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";
import StateMachineComponent from "./stateMachineComponent";
import { objects, resetValues} from "../objects";
import { equipStarterItems, Inventory, InventoryComponent, ItemList } from "./inventoryComponent";


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

    public stats: Record <string, number>;
    public weapon: string | null;
    public weapons: Record <string, string>;
    public directionChange: number;
    public attacking: boolean;
    public lane: number;
    public state: PlayerState;
    public PREPARE_SPEAR_FRAMES: number;

    constructor(lane: number, state: PlayerState, startingStats: Record <string, number>, weapons: Record <string, string>) {
        super();
        this.stats = startingStats;
        this.weapon = null;
        this.weapons = weapons;
        this.directionChange = 0;
        this.attacking = false;
        this.lane = lane;
        this.state = state;
        this.PREPARE_SPEAR_FRAMES = 4;
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
        positionComponent!.x += this.stats.RollSpeed * deltaTime/1000 * this.directionChange;
    }

    updateStats(): void{
        if (this._entity == null) {
            return;
        }
        this.stats = {};
        const inventoryComponent = this._entity.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID);
        inventoryComponent!.inventories[0].updateStats(this.stats);
    }
    updateAnimationBasedOnWeapon(): void {
        if (this._entity == null) {
            return;
        }
        const animated = this._entity.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
        const inventoryComponent = this._entity.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID);
        const equippedInventory = inventoryComponent!.inventories[0];
        if (equippedInventory.isEquipped(ItemList.Spear) != null){
            this.weapon = this.weapons.Spear;
            animated!.animationInfo = playerSpearAnimationInfo;
        }
        else if (equippedInventory.isEquipped(ItemList.Bow)){
            this.weapon = this.weapons.Bow;
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
}
// Player Information
const weapons: Record <string, string> = {
    Spear: "assets/images/player.png",
    Bow: "assets/images/playerBow.png"
}
const StartingItems: Record <string, string | null> = {
    Armor: "&weapon=Leather_leather",
    Bow: null,
    Spear: "&armour=Thrust_spear_2",
    Boots: null
}
export const StartingStats: Record <string, number> = {
    Lives: 1,
    RollSpeed: 500
}
const PLAYER_MOVEMENT_COOLDOWN: number = 100;
const CLICK_DELAY: number = 300; //This is in milliseconds

let lastClick = Date.now();

// Player Animation Information
export const playerSpearAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    animations: {
        [PlayerAnimationName.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 8
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
            framesPerSecond: 9
        },
        [PlayerAnimationName.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 9
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
    animations: {
        [PlayerAnimationName.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 8
        },
        [PlayerAnimationName.Jumping]: {
            rowIndex: 0,
            frameCount: 7,
            framesPerSecond: 7
        },
        [PlayerAnimationName.Ducking]: {
            rowIndex: 16,
            frameCount: 13,
            framesPerSecond: 13
        },
        [PlayerAnimationName.RollingLeft]: {
            rowIndex: 9,
            frameCount: 9,
            framesPerSecond: 9
        },
        [PlayerAnimationName.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 9
        },
        [PlayerAnimationName.Dying]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};

// Figure out how to combine these two animation info dictionaries

// Player Animation
// export const playerAnimated = new PlayerCharacter(canvas.width/2, canvas.width/3, weapons.Bow, playerBowAnimationInfo, 2, PlayerState.Running, PLAYER.WIDTH, PLAYER.HEIGHT, StartingItems, StartingStats, weapons);

const PLAYER: Record <string, number> = {
    WIDTH: 100,
    HEIGHT: 100,
}

export const equippedInventory = new Inventory(5, 3, 50, 200);
export const itemsFound = new Inventory(10, 5, canvas.width/2, 0);

export const playerInventory = [equippedInventory, itemsFound];

export const player = new Entity("Player");

player.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(canvas.width/2, canvas.width/3, PLAYER.WIDTH, PLAYER.HEIGHT, 0));
player.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent(weapons.Bow, playerBowAnimationInfo));
player.addComponent(PlayerComponent.COMPONENT_ID, new PlayerComponent(1, PlayerState.Running, StartingStats, weapons));
player.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent<PlayerState>());
player.addComponent(InventoryComponent.COMPONENT_ID, new InventoryComponent(playerInventory));

// Player States
const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID);
const animatedComponent = player.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
const positionComponent =  player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
const smComponent = player.getComponent<StateMachineComponent<PlayerState>>(StateMachineComponent.COMPONENT_ID)!;


const onRunningActivation = () => {
    animatedComponent!.playAnimation(PlayerAnimationName.RunningBack);
    playerComponent!.state = PlayerState.Running;
    animatedComponent!.currentAnimationFrame = 0;
    console.log("running")
};
const onRunningUpdate = (): PlayerState | undefined => {
    playerComponent!.directionChange = ~~(allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]) -
        ~~(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]);
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
        if (lastClick <= Date.now() - CLICK_DELAY && playerComponent!.lane + playerComponent!.directionChange <= LANE.COUNT && playerComponent!.lane + playerComponent!.directionChange >= 1){
            if (playerComponent!.directionChange != 0){
                playerComponent!.lane += playerComponent!.directionChange;
                lastClick = Date.now();
                return PlayerState.Roll;
            }

        }
    }
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(PLAYER_MOVEMENT_COOLDOWN, timeStart)) {
        return PlayerState.Ducking;
    }
    else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp] && checkTime(PLAYER_MOVEMENT_COOLDOWN, timeStart)) {
        return PlayerState.Jumping;
    }
    if (playerComponent!.stats.Lives <= 0){
        return PlayerState.Dying;
        // Game mechanic: As long as you keep on moving, you will never die, no matter your lives count.
    }
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
    if (playerComponent!.weapon == playerComponent!.weapons.Bow){
        var audio = new Audio('../assets/audio/arrow-release.mp3');
        audio.play();
    }
}
const onDuckingUpdate = () => {
    if (playerComponent!.weapon == playerComponent!.weapons.Spear){
        if (animatedComponent!.currentAnimationFrame >= playerComponent!.PREPARE_SPEAR_FRAMES - OFFSET){
            playerComponent!.attacking = true;
        }
    }
    // if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount){
    //     objects.push(
    //         new Arrow(playerAnimated.x, playerAnimated.y, "assets/images/arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ORIGINAL_SPEED)
    //     );
    // }
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return PlayerState.Running;
    }
}
const onDuckingDeactivation = () => {
    if (playerComponent!.weapon == playerComponent!.weapons.Bow){
        const arrow: Entity = new Entity("Fireball");
        const ARROW_DIRECTION: number = -1;

        const ARROW: Record <string, number | string> = {
            WIDTH: 7.5,
            HEIGHT: 45,
            SPEED: 150,
            DIRECTION: -1,
            URL: "assets/images/arrow.png"
        }
    
        arrow.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(positionComponent!.x, positionComponent!.y, ARROW.WIDTH as number, ARROW.HEIGHT as number, 0));
        arrow.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(ARROW.URL as string));
        arrow.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(ARROW.SPEED as number, ARROW.DIRECTION as number));
    
        objects.push(arrow);
    }
    //Figure out a way to put this 1 frame before the animation ends to make it seems less akward
    if (playerComponent!.attacking != false){
        playerComponent!.attacking = false;
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
    if (playerComponent!.directionChange >= 1){
        if (positionComponent!.x > playerComponent!.lane * LANE.WIDTH - LANE.WIDTH/2){
            positionComponent!.x = playerComponent!.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerState.Running;
        }
    }
    else if (playerComponent!.directionChange <= -1){
        if (positionComponent!.x < playerComponent!.lane * LANE.WIDTH - LANE.WIDTH/2){
            positionComponent!.x = playerComponent!.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerState.Running;
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
    resetGame(player.getComponent(InventoryComponent.COMPONENT_ID)!);
}

smComponent.stateMachine.addState(PlayerState.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
smComponent.stateMachine.addState(PlayerState.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
smComponent.stateMachine.addState(PlayerState.Ducking, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation);
smComponent.stateMachine.addState(PlayerState.Roll, onRollActivation, onRollUpdate, onRollDeactivation);
smComponent.stateMachine.addState(PlayerState.Dying, onDyingActivation, onDyingUpdate, onDyingDeactivation);
smComponent.activate(PlayerState.Running);

export function resetGame(inventoryComponent: InventoryComponent){
    objects.splice(0);
    const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;
    playerComponent.lane = 2;
    playerComponent.setLane();
    playerComponent.stats = StartingStats;
    inventoryComponent.inventories[0].resetInventory();
    equipStarterItems(player);
    playerComponent.updateStats();
    playerComponent.updateAnimationBasedOnWeapon();
    smComponent.activate(PlayerState.Running);
    resetValues();
}
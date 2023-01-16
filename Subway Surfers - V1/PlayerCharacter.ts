import {AnimatedObject, EquipmentItem, AnimationInfo} from "./main";
import {context} from "./main";
import {LANE, ARROW, OFFSET, KEYS, allPressedKeys, objects, playerSM} from "./main";
import {playerAnimated} from "./main";
import { checkTime, sleep, resetGame } from "./main";
import {Arrow} from "./projectiles"

export enum PlayerStates {
    Running = "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping = "jumping",
    Ducking = "ducking",
    Roll = "roll",
    Dying = "dying"
};

const PLAYER_MOVEMENT_COOLDOWN: number = 100;
const CLICK_DELAY: number = 300; //This is in milliseconds

let lastClick = Date.now();

export class PlayerCharacter extends AnimatedObject{
    public equippedItems: Record <string, EquipmentItem>;
    public stats: Record <string, number>;
    public weapon: string | null;
    public weapons: Record <string, string>;
    public directionChange: number;
    public attacking: boolean;
    public lane: number;
    public state: string;
    public PREPARE_SPEAR_FRAMES: number;
    constructor(x: number, y: number,
        spritesheetURL: string, animationInfo: AnimationInfo,
        lane: number, state: string, width: number, height: number,
        startingItems: Record <string, EquipmentItem>, startingStats: Record <string, number>, weapons: Record <string, string>){
        super(x, y, width, height, spritesheetURL, animationInfo);
        this.equippedItems = startingItems;
        this.stats = startingStats;
        this.weapon = null;
        this.weapons = weapons;
        this.directionChange = 0;
        this.attacking = false;
        this.lane = lane;
        this.state = state;
        this.PREPARE_SPEAR_FRAMES = 4;
    }
    roll(deltaTime: number){
            this.x += this.stats.RollSpeed * deltaTime/1000 * this.directionChange;
    }
    statsUpdate(){
        if (this.equippedItems.Armor != null){
            this.stats.Lives = 2;
        }
        if (this.equippedItems.Boots != null){
            this.stats.RollSpeed = 600;
        }
        if (this.equippedItems.Spear != null){
            this.weapon = this.weapons.Spear;
            this.animationInfo = playerSpearAnimationInfo;
        }
        if (this.equippedItems.Bow != null){
            this.weapon = this.weapons.Bow;
            this.animationInfo = playerBowAnimationInfo;
        }
        console.log(this.weapon);
        if (this.weapon != null){
            this.spritesheet.src = this.weapon;
        }
    }
    draw(): undefined{
        if (this.currentAnimation == null) {
            return;
        }
        // const frameW = this.spritesheet.width / this.currentAnimation.frameCount;
        const frameW = this.spritesheet.width / 13;
        const frameH = this.spritesheet.height / this.animationInfo.animationCount;
        console.assert(frameW > 0);
        console.assert(frameH > 0);
        const frameSX = this.currentAnimationFrame * frameW;
        const frameSY = this.currentAnimation.rowIndex * frameH;
        console.assert(frameW >= 0);
        console.assert(frameH >= 0);
        context.drawImage(this.spritesheet,
            frameSX, frameSY, frameW, frameH,
            this.x - this.width / 2, this.y - this.height / 2, this.width, this.height
        );
    }
    changeLane(){
        this.x = this.lane * LANE.WIDTH - LANE.WIDTH/2;
    }
}
// Player Animation Information
export const AnimationNames = {
    RunningBack: "runningBack",
    Jumping: "jumping",
    Ducking: "ducking",
    RollingLeft: "rollingLeft",
    RollingRight: "rollingRight",
    Dying: "dying"
}
export const playerSpearAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    animations: {
        [AnimationNames.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 8
        },
        [AnimationNames.Jumping]: {
            rowIndex: 0,
            frameCount: 7,
            framesPerSecond: 7
        },
        [AnimationNames.Ducking]: {
            rowIndex: 4,
            frameCount: 7,
            framesPerSecond: 7
        },
        [AnimationNames.RollingLeft]: {
            rowIndex: 9,
            frameCount: 9,
            framesPerSecond: 9
        },
        [AnimationNames.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 9
        },
        [AnimationNames.Dying]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};
export const playerBowAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    animations: {
        [AnimationNames.RunningBack]: {
            rowIndex: 8,
            frameCount: 8,
            framesPerSecond: 8
        },
        [AnimationNames.Jumping]: {
            rowIndex: 0,
            frameCount: 7,
            framesPerSecond: 7
        },
        [AnimationNames.Ducking]: {
            rowIndex: 16,
            frameCount: 13,
            framesPerSecond: 13
        },
        [AnimationNames.RollingLeft]: {
            rowIndex: 9,
            frameCount: 9,
            framesPerSecond: 9
        },
        [AnimationNames.RollingRight]: {
            rowIndex: 11,
            frameCount: 9,
            framesPerSecond: 9
        },
        [AnimationNames.Dying]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};

// Figure out how to combine these two animation info dictionaries

// Player States

const onRunningActivation = () => {
    playerAnimated.playAnimation(AnimationNames.RunningBack);
    playerAnimated.state = PlayerStates.Running;
    playerAnimated.currentAnimationFrame = 0;
    console.log("running")
};
const onRunningUpdate = (): string | undefined => {
    playerAnimated.directionChange = ~~(allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]) -
        ~~(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]);
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
        if (lastClick <= Date.now() - CLICK_DELAY && playerAnimated.lane + playerAnimated.directionChange <= LANE.COUNT && playerAnimated.lane + playerAnimated.directionChange >= 1){
            if (playerAnimated.directionChange != 0){
                playerAnimated.lane += playerAnimated.directionChange;
                lastClick = Date.now();
                return PlayerStates.Roll;
            }

        }
    }
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(PLAYER_MOVEMENT_COOLDOWN)) {
        return PlayerStates.Ducking;
    }
    else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp] && checkTime(PLAYER_MOVEMENT_COOLDOWN)) {
        return PlayerStates.Jumping;
    }
    if (playerAnimated.stats.Lives <= 0){
        return PlayerStates.Dying;
        // Game mechanic: As long as you keep on moving, you will never die, no matter your lives count.
    }
};
const onRunningDeactivation = () => {
};

const onJumpingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Jumping);
    playerAnimated.state = PlayerStates.Jumping;
    playerAnimated.currentAnimationFrame = 0;
}
const onJumpingUpdate = (): string | undefined => {
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation!.frameCount - OFFSET){
        return PlayerStates.Running;
    }
}
const onJumpingDeactivation = () => {
}

const onDuckingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Ducking);
    playerAnimated.state = PlayerStates.Ducking;
    playerAnimated.currentAnimationFrame = 0;
    console.log("jumping")
}
const onDuckingUpdate = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Spear){
        if (playerAnimated.currentAnimationFrame >= playerAnimated.PREPARE_SPEAR_FRAMES - OFFSET){
            playerAnimated.attacking = true;
        }
    }
    // if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount){
    //     objects.push(
    //         new Arrow(playerAnimated.x, playerAnimated.y, "arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ORIGINAL_SPEED)
    //     );
    // }
    // Why does this code not work?
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation!.frameCount - OFFSET){
        return PlayerStates.Running;
    }
}
const onDuckingDeactivation = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Bow){
        objects.push(
            new Arrow(playerAnimated.x, playerAnimated.y, "arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ARROW.SPEED)
        );
        console.log("arrow fired");
    }
    //Figure out a way to put this 1 frame before the animation ends to make it seems less akward
    if (playerAnimated.attacking != false){
        playerAnimated.attacking = false;
    }
}

const onRollActivation = () => {
    if (playerAnimated.directionChange >= 1){
        playerAnimated.playAnimation(AnimationNames.RollingRight);  
    }
    else{
        playerAnimated.playAnimation(AnimationNames.RollingLeft);  
    }
    playerAnimated.currentAnimationFrame = 0;
    playerAnimated.state = PlayerStates.Roll;
}
const onRollUpdate = (deltaTime: number): string | undefined => {
    if (playerAnimated.directionChange >= 1){
        if (playerAnimated.x > playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2){
            playerAnimated.x = playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerStates.Running;
        }
    }
    else if (playerAnimated.directionChange <= -1){
        if (playerAnimated.x < playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2){
            playerAnimated.x = playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerStates.Running;
        }
    }
    playerAnimated.roll(deltaTime);
}
const onRollDeactivation = () => {
}
const onDyingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Dying);
    playerAnimated.currentAnimationFrame = 0;
}
const onDyingUpdate = (): string | undefined => {
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation!.frameCount - OFFSET){
        sleep(1000);
        return PlayerStates.Running; 
    }
}
const onDyingDeactivation = () => {
    resetGame();
}

playerSM.addState(PlayerStates.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
playerSM.addState(PlayerStates.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
playerSM.addState(PlayerStates.Ducking, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation);
playerSM.addState(PlayerStates.Roll, onRollActivation, onRollUpdate, onRollDeactivation);
playerSM.addState(PlayerStates.Dying, onDyingActivation, onDyingUpdate, onDyingDeactivation);
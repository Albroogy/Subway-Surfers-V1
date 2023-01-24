// import { AnimatedObject, AnimationInfo, objects, playerSM } from "./main";
import { objects, playerSM } from "./main";
import { resetGame } from "./main";
import { canvas, context, allPressedKeys, timeStart, checkTime, sleep, OFFSET, KEYS, LANE } from "./global";
import { Entity } from "./E&C";
import PositionComponent from "./components/positionComponent";
import PlayerComponent from "./components/playerComponent";
import { AnimatedComponent, AnimationInfo } from "./components/animatedComponent";
import { ImageComponent } from "./components/imageComponent";
import MovementComponent from "./components/movementComponent";

const ARROW: Record <string, number> = {
    WIDTH: 7.5,
    HEIGHT: 45,
    SPEED: 150
}
// Player Information
const PLAYER: Record <string, number> = {
    WIDTH: 100,
    HEIGHT: 100,
}
const weapons: Record <string, string> = {
    Spear: "../assets/images/player.png",
    Bow: "../assets/images/playerBow.png"
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
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(PLAYER_MOVEMENT_COOLDOWN, timeStart)) {
        return PlayerStates.Ducking;
    }
    else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp] && checkTime(PLAYER_MOVEMENT_COOLDOWN, timeStart)) {
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
    if (playerAnimated.weapon == playerAnimated.weapons.Bow){
        var audio = new Audio('../assets/audio/arrow-release.mp3');
        audio.play();
    }
}
const onDuckingUpdate = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Spear){
        if (playerAnimated.currentAnimationFrame >= playerAnimated.PREPARE_SPEAR_FRAMES - OFFSET){
            playerAnimated.attacking = true;
        }
    }
    // if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount){
    //     objects.push(
    //         new Arrow(playerAnimated.x, playerAnimated.y, "../assets/images/arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ORIGINAL_SPEED)
    //     );
    // }
    // Why does this code not work?
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation!.frameCount - OFFSET){
        return PlayerStates.Running;
    }
}
const onDuckingDeactivation = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Bow){
        const arrow: Entity = new Entity("Fireball");
        const ARROW_DIRECTION: number = -1;
    
        arrow.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent());
        arrow.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("arrow.png"));
        arrow.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(150, ARROW_DIRECTION));
    
        objects.push(arrow);
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


// Player Animation
// export const playerAnimated = new PlayerCharacter(canvas.width/2, canvas.width/3, weapons.Bow, playerBowAnimationInfo, 2, PlayerStates.Running, PLAYER.WIDTH, PLAYER.HEIGHT, StartingItems, StartingStats, weapons);
export const playerAnimated = new Entity("PlayerAnimated");
playerAnimated.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent());
playerAnimated.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent(weapons.Bow, playerBowAnimationInfo));
playerAnimated.addComponent(PlayerComponent.COMPONENT_ID, new PlayerComponent(1, AnimationNames.RunningBack, StartingItems, StartingStats, weapons));

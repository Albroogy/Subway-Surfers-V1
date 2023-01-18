import { AnimatedObject, AnimationInfo, StateMachine } from "./main";
import { calculatePlayerStateHeight} from "./main";
import { fallSpeed } from "./main";
import { PlayerCharacter, playerAnimated } from "./playerCharacter";
import { Fireball } from "./projectiles";
import { checkTime, timeStart, objects } from "./global";

export enum DragonStates {
    Flying = "flying",
    Firing = "firing"
}

const DRAGON: Record <string, number> = {
    SIGHT: 300,
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}

export class DragonEnemy extends AnimatedObject{
    public speed: number;
    private stateMachine: StateMachine; // I don't know what to input here
    constructor(x: number, y: number, width: number, height: number, spritesheetURL: string, animationInfo: AnimationInfo, speed: number){
        super(x, y, width, height, spritesheetURL, animationInfo);
        this.speed = speed;
        this.stateMachine = this.generateDragonSM();
        this.stateMachine.activeState = this.stateMachine.states[DragonStates.Flying];
        this.stateMachine.activeState.onActivation(this);
    }
    move(deltaTime: number, gameSpeed: number){
        this.y += this.speed * deltaTime / 1000 * gameSpeed;
    }
    update(deltaTime: number){
        this.animationUpdate(deltaTime);
        this.stateMachine.update(deltaTime, this);
    }
    isColliding(player: PlayerCharacter): boolean{
        return (
            this.x - this.width/2 <= player.x + player.width/2 &&
            this.x + this.width/2 >= player.x - player.width/2 &&
            this.y + this.height/2 >= player.y - calculatePlayerStateHeight()&&
            this.y - this.height/2 <= player.y + player.height/2
        )
    }
    generateDragonSM = (): StateMachine => {
        const dragonSM: StateMachine = new StateMachine();
        dragonSM.addState(DragonStates.Flying, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation);
        dragonSM.addState(DragonStates.Firing, onFiringActivation, onFiringUpdate, onFiringDeactivation)
        return dragonSM;
    }
}
// Dragon Animation Info
const DragonAnimationNames = {
    Flying: "flying",
}

export const DragonAnimationInfo: AnimationInfo = {
    animationCount: 4, 
    animations: {
        [DragonAnimationNames.Flying]: {
            rowIndex: 0,
            frameCount: 4,
            framesPerSecond: 8
        }
    }
};

const onFlyingActivation = (currentObject: DragonEnemy) => {
    currentObject.currentAnimation = currentObject.animationInfo.animations[DragonAnimationNames.Flying]
}
const onFlyingUpdate = (deltatime: number, currentObject: DragonEnemy): string | undefined => {
    if (playerAnimated.x == currentObject.x && playerAnimated.y <= currentObject.y + DRAGON.SIGHT && playerAnimated.y > currentObject.y){
        return DragonStates.Firing;
    }
}
const onFlyingDeactivation = () => {
}
const onFiringActivation = (currentObject: DragonEnemy) => {
    currentObject.currentAnimation = currentObject.animationInfo.animations[DragonAnimationNames.Flying];
    currentObject.speed = 0;
    objects.push(
        new Fireball(currentObject.x, currentObject.y, "../assets/images/fireball.png", DRAGON.WIDTH, DRAGON.HEIGHT, 250)
    );
    var audio = new Audio('../assets/audio/dragon-roar.mp3');
    audio.play();
}
const onFiringUpdate = (deltatime: number, currentObject: DragonEnemy): string | undefined => {
    if (checkTime(1000, timeStart)){
        if (playerAnimated.x != currentObject.x && playerAnimated.y <= currentObject.y + DRAGON.SIGHT && playerAnimated.y > currentObject.y || checkTime(3000, timeStart)){
            return DragonStates.Flying;
        }
    }
}
const onFiringDeactivation = (currentObject: DragonEnemy) => {
    currentObject.speed = fallSpeed;
}

// Make dragon stop moving when near to another obstacle

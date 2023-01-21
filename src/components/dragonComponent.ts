import Component from "./component";
import PositionComponent from "./positionComponent";
import AnimatedComponent from "./animatedComponent";
import { fallSpeed, StateMachine } from "../main";
import { DragonAnimationNames } from "../dragon";
import { playerAnimated } from "../PlayerCharacter";
import { checkTime, objects, timeStart } from "../global";
import { Fireball } from "../projectiles";

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

export default class DragonComponent extends Component{ 
    public speed: number;
    private stateMachine: StateMachine;
    public animated: AnimatedComponent | null;
    public position: PositionComponent | null;
    constructor(speed: number){
        super();
        this.speed = speed;
        this.stateMachine = this.generateDragonSM();
        this.stateMachine.activeState = this.stateMachine.states[DragonStates.Flying];
        this.stateMachine.activeState.onActivation(this);
        this.animated = this._entity!.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
        this.position = this._entity!.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
    }
    generateDragonSM = (): StateMachine => {
        const dragonSM: StateMachine = new StateMachine();
        dragonSM.addState(DragonStates.Flying, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation);
        dragonSM.addState(DragonStates.Firing, onFiringActivation, onFiringUpdate, onFiringDeactivation)
        return dragonSM;
    }
    update(deltaTime: number): void{
        this.stateMachine.update(deltaTime, this);
    }
}

const onFlyingActivation = (currentObject: DragonComponent) => {
    currentObject.animated!.currentAnimation = currentObject.animated!.animationInfo.animations[DragonAnimationNames.Flying]
}
const onFlyingUpdate = (deltatime: number, currentObject: DragonComponent): string | undefined => {
    if (playerAnimated.x == currentObject.position!.x && playerAnimated.y <= currentObject.position!.y + DRAGON.SIGHT && playerAnimated.y > currentObject.position!.y){
        return DragonStates.Firing;
    }
}
const onFlyingDeactivation = () => {
}
const onFiringActivation = (currentObject: DragonComponent) => {
    currentObject.animated!.currentAnimation = currentObject.animated!.animationInfo.animations[DragonAnimationNames.Flying];
    currentObject.speed = 0;
    objects.push(
        new Fireball(currentObject.position!.x, currentObject.position!.y, "../assets/images/fireball.png", DRAGON.WIDTH, DRAGON.HEIGHT, 250)
    );
    var audio = new Audio('../assets/audio/dragon-roar.mp3');
    audio.play();
}
const onFiringUpdate = (deltatime: number, currentObject: DragonComponent): string | undefined => {
    if (checkTime(1000, timeStart)){
        if (playerAnimated.x != currentObject.position!.x && playerAnimated.y <= currentObject.position!.y + DRAGON.SIGHT && playerAnimated.y > currentObject.position!.y || checkTime(3000, timeStart)){
            return DragonStates.Flying;
        }
    }
}
const onFiringDeactivation = (currentObject: DragonComponent) => {
    currentObject.speed = fallSpeed;
}
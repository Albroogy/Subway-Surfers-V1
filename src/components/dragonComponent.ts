import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";
import { fallSpeed, objects, StateMachine } from "../main";
import { AnimatedComponent, DragonAnimationNames } from "./animatedComponent";
import { player } from "../playerCharacter";
import { checkTime, context, timeStart } from "../global";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";

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

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onFlyingActivation = (currentObject: DragonComponent) => {
    currentObject.animated!.currentAnimation = currentObject.animated!.animationInfo.animations[DragonAnimationNames.Flying]
}
const onFlyingUpdate = (deltatime: number, currentObject: DragonComponent): string | undefined => {
    if (playerPositionComponent == null){
        return;
    }
    if (playerPositionComponent.x == currentObject.position!.x && playerPositionComponent.y <= currentObject.position!.y + DRAGON.SIGHT && playerPositionComponent.y > currentObject.position!.y){
        return DragonStates.Firing;
    }
}
const onFlyingDeactivation = () => {
}
const onFiringActivation = (currentObject: DragonComponent) => {
    currentObject.animated!.currentAnimation = currentObject.animated!.animationInfo.animations[DragonAnimationNames.Flying];
    currentObject.speed = 0;
    const fireball: Entity = new Entity("Fireball");
    const FIREBALL_DIRECTION: number = 1;

    fireball.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent());
    fireball.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("fireball.png"));
    fireball.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(150, FIREBALL_DIRECTION));

    objects.push(fireball);

    var audio = new Audio('../assets/audio/dragon-roar.mp3');
    audio.play();
}
const onFiringUpdate = (deltatime: number, currentObject: DragonComponent): string | undefined => {
    if (playerPositionComponent == null){
        return;
    }
    if (checkTime(1000, timeStart)){
        if (playerPositionComponent.x != currentObject.position!.x && playerPositionComponent.y <= currentObject.position!.y + DRAGON.SIGHT && playerPositionComponent.y > currentObject.position!.y || checkTime(3000, timeStart)){
            return DragonStates.Flying;
        }
    }
}
const onFiringDeactivation = (currentObject: DragonComponent) => {
    currentObject.speed = fallSpeed;
}
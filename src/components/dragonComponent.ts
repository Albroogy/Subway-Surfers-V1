import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";
import { objects} from "../objects";
import { AnimatedComponent, AnimationInfo} from "./animatedComponent";
import { checkTime, EntityName} from "../global";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";
import StateMachineComponent from "./stateMachineComponent";
import { player, PlayerState } from "./playerComponent";
import { SoundComponent } from "./soundComponent";

export enum DragonState {
    Flying = "flying",
    Firing = "firing"
}

export enum DragonSound {
    Roar = "roar"
}

const DRAGON: Record <string, number> = {
    SIGHT: 300,
}

export default class DragonComponent extends Component {
    public static COMPONENT_ID: string = "Dragon";
    
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<DragonState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(DragonState.Flying, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation);
        stateMachineComponent.stateMachine.addState(DragonState.Firing, onFiringActivation, onFiringUpdate, onFiringDeactivation);
        stateMachineComponent.activate(DragonState.Flying);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onFlyingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[DragonAnimationNames.Flying]
}
const onFlyingUpdate = (deltatime: number, currentObject: Entity): DragonState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + DRAGON.SIGHT && playerPositionComponent.y > positionComponent.y){
        return DragonState.Firing;
    }
}
const onFlyingDeactivation = () => {
}
const onFiringActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<DragonState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[DragonAnimationNames.Flying];
    if (movementComponent.yDirection != 0){
        movementComponent.yDirection = 0;
    }

    generateFireball(positionComponent, currentObject);
}
const onFiringUpdate = (deltatime: number, currentObject: Entity): DragonState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<PlayerState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (checkTime(1000, stateStart)){
        if (playerPositionComponent.x != positionComponent.x && playerPositionComponent.y <= positionComponent.y + DRAGON.SIGHT && playerPositionComponent.y > positionComponent.y || checkTime(2000, stateStart)){
            return DragonState.Flying;
        }
    }
}
const onFiringDeactivation = (currentObject: Entity) => {
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    movementComponent.yDirection = 1;
}


// Dragon Animation Info
export const DragonAnimationNames = {
    Flying: "flying"
}

export const DragonAnimationInfo: AnimationInfo = {
    animationCount: 4, 
    maxAnimationFrameCount: 4,
    animations: {
        [DragonAnimationNames.Flying]: {
            rowIndex: 0,
            frameCount: 4,
            framesPerSecond: 8
        }
    }
};

function generateFireball(positionComponent: PositionComponent, currentObject: Entity){
    const fireball: Entity = new Entity(EntityName.Fireball);

    const FIREBALL: Record <string, number | string> = {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 150,
        DIRECTION: 1,
        URL: "assets/images/fireball.png"
    }

    fireball.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(positionComponent.x, positionComponent.y, FIREBALL.WIDTH as number, FIREBALL.HEIGHT as number, 0));
    fireball.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(FIREBALL.URL as string));
    fireball.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(FIREBALL.SPEED as number, FIREBALL.DIRECTION as number));

    objects.push(fireball);

    const soundComponent = currentObject.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;

    soundComponent.playSound(DragonSound.Roar)
}

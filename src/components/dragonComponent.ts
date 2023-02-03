import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";
import { fallSpeed, objects} from "../objects";
import { AnimatedComponent, AnimationInfo} from "./animatedComponent";
import { checkTime, context, timeStart } from "../global";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";
import StateMachineComponent from "./stateMachineComponent";
import { player } from "./playerComponent";

export enum DragonState {
    Flying = "flying",
    Firing = "firing"
}

const DRAGON: Record <string, number> = {
    SIGHT: 300,
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}

export default class DragonComponent extends Component {
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<DragonState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(DragonState.Flying, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation);
        stateMachineComponent.stateMachine.addState(DragonState.Firing, onFiringActivation, onFiringUpdate, onFiringDeactivation);
        stateMachineComponent.activate(DragonState.Flying);
        // stateMachineComponent.initialState = DragonState.Flying;
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
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[DragonAnimationNames.Flying];
    movementComponent.speed = 0;

    const fireball: Entity = new Entity("Fireball");

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

    //var audio = new Audio('/assets/audio/dragon-roar.mp3');
    //audio.play();
}
const onFiringUpdate = (deltatime: number, currentObject: Entity): DragonState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (checkTime(1000, timeStart)){
        if (playerPositionComponent.x != positionComponent.x && playerPositionComponent.y <= positionComponent.y + DRAGON.SIGHT && playerPositionComponent.y > positionComponent.y || checkTime(3000, timeStart)){
            return DragonState.Flying;
        }
    }
}
const onFiringDeactivation = (currentObject: Entity) => {
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    movementComponent.speed = fallSpeed;
}


// Dragon Animation Info
export const DragonAnimationNames = {
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

import { Component, Entity } from "../entityComponent";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum MinotaurState {
    WalkingDown = "walkingDown",
    WalkingUp = "walkingUp",
    Jumping = "jumping",
    Hitting = "hitting"
}

const MINOTAUR: Record <string, number> = {
    SIGHT: 300,
    JUMPING_SPEED: 200,
    WALKING_SPEED: 150
}

export default class MinotaurComponent extends Component {
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<MinotaurState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(MinotaurState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
        stateMachineComponent.stateMachine.addState(MinotaurState.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
        stateMachineComponent.stateMachine.addState(MinotaurState.WalkingUp, onWalkingUpActivation, onWalkingUpUpdate, onWalkingUpDeactivation);
        stateMachineComponent.stateMachine.addState(MinotaurState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
        stateMachineComponent.activate(MinotaurState.WalkingDown);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onWalkingDownActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.WalkingDown];
}
const onWalkingDownUpdate = (deltatime: number, currentObject: Entity): MinotaurState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + MINOTAUR.SIGHT && playerPositionComponent.y > positionComponent.y){
        return MinotaurState.Jumping;
    }
}
const onWalkingDownDeactivation = () => {
}

const onJumpingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.Jumping];
    movementComponent.speed = MINOTAUR.JUMPING_SPEED;
}
const onJumpingUpdate = (deltatime: number, currentObject: Entity): MinotaurState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.y < positionComponent.y - 200){
        return MinotaurState.WalkingUp;
    }
}
const onJumpingDeactivation = () => {
}

const onWalkingUpActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.WalkingUp];
    movementComponent.speed = 150;
    movementComponent.yDirection = -1;
}
const onWalkingUpUpdate = (deltatime: number, currentObject: Entity): MinotaurState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y >= positionComponent.y - 100){
        return MinotaurState.Hitting;
    }
}
const onWalkingUpDeactivation = () => {
}
const onHittingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.Hitting];
    console.log(MinotaurState.Hitting);
}
const onHittingUpdate = (deltatime: number, currentObject: Entity): MinotaurState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x != positionComponent.x){
        return MinotaurState.WalkingUp;
    }
}
const onHittingDeactivation = () => {
}

// Minotaur Animation Info
export const MinotaurAnimationNames = {
    WalkingDown: "walkingDown",
    WalkingUp: "walkingUp",
    Jumping: "jumping",
    Hitting: "hitting"
}

export const MinotaurAnimationInfo: AnimationInfo = {
    animationCount: 4, 
    animations: {
        [MinotaurAnimationNames.WalkingDown]: {
            rowIndex: 10,
            frameCount: 9,
            framesPerSecond: 8
        },
        [MinotaurAnimationNames.WalkingUp]: {
            rowIndex: 8,
            frameCount: 9,
            framesPerSecond: 8
        },
        [MinotaurAnimationNames.Jumping]: {
            rowIndex: 20,
            frameCount: 6,
            framesPerSecond: 8
        },
        [MinotaurAnimationNames.Hitting]: {
            rowIndex: 4,
            frameCount: 8,
            framesPerSecond: 8
        }
    }
};
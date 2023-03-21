import { Component, Entity } from "../entityComponent";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum SkeletonState {
    WalkingDown = "walkingDown",
    Hitting = "hitting"
}

export default class SkeletonComponent extends Component {
    public static COMPONENT_ID: string = "Skeleton";
    public lastHit: number = 0;

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<SkeletonState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(SkeletonState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
        stateMachineComponent.stateMachine.addState(SkeletonState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
        stateMachineComponent.activate(SkeletonState.WalkingDown);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onWalkingDownActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[SkeletonAnimationNames.WalkingDown];
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!
    if (movementComponent.yDirection != 1){
        movementComponent.yDirection = 1;
    }
}
const onWalkingDownUpdate = (deltatime: number, currentObject: Entity): SkeletonState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + 50 && playerPositionComponent.y > positionComponent.y){
        return SkeletonState.Hitting;
    }
}
const onWalkingDownDeactivation = () => {
}

const onHittingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[SkeletonAnimationNames.Hitting];
    console.log(SkeletonState.Hitting);
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!
    if (movementComponent.yDirection != 0){
        movementComponent.yDirection = 0;
    }
}
const onHittingUpdate = (deltatime: number, currentObject: Entity): SkeletonState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x != positionComponent.x){
        return SkeletonState.WalkingDown;
    }
}
const onHittingDeactivation = () => {
}

// Skeleton Animation Info
export const SkeletonAnimationNames = {
    WalkingDown: "walkingDown",
    Hitting: "hitting",
}

export const SkeletonAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    maxAnimationFrameCount: 13,
    animations: {
        [SkeletonAnimationNames.WalkingDown]: {
            rowIndex: 10,
            frameCount: 9,
            framesPerSecond: 8
        },
        [SkeletonAnimationNames.Hitting]: {
            rowIndex: 14,
            frameCount: 6,
            framesPerSecond: 8
        }
    }
};
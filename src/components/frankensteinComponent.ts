import { Component, Entity } from "../entityComponent";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum FrankensteinState {
    WalkingDown = "walkingDown",
    Hitting = "hitting"
}

export default class FrankensteinComponent extends Component {
    public health: number = 2;
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<FrankensteinState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(FrankensteinState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
        stateMachineComponent.stateMachine.addState(FrankensteinState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
        stateMachineComponent.activate(FrankensteinState.WalkingDown);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onWalkingDownActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.WalkingDown];
}
const onWalkingDownUpdate = (deltatime: number, currentObject: Entity): FrankensteinState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + 50 && playerPositionComponent.y > positionComponent.y){
        return FrankensteinState.Hitting;
    }
}
const onWalkingDownDeactivation = () => {
}

const onHittingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.Hitting];
    console.log(FrankensteinState.Hitting);
}
const onHittingUpdate = (deltatime: number, currentObject: Entity): FrankensteinState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x != positionComponent.x){
        return FrankensteinState.WalkingDown;
    }
}
const onHittingDeactivation = () => {
}

// Frankenstein Animation Info
export const FrankensteinAnimationNames = {
    WalkingDown: "walkingDown",
    Hitting: "hitting",
    Bow: "bow"
}

export const FrankensteinAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    animations: {
        [FrankensteinAnimationNames.WalkingDown]: {
            rowIndex: 10,
            frameCount: 9,
            framesPerSecond: 8
        },
        [FrankensteinAnimationNames.Hitting]: {
            rowIndex: 6,
            frameCount: 8,
            framesPerSecond: 8
        },
        [FrankensteinAnimationNames.Bow]: {
            rowIndex: 16,
            frameCount: 13,
            framesPerSecond: 8
        }
    }
};
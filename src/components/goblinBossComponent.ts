import { Component, Entity } from "../entityComponent";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum GoblinBossState {
    WalkingDown = "walkingDown",
    Hitting = "hitting"
}

export default class GoblinBossComponent extends Component {
    public static COMPONENT_ID: string = "GoblinBoss";

    public health: number = 2;
    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GoblinBossState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
        stateMachineComponent.activate(GoblinBossState.WalkingDown);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

const onWalkingDownActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.WalkingDown];
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!
    if (movementComponent.yDirection != 1){
        movementComponent.yDirection = 1;
    }
}
const onWalkingDownUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + playerPositionComponent.height/2 && playerPositionComponent.y >= positionComponent.y){
        return GoblinBossState.Hitting;
    }
}
const onWalkingDownDeactivation = () => {
}

const onHittingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.Hitting];
    console.log(GoblinBossState.Hitting);
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!
    if (movementComponent.yDirection != 0){
        movementComponent.yDirection = 0;
    }
}
const onHittingUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x != positionComponent.x){
        return GoblinBossState.WalkingDown;
    }
}
const onHittingDeactivation = () => {
}

// Frankenstein Animation Info
export const FrankensteinAnimationNames = {
    WalkingDown: "walkingDown",
    Hitting: "hitting",
}

export const FrankensteinAnimationInfo: AnimationInfo = {
    animationCount: 21, 
    maxAnimationFrameCount: 13,
    animations: {
        [FrankensteinAnimationNames.WalkingDown]: {
            rowIndex: 10,
            frameCount: 9,
            framesPerSecond: 6
        },
        [FrankensteinAnimationNames.Hitting]: {
            rowIndex: 14,
            frameCount: 6,
            framesPerSecond: 6
        }
    }
};
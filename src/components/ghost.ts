import { Component, Entity } from "../entityComponent";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum GhostState {
    Walking = "walking",
    Attacking = "attacking"
}

export default class GhostComponent extends Component {
    public static COMPONENT_ID: string = "Ghost";

    public speed = 150;
    public direction = {
        x: 0,
        y: 0
    }

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GhostState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GhostState.Walking, onWalkingActivation, onWalkingUpdate, onWalkingDeactivation);
        stateMachineComponent.stateMachine.addState(GhostState.Attacking, onAttackingActivation, onAttackingUpdate, onAttackingDeactivation);
        stateMachineComponent.activate(GhostState.Walking);
    }
}

const playerPositionComponent: PositionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;

const onWalkingActivation = (currentObject: Entity) => {

}
const onWalkingUpdate = (deltatime: number, currentObject: Entity): GhostState | undefined => {
    const playerX = playerPositionComponent.x;
    const playerY = playerPositionComponent.y;
    
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const ghostComponent = currentObject.getComponent<GhostComponent>(GhostComponent.COMPONENT_ID)!;

    const deltaX = playerX - positionComponent.x;
    const deltaY = playerY - positionComponent.y;

    if (deltaX < 0) {
    ghostComponent.direction.x = -1;
    } else {
    ghostComponent.direction.x = 1;
    }

    if (deltaY < 0) {
    ghostComponent.direction.y = -1;
    } else if (deltaY ) {
    ghostComponent.direction.y = 1;
    }

    positionComponent.x += ghostComponent.direction.x * ghostComponent.speed; 
    positionComponent.y += ghostComponent.direction.y * ghostComponent.speed; 
}
const onWalkingDeactivation = () => {
}

const onAttackingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.Attacking];
    console.log(GhostState.Attacking);
    const movementComponent = currentObject.getComponent<MovementComponent>(MovementComponent.COMPONENT_ID)!
    if (movementComponent.yDirection != 0){
        movementComponent.yDirection = 0;
    }
}
const onAttackingUpdate = (deltatime: number, currentObject: Entity): GhostState | undefined => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    if (playerPositionComponent == null){
        return;
    }
    else if (playerPositionComponent.x != positionComponent.x){
        return GhostState.Walking;
    }
}
const onAttackingDeactivation = () => {
}

// Ghost Animation Info
export const GhostAnimationNames = {
    WalkingEast: "walkingEast",
    WalkingNorth: "walkingNorth",
    WalkingNorthEast: "walkingNorthEast",
    WalkingNorthWest: "walkingNorthWest",
    WalkingSouth: "walkingSouth",
    WalkingSouthEast: "walkingSouthEast",
    WalkingSouthWest: "walkingSouthWest",
    WalkingWest: "walkingWest",
    AttackingEast: "attackingEast",
    AttackingNorth: "attackingNorth",
    AttackingNorthEast: "attackingNorthEast",
    AttackingNorthWest: "attackingNorthWest",
    AttackingSouth: "attackingSouth",
    AttackingSouthEast: "attackingSouthEast",
    AttackingSouthWest: "attackingSouthWest",
    AttackingWest: "attackingWest",
    Death: "death"
}

export const GhostAnimationInfo: AnimationInfo = {
    animationCount: 16, 
    maxAnimationFrameCount: 24,
    animations: {
        [GhostAnimationNames.Death]: {
            rowIndex: 0,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingEast]: {
            rowIndex: 1,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorth]: {
            rowIndex: 2,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorthEast]: {
            rowIndex: 3,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorthWest]: {
            rowIndex: 4,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouth]: {
            rowIndex: 5,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouthEast]: {
            rowIndex: 6,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouthWest]: {
            rowIndex: 7,
            frameCount: 24,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingWest]: {
            rowIndex: 8,
            frameCount: 24,
            framesPerSecond: 8
        },
    }
};
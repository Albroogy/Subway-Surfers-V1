import { Component, Entity } from "../entityComponent";
import { checkTime } from "../global";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";

export enum GhostState {
    Walking = "walking",
    Attacking = "attacking"
}


let playerPositionComponent: PositionComponent | null = null;

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
        
        playerPositionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
    }
}

const onWalkingActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GhostState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
}
const onWalkingUpdate = (deltatime: number, currentObject: Entity): GhostState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GhostState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart
    const playerX = playerPositionComponent!.x;
    const playerY = playerPositionComponent!.y;
    
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const ghostComponent = currentObject.getComponent<GhostComponent>(GhostComponent.COMPONENT_ID)!;

    if (checkTime(1000, stateStart)){
        const deltaX = playerX - positionComponent.x;
        const deltaY = playerY - positionComponent.y;

        if (deltaX < 100 || deltaX > -100) {
          return GhostState.Attacking;
        }
    
        if (deltaX < 0) {
          ghostComponent.direction.x = -1;
        } else if (deltaX > 0) {
          ghostComponent.direction.x = 1;
        } else {
          ghostComponent.direction.x = 0;
        }
        
        if (deltaY < 0) {
          ghostComponent.direction.y = -1;
        } else if (deltaY > 0) {
          ghostComponent.direction.y = 1;
        } else {
          ghostComponent.direction.y = 0;
        }
        chooseWalkingAnimation(currentObject);
    }
    stateStart = Date.now();
    positionComponent.x += ghostComponent.direction.x * ghostComponent.speed * deltatime / 1000; 
    positionComponent.y += ghostComponent.direction.y * ghostComponent.speed * deltatime / 1000; 
}
const onWalkingDeactivation = () => {
}

const onAttackingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    chooseAttackingAnimation(currentObject);
}
const onAttackingUpdate = (deltatime: number, currentObject: Entity): GhostState | undefined => {
  const playerX = playerPositionComponent!.x;

  const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!

  const deltaX = playerX - positionComponent.x;

  if (deltaX > 100 || deltaX < -100) {
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
    animationCount: 17, 
    maxAnimationFrameCount: 24,
    animations: {
        [GhostAnimationNames.Death]: {
            rowIndex: 0,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.AttackingEast]: {
          rowIndex: 1,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingNorth]: {
          rowIndex: 2,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingNorthEast]: {
          rowIndex: 3,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingNorthWest]: {
          rowIndex: 4,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingSouth]: {
          rowIndex: 5,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingSouthEast]: {
          rowIndex: 6,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingSouthWest]: {
          rowIndex: 7,
          frameCount: 24,
          framesPerSecond: 8
      },
      [GhostAnimationNames.AttackingWest]: {
          rowIndex: 8,
          frameCount: 24,
          framesPerSecond: 8
      },
        [GhostAnimationNames.WalkingEast]: {
            rowIndex: 9,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorth]: {
            rowIndex: 10,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorthEast]: {
            rowIndex: 11,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingNorthWest]: {
            rowIndex: 12,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouth]: {
            rowIndex: 13,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouthEast]: {
            rowIndex: 14,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingSouthWest]: {
            rowIndex: 15,
            frameCount: 12,
            framesPerSecond: 8
        },
        [GhostAnimationNames.WalkingWest]: {
            rowIndex: 16,
            frameCount: 12,
            framesPerSecond: 8
        },
    }
};

function chooseWalkingAnimation(currentObject: Entity) {
    const ghostComponent = currentObject.getComponent<GhostComponent>(GhostComponent.COMPONENT_ID)!;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;

    switch (ghostComponent.direction.x) {
      case -1:
        // ghost is moving left
        switch (ghostComponent.direction.y) {
          case -1:
            // ghost is moving left and up
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorthWest];
            break;
          case 0:
            // ghost is moving left
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingWest];
            break;
          case 1:
            // ghost is moving left and down
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouthWest];
            break;
        }
        break;
      case 0:
        // ghost is not moving left or right
        switch (ghostComponent.direction.y) {
          case -1:
            // ghost is moving up
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorth];
            break;
          case 1:
            // ghost is moving down
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouth];
            break;
        }
        break;
      case 1:
        // ghost is moving right
        switch (ghostComponent.direction.y) {
          case -1:
            // ghost is moving right and up
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorthEast];
            break;
          case 0:
            // ghost is moving right
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingEast];
            break;
          case 1:
            // ghost is moving right and down
            animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouthEast];
            break;
        }
        break;
    }
}

function chooseAttackingAnimation(currentObject: Entity) {
  const ghostComponent = currentObject.getComponent<GhostComponent>(GhostComponent.COMPONENT_ID)!;
  const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;

  switch (ghostComponent.direction.x) {
    case -1:
      // ghost is moving left
      switch (ghostComponent.direction.y) {
        case -1:
          // ghost is moving left and up
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorthWest];
          break;
        case 0:
          // ghost is moving left
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingWest];
          break;
        case 1:
          // ghost is moving left and down
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouthWest];
          break;
      }
      break;
    case 0:
      // ghost is not moving left or right
      switch (ghostComponent.direction.y) {
        case -1:
          // ghost is moving up
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorth];
          break;
        case 1:
          // ghost is moving down
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouth];
          break;
      }
      break;
    case 1:
      // ghost is moving right
      switch (ghostComponent.direction.y) {
        case -1:
          // ghost is moving right and up
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorthEast];
          break;
        case 0:
          // ghost is moving right
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingEast];
          break;
        case 1:
          // ghost is moving right and down
          animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouthEast];
          break;
      }
      break;
  }
}
import { Component, Entity } from "../entityComponent";
import { generateMoneyPouch } from "../entityGenerator";
import { calculateLaneLocation, checkTime, findLane, IN_GAME_SECOND, mouse, OFFSET, sleep, Tag } from "../global";
import { objects } from "../objects";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import ArrowComponent from "./arrowComponent";
import HealthBarComponent from "./healthBarComponent";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";
import { TagComponent } from "./tagComponent";

export enum GoblinBossState {
    Stationary = "Stationary",
    GroundSlam = "GroundSlam",
    Taunt = "Taunt",
    Healing = "Healing",
    MoneyPouch = "MoneyPouch",
    MoneyThrow = "MoneyThrow",
    Jump = "Jump",
    ChangeLane = "ChangeLane",
    Defeat = "Defeat",
}

let playerPositionComponent: PositionComponent | null = null;

export default class GoblinBossComponent extends Component {
    public static COMPONENT_ID: string = "GoblinBoss";

    public health: number = 20;
    public landingLocation: number = 0;
    public goblinRestY: number = 100;
    public lastHit: number = 0;
    public walkDirection: number = 0;
    public walkSpeed: number = 150;
    public lane: number = 2;

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GoblinBossState.GroundSlam, onGroundSlamActivation, onGroundSlamUpdate, onGroundSlamDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Stationary, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Taunt, onTauntActivation, onTauntUpdate, onTauntDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyPouch, onMoneyPouchActivation, onMoneyPouchUpdate, onMoneyPouchDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyThrow, onMoneyThrowActivation, onMoneyThrowUpdate, onMoneyThrowDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Healing, onHealingActivation, onHealingUpdate, onHealingDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Jump, onJumpActivation, onJumpUpdate, onJumpDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.ChangeLane, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Defeat, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation);

        stateMachineComponent.activate(GoblinBossState.GroundSlam);
        
        playerPositionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
    }
    public changeLane(deltaTime: number){
        if (this._entity == null){
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        positionComponent!.x += this.walkSpeed * deltaTime/1000 * this.walkDirection;
    }
    public chooseDirection(){
        let randomNum = Math.random();
        
        if (randomNum > 0.5){
            this.walkDirection = 1;
        }
        else {
            this.walkDirection = -1;
        }
        if (this.lane + this.walkDirection < 1 || this.lane + this.walkDirection > 3){
            this.chooseDirection();
        }
        else {
            this.lane += this.walkDirection;
        }
    }
    public update() {
        if (this._entity == null){
            return;
        }
        const healthBarComponent = this._entity.getComponent<HealthBarComponent>(HealthBarComponent.COMPONENT_ID)!;
        healthBarComponent.setHealth(this.health);
    }
}

const onGroundSlamActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.GroundSlam];
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    if (goblinBossComponent.landingLocation != 0) {
        positionComponent.x = calculateLaneLocation(goblinBossComponent.landingLocation);
        positionComponent.y = playerPositionComponent!.y;
    }
}
const onGroundSlamUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        animatedComponent.pauseAnimation = true;
        if (checkTime(IN_GAME_SECOND * 1.5, stateStart)) {
            animatedComponent.pauseAnimation = false;
            return GoblinBossState.Stationary;
        }
    }
}
const onGroundSlamDeactivation = (currentObject: Entity) => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    if (goblinBossComponent.landingLocation != 0) {
        positionComponent.x = calculateLaneLocation(goblinBossComponent.lane);
        positionComponent.y = goblinBossComponent.goblinRestY;
    }
}

const onStationaryActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Stationary];
}
const onStationaryUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    if (goblinBossComponent.health < 0) {
        return GoblinBossState.Defeat;
    }
    if (checkTime(IN_GAME_SECOND * 2, stateStart)){
        const randomNum = Math.random();
        if (randomNum < 0.2) {
            return GoblinBossState.MoneyPouch;
        }
        else if (randomNum < 0.4) {
            const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
            if (goblinBossComponent.health < 20){
                return GoblinBossState.Healing;
            }
        }
        else if (randomNum < 0.6) {
            return GoblinBossState.Jump;
        }
        else if (randomNum < 0.8) {
            return GoblinBossState.ChangeLane;
        }
        else {
            return GoblinBossState.Taunt;
        }
    }
}

const onStationaryDeactivation = () => {
}

const onTauntActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Taunt];
}
const onTauntUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        return GoblinBossState.Stationary;
    }
}
const onTauntDeactivation = () => {
}

const onMoneyPouchActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.MoneyPouch];
}
const onMoneyPouchUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        return GoblinBossState.MoneyThrow;
    }
}
const onMoneyPouchDeactivation = () => {
}

const onMoneyThrowActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.MoneyThrow];
}
const onMoneyThrowUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        generateMoneyPouch(currentObject);
        return GoblinBossState.Stationary;
    }
}
const onMoneyThrowDeactivation = () => {
}

const onHealingActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Healing];
}
const onHealingUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
        goblinBossComponent.health += 5;
        return GoblinBossState.Stationary;
    }
}
const onHealingDeactivation = () => {
}

const onJumpActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Jump];
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    goblinBossComponent.landingLocation = findLane(playerPositionComponent!.x);
}
const onJumpUpdate = (deltatime: number, currentObject: Entity): GoblinBossState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation!.frameCount - OFFSET){
        animatedComponent.shouldDraw = false;
        if (checkTime(IN_GAME_SECOND * 1.5, stateStart)) {
            animatedComponent.shouldDraw = true;
            return GoblinBossState.GroundSlam;
        }
    }
}
const onJumpDeactivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.shouldDraw = true;
}

const onChangeLaneActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.ChangeLane];
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    goblinBossComponent.chooseDirection();
    if (goblinBossComponent.walkDirection == 1){
        animatedComponent!.isFlipped = false;
    }
    else{
        animatedComponent!.isFlipped = true;
    }
    animatedComponent!.currentAnimationFrame = 0;
}
const onChangeLaneUpdate = (deltaTime: number, currentObject: Entity): GoblinBossState | undefined => {
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    goblinBossComponent.changeLane(deltaTime);
    if (goblinBossComponent.walkDirection == 1){
        if (positionComponent!.x > calculateLaneLocation(goblinBossComponent.lane)){
            positionComponent!.x = calculateLaneLocation(goblinBossComponent.lane);
            return GoblinBossState.Stationary;
        }
    }
    else {
        if (positionComponent!.x < calculateLaneLocation(goblinBossComponent.lane)){
            positionComponent!.x = calculateLaneLocation(goblinBossComponent.lane);
            return GoblinBossState.Stationary;
        }
    }
}
const onChangeLaneDeactivation = (currentObject: Entity) => {
}

const onDefeatActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Defeat];
    animatedComponent!.currentAnimationFrame = 0;
}
const onDefeatUpdate = (deltaTime: number, currentObject: Entity): GoblinBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return GoblinBossState.Stationary;
    }
}
const onDefeatDeactivation = (currentObject: Entity) => {
    objects.splice(objects.indexOf(currentObject), 1);
}

// Goblin Boss Animation Info
enum GoblinBossAnimationNames {
    Stationary,
    GroundSlam,
    Taunt,
    Healing,
    MoneyPouch,
    MoneyThrow,
    Jump,
    ChangeLane,
    Defeat
}

export const GoblinBossAnimationInfo: AnimationInfo = {
    animationCount: 11, 
    maxAnimationFrameCount: 16,
    animations: {
        [GoblinBossAnimationNames.Stationary]: {
            rowIndex: 0,
            frameCount: 4,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.GroundSlam]: {
            rowIndex: 10,
            frameCount: 7,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.Taunt]: {
            rowIndex: 8,
            frameCount: 6,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.Healing]: {
            rowIndex: 5,
            frameCount: 16,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.MoneyPouch]: {
            rowIndex: 3,
            frameCount: 12,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.MoneyThrow]: {
            rowIndex: 4,
            frameCount: 8,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.Jump]: {
            rowIndex: 9,
            frameCount: 6,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.ChangeLane]: {
            rowIndex: 1,
            frameCount: 6,
            framesPerSecond: 6
        },
        [GoblinBossAnimationNames.Defeat]: {
            rowIndex: 7,
            frameCount: 11,
            framesPerSecond: 6
        },
    }
};
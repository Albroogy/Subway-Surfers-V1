import { Component, Entity } from "../entityComponent";
import { checkTime, findLane, IN_GAME_SECOND, mouse, OFFSET, Tag } from "../global";
import { calculateLaneLocation } from "../main";
import { objects } from "../objects";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import ArrowComponent from "./arrowComponent";
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

export default class GoblinBossComponent extends Component {
    public static COMPONENT_ID: string = "GoblinBoss";

    public health: number = 20;
    public landingLocation: number = 0;
    public goblinRestY: number = 100;
    public lastHit: number = 0;

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GoblinBossState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GoblinBossState.GroundSlam, onGroundSlamActivation, onGroundSlamUpdate, onGroundSlamDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Stationary, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Taunt, onTauntActivation, onTauntUpdate, onTauntDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyPouch, onMoneyPouchActivation, onMoneyPouchUpdate, onMoneyPouchDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyThrow, onMoneyThrowActivation, onMoneyThrowUpdate, onMoneyThrowDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Healing, onHealingActivation, onHealingUpdate, onHealingDeactivation);
        stateMachineComponent.stateMachine.addState(GoblinBossState.Jump, onJumpActivation, onJumpUpdate, onJumpDeactivation);
        stateMachineComponent.activate(GoblinBossState.GroundSlam);
    }
}

const playerPositionComponent: PositionComponent | null = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);

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
        return GoblinBossState.Stationary;
    }
}
const onGroundSlamDeactivation = (currentObject: Entity) => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
    if (goblinBossComponent.landingLocation != 0) {
        positionComponent.x = calculateLaneLocation(2);
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
    if (checkTime(IN_GAME_SECOND * 2, stateStart)){
        const randomNum = Math.random();
        if (randomNum < 0.2) {
            return GoblinBossState.MoneyPouch;
        }
        else if (randomNum < 0.5) {
            const goblinBossComponent = currentObject.getComponent<GoblinBossComponent>(GoblinBossComponent.COMPONENT_ID)!;
            if (goblinBossComponent.health < 20){
                return GoblinBossState.Healing;
            }
        }
        else if (randomNum < 0.9) {
                return GoblinBossState.Jump;
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
        goblinBossComponent.health += 1;
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
        if (checkTime(IN_GAME_SECOND * 1, stateStart)){
            return GoblinBossState.GroundSlam;
        }
    }
}
const onJumpDeactivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.shouldDraw = true;
}

function generateMoneyPouch(currentObject: Entity){
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;

    const moneyPouch: Entity = new Entity("MoneyPouch");

    const MONEY_POUCH: Record <string, number | string> = {
        WIDTH: 30,
        HEIGHT: 30,
        SPEED: 200,
        URL: "assets/images/moneyPouch.png"
    }

    let angle = Math.atan2(playerPositionComponent!.y - positionComponent.y, playerPositionComponent!.x - positionComponent.x);
    const Direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    moneyPouch.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(positionComponent.x, positionComponent.y, MONEY_POUCH.WIDTH as number, MONEY_POUCH.HEIGHT as number, 0, angle));
    moneyPouch.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(MONEY_POUCH.URL as string));
    moneyPouch.addComponent(ArrowComponent.COMPONENT_ID, new ArrowComponent(MONEY_POUCH.SPEED as number, Direction));
    moneyPouch.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.MoneyPouch]));

    objects.push(moneyPouch);
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
    }
};
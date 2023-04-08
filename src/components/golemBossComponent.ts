import { Component, Entity } from "../entityComponent";
import { generateArmProjectile, generateLaser, generateMoneyPouch } from "../entityGenerator";
import { calculateLaneLocation, canvas, checkTime, findLane, IN_GAME_SECOND, mouse, OFFSET, sleep, Tag } from "../global";
import { objects } from "../objects";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import ArrowComponent from "./arrowComponent";
import GoblinBossComponent from "./goblinBossComponent";
import HealthBarComponent from "./healthBarComponent";
import { ImageComponent } from "./imageComponent";
import MovementComponent from "./movementComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";
import StateMachineComponent from "./stateMachineComponent";
import { TagComponent } from "./tagComponent";

export enum GolemBossState {
    Stationary = "Stationary",
    ChangeLane = "ChangeLane",
    ArmProjectileAttack = "ArmProjectileAttack",
    LaserBeam = "LaserBeam",
    LaserRain = "LaserRain",
    RegainArmor = "RegainArmor",
    Defeat = "Defeat",
}

let playerPositionComponent: PositionComponent | null = null;

export default class GolemBossComponent extends Component {
    public static COMPONENT_ID: string = "GolemBoss";

    public health: number = 20;
    public armor: number = 3;
    public landingLocation: number = 0;
    public lastHit: number = 0;
    public walkDirection: number = 0;
    public walkSpeed: number = 150;
    public lane: number = 2;

    public onAttached(): void {
        const stateMachineComponent = this._entity!.getComponent<StateMachineComponent<GolemBossState>>(StateMachineComponent.COMPONENT_ID)!;
        stateMachineComponent.stateMachine.addState(GolemBossState.Stationary, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation);
        stateMachineComponent.stateMachine.addState(GolemBossState.ChangeLane, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation);
        stateMachineComponent.stateMachine.addState(GolemBossState.LaserBeam, onLaserBeamActivation, onLaserBeamUpdate, onLaserBeamDeactivation);
        stateMachineComponent.stateMachine.addState(GolemBossState.ArmProjectileAttack, onArmProjectileAttackActivation, onArmProjectileAttackUpdate, onArmProjectileAttackDeactivation);
        stateMachineComponent.stateMachine.addState(GolemBossState.LaserRain, onLaserRainActivation, onLaserRainUpdate, onLaserRainDeactivation);
        stateMachineComponent.stateMachine.addState(GolemBossState.Defeat, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation);

        stateMachineComponent.activate(GolemBossState.Stationary);
        
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
        healthBarComponent.entityBars[0].setHealth(this.health); // Health bar
        healthBarComponent.entityBars[1].setHealth(this.armor); // Armor bar
    }
}

const onStationaryActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GolemBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Stationary];
}
const onStationaryUpdate = (deltatime: number, currentObject: Entity): GolemBossState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GolemBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    const golemBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
    if (golemBossComponent.health < 0) {
        return GolemBossState.Defeat;
    }
    if (checkTime(IN_GAME_SECOND * 2, stateStart)){
        // const randomNum = Math.random();
        // if (randomNum < 0.2) {
        //     return GolemBossState.ArmProjectileAttack;
        // }
        // else if (randomNum < 0.4) {
        //     const goblinBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
        //     if (goblinBossComponent.armor < 3){
        //         return GolemBossState.RegainArmor;
        //     }
        // }
        // else if (randomNum < 0.6) {
        //     return GolemBossState.LaserBeam;
        // }
        // else if (randomNum < 0.8) {
        //     return GolemBossState.ChangeLane;
        // }
        // else {
            return GolemBossState.LaserRain;
        // }
    }
}

const onStationaryDeactivation = () => {
}

const onChangeLaneActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Stationary];
    const golemBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
    golemBossComponent.chooseDirection();
    if (golemBossComponent.walkDirection == 1){
        animatedComponent!.isFlipped = false;
    }
    else{
        animatedComponent!.isFlipped = true;
    }
    animatedComponent!.currentAnimationFrame = 0;
}
const onChangeLaneUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    const golemBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    golemBossComponent.changeLane(deltaTime);
    if (golemBossComponent.walkDirection == 1){
        if (positionComponent!.x > calculateLaneLocation(golemBossComponent.lane)){
            positionComponent!.x = calculateLaneLocation(golemBossComponent.lane);
            return GolemBossState.Stationary;
        }
    }
    else {
        if (positionComponent!.x < calculateLaneLocation(golemBossComponent.lane)){
            positionComponent!.x = calculateLaneLocation(golemBossComponent.lane);
            return GolemBossState.Stationary;
        }
    }
}
const onChangeLaneDeactivation = (currentObject: Entity) => {
}

const onDefeatActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Defeat];
    animatedComponent!.currentAnimationFrame = 0;
}
const onDefeatUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return GolemBossState.Stationary;
    }
}
const onDefeatDeactivation = (currentObject: Entity) => {
    objects.splice(objects.indexOf(currentObject), 1);
}

const onLaserBeamActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.LaserBeam];
    animatedComponent!.currentAnimationFrame = 0;
}
const onLaserBeamUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return GolemBossState.Stationary;
    }
}
const onLaserBeamDeactivation = (currentObject: Entity) => {
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    generateLaser(positionComponent.x, positionComponent.y);
}

const onLaserRainActivation = (currentObject: Entity) => {
    currentObject.getComponent<StateMachineComponent<GolemBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart = Date.now();
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.LaserRain];
    animatedComponent!.currentAnimationFrame = 0;
    for (let i = 0; i < 5; i++) {
        let laserX = Math.random() * canvas.width;
        let laserY = Math.random() * canvas.height;
        generateLaser(laserX, laserY);
    }
}
const onLaserRainUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    let stateStart = currentObject.getComponent<StateMachineComponent<GolemBossState>>(StateMachineComponent.COMPONENT_ID)!.stateMachine.data.stateStart;
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        animatedComponent.pauseAnimation = true;
        if (checkTime(IN_GAME_SECOND * 3, stateStart)) {
            animatedComponent.pauseAnimation = false;
            return GolemBossState.Stationary;
        }
    }
}
const onLaserRainDeactivation = (currentObject: Entity) => {
}

const onArmProjectileAttackActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.ArmProjectileAttack];
    animatedComponent!.currentAnimationFrame = 0;
}
const onArmProjectileAttackUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return GolemBossState.Stationary;
    }
}
const onArmProjectileAttackDeactivation = (currentObject: Entity) => {
    generateArmProjectile(currentObject);
}

const onRegainArmorActivation = (currentObject: Entity) => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.RegainArmor];
    animatedComponent!.currentAnimationFrame = 0;
}
const onRegainArmorUpdate = (deltaTime: number, currentObject: Entity): GolemBossState | undefined => {
    const animatedComponent = currentObject.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    if (animatedComponent!.currentAnimationFrame >= animatedComponent!.currentAnimation!.frameCount - OFFSET){
        return GolemBossState.Stationary;
    }
}
const onRegainArmorDeactivation = (currentObject: Entity) => {
    const golemBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
    golemBossComponent.armor = 3;
}

// Goblin Boss Animation Info
enum GolemBossAnimationNames {
    Stationary,
    ArmProjectileAttack,
    LaserBeam,
    LaserRain,
    RegainArmor,
    Defeat
}

export const GolemBossAnimationInfo: AnimationInfo = {
    animationCount: 9, 
    maxAnimationFrameCount: 10,
    animations: {
        [GolemBossAnimationNames.Stationary]: {
            rowIndex: 0,
            frameCount: 4,
            framesPerSecond: 6
        },
        [GolemBossAnimationNames.ArmProjectileAttack]: {
            rowIndex: 2,
            frameCount: 9,
            framesPerSecond: 6
        },
        [GolemBossAnimationNames.LaserBeam]: {
            rowIndex: 4,
            frameCount: 7,
            framesPerSecond: 6
        },
        [GolemBossAnimationNames.LaserRain]: {
            rowIndex: 3,
            frameCount: 8,
            framesPerSecond: 6
        },
        [GolemBossAnimationNames.Defeat]: {
            rowIndex: 7,
            frameCount: 10,
            framesPerSecond: 6
        },
    }
};
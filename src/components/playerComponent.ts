import { Component } from "../entityComponent";
import PositionComponent from "./positionComponent";
import {AnimatedComponent} from "./animatedComponent";
import { playerBowAnimationInfo, playerSpearAnimationInfo } from "../playerCharacter";
import { LANE } from "../global";


export enum PlayerState {
    Running = "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping = "jumping",
    Ducking = "ducking",
    Roll = "roll",
    Dying = "dying"
};

export const PlayerAnimationName = {
    RunningBack: "runningBack",
    Jumping: "jumping",
    Ducking: "ducking",
    RollingLeft: "rollingLeft",
    RollingRight: "rollingRight",
    Dying: "dying"
}

export default class PlayerComponent extends Component{ 
    public equippedItems: Record <string, string | null>;
    public stats: Record <string, number>;
    public weapon: string | null;
    public weapons: Record <string, string>;
    public directionChange: number;
    public attacking: boolean;
    public lane: number;
    public state: PlayerState;
    public PREPARE_SPEAR_FRAMES: number;

    constructor(lane: number, state: PlayerState, startingItems: Record <string, string | null>, startingStats: Record <string, number>, weapons: Record <string, string>) {
        super();
        this.equippedItems = startingItems;
        this.stats = startingStats;
        this.weapon = null;
        this.weapons = weapons;
        this.directionChange = 0;
        this.attacking = false;
        this.lane = lane;
        this.state = state;
        this.PREPARE_SPEAR_FRAMES = 4;
    }
    
    roll(deltaTime: number){
        if (this._entity == null){
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        positionComponent!.x += this.stats.RollSpeed * deltaTime/1000 * this.directionChange;
    }
    statsUpdate(): void{
        if (this._entity == null){
            return;
        }
        const animated = this._entity.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID);
        if (this.equippedItems.Armor != null){
            this.stats.Lives = 2;
        }
        if (this.equippedItems.Boots != null){
            this.stats.RollSpeed = 600;
        }
        if (this.equippedItems.Spear != null){
            this.weapon = this.weapons.Spear;
            animated!.animationInfo = playerSpearAnimationInfo;
        }
        else if (this.equippedItems.Bow != null){
            this.weapon = this.weapons.Bow;
            animated!.animationInfo = playerBowAnimationInfo;
        }
        if (this.weapon != null){
            animated!.spritesheet.src = this.weapon;
        }
    }
    changeLane(): void {
        console.assert(this._entity != null);
        const positionComponent = this._entity!.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        positionComponent.x = this.lane * LANE.WIDTH - LANE.WIDTH/2;
    }
}
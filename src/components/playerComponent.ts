import { Component } from "../components/component";
import PositionComponent from "./positionComponent";
import AnimatedComponent from "./animatedComponent";
import { playerBowAnimationInfo, playerSpearAnimationInfo } from "../PlayerCharacter";

export default class PlayerComponent extends Component{ 
    public equippedItems: Record <string, string | null>;
    public stats: Record <string, number>;
    public weapon: string | null;
    public weapons: Record <string, string>;
    public directionChange: number;
    public attacking: boolean;
    public lane: number;
    public state: string;
    public PREPARE_SPEAR_FRAMES: number;

    constructor(lane: number, state: string, startingItems: Record <string, string | null>, startingStats: Record <string, number>, weapons: Record <string, string>) {
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
}
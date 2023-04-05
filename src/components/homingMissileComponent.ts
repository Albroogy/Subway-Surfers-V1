import { Component } from "../entityComponent";
import { player } from "./playerComponent";
import PositionComponent from "./positionComponent";

type Direction = {x: number, y: number}

export default class HomingMissileComponent extends Component {    
    public static COMPONENT_ID: string = "HomingMissile";

    public speed: number = 0;

    public direction: Direction = {x: 0, y: 0};

    constructor(speed: number) {
        super();
        this.speed = speed;
    }

    public update(deltaTime: number, gameSpeed: number): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        const playerPositionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        console.assert(positionComponent != null);
    
        let angle = Math.atan2(playerPositionComponent!.y - positionComponent.y, playerPositionComponent!.x - positionComponent.x);
        this.direction = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        positionComponent.rotation = angle;
        positionComponent!.x += this.speed * deltaTime / 1000 * this.direction.x * gameSpeed;
        positionComponent!.y += this.speed * deltaTime / 1000 * this.direction.y * gameSpeed;
    }
}
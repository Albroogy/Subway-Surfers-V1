import { Component } from "../entityComponent";
import PositionComponent from "./positionComponent";

type Direction = {x: number, y: number}

export default class ArrowComponent extends Component {    
    public static COMPONENT_ID: string = "Movement";

    public speed: number = 0;

    public direction: Direction;

    constructor(speed: number, direction: Direction) {
        super();
        this.speed = speed;
        this.direction = direction
    }

    public update(deltaTime: number, gameSpeed: number): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        console.assert(positionComponent != null);
        positionComponent!.x += this.speed * deltaTime / 1000 * this.direction.x * gameSpeed;
        positionComponent!.y += this.speed * deltaTime / 1000 * this.direction.y * gameSpeed;
    }
}
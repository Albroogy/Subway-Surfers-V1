import { Component } from "../entityComponent";
import PositionComponent from "./positionComponent";

export default class MovementComponent extends Component {    
    public static COMPONENT_ID: string = "Movement";

    public speed: number = 0;
     // Either a 1, 0, or -1
    public yDirection: number = 0;

    constructor(speed: number, yDirection: number) {
        super();
        this.speed = speed;
        this.yDirection = yDirection;
    }
    
    public update(deltaTime: number, gameSpeed: number): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        console.assert(positionComponent != null);
        positionComponent!.y += this.speed * deltaTime / 1000 * this.yDirection * gameSpeed;
    }
}
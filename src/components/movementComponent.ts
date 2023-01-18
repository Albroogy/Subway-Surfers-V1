import Component from "./component";
import PositionComponent from "./positionComponent";

export default class MovementComponent extends Component {    
    public static COMPONENT_ID: string = "Movement";

    public speed: number = 0;
     // Either a 1 or -1
    public yDirection: number = 0;

    constructor(speed: number, yDirection: number) {
        super();
        this.speed = speed;
        this.yDirection = yDirection;
    }
    
    public update(deltaTime: number): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        console.assert(positionComponent != null);
        // TODO: Take gamespeed into account
        positionComponent!.y += this.speed * deltaTime / 1000;// * gameSpeed;
    }
}
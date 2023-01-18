import Component from "./component";
import PositionComponent from "./positionComponent";

export default class DrawCircleComponent extends Component { 
    public static COMPONENT_ID: string = "DrawCircle";
    private _color: string = "black";
    private _context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, color: string) {
        super();
        this._context = context;
        this._color = color;
    }
    
    public update(deltaTime: number): void {
        if (this._entity == null) {
            return;
        }
        const position = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        console.assert(position != null);
        this._context.beginPath();
        this._context.arc(position!.x, position!.y, position!.width, 0, 2 * Math.PI, false);
        this._context.closePath();
        this._context.fillStyle = this._color;
        this._context.fill();
    }
}
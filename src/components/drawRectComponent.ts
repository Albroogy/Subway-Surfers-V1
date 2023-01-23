import { Component } from "../E&C";
import PositionComponent from "./positionComponent";

export default class DrawRectComponent extends Component { 
    public static COMPONENT_ID: string = "DrawRect";
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
        this._context.fillStyle = this._color;
        this._context.fillRect(position!.x - position!.width/2, position!.y - position!.height/2, position!.width, position!.height);
    }
}
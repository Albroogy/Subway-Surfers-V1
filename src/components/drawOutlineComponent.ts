import { Component } from "../entityComponent";
import PositionComponent from "./positionComponent";

export default class DrawOutlineComponent extends Component { 
    public static COMPONENT_ID: string = "DrawOutline";
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
        this._context.strokeStyle = this._color;
        this._context.strokeRect(position!.x - position!.width/2, position!.y - position!.height/2, position!.width, position!.height);
    }
}
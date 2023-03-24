import { Component } from "../entityComponent";

export default class PositionComponent extends Component {
    public static COMPONENT_ID: string = "Position";

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public radius: number;
    public rotation: number;

    constructor(x: number, y: number, width: number, height: number, radius: number = 0, rotation: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.rotation = rotation; 
    }
}
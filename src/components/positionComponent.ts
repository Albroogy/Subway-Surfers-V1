import { Component } from "../entityComponent";

export default class PositionComponent extends Component {
    public static COMPONENT_ID: string = "Position";

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public radius: number;

    constructor(x: number, y: number, width: number, height: number, radius: number){
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }
}
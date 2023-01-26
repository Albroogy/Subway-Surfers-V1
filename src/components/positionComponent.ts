import { Component } from "../entityComponent";

export default class PositionComponent extends Component {
    public static COMPONENT_ID: string = "Position";

    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    public radius: number = 0;
}
import { Component } from "../entityComponent";
import { context } from "../global";

export default class CameraComponent extends Component {
    public static COMPONENT_ID: string = "Camera";

    public cameraAngle: number = 0;
    public cameraX: number = 500;
    public cameraY: number = 500;
    public zoomLevel: number = 1;

    public draw(): void {
        context.save();

        context.rotate(this.cameraAngle);
        context.translate(this.cameraX, this.cameraY);
        context.scale(this.zoomLevel, this.zoomLevel);

        context.restore();
    }
}
import { canvas, context } from "../global";

export default class CameraSystem {
    public static Instance = new CameraSystem();

    public cameraAngle: number = 0;
    public cameraX: number = 0;
    public cameraY: number = 0;
    public zoomLevel: number = 1;
    public translatePoint = {
        x: canvas.width/2,
        y: canvas.height/2
    }

    public beginDraw(): void {
        context.save();

        context.rotate(this.cameraAngle);
        context.translate(this.translatePoint.x, this.translatePoint.y);
        context.scale(this.zoomLevel, this.zoomLevel);
        context.translate(-this.translatePoint.x, -this.translatePoint.y);
    }

    public endDraw(): void {
        context.restore();
    }
}

import { canvas, context } from "../global";

export default class CameraSystem {
    public static Instance = new CameraSystem();

    public cameraAngle: number = 0;
    public cameraX: number = 0;
    public cameraY: number = 0;
    public zoomLevel: number = 1;

    public beginDraw(): void {
        context.save();

        context.rotate(this.cameraAngle);
        context.translate(this.cameraX, this.cameraY);
        context.translate(canvas.width/2, canvas.height/2);
        context.scale(this.zoomLevel, this.zoomLevel);
        context.translate(-canvas.width/2, -canvas.height/2);
    }

    public endDraw(): void {
        context.restore();
    }
}

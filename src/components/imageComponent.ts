import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";

export class ImageComponent extends Component { 
    public static COMPONENT_ID: string = "Image";
    
    public image: HTMLImageElement;

    constructor(imageURL: string) {
        super();
        this.image = new Image();
        this.image.src = imageURL;
    }
    public draw(): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        if (positionComponent.rotation !== 0) {
            context.save(); // save the current transformation matrix
            context.translate(positionComponent.x, positionComponent.y); // move the origin to the object's position
            context.rotate(positionComponent.rotation); // apply the object's current rotation
            
            const imageWidth = positionComponent.width || this.image.width; // get image width, or use default
            const imageHeight = positionComponent.height || this.image.height; // get image height, or use default

            context.drawImage(
                this.image,
                -imageWidth / 2,
                -imageHeight / 2,
                imageWidth,
                imageHeight
            );

            context.restore();
        }
        else {
            const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
            const imageWidth = positionComponent.width || this.image.width; // get image width, or use default
            const imageHeight = positionComponent.height || this.image.height; // get image height, or use default
            
            context.drawImage(
                this.image,
                -imageWidth / 2,
                -imageHeight / 2,
                imageWidth,
                imageHeight
            );
        }
    }
}
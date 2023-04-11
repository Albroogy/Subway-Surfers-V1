import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";

export class ImageComponent extends Component { 
    public static COMPONENT_ID: string = "Image";
    
    public image: HTMLImageElement;
    public isLoaded: boolean = false;


    constructor(imageURL: string) {
        super();
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        };
        this.image.src = imageURL;
    }
    public draw(): void{
        if (this._entity == null) {
            return;
        }
        if (!this.isLoaded) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        const imageWidth = positionComponent.width || this.image.width; // get image width, or use default
        const imageHeight = positionComponent.height || this.image.height; // get image height, or use default
        const centerX = positionComponent.x - imageWidth / 2;
        const centerY = positionComponent.y - imageHeight / 2;
        if (positionComponent.rotation !== 0) {
            context.save(); // save the current transformation matrix
            context.translate(centerX, centerY); // move the origin to the object's position
            context.rotate(positionComponent.rotation); // apply the object's current rotation
            context.translate(-centerX, -centerY); // move the origin to the object's position
        }

        context.drawImage(
            this.image,
            centerX,
            centerY,
            imageWidth,
            imageHeight
        );

        if (positionComponent.rotation !== 0) {
            context.restore();
        }
    }
}
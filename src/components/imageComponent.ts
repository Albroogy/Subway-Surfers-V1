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
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
            context.drawImage(this.image, positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, 
                positionComponent!.width, positionComponent!.height
            );
    }
}
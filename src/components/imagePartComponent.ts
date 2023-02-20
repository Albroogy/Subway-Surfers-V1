import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";

export class ImagePartComponent extends Component { 
    public static COMPONENT_ID: string = "ImagePart";
    
    public image: HTMLImageElement;
    public imageSX: number;
    public imageSY: number;
    public imageSW: number;
    public imageSH: number;

    constructor(imageURL: string, imageSX: number, imageSY: number, imageSW: number, imageSH: number) {
        super();
        this.image = new Image();
        this.image.src = imageURL;
        this.imageSX = imageSX;
        this.imageSY = imageSY;
        this.imageSW = imageSW;
        this.imageSH = imageSH;
    }
    public draw(): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
            context.drawImage(this.image, this.imageSX, this.imageSY, this.imageSW, this.imageSH, positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, 
                positionComponent!.width, positionComponent!.height
            );
    }
}

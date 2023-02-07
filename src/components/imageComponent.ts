import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";

export class ImageComponent extends Component { 
    public static COMPONENT_ID: string = "Image";
    
    public image: HTMLImageElement;
    public imageSX: number;
    public imageSY: number;
    private _imageW: number;
    private _imageH: number;

    constructor(imageURL: string, imageSX: number = 0, imageSY: number = 0, imageW = 0, imageH = 0) {
        super();
        this.image = new Image();
        this.image.src = imageURL;
        this.imageSX = imageSX
        this.imageSY = imageSY
        if (imageW == 0 || imageH == 0){
            this._imageW = this.image.width;
            this._imageH = this.image.height;
        }
        else{
            this._imageW = imageW;
            this._imageH = imageH;
        }
    }
    public draw(): void{
        if (this._entity == null) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        context.drawImage(this.image, this.imageSX, this.imageSY, this._imageW, this._imageH, 
            positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, 
            positionComponent!.width, positionComponent!.height
        );
    }
}
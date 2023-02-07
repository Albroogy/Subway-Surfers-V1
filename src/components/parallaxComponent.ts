import { Component } from "../entityComponent";
import { canvas, context } from "../global";

export class ParallaxImage {
    public image: HTMLImageElement;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(imageURL: string, width: number, height: number) {
        this.image = new Image();
        this.image.src = imageURL;
        this.x = canvas.width/2;
        this.y = canvas.width/2;
        this.width = width;
        this.height = height; 
    }
    public draw(): void{
        context.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2, 
            this.image.width, this.image.height
        );
    }
}

export class ParallaxComponent extends Component{ 
    public static COMPONENT_ID: string = "Parallax";
    private _textures: Array<ParallaxImage>;
    private _speed: number;

    constructor(textures: Array<ParallaxImage>, speed: number){
        super();
        this._textures = textures;
        this._speed = speed;
    }
    public update(): void {
        for (let i = 0; i < this._textures.length; i++){
            this._textures[i].x += this._speed / (this._textures.length - 1);
        }
    }
    public draw(): void {
        for (const texture of this._textures){
            texture.draw();
        }
    }
}
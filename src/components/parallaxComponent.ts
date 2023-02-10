import { Component, Entity } from "../entityComponent";
import { canvas, context } from "../global";
import PositionComponent from "./positionComponent";

// export class ParallaxComponent extends Component{ 
//     public static COMPONENT_ID: string = "Parallax";
//     private _textures: Array<HTMLImageElement>;
//     private _speed: number;

//     constructor(textures: Array<HTMLImageElement>, speed: number){
//         super();
//         this._textures = textures;
//         this._speed = speed;
//     }
//     public update(deltaTime: number, gameSpeed: number): void {
//         for (let i = 0; i < this._textures.length; i++){
//             const positionComponent = this._textures[i].getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
//             positionComponent.x += this._speed / (Math.abs(this._textures.length - i)) * gameSpeed;
//         }
//     }
//     public draw(): void {
//         for (const texture of this._textures){
//             texture.draw();
//         }
//     }
// }

export class ParallaxComponent extends Component{ 
    public static COMPONENT_ID: string = "Parallax";
    private _textures: Array<HTMLImageElement>;
    private _speed: number;
    public topSourceX: number = 0;
    public bottomSourceX: number;

    constructor(textures: Array<HTMLImageElement>, speed: number){
        super();
        this._textures = textures;
        this._speed = speed;
        this.bottomSourceX = 590;

    }
    public update(deltaTime: number, gameSpeed: number): void {
        this.topSourceX = (this.topSourceX + this._speed * gameSpeed) % 1920;
        this.bottomSourceX = (this.bottomSourceX + this._speed * gameSpeed) % 1920;
    }
    public draw(): void {
        for (let i = 0; i < this._textures.length; i++){
            context.drawImage(this._textures[i], this.topSourceX, 0, this._textures[i].width/2, this._textures[i].height, 0, 0, this._textures[i].width/2, this._textures[i].height) // Top part
            context.drawImage(this._textures[i], this._textures[i].width/2 + this.bottomSourceX, 0, this._textures[i].width/2, this._textures[i].height, this._textures[i].width/2, 0, this._textures[i].width/2, this._textures[i].height) // Bottom part
        }
        console.log(this._textures);
    }
}
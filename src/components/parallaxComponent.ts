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
    private _speeds: Array<number>;
    private _xPositions: Array<number>;
    public topSourceX: number = 0;
    public bottomSourceX: number;

    constructor(textures: Array<HTMLImageElement>, speed: number){
        super();
        this._textures = textures;
        this._speeds = [];
        this._xPositions = [];
        for (let i = 0; i < textures.length; i++) {
            this._speeds[i] = (i / textures.length) * speed;
            this._xPositions[i] = 0;
        }
        this.bottomSourceX = 590;

    }
    public update(deltaTime: number, gameSpeed: number): void {
        for (let i = 0; i < this._speeds.length; i++) {
            this._xPositions[i] -= this._speeds[i];
            if (this._xPositions[i] <= -this._textures[i].width) {
                this._xPositions[i] = 0;
            }
        }
        //this.topSourceX = (this.topSourceX + this._speed * gameSpeed) % 1920;
        //this.bottomSourceX = (this.bottomSourceX + this._speed * gameSpeed) % 1920;
    }
    public draw(): void {
        context.save();
        context.scale(canvas.width / this._textures[0].width, canvas.height / this._textures[0].height);

        for (let i = 0; i < this._textures.length; i++){
            const tex = this._textures[i];
            context.drawImage(tex,
                0, 0, tex.width, tex.height,
                this._xPositions[i], 0, tex.width, tex.height
            ); // right part
            
            context.drawImage(tex,
                0, 0, tex.width, tex.height,
                tex.width + this._xPositions[i], 0, tex.width, tex.height
            ); // left part
        }
        context.restore();
    }
}
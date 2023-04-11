import { Component} from "../entityComponent";
import { canvas, context } from "../global";

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
            this._xPositions[i] -= this._speeds[i] * gameSpeed;
            if (this._xPositions[i] <= -this._textures[i].width) {
                this._xPositions[i] = 0;
            }
        }
    }
    public draw(): void {
        context.save();
        context.scale(canvas.width / this._textures[0].width, canvas.height / this._textures[0].height);
        // context.scale(1.5, 1.5);

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
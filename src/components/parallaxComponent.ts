import { Component, Entity } from "../entityComponent";
import PositionComponent from "./positionComponent";

export class ParallaxComponent extends Component{ 
    public static COMPONENT_ID: string = "Parallax";
    private _textures: Array<Array<Entity>>;
    private _speed: number;

    constructor(textures: Array<Array<Entity>>, speed: number){
        super();
        this._textures = textures;
        this._speed = speed;
    }
    public update(deltaTime: number, gameSpeed: number): void {
        for (let i = 0; i < this._textures.length; i++) {
            for (let j = 0; i < this._textures[i].length; i++) {
                const positionComponent = this._textures[i][j].getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
                positionComponent.x += this._speed / (Math.abs(this._textures.length - i)) * gameSpeed;
            }
        }
    }
    public draw(): void {
        for (let i = 0; i < this._textures.length; i++) {
            for (let j = 0; i <= this._textures[i].length; i++) {
                this._textures[i][j].draw()
                // console.log(this._textures[i][j].getComponent<ImageComponent>(ImageComponent.COMPONENT_ID)!.image.src)
            }
        }
    }
}

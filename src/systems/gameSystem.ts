import GameComponent from "../components/gameComponent";
import { ImageComponent } from "../components/imageComponent";
import { ParallaxComponent} from "../components/parallaxComponent";
import PositionComponent from "../components/positionComponent";
import StateMachineComponent, { StateMachine } from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { allPressedKeys, canvas, EntityName, KEYS } from "../global";

// let backgroundTextures: Array<Array<Entity>> = [];
// for (let i = 0; i < textureCount; i++){
//     const texture1 = new Entity("ParallaxImage");
//     texture1.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(0, canvas.height/2, 1920, 1080, 0));
//     texture1.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(textureCount - i)}.png`, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT));
//     const texture2 = new Entity("ParallaxImage");
//     texture2.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(canvas.width, canvas.height/2, 1920, 1080, 0));
//     texture2.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(textureCount - i)}.png`, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT));
//     const layer = [texture1, texture2];
//     backgroundTextures.push(layer);
//     console.log(backgroundTextures);
// }
//for (let i = 0; i < textureCount; i++){
//     const texture = new Entity("ParallaxImage");
//     texture.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(canvas.width/2, canvas.height/2, 1920, 1080, 0));
//     texture.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(i - textureCount)}.png`));
//     backgroundTextures.push(texture);
// }

let backgroundTextures: Array<HTMLImageElement> = [];

const textureCount: number = 8;
const TEXTURE_WIDTH: number = 1920;
const TEXTURE_HEIGHT: number = 1080;

for (let i = 0; i < textureCount; i++){
    const texture: HTMLImageElement = new Image(TEXTURE_WIDTH, TEXTURE_HEIGHT);
    texture.src = `assets/images/PARALLAX/layer_0${Math.abs(i - textureCount)}.png`;
    backgroundTextures.push(texture);
}

export const gameEntity = new Entity(EntityName.GameEntity);
gameEntity.addComponent(ParallaxComponent.COMPONENT_ID, new ParallaxComponent(backgroundTextures, 10));
gameEntity.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent);
gameEntity.addComponent(GameComponent.COMPONENT_ID, new GameComponent);


// class ParallaxLayer{

//         public texture: HTMLImageElement;
//         private _hasTextureLoaded: boolean;
//         private _frameW: number = 0;
//         private _frameH: number = 0;
//         public sourceX: number = 0;
//         public sourceY: number = 0;
    
//         constructor(texture: string) {
//             this.texture = new Image();
//             this._hasTextureLoaded = false;
//             this.texture.onload = () => {
//                 this._hasTextureLoaded = true;
//                 this._frameW = this.texture.width / 2
//                 this._frameH = this.texture.height / 2
//             }
//             this.texture.src = texture;
//         }
        
//         public draw(): void{
//             if (!this._hasTextureLoaded) {
//                 return;
//             }
//             const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
//             context.drawImage(this.spritesheet,
//                 frameSX, frameSY, this._frameW, this._frameH,
                
//             );
//         }
// }
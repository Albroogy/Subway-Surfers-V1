import GameComponent from "../components/gameComponent";
import { ImageComponent } from "../components/imageComponent";
import { ParallaxComponent} from "../components/parallaxComponent";
import PositionComponent from "../components/positionComponent";
import StateMachineComponent, { StateMachine } from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { allPressedKeys, canvas, EntityName, KEYS } from "../global";

const textureCount: number = 8;
const TEXTURE_WIDTH: number = 1920;
const TEXTURE_HEIGHT: number = 1080;

let backgroundTextures: Array<Array<Entity>> = [];
for (let i = 0; i < textureCount; i++){
    const texture1 = new Entity("ParallaxImage");
    texture1.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(-TEXTURE_WIDTH / 2, canvas.height/2, 1920, 1080, 0));
    texture1.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(textureCount - i)}.png`, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT));
    const texture2 = new Entity("ParallaxImage");
    texture2.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(TEXTURE_WIDTH / 2, canvas.height/2, 1920, 1080, 0));
    texture2.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(textureCount - i)}.png`, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT));
    const layer = [texture1, texture2];
    backgroundTextures.push(layer);
    console.log(backgroundTextures);
}

export const gameEntity = new Entity(EntityName.GameEntity);
gameEntity.addComponent(ParallaxComponent.COMPONENT_ID, new ParallaxComponent(backgroundTextures, 10));
gameEntity.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent);
gameEntity.addComponent(GameComponent.COMPONENT_ID, new GameComponent);



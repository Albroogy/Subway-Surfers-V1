import GameComponent from "../components/gameComponent";
import { ParallaxComponent} from "../components/parallaxComponent";
import StateMachineComponent from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { EntityName} from "../global";

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

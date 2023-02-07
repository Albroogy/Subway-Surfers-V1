import GameComponent from "../components/gameComponent";
import { ImageComponent } from "../components/imageComponent";
import { ParallaxComponent} from "../components/parallaxComponent";
import PositionComponent from "../components/positionComponent";
import StateMachineComponent, { StateMachine } from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { allPressedKeys, canvas, EntityName, KEYS } from "../global";

const textureCount: number = 8;

let backgroundTextures: Array<Entity> = [];
for (let i = 0; i < textureCount; i++){
    const texture = new Entity("ParallaxImage");
    texture.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(canvas.width/2, canvas.height/2, 1920, 1080, 0));
    texture.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(`assets/images/PARALLAX/layer_0${Math.abs(i - textureCount)}.png`, 0, 0, 1920, 1080));
    backgroundTextures.push(texture);
    console.log(backgroundTextures);
}

export const gameEntity = new Entity(EntityName.GameEntity);
gameEntity.addComponent(ParallaxComponent.COMPONENT_ID, new ParallaxComponent(backgroundTextures, 10));
gameEntity.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent);
gameEntity.addComponent(GameComponent.COMPONENT_ID, new GameComponent);


import GameComponent from "../components/gameComponent";
import { ParallaxComponent, ParallaxImage } from "../components/parallaxComponent";
import StateMachineComponent, { StateMachine } from "../components/stateMachineComponent";
import { Entity } from "../entityComponent";
import { allPressedKeys, EntityName, KEYS } from "../global";

const textureCount: number = 8;

let backgroundTextures: Array<ParallaxImage> = [];
for (let i = 1; i <= textureCount; i++){
    const texture = new ParallaxImage(`layer_0${i}_1920 x 1080`, 1920, 1080);
    backgroundTextures.push(texture)
}

export const gameEntity = new Entity(EntityName.GameEntity);
gameEntity.addComponent(ParallaxComponent.COMPONENT_ID, new ParallaxComponent(backgroundTextures, 150));
gameEntity.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent);
gameEntity.addComponent(GameComponent.COMPONENT_ID, new GameComponent)


// Setting up state machine
// export const gameSM = new StateMachine<GameState>();
// gameSM.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
// gameSM.addState(GameState.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);

// // Activating state machines
// gameSM.activeState = gameSM.states[GameState.Playing];
// gameSM.activeState.onActivation(null as unknown as Entity);

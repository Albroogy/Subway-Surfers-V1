import PositionComponent from "../components/positionComponent";
import DrawCircleComponent from "../components/drawCircleComponent";
import { Entity } from "../entityComponent";
import { IN_GAME_SECOND, Tag } from "../global";
import { TagComponent } from "../components/tagComponent";
import FrankensteinComponent from "../components/frankensteinComponent";
import { objects } from "../objects";
import { player, PlayerComponent } from "../components/playerComponent";
import { SoundComponent } from "../components/soundComponent";
import { gameEntity, GameSound } from "./gameSystem";
import { addGold, addScore, deleteObject, destroyCollidingObjects } from "../main";
import { AnimatedComponent } from "../components/animatedComponent";
import CameraSystem from "./cameraSystem";

type Func = (object1: Entity, object2: Entity) => void;
type Registry = { [tag: string]: { [subtag: string]: Func } }; 

export default class CollisionSystem {
    public static registry: Registry = {
        [Tag.Player]: {
            [Tag.Coin]: playerCoinCollision, 
            [Tag.Frankenstein]: playerFrankensteinCollision, 
            [Tag.Fireball]: playerGenericCollision, 
            [Tag.Skeleton]: playerSkeletonCollision, 
            [Tag.Dragon]: playerGenericCollision,
            [Tag.Minotaur]: playerGenericCollision,
            [Tag.Ghost]: playerGenericCollision,
            [Tag.ExtendedVisionPowerup]: playerExtendedVisionPowerupCollision,
            [Tag.AuraPowerup]: playerAuraPowerupCollision,
        },
        [Tag.Arrow]: {
            [Tag.Frankenstein]: arrowFrankensteinCollision,
            [Tag.Skeleton]: arrowGenericCollision,
            [Tag.Dragon]: arrowGenericCollision,
            [Tag.Minotaur]: arrowGenericCollision,
            [Tag.Ghost]: arrowGenericCollision,
        }
    };

    public static checkObjectsColliding(obj1: Entity, obj2: Entity): boolean | void {
        // do both of these have a position component (As they should!?)
        if (obj1.getComponent(PositionComponent.COMPONENT_ID) == null || obj2.getComponent(PositionComponent.COMPONENT_ID) == null){
            return;
        }
        const positionComponent1 = obj1.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        const positionComponent2 = obj2.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        // do any of these have a circular component (because if they do, we have to do a different check)
        if (obj1.getComponent(DrawCircleComponent.COMPONENT_ID) != null || obj2.getComponent(DrawCircleComponent.COMPONENT_ID)!= null){
            if (obj1.getComponent(DrawCircleComponent.COMPONENT_ID) != null && obj2.getComponent(DrawCircleComponent.COMPONENT_ID) != null){
                return (
                    positionComponent1!.x - positionComponent1!.radius <= positionComponent2!.x + positionComponent2!.radius &&
                    positionComponent1!.x + positionComponent1!.radius >= positionComponent2!.x - positionComponent2!.radius &&
                    positionComponent1!.y + positionComponent1!.radius >= positionComponent2!.y - positionComponent2!.radius &&
                    positionComponent1!.y - positionComponent1!.radius <= positionComponent2!.y + positionComponent2!.radius
                )
            }
            else if (obj1.getComponent(DrawCircleComponent.COMPONENT_ID) != null && obj1.getComponent(DrawCircleComponent.COMPONENT_ID) == null){
                return (
                    positionComponent1!.x - positionComponent1!.radius <= positionComponent2!.x + positionComponent2!.width/2 &&
                    positionComponent1!.x + positionComponent1!.radius >= positionComponent2!.x - positionComponent2!.width/2 &&
                    positionComponent1!.y + positionComponent1!.radius >= positionComponent2!.y - positionComponent2!.height/2 &&
                    positionComponent1!.y - positionComponent1!.radius <= positionComponent2!.y + positionComponent2!.height/2
                )
            }
            else {
                return (
                    positionComponent1!.x - positionComponent1!.width/2 <= positionComponent2!.x + positionComponent2!.radius &&
                    positionComponent1!.x + positionComponent1!.width/2 >= positionComponent2!.x - positionComponent2!.radius &&
                    positionComponent1!.y + positionComponent1!.height/2 >= positionComponent2!.y - positionComponent2!.radius &&
                    positionComponent1!.y - positionComponent1!.height/2 <= positionComponent2!.y + positionComponent2!.radius
                )
            }
        }
        else{
            return (
                positionComponent1!.x - positionComponent1!.width/2 <= positionComponent2!.x + positionComponent2!.width/2 &&
                positionComponent1!.x + positionComponent1!.width/2 >= positionComponent2!.x - positionComponent2!.width/2 &&
                positionComponent1!.y + positionComponent1!.height/2 >= positionComponent2!.y - positionComponent2!.height/2 &&
                positionComponent1!.y - positionComponent1!.height/2 <= positionComponent2!.y + positionComponent2!.height/2
            )
        }
    }
    public static matchPair(entity1: Entity, entity2: Entity){
        const tagComponent1 = entity1.getComponent<TagComponent>(TagComponent.COMPONENT_ID)!;
        const tagComponent2 = entity2.getComponent<TagComponent>(TagComponent.COMPONENT_ID)!;
        console.log(tagComponent1.tags, tagComponent2.tags)
        // console.log("colliding");
        for (const tag1 of tagComponent1.tags){
            const firstTag = tag1;
            for (const tag2 of tagComponent2.tags){
                const secondTag = tag2;
                if (this.registry[firstTag] && this.registry[firstTag][secondTag]){
                    this.registry[firstTag][secondTag](entity1, entity2);
                }
                else if (this.registry[secondTag] && this.registry[secondTag][firstTag]){
                    this.registry[secondTag][firstTag](entity2, entity1);
                }
            }
        }  
    }
}

function playerCoinCollision(player: Entity, object: Entity) {
    const COIN_VALUE: number = 300;
    addScore(COIN_VALUE)
    addGold(1);
    deleteObject(object);
}

function playerFrankensteinCollision(player: Entity, object: Entity) {

}

function playerSkeletonCollision(player: Entity, object: Entity) {

}

let extendedVisionCollectedAgain = false;

function playerExtendedVisionPowerupCollision(player: Entity, object: Entity){
    if (CameraSystem.Instance.zoomLevel != 1){
        extendedVisionCollectedAgain = true;
    }
    else {
        const startZoom = CameraSystem.Instance.zoomLevel;
        const endZoom = startZoom - 0.2; // Set the end zoom level here
        
        const duration = 100; // Number of frames for the transition
        let elapsedFrames = 0;
        
        function lerp(start: number, end: number, t: number): number {
            return start * (1 - t) + end * t;
        }
        
        function updateZoom() {
            if (elapsedFrames >= duration) {
                return; // End the transition if we've reached the end
            }
            
            const t = elapsedFrames / duration; // Calculate the progress of the transition
            const newZoom = lerp(startZoom, endZoom, t); // Calculate the new zoom level
            CameraSystem.Instance.zoomLevel = newZoom; // Update the camera zoom level
            elapsedFrames++;
            
            // Call this function again on the next frame to continue the transition
            requestAnimationFrame(updateZoom);
        }

        // Start the transition
        requestAnimationFrame(updateZoom);
    }
    
    setTimeout(()=>{
        if (extendedVisionCollectedAgain == false){
            CameraSystem.Instance.zoomLevel = 1;
        }
        else {
            extendedVisionCollectedAgain = false;
        }
    }, IN_GAME_SECOND * 15);

    deleteObject(object);
}

let auraCollectedAgain = false;

function playerAuraPowerupCollision(player: Entity, object: Entity) {
    const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;
    if (playerComponent.aura == false){
        playerComponent.aura = true;
    }
    else {
        auraCollectedAgain = true;
    }
    setTimeout(()=>{
        if (auraCollectedAgain == false){
            playerComponent.aura = false;
        }
        else {
            auraCollectedAgain = false;
        }
    }, IN_GAME_SECOND * 15);

    deleteObject(object);
}

function playerGenericCollision(player: Entity, object: Entity) {
    const playerComponent = player.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;

    if (playerComponent.attacking == false){
        if (playerComponent.aura == true) {
            playerComponent.aura = false;
        }
        else {
            playerComponent.stats.Lives -= 1;
            const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
            soundComponent.playSound(GameSound.PlayerHit);
        }
    }
    deleteObject(object);
}

function arrowFrankensteinCollision(arrow: Entity, object: Entity) {
    const frankensteinComponent = object.getComponent<FrankensteinComponent>(FrankensteinComponent.COMPONENT_ID)!;
    frankensteinComponent.health -= 1;
    if (frankensteinComponent.health < 1){
        destroyCollidingObjects(arrow, object);
    }
    else {
        dealDamageToCollidingObjects(arrow, object);
    }
    playArrowImpactSound();
}

function arrowGenericCollision(arrow: Entity, object: Entity) {
    destroyCollidingObjects(arrow, object);
    playArrowImpactSound();
}

function playArrowImpactSound() {
    const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
    soundComponent.playSound(GameSound.ArrowHit);
}

export function dealDamageToCollidingObjects(object1: Entity, object2: Entity){
    objects.splice(objects.indexOf(object1), 1);
    const animatedComponent = object2.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
}
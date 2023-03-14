import PositionComponent from "../components/positionComponent";
import DrawCircleComponent from "../components/drawCircleComponent";
import { Entity } from "../entityComponent";
import { Tag } from "../global";
import { TagComponent } from "../components/tagComponent";
import FrankensteinComponent from "../components/frankensteinComponent";
import { dealDamageToCollidingObjects, destroyCollidingObjects } from "../objects";

type Func = (object1: Entity, object2: Entity) => void;
type Registry = { [tag: string]: { [subtag: string]: Func } }; 

export default class CollisionSystem {
    public static registry: Registry = {
        [Tag.Player]: {[Tag.Coin]: playerCoinCollision},
        [Tag.Player]: {[Tag.Frankenstein]: playerFrankensteinCollision},
        [Tag.Player]: {[Tag.Fireball]: playerFireballCollision},
        [Tag.Player]: {[Tag.Skeleton]: playerGenericCollision},
        [Tag.Player]: {[Tag.Dragon]: playerGenericCollision},
        [Tag.Player]: {[Tag.Minotaur]: playerGenericCollision},
        [Tag.Player]: {[Tag.Ghost]: playerGenericCollision},
        [Tag.Arrow]: {[Tag.Frankenstein]: arrowFrankensteinCollision},
        [Tag.Arrow]: {[Tag.Skeleton]: arrowGenericCollision},
        [Tag.Arrow]: {[Tag.Dragon]: arrowGenericCollision},
        [Tag.Arrow]: {[Tag.Minotaur]: arrowGenericCollision},
        [Tag.Arrow]: {[Tag.Ghost]: arrowGenericCollision},
    };

    public static collideObjects(obj1: Entity, obj2: Entity): boolean | void {
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

        for (const tag1 of tagComponent1.tags){
            for (const tag2 of tagComponent2.tags){
                if (this.registry[tag1][tag2]){
                    this.registry[tag1][tag2](entity1, entity2);
                }
                else if (this.registry[tag2][tag1]){
                    this.registry[tag2][tag1](entity2, entity1);
                }
            }
        }  
    }
}

function playerCoinCollision(player: Entity, object: Entity) {

}

function playerFrankensteinCollision(player: Entity, object: Entity) {

}

function playerFireballCollision(player: Entity, object: Entity) {

}

function playerGenericCollision(player: Entity, object: Entity) {

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
}

function arrowGenericCollision(arrow: Entity, object: Entity) {

}
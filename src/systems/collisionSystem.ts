import PositionComponent from "../components/positionComponent";
import Entity from "../entity";
import { calculatePlayerStateHeight } from "../main";
import { PlayerCharacter } from "../PlayerCharacter";

export default class CollisionSystem {
    public static collideRectPlayer(rect: PositionComponent, player: PlayerCharacter): boolean {
        return (
            rect.x - rect.width/2 <= player.x + player.width/2 &&
            rect.x + rect.width/2 >= player.x - player.width/2 &&
            rect.y + rect.height/2 >= player.y - calculatePlayerStateHeight()&&
            rect.y - rect.height/2 <= player.y + player.height/2
        )
    }
    
    public static collideObjects(obj1: Entity, obj2: Entity): boolean {
        // do both of these have a position component (As they should!?)
        // do any of these have a circular component (because if they do, we have to do a different check)
        if (/* both are rectangles */) {
            // do rectangle check
        }
        // if one entity has a "specialHeightCalculationComponent"
        else if (/* one is a circle, do a rectangle/circle check*/) {

        }
        else { // both are circle
            // do a circle/circle check
        }
    }
}
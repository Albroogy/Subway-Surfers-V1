import PositionComponent from "../components/positionComponent";
import DrawCircleComponent from "../components/drawCircleComponent";
import { Entity } from "../entityComponent";


export default class CollisionSystem {
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
}
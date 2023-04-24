import { Component } from "../entityComponent";
import { objects } from "../objects";
import { AnimatedComponent, AnimationInfo } from "./animatedComponent";
import PositionComponent from "./positionComponent";

export default class LaserComponent extends Component {    
    public static COMPONENT_ID: string = "Laser";

    public onAttached(): void {
        const animatedComponent = this._entity!.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[LaserAnimationNames.LaserBeam];
    }
    public update(deltaTime: number, gameSpeed: number): void {
        const animatedComponent = this._entity!.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
        if (animatedComponent.currentAnimationFrame > 12) {
            objects.splice(objects.indexOf(this._entity!), 1);
        }
    }
}

enum LaserAnimationNames {
    LaserBeam,
}

export const LaserAnimationInfo: AnimationInfo = {
    animationCount: 1, 
    maxAnimationFrameCount: 14,
    animations: {
        [LaserAnimationNames.LaserBeam]: {
            rowIndex: 0,
            frameCount: 14,
            framesPerSecond: 6
        },
    }
};
import { context } from "../global";
import { AnimationInfo, SingleAnimationInfo } from "../main";
import Component from "./component";
import PositionComponent from "./positionComponent";

export default class AnimatedComponent extends Component { 
    public static COMPONENT_ID: string = "Animated";
    public spritesheet: HTMLImageElement;
    public animationInfo: AnimationInfo;
    public currentAnimation: SingleAnimationInfo | null;
    public currentAnimationFrame: number;
    private _timeSinceLastFrame: number;

    constructor(spritesheetURL: string, animationInfo: AnimationInfo) {
        super();
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheetURL;
        this.animationInfo = animationInfo;
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this._timeSinceLastFrame = 0;
    }
    
    public update(deltaTime: number): void {
        this.animationUpdate(deltaTime);
        this.draw();
    }
    public playAnimation(name: string) {
        this.currentAnimation = this.animationInfo.animations[name];
    }
    public animationUpdate(deltaTime: number): void{
        if (this.currentAnimation == null) {
            return;
        }
        const timeBetweenFrames = 1000 / this.currentAnimation.framesPerSecond;
        this._timeSinceLastFrame += deltaTime;
        if (this._timeSinceLastFrame >= timeBetweenFrames) {
            this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.currentAnimation.frameCount;
            this._timeSinceLastFrame = 0;
        }
    }
    public draw(): void{
        if (this._entity == null || this.currentAnimation == null) {
            return;
        }
        const frameW = this.spritesheet.width / this.currentAnimation.frameCount;
        const frameH = this.spritesheet.height / this.animationInfo.animationCount;
        console.assert(frameW > 0);
        console.assert(frameH > 0);
        const frameSX = this.currentAnimationFrame * frameW;
        const frameSY = this.currentAnimation.rowIndex * frameH;
        console.assert(frameSX >= 0);
        console.assert(frameSY >= 0);
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        context.drawImage(this.spritesheet,
            frameSX, frameSY, frameW, frameH,
            positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, positionComponent!.width, positionComponent!.height
        );
    }
}
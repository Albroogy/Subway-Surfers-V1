import Component from "./component";
import PositionComponent from "./positionComponent";

export default class AnimatedComponent extends Component { 
    public static COMPONENT_ID: string = "Animated";
    private _spritesheet: HTMLImageElement;
    private _animationInfo: AnimationInfo;
    public currentAnimation: SingleAnimationInfo | null;
    public currentAnimationFrame: number;
    private _timeSinceLastFrame: number;

    constructor(spritesheetURL: string, animationInfo: AnimationInfo) {
        super();
        this._spritesheet = new Image();
        this._spritesheet.src = spritesheetURL;
        this._animationInfo = animationInfo;
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this._timeSinceLastFrame = 0;
    }
    
    public update(deltaTime: number): void {
        this.animationUpdate(deltaTime);
        this.draw();
    }
    playAnimation(name: string) {
        this.currentAnimation = this.animationInfo.animations[name];
    }
    animationUpdate(deltaTime: number): undefined{
        if (this.currentAnimation == null) {
            return;
        }
        const timeBetweenFrames = 1000 / this.currentAnimation.framesPerSecond;
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame >= timeBetweenFrames) {
            this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.currentAnimation.frameCount;
            this.timeSinceLastFrame = 0;
        }
    }
    draw(): undefined{
        if (this.currentAnimation == null) {
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
        context.drawImage(this.spritesheet,
            frameSX, frameSY, frameW, frameH,
            this.x - this.width / 2, this.y - this.height / 2, this.width, this.height
        );
    }
}
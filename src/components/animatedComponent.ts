import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";
import { player, PlayerComponent } from "./playerComponent";


export type SingleAnimationInfo = { rowIndex: number, frameCount: number, framesPerSecond: number };
export class AnimationInfo {
    public animationCount: number = 0;
    public maxAnimationFrameCount: number = 0;
    public animations: Record<string, SingleAnimationInfo> = {};
}

export class AnimatedComponent extends Component { 
    public static COMPONENT_ID: string = "Animated";
    public spritesheet: HTMLImageElement;
    public animationInfo: AnimationInfo;
    public currentAnimation: SingleAnimationInfo | null;
    public currentAnimationFrame: number;
    private _timeSinceLastFrame: number;
    private _hasSpritesheetLoaded: boolean;
    private _frameW: number = 0;
    private _frameH: number = 0;

    constructor(spritesheetURL: string, animationInfo: AnimationInfo) {
        super();
        this.spritesheet = new Image();
        this._hasSpritesheetLoaded = false;
        this.spritesheet.onload = () => {
            this._hasSpritesheetLoaded = true;
            
            // let maxAnimationFrameCount = 0;
            // for (const anim of Object.values(this.animationInfo.animations)) {
            //     if (maxAnimationFrameCount < anim.frameCount) {
            //         maxAnimationFrameCount = anim.frameCount;
            //     }
            // }
            
            this._frameW = this.spritesheet.width / animationInfo.maxAnimationFrameCount;
            this._frameH = this.spritesheet.height / this.animationInfo.animationCount;
        }
        this.spritesheet.src = spritesheetURL;
        this.animationInfo = animationInfo;
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this._timeSinceLastFrame = 0;
    }
    
    public update(deltaTime: number): void {
        this.animationUpdate(deltaTime);
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
        if (this._entity == null || this.currentAnimation == null || !this._hasSpritesheetLoaded) {
            return;
        }
        console.assert(this._frameW > 0);
        console.assert(this._frameH > 0);
        const frameSX = this.currentAnimationFrame * this._frameW;
        const frameSY = this.currentAnimation.rowIndex * this._frameH;
        console.assert(frameSX >= 0);
        console.assert(frameSY >= 0);
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID);
        const playerComponent = this._entity.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID);
        context.drawImage(this.spritesheet,
            frameSX, frameSY, this._frameW, this._frameH,
            positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, positionComponent!.width, positionComponent!.height
        );
    }
}

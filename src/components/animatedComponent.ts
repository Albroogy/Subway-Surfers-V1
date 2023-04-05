import { context } from "../global";
import {Component} from "../entityComponent";
import PositionComponent from "./positionComponent";

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
    public shouldDraw: boolean = true;
    public isFlipped: boolean = false;
    public pauseAnimation: boolean = false;
    public spritesheetHorizontal: boolean;

    constructor(spritesheetURL: string, animationInfo: AnimationInfo, spritesheetHorizontal: boolean = true) {
        super();
        this.spritesheet = new Image();
        this._hasSpritesheetLoaded = false;
        this.spritesheetHorizontal = spritesheetHorizontal;
        this.spritesheet.onload = () => {
            this._hasSpritesheetLoaded = true;
            if (this.spritesheetHorizontal == false){
                this._frameW = this.spritesheet.width / this.animationInfo.animationCount;
                this._frameH = this.spritesheet.height / animationInfo.maxAnimationFrameCount;
            }
            else {
                this._frameW = this.spritesheet.width / animationInfo.maxAnimationFrameCount;
                this._frameH = this.spritesheet.height / this.animationInfo.animationCount;
            }
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
        if (this.currentAnimation == null || this.pauseAnimation == true) {
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
        if (this._entity == null || this.currentAnimation == null || !this._hasSpritesheetLoaded || this.shouldDraw == false) {
            return;
        }
        const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        if (this.isFlipped == true){
            context.save();
            context.translate(positionComponent.x, positionComponent.y);
            context.scale(-1, 1);
            context.translate(-positionComponent.x, -positionComponent.y);
        }
        const centerX = positionComponent.x - positionComponent.width / 2;
        const centerY = positionComponent.y - positionComponent.height / 2;
        if (positionComponent.rotation !== 0) {
            context.save(); // save the current transformation matrix
            context.translate(centerX, centerY); // move the origin to the object's position
            context.rotate(positionComponent.rotation); // apply the object's current rotation
            context.translate(-centerX, -centerY); // move the origin to the object's position
        }
        console.assert(this._frameW > 0);
        console.assert(this._frameH > 0);
        let frameSX;
        let frameSY;
        if (this.spritesheetHorizontal == false) {
            frameSX = this.currentAnimation.rowIndex * this._frameW;
            frameSY = this.currentAnimationFrame * this._frameH;
        }
        else {
            frameSX = this.currentAnimationFrame * this._frameW;
            frameSY = this.currentAnimation.rowIndex * this._frameH;
        }
        console.assert(frameSX >= 0);
        console.assert(frameSY >= 0);
        context.drawImage(this.spritesheet,
            frameSX, frameSY, this._frameW, this._frameH,
            positionComponent!.x - positionComponent!.width / 2, positionComponent!.y - positionComponent!.height / 2, positionComponent!.width, positionComponent!.height
        );
        if (this.isFlipped == true){
            context.restore();
        }
        if (positionComponent.rotation !== 0) {
            context.restore();
        }
    }
}

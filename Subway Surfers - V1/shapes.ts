import { PlayerCharacter } from "./playerCharacter";
import { calculatePlayerStateHeight } from "./main";
import {context} from "./global"

export class Circles {
    public x: number;
    public y: number;
    public radius: number;
    public color: string;
    public speed: number;
    constructor(x: number, y: number, radius: number, color: string, speed: number){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }
    draw(): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
    isColliding(player: PlayerCharacter): boolean{
        return (
            this.x - this.radius <= player.x + player.width/2 &&
            this.x + this.radius >= player.x - player.width/2 &&
            this.y + this.radius >= player.y - calculatePlayerStateHeight()&&
            this.y - this.radius <= player.y + player.height/2
        )
    }
    move(deltaTime: number, gameSpeed: number){
        this.y += this.speed * deltaTime / 1000 * gameSpeed;
    }
}

export class Rects{
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public color: string;
    public requiredState: string;
    public speed: number;
    constructor(x: number, y: number, width: number, height: number, color: string, requiredState: string, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.requiredState = requiredState;
        this.speed = speed;
    }
    draw(){
        context.fillStyle = this.color;
        context.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
    isColliding(player: PlayerCharacter): boolean{
        return (
            this.x - this.width/2 <= player.x + player.width/2 &&
            this.x + this.width/2 >= player.x - player.width/2 &&
            this.y + this.height/2 >= player.y - calculatePlayerStateHeight()&&
            this.y - this.height/2 <= player.y + player.height/2
        )
    }
    move(deltaTime: number, gameSpeed: number){
        this.y += this.speed * deltaTime / 1000 * gameSpeed;
    }
}
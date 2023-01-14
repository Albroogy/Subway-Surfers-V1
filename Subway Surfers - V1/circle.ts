import { PlayerCharacter } from "./main";
import { calculatePlayerStateHeight } from "./main";
import { context, playerAnimated, gameSpeed } from "./main";

export default class Circles {
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
    move(deltaTime: number){
        this.y += this.speed * deltaTime / 1000 * gameSpeed;
    }
}
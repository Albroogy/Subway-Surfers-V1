import {context} from "./global"
import { calculatePlayerStateHeight } from "./main";
import {PlayerCharacter} from "./playerCharacter";
import { DragonEnemy } from "./dragon";

export class Projectile {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public image: HTMLImageElement;
    public speed: number;
    constructor(x: number, y: number, imageUrl: string, width: number, height: number, speed: number){
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageUrl;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
    draw(){
        context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    isColliding(object: DragonEnemy | PlayerCharacter): boolean{
        return (
            this.x - this.width/2 <= object.x + object.width/2 &&
            this.x + this.width/2 >= object.x - object.width/2 &&
            this.y + this.height/2 >= object.y - object.height/2 &&
            this.y - this.height/2 <= object.y + object.height/2
        );
    }
}
export class Arrow extends Projectile {
    constructor(x: number, y: number, imageUrl: string, width: number, height: number, speed: number){
        super(x, y, imageUrl, width, height, speed);
    }
    move(deltaTime: number, gameSpeed: number){
        this.y -= this.speed * deltaTime / 1000 * gameSpeed;
    }
}
export class Fireball extends Projectile {
    constructor(x: number, y: number, imageUrl: string, width: number, height: number, speed: number){
        super(x, y, imageUrl, width, height, speed);
    }
    move(deltaTime: number, gameSpeed: number){
        this.y += this.speed * deltaTime / 1000 * gameSpeed;
    }
    isColliding(player: DragonEnemy | PlayerCharacter): boolean{
        return (
            this.x - this.width/2 <= player.x + player.width/2 &&
            this.x + this.width/2 >= player.x - player.width/2 &&
            this.y + this.height/2 >= player.y - calculatePlayerStateHeight()&&
            this.y - this.height/2 <= player.y + player.height/2
        );
    }
}

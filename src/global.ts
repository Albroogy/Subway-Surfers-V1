// Key Information
export const allPressedKeys: Record<string, boolean> = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});
export const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    Space: 32,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
    SpaceBar: 32,
    Escape: 27,
    E: 69
};

export let mouseDown = false;
export let mouse = {
    x: 0,
    y: 0,
}

window.addEventListener("mousedown", function (event) {
    mouseDown = true;
    mouse.x = event.x
    mouse.y = event.y
});
window.addEventListener("mouseup", function (event) {
    mouseDown = false;
});

export const canvas: HTMLCanvasElement = document.getElementById("game-canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export const context: CanvasRenderingContext2D = canvas.getContext("2d")! as CanvasRenderingContext2D;

export const OFFSET: number = 1;
export const IN_GAME_SECOND = 10 ** 3;
export const IN_GAME_MINUTE = IN_GAME_SECOND * 60;
export const LANE: Record <string, number> = {
    WIDTH: canvas.width/3,
    COUNT: 3
}

export enum EntityName{
    Fireball = "fireball",
    Arrow = "arrow",
    Dragon = "dragon",
    Player = "player",
    Minotaur = "minotaur",
    Coin = "coin",
    Frankenstein = "frankenstein",
    Skeleton = "skeleton",
    Ghost = "ghost",
    ItemFrame = "itemFrame",
    RectEnemy = "rectEnemy",
    GameEntity = "gameEntity",
}








export enum Tag {
    Player = "player",
    Fireball = "fireball",
    Arrow = "arrow",
    Dragon = "dragon",
    Minotaur = "minotaur",
    Coin = "coin",
    Frankenstein = "frankenstein",
    Skeleton = "skeleton",
    Ghost = "ghost",
    ExtendedVisionPowerup = "ExtendedVisionPowerup",
    AuraPowerup = "AuraPowerup",
    DeathStarPowerup = "DeathStarPowerup",
    Powerup = "Powerup",
    Enemy = "Enemy",
    GoblinBoss = "GoblinBoss",
    Boss = "Boss",
    MoneyPouch = "MoneyPouch"
}

export let timeStart: number = Date.now();

export function checkTime(stateLength: number, timeStart: number): boolean{
    return timeStart <= Date.now() - stateLength;
}
export function sleep(time: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < time);
}
export function calculatePlayerStateHeight(player: any): number{
    if (player.attacking == true){
        return player.height/2;
    }
    return 0;
}
export function findLane(xCoordinate: number){
    return (xCoordinate + LANE.WIDTH/2) / LANE.WIDTH;
}

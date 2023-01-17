import { DragonEnemy } from "./dragon";
import { Circles, Rects } from "./shapes";
import { Fireball } from "./projectiles";

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

export const canvas: HTMLCanvasElement = document.getElementById("game-canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export const context: CanvasRenderingContext2D = canvas.getContext("2d")! as CanvasRenderingContext2D;

export const OFFSET: number = 1;
export const LANE: Record <string, number> = {
    WIDTH: canvas.width/3,
    COUNT: 3
}

export let timeStart: number = Date.now();

export type RenderableObject = DragonEnemy | Circles | Rects | Fireball;
export const objects: Array<RenderableObject> = [];

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

import {Circles, Rects} from "./shapes";
import {InventoryItem, TakenInventoryItemSlot, Inventory} from "./inventory";
import { Projectile, Arrow, Fireball } from "./projectiles";
import {PlayerCharacter, AnimationNames, playerSpearAnimationInfo, playerBowAnimationInfo, PlayerStates} from "./playerCharacter";
import { DragonEnemy, DragonAnimationInfo } from "./dragon";
import {KEYS, allPressedKeys, objects, RenderableObject, context, canvas} from "./global";

// Constant variables
const SCORE_INCREASE_SPEED: number = 1;
const COIN_VALUE: number = 300;
const SPAWN_INCREMENT: number = 0.1;
const FALL_INCREMENT: number = 0.02;
const COIN_RADIUS: number = 25;
export const OFFSET: number = 1;
const ORIGINAL_FALL_SPEED: number = 150;
const ORIGINAL_SPAWN_DELAY: number = 1000;

const image = new Image();
image.src = 'coin_01.png';
const music = new Audio('Game_Song.mp3');

const weapons = {
    Spear: "player.png",
    Bow: "playerBow.png"
}
const StartingItems = {
    Armor: "&weapon=Leather_leather",
    Bow: null,
    Spear: "&armour=Thrust_spear_2",
    Boots: null
}
const playerImage = `https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/#?body=Body_color_zombie_green&head=Goblin_zombie_green&wrinkes=Wrinkles_zombie_green&beard=Beard_brown&hair=Bangslong_raven&shoulders=Legion_steel&arms=Armour_iron&chainmail=Chainmail_gray&legs=Armour_steel${StartingItems.Spear}&quiver=Quiver_quiver&ammo=Ammo_arrow${StartingItems.Armor}`

const StartingStats = {
    Lives: 1,
    RollSpeed: 500
}

const spearImage = new Image;
spearImage.src = "spear.png";
const bowImage = new Image;
bowImage.src = "bow.png";
const armorImage = new Image;
armorImage.src = "armor.png";
const bootsImage = new Image;
bootsImage.src = "boots.png";

export type EquipmentItem = {
    Width: number, 
    Height: number,
    URL: string,
    Image: HTMLImageElement,
    Name: string
};

export const ItemList: Record<string, EquipmentItem> = {
    Spear: {
        Width: 2, 
        Height: 1,
        URL: spearImage.src,
        Image: spearImage,
        Name: "Spear"
    },
    Bow: {
        Width: 1,
        Height: 2,
        URL: bowImage.src,
        Image: bowImage,
        Name: "Bow"
    },
    Armor: {
        Width: 2,
        Height: 2,
        URL: armorImage.src,
        Image: armorImage,
        Name: "Armor"
    },
    Boots: {
        Width: 1,
        Height: 1,
        URL: bootsImage.src,
        Image: bootsImage,
        Name: "Boots"
    }
}

enum GameStates {
    Playing = "playing",
    InventoryMenu = "inventoryMenu"
}

// All the enums are causing bugs

const PLAYER = {
    WIDTH: 100,
    HEIGHT: 100,
}
// Obstacle Information
const OBJECT = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}
enum obstacleColors {
    Orange,
    Brown,
    Black
}
const spawnType = {
    generateObstacle: "generateObstacle",
    generateCoin: "generateCoin",
    generateRect: "generateRect"
}
export const LANE = {
    WIDTH: canvas.width/3,
    COUNT: 3
}
const GOLD_TEXT_LOCATION = {
    x: 50,
    y: 150
}
const LIVES_TEXT_LOCATION = {
    x: 50,
    y: 200
}

const obstacleType = [PlayerStates.Ducking, PlayerStates.Jumping,"Invincible"];
const stillObjects: Array<Necromancer> = [];

// Score Information
const HIGH_SCORE = {
    x: 50,
    y: 50
}
const SCORE = {
    x: 50,
    y: 100
}

// Changeble variables
let lastTime: number = Date.now();
let lastClick: number = Date.now();
let lastSpawn: number = Date.now();
let timeStart: number = Date.now();
let spawnDelay: number = ORIGINAL_SPAWN_DELAY; //This is in milliseconds
let score: number = 0;
let highScore: number = 0;
let gold: number = 0;
export let fallSpeed: number = ORIGINAL_FALL_SPEED;
let gameState: Object = GameStates.Playing;

type SingleAnimationInfo = { rowIndex: number, frameCount: number, framesPerSecond: number };
export class AnimationInfo {
    public animationCount: number = 0;
    public animations: Record<string, SingleAnimationInfo> = {};
}

export class AnimatedObject {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public spritesheet: HTMLImageElement;
    public animationInfo: AnimationInfo;
    public currentAnimation: SingleAnimationInfo | null;
    public currentAnimationFrame: number;
    private timeSinceLastFrame: number;
    constructor(x: number, y: number, width: number, height: number, spritesheetURL: string, animationInfo: AnimationInfo){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheetURL;
        this.animationInfo = animationInfo;
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this.timeSinceLastFrame = 0;
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
    update(deltaTime: number) {
        this.animationUpdate(deltaTime);
    }
    draw(): undefined{
        if (this.currentAnimation == null) {
            return;
        }
        // const frameW = this.spritesheet.width / this.currentAnimation.frameCount;
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
class Necromancer extends AnimatedObject{
    constructor(x: number, y: number, width: number, height: number, spritesheetURL: string, animationInfo: AnimationInfo){
        super(x, y, width, height, spritesheetURL, animationInfo);
        this.currentAnimation = this.animationInfo.animations[necromancerAnimationNames.Levitating];
    }
}
const necromancerAnimationNames = {
    Levitating: "levitating"
}
const necromancerInfo: AnimationInfo = {
    animationCount: 1, 
    animations: {
        [necromancerAnimationNames.Levitating]: {
            rowIndex: 0,
            frameCount: 8,
            framesPerSecond: 8
        },
    }
};

// Player Animation
export const playerAnimated = new PlayerCharacter(canvas.width/2, canvas.width/3, playerImage, playerBowAnimationInfo, 2, PlayerStates.Running, PLAYER.WIDTH, PLAYER.HEIGHT, StartingItems, StartingStats, weapons);
playerAnimated.playAnimation(AnimationNames.RunningBack);

const equippedInventory = new Inventory(5, 3, 50, 200);
const itemsFound = new Inventory(10, 5, canvas.width/2, 0);
const spear = new InventoryItem(ItemList.Spear.Width,ItemList.Spear.Height,ItemList.Spear.URL, ItemList.Spear.Image, ItemList.Spear.Name);
const bow = new InventoryItem(ItemList.Bow.Width,ItemList.Bow.Height,ItemList.Bow.URL, ItemList.Bow.Image, ItemList.Bow.Name);
const armor = new InventoryItem(ItemList.Armor.Width,ItemList.Armor.Height,ItemList.Armor.URL, ItemList.Armor.Image, ItemList.Armor.Name);
const boots = new InventoryItem(ItemList.Boots.Width,ItemList.Boots.Height,ItemList.Boots.URL, ItemList.Boots.Image, ItemList.Boots.Name);

equippedInventory.placeItem(bow, 1, 0);
// equippedInventory.placeItem(spear, 0, 0);
equippedInventory.placeItem(armor, 2, 0);
equippedInventory.placeItem(boots, 0, 0);
console.log(equippedInventory);


///State Machine Code
class State {
    public onActivation: Function;
    public update: Function;
    public onDeactivation: Function;
    constructor(onActivation: Function, update: Function, onDeactivation: Function) {
        this.onActivation = onActivation;
        this.update = update;
        this.onDeactivation = onDeactivation;
    }
}
// When do we begin updating/executing the state machine? Which array do we keep it in?
// What's the starting state? How do we know where to begin?
export class StateMachine {
    public states: Record <string, State>;
    public activeState: null | State;
    constructor() {
        this.states = {};
        this.activeState = null;
    }
    addState(stateName: string, onActivation: Function, update: Function, onDeactivation: Function) {
        this.states[stateName] = new State(onActivation, update, onDeactivation);
    }
    update(deltaTime: number, currentObject: PlayerCharacter | DragonEnemy) {
        if (this.activeState){
            const nextState = this.activeState.update(deltaTime, currentObject);
            // console.log(nextState)
            if (nextState){
                this.activeState.onDeactivation(currentObject);
                this.activeState = this.states[nextState];
                this.activeState.onActivation(currentObject);
            }
        }
    }
}

export const playerSM = new StateMachine();
const gameSM = new StateMachine();

//Adding the states

const onPlayingActivation = () => {
    gameState = GameStates.Playing;
    console.log(GameStates.Playing);
}
const onPlayingUpdate = (): string | undefined => {
    if (allPressedKeys[KEYS.SpaceBar]){
        return GameStates.InventoryMenu;
    }
}
const onPlayingDeactivation = () => {
}
const onInventoryMenuActivation = () => {
    gameState = GameStates.InventoryMenu;
    // EventListener to see if mouse clicked
    document.addEventListener('click', mouseClicked);
    let mouseX = null;
    let mouseY = null;
    function mouseClicked(e: { clientX: number; clientY: number; }) {
        // Maybe give the variable e a better name?
        mouseX = e.clientX;
        mouseY = e.clientY;
        console.log(`${e.clientX} ${e.clientY}`);
        // if (equippedInventory.isColliding(e.clientX, e.clientY)){
            
        // }
    }
    console.log(GameStates.InventoryMenu);
    stillObjects.push(
        new Necromancer(200, 200, 300, 300, "Necromancer.png", necromancerInfo)
    )
}
const onInventoryMenuUpdate = (): string | undefined => {
    if (allPressedKeys[KEYS.Escape]){
        return GameStates.Playing;
    }
}
const onInventoryMenuDeactivation = () => {
    // document.removeEventListener('click', mouseClicked);
    // mouseClicked is not defined
}

// Setting up state machines

gameSM.addState(GameStates.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
gameSM.addState(GameStates.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);

// Starting state machines
playerSM.activeState = playerSM.states[PlayerStates.Running];
playerSM.activeState.onActivation();

gameSM.activeState = gameSM.states[GameStates.Playing];
gameSM.activeState.onActivation();
console.log(gameSM.activeState)

// Next steps
// Done = /
// 1. Complete the equippedInventory/
//    - create the UI for the equippedInventory/
//    - create several items and have them affect the game (extra health, extra speed, whatever)/
// 2. Complete the state machine
//    - extract the "state machine" from the PlayerCharacter class into an actual state machine /
//    - create a state machine for a new type of obstacle
//    - create a state machine for sound management
//          - different sounds when the game begins and restarts, when you reach a certain high score
// 3. Decide on the creative theme - LOTR-based? Something else?
//    - let's pick some art
//    - turn at least 1 type of obstacle into an animated spritesheet
// Bugs to fix:
// 1. Animation seems to vary. It doesn't always start at frame 0 /
// 2. Figure out why necromancer is not appearing on screen
// Tasks:
// 1. Figure out how to add changeLane state to player. /

//Start Loop
requestAnimationFrame(runFrame)

// Main processing objectsLoop 
function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    let gameSpeed: number = 1;

    if (playerAnimated.state != PlayerStates.Running || allPressedKeys[KEYS.E]){
        gameSpeed = 1;
    }
    else{
        gameSpeed = 0.5;
    }
    // process input
    // playerAnimated.processInput();
    // update state
    if (gameState == GameStates.Playing){
        update(deltaTime, gameSpeed);        
    }
    stillObjectsLoop(deltaTime);
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
    gameSM.update(deltaTime, playerAnimated);
}

function update(deltaTime: number, gameSpeed: number){
    score += SCORE_INCREASE_SPEED;
    checkSpawn();
    objectsLoop(deltaTime, gameSpeed);
    playerAnimated.update(deltaTime);
    spawnDelay -= SPAWN_INCREMENT;
    fallSpeed += FALL_INCREMENT;
    playerSM.update(deltaTime, playerAnimated);
}



function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState != GameStates.InventoryMenu){
        for (let object of objects){
            object.draw();
        }
    
        context.fillStyle = "black";
        context.font = "20px Arial";
        context.fillText(`SCORE: ${score}`, SCORE.x, SCORE.y);
        context.font = "20px Arial";
        context.fillText(`HIGH SCORE: ${highScore}`, HIGH_SCORE.x, HIGH_SCORE.y);
        context.fillText(`GOLD_TEXT_LOCATION: ${gold}`, GOLD_TEXT_LOCATION.x, GOLD_TEXT_LOCATION.y);
        context.font = "20px Arial";
        if (playerAnimated.stats.Lives > 0){
            context.font = "20px Arial";
            context.fillText(`LIVES_TEXT_LOCATION: ${playerAnimated.stats.Lives}`, LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
        else{
            context.fillStyle = "red";
            context.font = "20px Arial";
            context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE)", LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
        context.drawImage(image,200,50,50,50);
        playerAnimated.draw();
    }
    else{
        equippedInventory.draw();
        itemsFound.draw();
    }
}

// These functions calculate a certain value

function calculateLaneLocation(lane: number): number{
    return lane * LANE.WIDTH - LANE.WIDTH/2;
}
function pickLane(): number{
    return Math.floor(Math.random() * LANE.COUNT) + OFFSET;
}
// These functions carry out a certain action
export function calculatePlayerStateHeight(): number{
    if (playerAnimated.attacking == true){
        return playerAnimated.height/2;
    }
    return 0;
}
function generateObstacle(){
    const type = Math.floor(Math.random() * LANE.COUNT);
    objects.push(
        new Rects(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION , OBJECT.WIDTH, OBJECT.HEIGHT, Object.keys(obstacleColors)[type], obstacleType[type], fallSpeed)
    )
}
function generateCoin(){
    objects.push(
        new Circles(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION , COIN_RADIUS, "yellow", fallSpeed)
    )
}

function generateDragon(){
    objects.push(
        new DragonEnemy(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, 100, 100, "dragon.png", DragonAnimationInfo, fallSpeed)
    )
}

function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType = Object.keys(spawnType)[Math.floor(Math.random() * 2)];
        if (generateType == spawnType.generateObstacle){
            generateDragon();
        }
        else if (generateType == spawnType.generateCoin){
            generateCoin();
        }
        lastSpawn = Date.now();
    }
}
export function resetGame(){
    objects.splice(0);
    playerAnimated.lane = 2;
    playerAnimated.changeLane();
    playerAnimated.stats = StartingStats;
    equippedInventory.resetInventory();
    // equippedInventory.placeItem(bow,1,0);
    equippedInventory.placeItem(armor,2,0);
    equippedInventory.placeItem(boots,4,0);
    equippedInventory.placeItem(spear,0,0);
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}
function destroyCollidingObjects(object1: RenderableObject, object2: RenderableObject){
    objects.splice(objects.indexOf(object1),1);
    objects.splice(objects.indexOf(object2),1);
}

function objectsLoop(deltaTime: number, gameSpeed: number){
    for (let i = 0; i < objects.length; i++){
        objects[i].move(deltaTime, gameSpeed);
        if (objects[i].constructor != Arrow || Fireball){
            objects[i].speed += FALL_INCREMENT;
        }
        if (objects[i].constructor == DragonEnemy){
            (objects[i] as DragonEnemy).update(deltaTime);
        }
        if (objects[i].constructor == Arrow){
            if (objects[i].y <= - (objects[i] as Arrow).height){
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].y >= canvas.height + (objects[i] as Arrow | DragonEnemy | Rects).height/2){
            objects.splice(i,1);
            continue;
        }
        if (objects[i].constructor == Circles){
            if (objects[i].isColliding(playerAnimated)){
                score += COIN_VALUE;
                gold += 1;
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].constructor != Circles && objects[i].constructor != Arrow){
            if (objects[i].isColliding(playerAnimated)){
                if (playerAnimated.attacking != true){
                    playerAnimated.stats.Lives -= 1;
                }
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].constructor == Arrow){
            const currentObject1 = objects[i];
            // When I removed the current object lines, the game sometimes bugged out when arrows collided with objects, so I'm keeping this code in.
            for (let j = 0; j < objects.length; j++){
                if (objects[j].constructor == DragonEnemy){
                    const currentObject2 = objects[j];
                    console.assert(currentObject1 != undefined);
                    console.assert(currentObject2 != undefined);
                    if (currentObject1.isColliding(currentObject2)){
                        destroyCollidingObjects(objects[i], objects[j]);
                    }
                continue;
                // For effiency's sake, should I split the objects array into 3 lane arrays? 
                // This way for collisions I will only need to check the objects that are on the same lane.
                }
            }
        }
    }
}
function stillObjectsLoop(deltaTime: number){
    for (let object of stillObjects){
        object.draw();
        object.animationUpdate(deltaTime);
    }
}
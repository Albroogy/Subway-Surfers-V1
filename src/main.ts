import {equippedInventory, itemsFound, equipStarterItems} from "./components/inventoryComponent";
import {player as playerCharacter, StartingStats, player} from "./components/playerComponent";
import {PlayerState as PlayerState} from "./components/playerComponent";
import PlayerComponent from "./components/playerComponent";
import {KEYS, allPressedKeys, context, canvas, OFFSET, LANE} from "./global";
import { Entity } from "./entityComponent";
import PositionComponent from "./components/positionComponent";
import DrawCircleComponent from "./components/drawCircleComponent";
import { AnimatedComponent } from "./components/animatedComponent";
import DragonComponent, { DragonAnimationInfo } from "./components/dragonComponent";
import MovementComponent from "./components/movementComponent";
import DrawRectComponent from "./components/drawRectComponent";
import { gameState, GameState, gameSM } from "./systems/gameSystem";

// ORIGINAL_VALUES
const ORIGINAL_FALL_SPEED: number = 150;
const ORIGINAL_SPAWN_DELAY: number = 1000;
const backgroundMusic = new Audio("track1");

// Obstacle Information
const OBJECT: Record <string, number> = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}
enum obstacleColors {
    Orange,
    Brown,
    Black
}
const spawnType: Record <string, string> = {
    generateObstacle: "generateObstacle",
    generateCoin: "generateCoin",
    generateRect: "generateRect"
}

const obstacleType: Array <string> = [PlayerState.Ducking, PlayerState.Jumping,"Invincible"];
let entities: Array<Entity> = [];

// Changeble variables
let lastTime: number = Date.now();
let lastSpawn: number = Date.now();
let spawnDelay: number = ORIGINAL_SPAWN_DELAY; //This is in milliseconds
let score: number = 0;
let highScore: number = 0;
let gold: number = 0;
export let fallSpeed: number = ORIGINAL_FALL_SPEED;

export const objects: Array<Entity> = [];
let playerComponent = playerCharacter.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;


// Creating the state machines

// Next steps
// Done = /
// 1. Complete the equippedInventory/
//    - create the UI for the equippedInventory/
//    - create several items and have them affect the game (extra health, extra speed, whatever)/
// 2. Complete the state machine
//    - extract the "state machine" from the PlayerCharacter class into an actual state machine /
//    - create a state machine for a new type of obstacle/
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
    const currentTime: number = Date.now();
    const deltaTime: number = currentTime - lastTime;
    lastTime = currentTime;
    let gameSpeed: number = 1;

    if (playerComponent.state != PlayerState.Running || allPressedKeys[KEYS.E]){
        gameSpeed = 1;
    }
    else{
        gameSpeed = 0.5;
    }
    // update state
    if (gameState == GameState.Playing){
        update(deltaTime, gameSpeed);        
    }
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
    gameSM.update(deltaTime, playerCharacter);
}

function update(deltaTime: number, gameSpeed: number){
    const SPAWN_INCREMENT: number = 0.1;
    const FALL_INCREMENT: number = 0.02;
    const SCORE_INCREMENT: number = 0.001;
    let scoreIncreaseSpeed: number = 1;
    score += scoreIncreaseSpeed;

    for (const entity of entities) {
        entity.update(deltaTime);
    }


    checkSpawn();
    objectsLoop(deltaTime, gameSpeed, FALL_INCREMENT);
    playerCharacter.update(deltaTime);
    spawnDelay -= SPAWN_INCREMENT;
    fallSpeed += FALL_INCREMENT;
    scoreIncreaseSpeed += SCORE_INCREMENT;
    console.log(`This is the score increase speed: ${scoreIncreaseSpeed}`);
}



function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState != GameState.InventoryMenu){
        for (let object of objects){
            object.draw();
        }

        // Text postition innformation
        const GOLD_TEXT_LOCATION: Record <string, number> = {
            x: 50,
            y: 150
        }
        const LIVES_TEXT_LOCATION: Record <string, number> = {
            x: 50,
            y: 200
        }
        const HIGH_SCORE_LOCATION: Record <string, number> = {
            x: 50,
            y: 50
        }
        const SCORE_LOCATION: Record <string, number> = {
            x: 50,
            y: 100
        }

        context.fillStyle = "black";
        context.font = "20px Arial";
        context.fillText(`SCORE: ${score}`, SCORE_LOCATION.x, SCORE_LOCATION.y);
        context.font = "20px Arial";
        context.fillText(`HIGH SCORE_LOCATION: ${highScore}`, HIGH_SCORE_LOCATION.x, HIGH_SCORE_LOCATION.y);
        context.fillText(`GOLD_TEXT_LOCATION: ${gold}`, GOLD_TEXT_LOCATION.x, GOLD_TEXT_LOCATION.y);
        context.font = "20px Arial";
        if (playerComponent.stats.Lives > 0){
            context.font = "20px Arial";
            context.fillText(`LIVES_TEXT_LOCATION: ${playerComponent.stats.Lives}`, LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
        else{
            context.fillStyle = "red";
            context.font = "20px Arial";
            context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE)", LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
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
function generateObstacle(){
    const type: number = Math.floor(Math.random() * Object.keys(obstacleColors).length);
    const rect: Entity = new Entity;
    rect.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    rect.addComponent(DrawRectComponent.COMPONENT_ID, new DrawRectComponent(context, Object.keys(obstacleColors)[type]));
    objects.push(
        rect
    )
}
function generateCoin(){
    const COIN_RADIUS: number = 25;
    const circle: Entity = new Entity;
    circle.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, 0, 0, COIN_RADIUS));
    circle.addComponent(DrawCircleComponent.COMPONENT_ID, new DrawCircleComponent(context, "yellow"));
    objects.push(
        circle
    )
}

function generateDragon(){
    const dragon: Entity = new Entity;
    dragon.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, 50, 50, 0));
    dragon.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("dragon.png", DragonAnimationInfo));
    dragon.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    dragon.addComponent(DragonComponent.COMPONENT_ID, new DragonComponent());

    objects.push(
        dragon
    )
}

function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType: string = Object.keys(spawnType)[Math.floor(Math.random() * 2)];
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
    playerComponent.lane = 2;
    playerComponent.setLane();
    playerComponent.stats = StartingStats;
    equippedInventory.resetInventory();
    equipStarterItems(player);
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}
function destroyCollidingObjects(object1: Entity, object2: Entity){
    objects.splice(objects.indexOf(object1),1);
    objects.splice(objects.indexOf(object2),1);
}

function objectsLoop(deltaTime: number, gameSpeed: number, FALL_INCREMENT: number){
    for (let i = 0; i < objects.length; i++){
        objects[i].move(deltaTime, gameSpeed);
        objects[i].speed += FALL_INCREMENT;

        if (objects[i].constructor == DragonEnemy){
            (objects[i] as DragonEnemy).update(deltaTime);
        }

        if (objects[i].constructor == Arrow && objects[i].y <= - (objects[i] as Arrow).height
        || objects[i].constructor == DragonEnemy || Rects && objects[i].y >= canvas.height + (objects[i] as DragonEnemy | Rects).height/2 
        || objects[i].constructor == Circles && objects[i].y >= canvas.height){
            objects.splice(i,1);
            continue;
        }
        if (objects[i].constructor == Circles){
            if (objects[i].isColliding(playerCharacter)){
                const COIN_VALUE: number = 300;
                score += COIN_VALUE;
                gold += 1;
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].constructor == Arrow){
            const currentObject1: Arrow = objects[i] as Arrow;
            // When I removed the current object lines, the game sometimes bugged out when arrows collided with objects, so I'm keeping this code in.
            for (let j = 0; j < objects.length; j++){
                if (objects[j].constructor == DragonEnemy){
                    const currentObject2: DragonEnemy = objects[j] as DragonEnemy;
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
        else if (objects[i].isColliding(playerCharacter)){
            if (!playerComponent.attacking || objects[i].constructor == Fireball){
                playerComponent.stats.Lives -= 1;
            }
            objects.splice(i,1);
            continue;
        }
    }
}

import {PLAYER, player as playerCharacter, PlayerComponent, resetGame} from "./components/playerComponent";
import {PlayerState as PlayerState} from "./components/playerComponent";
import {KEYS, allPressedKeys, context, canvas, OFFSET, LANE, EntityName} from "./global";
import { Entity } from "./entityComponent";
import PositionComponent from "./components/positionComponent";
import DrawCircleComponent from "./components/drawCircleComponent";
import { AnimatedComponent } from "./components/animatedComponent";
import DragonComponent, { DragonAnimationInfo, DragonSound} from "./components/dragonComponent";
import MovementComponent from "./components/movementComponent";
import DrawRectComponent from "./components/drawRectComponent";
import { gameEntity, GameSound } from "./systems/gameSystem";
import {addScore, changeFallSpeed, changeSpawnDelay, fallSpeed, highScore, images, objects, score, spawnDelay} from "./objects"
import CollisionSystem from "./systems/collisionSystem";
import StateMachineComponent from "./components/stateMachineComponent";
import { InventoryComponent } from "./components/inventoryComponent";
import { GameState, gameState } from "./components/gameComponent";
import MinotaurComponent, { MinotaurAnimationInfo } from "./components/minotaurComponent";
import FrankensteinComponent from "./components/frankensteinComponent";
import { SoundComponent } from "./components/soundComponent";
import { ImagePartComponent } from "./components/imagePartComponent";
document.addEventListener('input', function(e) {
    console.log("played")
    const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
    soundComponent.playSound(GameSound.Track1);
});

// Player Component
const playerComponent = playerCharacter.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;

// Changeble variables
let gold: number = 0;

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
// TODO:
// - Add helpful UI for inventory system.
// - Entities are on top of player when colliding.
// - Add looping music function to soundComponent.


//Start Loop
resetGame();
requestAnimationFrame(runFrame);

let lastTime: number = Date.now();

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
        gameSpeed = 0.3;
    }
    // update state
    if (gameState == GameState.Playing){
        update(deltaTime, gameSpeed);        
    }
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
    gameEntity.update(deltaTime, gameSpeed);
}

function update(deltaTime: number, gameSpeed: number){
    const SPAWN_INCREMENT: number = 0.1;
    const FALL_INCREMENT: number = 0.02;
    const SCORE_INCREMENT: number = 0.001;
    let scoreIncreaseSpeed: number = 1;
    addScore(scoreIncreaseSpeed);

    checkSpawn();
    objectsLoop(deltaTime, gameSpeed, FALL_INCREMENT);
    playerCharacter.update(deltaTime, gameSpeed);
    changeSpawnDelay(SPAWN_INCREMENT);
    changeFallSpeed(FALL_INCREMENT)
    scoreIncreaseSpeed += SCORE_INCREMENT;
    // console.log(`This is the score increase speed: ${scoreIncreaseSpeed}`);
}

const playerImage = new Entity();
playerImage.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(500, 500, PLAYER.WIDTH * 5, PLAYER.HEIGHT * 5, 0));
playerImage.addComponent(ImagePartComponent.COMPONENT_ID, new ImagePartComponent(playerCharacter.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!.spritesheet.src, 0, 140, 60, 60));

function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState != GameState.InventoryMenu){
        
        context.save();

        let cameraAngle: number = 0;
        let cameraX: number = 500;
        let cameraY: number = 0;
        let zoomLevel: number = 1;
        context.rotate(cameraAngle);
        context.translate(cameraX, cameraY);
        context.scale(zoomLevel, zoomLevel);
        
        gameEntity.draw();
        for (const obj of objects) {
            obj.draw();
        }
        context.restore();

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
        context.fillText(`HIGH SCORE: ${highScore}`, HIGH_SCORE_LOCATION.x, HIGH_SCORE_LOCATION.y);
        context.fillText(`GOLD: ${gold}`, GOLD_TEXT_LOCATION.x, GOLD_TEXT_LOCATION.y);
        context.font = "20px Arial";
        if (playerComponent.stats.Lives > 0){
            context.font = "20px Arial";
            context.fillText(`LIVES: ${playerComponent.stats.Lives}`, LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
        else{
            context.fillStyle = "red";
            context.font = "20px Arial";
            context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE. DO NOT GET HIT)", LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
    }
    else{
        // draw player inventories
        if (playerCharacter.getComponent(InventoryComponent.COMPONENT_ID) == null) {
            return;
        }

        const inventoryComponent = playerCharacter.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;

        for (const inventory of inventoryComponent.inventories) {
            inventory.draw();
        }
        for (const image of images) {
            image.draw();
        }
        playerImage.draw();
    }
}

// These functions calculate a certain value

function calculateLaneLocation(lane: number): number{
    return lane * LANE.WIDTH - LANE.WIDTH/2;
}
function pickLane(): number{
    return Math.floor(Math.random() * LANE.COUNT) + OFFSET;
}

// Obstacle/Object Information

enum obstacleColors {
    Orange,
    Brown,
    Black
}

const obstacleType: Array <string> = [PlayerState.Ducking, PlayerState.Jumping, "Invincible"];

const OBJECT: Record <string, number> = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}

function generateRectEnemy(){
    const type: number = Math.floor(Math.random() * Object.keys(obstacleColors).length);
    const rect: Entity = new Entity(EntityName.RectEnemy);
    rect.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    rect.addComponent(DrawRectComponent.COMPONENT_ID, new DrawRectComponent(context, Object.keys(obstacleColors)[type]));
    objects.push(
        rect
    )
}
function generateCoin(){
    const COIN_RADIUS: number = 25;
    const circle: Entity = new Entity(EntityName.Coin);
    circle.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, 0, 0, COIN_RADIUS));
    circle.addComponent(DrawCircleComponent.COMPONENT_ID, new DrawCircleComponent(context, "yellow"));
    objects.push(
        circle
    )
}

function generateDragon(){
    const DragonAudio = {
        [DragonSound.Roar]: new Audio('assets/audio/dragon-roar.mp3')
    }

    const dragon: Entity = new Entity(EntityName.Dragon);
    dragon.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    dragon.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/dragon.png", DragonAnimationInfo));
    dragon.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    dragon.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    dragon.addComponent(DragonComponent.COMPONENT_ID, new DragonComponent());
    dragon.addComponent(SoundComponent.COMPONENT_ID, new SoundComponent(DragonAudio));

    objects.push(
        dragon
    )
}

function generateMinotaur(){
    const MINOTAUR_WIDTH: number = 75;
    const MINOTAUR_HEIGHT: number = 75;

    const minotaur: Entity = new Entity(EntityName.Minotaur);
    minotaur.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, MINOTAUR_WIDTH, MINOTAUR_HEIGHT, 0));
    minotaur.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/minotaur.png", MinotaurAnimationInfo));
    minotaur.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    minotaur.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    minotaur.addComponent(MinotaurComponent.COMPONENT_ID, new MinotaurComponent());

    objects.push(
        minotaur
    )
}

function generateFrankenstein(){
    const FRANKENSTEIN_WIDTH: number = 100;
    const FRANKENSTEIN_HEIGHT: number = 100;

    const frankenstein: Entity = new Entity(EntityName.Frankenstein);
    frankenstein.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, FRANKENSTEIN_WIDTH, FRANKENSTEIN_HEIGHT, 0));
    frankenstein.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/frankenstein.png", MinotaurAnimationInfo));
    frankenstein.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    frankenstein.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    frankenstein.addComponent(FrankensteinComponent.COMPONENT_ID, new FrankensteinComponent());

    objects.push(
        frankenstein
    )
}

const SpawnType = {
    GenerateDragon: "generateDragon",
    GenerateCoin: "generateCoin",
    GenerateMinotaur: "generateMinotaur",
    GenerateFrankenstein: "generateFrankenstein"
}

let lastSpawn: number = Date.now() - spawnDelay; //This is in milliseconds

function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType: string = Object.values(SpawnType)[Math.floor(Math.random() * 4)];
        if (generateType == SpawnType.GenerateDragon){
            generateDragon();
        }
        else if (generateType == SpawnType.GenerateCoin){
            generateCoin();
        }
        else if (generateType == SpawnType.GenerateMinotaur){
            generateMinotaur();
        }
        else if (generateType == SpawnType.GenerateFrankenstein){
            generateFrankenstein();
        }
        lastSpawn = Date.now();
        // console.log(generateType);
    }
}

function objectsLoop(deltaTime: number, gameSpeed: number, FALL_INCREMENT: number){
    for (let i = 0; i < objects.length; i++){
        if (objects[i].getComponent(PositionComponent.COMPONENT_ID) == null){
            console.log("object doesn't have position component");
            return;
        }

        else if (objects[i].getComponent(MovementComponent.COMPONENT_ID) != null){
            const movementComponent: MovementComponent = objects[i].getComponent(MovementComponent.COMPONENT_ID)!;
            const positionComponent: PositionComponent = objects[i].getComponent(PositionComponent.COMPONENT_ID)!;
            if (objects[i].getComponent(DrawCircleComponent.COMPONENT_ID) == null){
                if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.height/2)){
                    objects.splice(i,1);
                    continue;
                }
            }
            else{
                if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.radius)){
                    objects.splice(i,1);
                    continue;
                }
            }
            movementComponent.speed += FALL_INCREMENT;
        }

        objects[i].update(deltaTime, gameSpeed);

        if (objects[i].name == EntityName.Arrow){
            const currentObject1: Entity = objects[i] as Entity;
            // When I removed the current object lines, the game sometimes bugged out when arrows collided with objects, so I'm keeping this code in.
            for (let j = 0; j < objects.length; j++){
                if (objects[j].name == EntityName.Dragon || objects[j].name == EntityName.Minotaur || objects[j].name == EntityName.Frankenstein){
                    const currentObject2: Entity = objects[j] as Entity;
                    console.assert(currentObject1 != undefined);
                    console.assert(currentObject2 != undefined);
                    if (CollisionSystem.collideObjects(currentObject1, currentObject2)){
                        if (objects[j].name != EntityName.Frankenstein){
                            destroyCollidingObjects(objects[i], objects[j]);
                        }
                        else {
                            const frankensteinComponent = objects[j].getComponent<FrankensteinComponent>(FrankensteinComponent.COMPONENT_ID)!;
                            frankensteinComponent.health -= 1;
                            if (frankensteinComponent.health < 1){
                                destroyCollidingObjects(objects[i], objects[j]);
                            }
                            else {
                                dealDamageToCollidingObjects(objects[i], objects[j])
                            }
                        }
                        const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
                        soundComponent.playSound(GameSound.ArrowHit);
                    }
                continue;
                // For effiency's sake, should I split the objects array into 3 lane arrays? 
                // This way for collisions I will only need to check the objects that are on the same lane.
                }
            }
        }

        else if (objects[i] != playerCharacter && CollisionSystem.collideObjects(objects[i], playerCharacter)){
            // check if the object is a coin, or something that can deal damage to the player
            if (objects[i].name == EntityName.Coin) {
                const COIN_VALUE: number = 300;
                addScore(COIN_VALUE)
                gold += 1;
                objects.splice(i,1);
                continue;
            }
            else {
                if (!playerComponent.attacking || objects[i].name == EntityName.Fireball){
                    playerComponent.stats.Lives -= 1;
                    const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
                    soundComponent.playSound(GameSound.PlayerHit);
                    objects.splice(i,1);
                    continue;
                }
                else if (objects[i].name == EntityName.Frankenstein){
                    const positionComponent = objects[i].getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!
                    const frankensteinComponent = objects[i].getComponent<FrankensteinComponent>(FrankensteinComponent.COMPONENT_ID)!;
                    for (let i = 0; i < 200; i++){
                        positionComponent.y -= 1;
                    }
                    frankensteinComponent.health -= 1;
                    if (frankensteinComponent.health < 1){
                        objects.splice(i,1);
                        continue;
                    }
                    else{
                        const animatedComponent = objects[i].getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
                        animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
                    }
                }
                else {
                    objects.splice(i,1);
                    continue;
                }
            }
        }
    }
}

function outOfBoundsCheck(movementComponent: MovementComponent, positionComponent: PositionComponent, shapeDistance: number){
        if (movementComponent.yDirection == -1 && positionComponent.y <= - shapeDistance || 
            movementComponent.yDirection == 1 && positionComponent.y >= canvas.height){
            return true;
        }
        return false;
}

function dealDamageToCollidingObjects(object1: Entity, object2: Entity){
    objects.splice(objects.indexOf(object1),1);
    const animatedComponent = object2.getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
    animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
}
function destroyCollidingObjects(object1: Entity, object2: Entity){
    objects.splice(objects.indexOf(object1),1);
    objects.splice(objects.indexOf(object2),1);
}

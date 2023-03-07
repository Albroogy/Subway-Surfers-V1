import {PLAYER, player as playerCharacter, PlayerComponent, resetGame} from "./components/playerComponent";
import {PlayerState as PlayerState} from "./components/playerComponent";
import {KEYS, allPressedKeys, context, canvas, OFFSET, LANE, EntityName, IN_GAME_SECOND, checkTime} from "./global";
import { Entity } from "./entityComponent";
import PositionComponent from "./components/positionComponent";
import DrawCircleComponent from "./components/drawCircleComponent";
import { AnimatedComponent } from "./components/animatedComponent";
import DragonComponent, { DragonAnimationInfo, DragonSound} from "./components/dragonComponent";
import MovementComponent from "./components/movementComponent";
import { gameEntity, GameSound } from "./systems/gameSystem";
import {images, objects} from "./objects"
import CollisionSystem from "./systems/collisionSystem";
import StateMachineComponent from "./components/stateMachineComponent";
import { InventoryComponent } from "./components/inventoryComponent";
import { GameState, gameState } from "./components/gameComponent";
import MinotaurComponent, { MinotaurAnimationInfo } from "./components/minotaurComponent";
import FrankensteinComponent, { FrankensteinAnimationInfo } from "./components/frankensteinComponent";
import { SoundComponent } from "./components/soundComponent";
import { ImagePartComponent } from "./components/imagePartComponent";
import CameraSystem from "./systems/cameraSystem";
import SaveGameSystem, { SaveKey } from "./systems/saveGameSystem";
import { ImageComponent } from "./components/imageComponent";
import SkeletonComponent, { SkeletonAnimationInfo } from "./components/skeletonComponent";
import GhostComponent, { GhostAnimationInfo } from "./components/ghost";

document.body.addEventListener('keydown', startMusicTracks);

function startMusicTracks() {
        const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
        if (!soundComponent.loadedSounds[GameSound.Track1].played){
            return;
        }
        // soundComponent.playSound(GameSound.Track1);
        const sounds = [GameSound.Track1, GameSound.Track2, GameSound.Track3];
        soundComponent.playSounds(sounds);
        document.body.removeEventListener('keydown', startMusicTracks);
}

window.addEventListener("beforeunload", function (e) {
    // Save game state here
    SaveGameSystem.Instance.saveGameData(gold, highScore);
});

// Player Component
const playerComponent = playerCharacter.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;

// Changeble variables
let gold: number = 0;
let score: number = 0;
let highScore: number = 0;

const ORIGINAL_FALL_SPEED: number = 150;
export let fallSpeed: number = ORIGINAL_FALL_SPEED;

export const ORIGINAL_SPAWN_DELAY: number = 1500;
export let spawnDelay: number = ORIGINAL_SPAWN_DELAY;

export function addScore(scoreIncreaseValue: number): void {
    score += scoreIncreaseValue;
}

export function changeSpawnDelay(spawnIncrement: number): void {
    spawnDelay -= spawnIncrement;
}

export function changeFallSpeed(fallIncrement: number): void {
    fallSpeed += fallIncrement;
}

export function resetValues(){
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_FALL_SPEED;
    objectTypesCount = ORIGINAL_OBJECT_TYPES_COUNT;
    objectIntervalTime = ORIGINAL_ENEMY_INTERVAL_TIME;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
    enemiesPerLane = [0, 0, 0];
}

// Load Game Data

if (SaveGameSystem.Instance.loadData(SaveKey.Gold) != null){
    gold = SaveGameSystem.Instance.loadData(SaveKey.Gold) as number;
}
if (SaveGameSystem.Instance.loadData(SaveKey.HighScore) != null){
    highScore = SaveGameSystem.Instance.loadData(SaveKey.HighScore) as number;
}


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
    checkobjectTypesCount(currentTime);
    gameEntity.update(deltaTime, gameSpeed);
}
const ORIGINAL_ENEMY_INTERVAL_TIME = 10 * IN_GAME_SECOND;
let objectIntervalTime = ORIGINAL_ENEMY_INTERVAL_TIME;
let nextobjectTime = Date.now() + objectIntervalTime;

const ORIGINAL_OBJECT_TYPES_COUNT = 2;
let objectTypesCount = ORIGINAL_OBJECT_TYPES_COUNT;

function checkobjectTypesCount(currentTime: number): void {
    if (currentTime >= nextobjectTime && objectTypesCount <= Object.keys(SpawnType).length){
        objectTypesCount += 1;
        nextobjectTime += objectIntervalTime;
        objectIntervalTime += 5 * IN_GAME_SECOND;
    }
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
        
        CameraSystem.Instance.beginDraw();
        
        gameEntity.draw();
        for (let i = objects.length - OFFSET; i >= 0; i--) {
            objects[i].draw();
        }
        CameraSystem.Instance.endDraw();

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

const SpawnType = {
    GenerateCoin: "generateCoin",
    GenerateSkeleton: "generateSkeleton",
    GenerateDragon: "generateDragon",
    GenerateMinotaur: "generateMinotaur",
    GenerateFrankenstein: "generateFrankenstein",
    GenerateGhost: "generateGhost"
}

let lastSpawn: number = Date.now() - spawnDelay; //This is in milliseconds

let enemiesPerLane = [0, 0, 0];

function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let typeNumber = Math.floor(Math.random() * objectTypesCount);
        // if (checkTypeNumberViable(typeNumber) == false){
        //     typeNumber = generateTypeNumber();
        // }
        // Maybe use this to add some weighting to the object spawn.

        let generateType: string = Object.values(SpawnType)[typeNumber];

        let objectLane = pickLane(enemiesPerLane);

        for (let i = 0; i < enemiesPerLane.length; i++){
            if (i == objectLane! - OFFSET){
                enemiesPerLane[i] += 1;
            }
        }

        let objectLaneLocation = calculateLaneLocation(objectLane!);

        if (generateType == SpawnType.GenerateCoin){
            generateCoin(objectLaneLocation);
        }
        else if (generateType == SpawnType.GenerateSkeleton){
            generateSkeleton(objectLaneLocation);
        }
        else if (generateType == SpawnType.GenerateDragon){
            generateDragon(objectLaneLocation);
        }
        else if (generateType == SpawnType.GenerateMinotaur){
            generateMinotaur(objectLaneLocation);
        }
        else if (generateType == SpawnType.GenerateFrankenstein){
            generateFrankenstein(objectLaneLocation);
        }
        else if (generateType == SpawnType.GenerateGhost){
            generateGhost(objectLaneLocation);
        }
        lastSpawn = Date.now();
        console.log(generateType);
        console.log(enemiesPerLane);
    }
}

function checkTypeNumberViable(typeNumber: number): boolean {
    return typeNumber <= Object.keys(SpawnType).length - OFFSET;
}

function generateTypeNumber(): number {
    let typeNumber = Math.floor(Math.random() * objectTypesCount);
    if (checkTypeNumberViable(typeNumber) == false){
        typeNumber = generateTypeNumber();
    }
    return Math.floor(Math.random() * objectTypesCount);
}

function calculateLaneLocation(lane: number): number{
    return lane * LANE.WIDTH - LANE.WIDTH/2;
}
function pickLane(enemiesPerLane: Array<number>){
    let weights = enemiesPerLane.map(count => 1 / (count + 1));

    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let normalizedWeights = weights.map(weight => weight / totalWeight);

    let randomNumber = Math.random();

    let cumulativeWeight = 0;
    for (let i = 0; i < normalizedWeights.length; i++) {
        cumulativeWeight += normalizedWeights[i];
        if (randomNumber <= cumulativeWeight) {
            return i + OFFSET;
        }
    }
}

const OBJECT: Record <string, number> = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}

function generateCoin(objectLaneLocation: number){
    const circle: Entity = new Entity(EntityName.Coin);
    circle.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    circle.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("assets/images/coin.png"));
    circle.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    objects.push(
        circle
    )
}

function generateDragon(objectLaneLocation: number){
    const DragonAudio = {
        [DragonSound.Roar]: new Audio('assets/audio/dragon-roar.mp3')
    }

    const dragon: Entity = new Entity(EntityName.Dragon);
    dragon.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    dragon.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/dragon.png", DragonAnimationInfo));
    dragon.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    dragon.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    dragon.addComponent(DragonComponent.COMPONENT_ID, new DragonComponent());
    dragon.addComponent(SoundComponent.COMPONENT_ID, new SoundComponent(DragonAudio));

    objects.push(
        dragon
    )
}

function generateMinotaur(objectLaneLocation: number){
    const MINOTAUR_WIDTH: number = 75;
    const MINOTAUR_HEIGHT: number = 75;

    const minotaur: Entity = new Entity(EntityName.Minotaur);
    minotaur.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, MINOTAUR_WIDTH, MINOTAUR_HEIGHT, 0));
    minotaur.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/minotaur.png", MinotaurAnimationInfo));
    minotaur.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    minotaur.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    minotaur.addComponent(MinotaurComponent.COMPONENT_ID, new MinotaurComponent());

    objects.push(
        minotaur
    )
}

function generateFrankenstein(objectLaneLocation: number){
    const FRANKENSTEIN_WIDTH: number = 100;
    const FRANKENSTEIN_HEIGHT: number = 100;

    const frankenstein: Entity = new Entity(EntityName.Frankenstein);
    frankenstein.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, FRANKENSTEIN_WIDTH, FRANKENSTEIN_HEIGHT, 0));
    frankenstein.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/frankenstein.png", FrankensteinAnimationInfo));
    frankenstein.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    frankenstein.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    frankenstein.addComponent(FrankensteinComponent.COMPONENT_ID, new FrankensteinComponent());

    objects.push(
        frankenstein
    )
}

function generateSkeleton(objectLaneLocation: number){
    const SKELOTON_WIDTH: number = 75;
    const SKELOTON_HEIGHT: number = 75;

    const skeleton: Entity = new Entity(EntityName.Skeleton);
    skeleton.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, SKELOTON_WIDTH, SKELOTON_HEIGHT, 0));
    skeleton.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/skeleton.png", SkeletonAnimationInfo));
    skeleton.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    skeleton.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    skeleton.addComponent(SkeletonComponent.COMPONENT_ID, new SkeletonComponent());

    objects.push(
        skeleton
    )
}

function generateGhost(objectLaneLocation: number){
    const GHOST_WIDTH: number = 200;
    const GHOST_HEIGHT: number = 200;

    const ghost: Entity = new Entity(EntityName.Ghost);
    ghost.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, GHOST_WIDTH, GHOST_HEIGHT, 0));
    ghost.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/ghost.png", GhostAnimationInfo));
    ghost.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    ghost.addComponent(GhostComponent.COMPONENT_ID, new GhostComponent());
    
    objects.push(
        ghost
    )
}

function objectsLoop(deltaTime: number, gameSpeed: number, FALL_INCREMENT: number){
    for (let i = 0; i < objects.length; i++){
        if (objects[i].getComponent(PositionComponent.COMPONENT_ID) == null){
            console.log("object doesn't have a position component");
            return;
        }

        else if (objects[i].getComponent(MovementComponent.COMPONENT_ID) != null){
            const movementComponent: MovementComponent = objects[i].getComponent(MovementComponent.COMPONENT_ID)!;
            const positionComponent: PositionComponent = objects[i].getComponent(PositionComponent.COMPONENT_ID)!;
            if (objects[i].getComponent(DrawCircleComponent.COMPONENT_ID) == null){
                if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.height/2)){
                    const object = objects[i];
                    deleteObject(object);
                    continue;
                }
            }
            else{
                if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.radius)){
                    const object = objects[i];
                    deleteObject(object);
                    continue;
                }
            }
            movementComponent.speed += FALL_INCREMENT;
        }

        objects[i].update(deltaTime, gameSpeed);

        if (objects[i].name == EntityName.Arrow){
            const arrow: Entity = objects[i] as Entity;
            // When I removed the current object lines, the game sometimes bugged out when arrows collided with objects, so I'm keeping this code in.
            for (let j = 0; j < objects.length; j++){
                const object: Entity = objects[j] as Entity;
                if (checkNameIsNonProjectile(object) && object.name != EntityName.Coin){
                    console.assert(arrow != undefined);
                    console.assert(object != undefined);
                    if (CollisionSystem.collideObjects(arrow, object)){
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
                deleteObject(objects[i]);
                continue;
            }
            else {
                if (!playerComponent.attacking && objects[i].name != EntityName.Frankenstein && objects[i].name != EntityName.Skeleton || objects[i].name == EntityName.Fireball){
                    playerComponent.stats.Lives -= 1;
                    const soundComponent = gameEntity.getComponent<SoundComponent>(SoundComponent.COMPONENT_ID)!;
                    soundComponent.playSound(GameSound.PlayerHit);
                    deleteObject(objects[i]);
                    continue;
                }
                else if (objects[i].name == EntityName.Frankenstein){
                    let timeCollisionStart = Date.now();
                    if (playerComponent.attacking){
                        const positionComponent = objects[i].getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!
                        const frankensteinComponent = objects[i].getComponent<FrankensteinComponent>(FrankensteinComponent.COMPONENT_ID)!;
                        for (let i = 0; i < 200; i++){
                            positionComponent.y -= 1;
                        }
                        frankensteinComponent.health -= 1;
                        if (frankensteinComponent.health < 1){
                            deleteObject(objects[i]);
                            continue;
                        }
                        else{
                            const animatedComponent = objects[i].getComponent<AnimatedComponent>(AnimatedComponent.COMPONENT_ID)!;
                            animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
                        }
                    }
                    else {
                        if (checkTime(IN_GAME_SECOND * 1, timeCollisionStart)){
                            playerComponent.stats.Lives -= 1;
                            timeCollisionStart = Date.now();
                        }
                    }
                }
                else if (objects[i].name == EntityName.Skeleton){
                    let timeCollisionStart = Date.now();
                    if (playerComponent.attacking){
                        deleteObject(objects[i]);
                        continue;
                    }
                    else {
                        if (checkTime(IN_GAME_SECOND * 1, timeCollisionStart)){
                            playerComponent.stats.Lives -= 1;
                            timeCollisionStart = Date.now();
                        }
                    }
                }
                else {
                    deleteObject(objects[i]);
                    continue;
                }
            }
        }
    }
}

function outOfBoundsCheck(movementComponent: MovementComponent, positionComponent: PositionComponent, shapeDistance: number){
        if (movementComponent.yDirection == -1 && positionComponent.y <= - shapeDistance || 
            movementComponent.yDirection == 1 && positionComponent.y >= canvas.height + shapeDistance){
            return true;
        }
        return false;
}

function deleteObject(object: Entity){
    objects.splice(objects.indexOf(object),1);
    if (checkNameIsNonProjectile(object)){
        const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        let objectLane = findLane(positionComponent.x);
        for (let i = 0; i < enemiesPerLane.length; i++){
            if (i == objectLane - OFFSET){
                enemiesPerLane[i] -= 1;
            }
        }
    }
}

function findLane(xCoordinate: number){
    return (xCoordinate + LANE.WIDTH/2) / LANE.WIDTH;
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

const nonProjectiles = [EntityName.Coin, EntityName.Skeleton, EntityName.Dragon, EntityName.Minotaur, EntityName.Frankenstein, EntityName.Ghost]

function checkNameIsNonProjectile(object: Entity){
    for (const objectName of nonProjectiles){
        console.log(object.name)
        console.log(objectName)
        if (object.name == objectName){
            return true;
        }
    }
    return false;
}

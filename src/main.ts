import {PLAYER, player as playerCharacter, PlayerComponent, resetGame} from "./components/playerComponent";
import {PlayerState as PlayerState} from "./components/playerComponent";
import {KEYS, allPressedKeys, context, canvas, OFFSET, LANE, EntityName, IN_GAME_SECOND, checkTime, Tag, findLane, calculateLaneLocation} from "./global";
import { Entity } from "./entityComponent";
import PositionComponent from "./components/positionComponent";
import DrawCircleComponent from "./components/drawCircleComponent";
import { AnimatedComponent } from "./components/animatedComponent";
import MovementComponent from "./components/movementComponent";
import { gameEntity, GameSound } from "./systems/gameSystem";
import {images, objects} from "./objects"
import CollisionSystem from "./systems/collisionSystem";
import { createInventoryItem, InventoryComponent, InventoryItem, InventoryItemStat, Items, Weapons } from "./components/inventoryComponent";
import { GameState, gameState } from "./components/gameComponent";
import { SoundComponent } from "./components/soundComponent";
import { ImagePartComponent } from "./components/imagePartComponent";
import CameraSystem from "./systems/cameraSystem";
import SaveGameSystem, { SaveKey } from "./systems/saveGameSystem";
import { TagComponent } from "./components/tagComponent";
import AchievementSystem, { BossAchievements, ValueType } from "./systems/achievementSystem";
import { generateAura, generateCoin, generateDeathStar, generateDragon, generateExtendedVision, generateFrankenstein, generateGhost, generateGoblinBoss, generateGolemBoss, generateLaser, generateLoot, generateMinotaur, generateSkeleton } from "./entityGenerator";

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
    const inventoryComponent = playerCharacter.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;
    SaveGameSystem.Instance.saveGameData(gold, highScore, AchievementSystem.Instance.AchievementInfo, inventoryComponent.inventories[1].cells);
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

export function addGold(goldIncreaseValue: number): void {
    gold += goldIncreaseValue;
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
    currentSpawnTypes = ORIGINAL_SPAWN_TYPES;
    enemiesPerLane = ORIGINAL_ENEMIES_PER_LANE;
    enemiesPerLane = [0, 0, 0];
    if (score > highScore){
        highScore = score;
    }
    score = 0;
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

const ORIGINAL_OBJECT_TYPES_COUNT = 1;
let objectTypesCount = ORIGINAL_OBJECT_TYPES_COUNT;

function checkobjectTypesCount(currentTime: number): void {
    if (currentTime >= nextobjectTime && objectTypesCount <= Object.keys(EnemyType).length){
        objectTypesCount += 1;
        currentSpawnTypes.push(
            Object.values(EnemyType)[objectTypesCount - OFFSET]
        )
        nextobjectTime += objectIntervalTime;
        objectIntervalTime += 5 * IN_GAME_SECOND;
    }
}

let lastSpawn: number = Date.now() - spawnDelay; //This is in milliseconds

function update(deltaTime: number, gameSpeed: number){
    const SPAWN_INCREMENT: number = 0.1;
    const FALL_INCREMENT: number = 0.02;
    const SCORE_INCREMENT: number = 0.001;
    let scoreIncreaseSpeed: number = 1;
    addScore(scoreIncreaseSpeed);
    const inventoryComponent = playerCharacter.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;
    let itemsCount = inventoryComponent.inventories[0].count + inventoryComponent.inventories[1].count;
    AchievementSystem.Instance.checkAchievements(gold, enemiesDefeated, BossesDefeated, itemsCount);

    if (checkTime(spawnDelay, lastSpawn)){
        const randomNum = Math.random();
        if (randomNum <= 0.8) {
            spawnEnemy();
        }
        else {
            spawnPowerup();
        }
        lastSpawn = Date.now();
    }
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
    
    if (gameState == GameState.Playing){
        
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
        if (playerComponent.stats[InventoryItemStat.Lives] > 0){
            context.font = "20px Arial";
            context.fillText(`LIVES: ${playerComponent.stats[InventoryItemStat.Lives]}`, LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
        else{
            context.fillStyle = "red";
            context.font = "20px Arial";
            context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE. DO NOT GET HIT)", LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
        }
    }
    else if (gameState == GameState.InventoryMenu){
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
    else if (gameState == GameState.AchievementsMenu){
        // draw achievements
        AchievementSystem.Instance.drawAchievements();
    }
}

enum EnemyType {
    GenerateSkeleton = "generateSkeleton",
    GenerateDragon = "generateDragon",
    GenerateMinotaur = "generateMinotaur",
    GenerateFrankenstein = "generateFrankenstein",
    GenerateGhost = "generateGhost"
}

const EnemyTypeGenerator = {
    [EnemyType.GenerateSkeleton]: generateSkeleton,
    [EnemyType.GenerateDragon]: generateDragon,
    [EnemyType.GenerateMinotaur]: generateMinotaur,
    [EnemyType.GenerateFrankenstein]: generateFrankenstein,
    [EnemyType.GenerateGhost]: generateGhost
};

const ORIGINAL_ENEMIES_PER_LANE = [0, 0, 0];
let enemiesPerLane = ORIGINAL_ENEMIES_PER_LANE;

const ORIGINAL_SPAWN_TYPES = [EnemyType.GenerateSkeleton];
let currentSpawnTypes = ORIGINAL_SPAWN_TYPES;

function spawnEnemy(){
    const spawnProbabilities = currentSpawnTypes.map((spawnType: string, index: number) => {
        const difficultyFactor = index + 1; // Difficulty factor = enemy type index + 1
        const baseProbability = 1 / Object.values(currentSpawnTypes).length; // Base probability for each enemy type
        const difficultyBonus = difficultyFactor * 0.1; // Increase probability by 10% for each difficulty factor
        const spawnProbability: number = baseProbability + difficultyBonus;
        return spawnProbability;
    });

    let spawnIndex = weightedRandom(spawnProbabilities);

    let generateType = Object.values(currentSpawnTypes)[spawnIndex];

    let weights = enemiesPerLane.map(count => 1 / (count + 1));
    let objectLane = weightedRandom(weights) + OFFSET;

    for (let i = 0; i < enemiesPerLane.length; i++){
        if (i == objectLane - OFFSET){
            enemiesPerLane[i] += 1;
        }
    }

    let objectLaneLocation = calculateLaneLocation(objectLane);

    EnemyTypeGenerator[generateType](objectLaneLocation, fallSpeed);
}

function weightedRandom(weights: number[]): number {
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let normalizedWeights = weights.map(weight => weight / totalWeight);

    let randomNumber = Math.random();

    let cumulativeWeight = 0;
    for (let i = 0; i < normalizedWeights.length; i++) {
        cumulativeWeight += normalizedWeights[i];
        if (randomNumber <= cumulativeWeight) {
            return i;
        }
    }
    return 0;
}

enum PowerupType {
    Coin = "coin",
    ExtendedVision = "extendedVision",
    Aura = "aura",
    DeathStar = "deathStar"
}

const PowerupTypeGenerator = {
    [PowerupType.Coin]: generateCoin,
    [PowerupType.ExtendedVision]: generateExtendedVision,
    [PowerupType.Aura]: generateAura,
    [PowerupType.DeathStar]: generateDeathStar,
};

function spawnPowerup(){
    let spawnIndex = Math.floor(Math.random() * Object.values(PowerupType).length);

    console.log(spawnIndex)

    let generateType = Object.values(PowerupType)[spawnIndex];

    let objectLane = Math.ceil(Math.random() * LANE.COUNT);
    let objectLaneLocation = calculateLaneLocation(objectLane);

    console.log(generateType, objectLaneLocation);
    PowerupTypeGenerator[generateType](objectLaneLocation, fallSpeed);
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
            const arrow = objects[i];
            for (let j = 0; j < objects.length; j++){
                const object = objects[j];
                const tagComponent = object.getComponent<TagComponent>(TagComponent.COMPONENT_ID)!;
                if (tagComponent.tags.includes(Tag.Enemy)){
                    console.assert(arrow != undefined);
                    console.assert(object != undefined);
                    if (CollisionSystem.checkObjectsColliding(arrow, object)){
                        CollisionSystem.matchPair(arrow, object);
                    }
                    continue;
                }
            }
        }
        else if (objects[i] != playerCharacter && CollisionSystem.checkObjectsColliding(objects[i], playerCharacter)){
            CollisionSystem.matchPair(objects[i], playerCharacter);
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

let enemiesDefeated = 0;

let BossesDefeated: BossAchievements = {
    [ValueType.GoblinBossDefeated]: 0,
    [ValueType.GolemBossDefeated]: 0,
}

export function deleteObject(object: Entity){
    objects.splice(objects.indexOf(object),1);
    const tagComponent = object.getComponent<TagComponent>(TagComponent.COMPONENT_ID);
    if (tagComponent!.tags.includes(Tag.Enemy)){
        if (tagComponent!.tags.includes(Tag.Boss)){
            generateItem(object);
            if (tagComponent!.tags.includes(Tag.GoblinBoss)){
                BossesDefeated[ValueType.GoblinBossDefeated] = 1;
            }
            if (tagComponent!.tags.includes(Tag.GolemBoss)){
                BossesDefeated[ValueType.GolemBossDefeated] = 1;
            }
        }
        else if (Math.random() > 0.000001) {
            generateItem(object);
        }
        const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        let objectLane = findLane(positionComponent.x);
        for (let i = 0; i < enemiesPerLane.length; i++){
            if (i == objectLane - OFFSET){
                enemiesPerLane[i] -= 1;
                const tagComponent = object.getComponent<TagComponent>(TagComponent.COMPONENT_ID)!;
                if (!tagComponent.tags.includes(Tag.Coin)){
                    enemiesDefeated += 1;
                }
            }
        }
    }
}

function generateItem(object: Entity) {
    let itemName = ""
    let item: any = null;
    
    let randomNum = Math.random();
    if (randomNum < 0.5) {
        itemName = Object.keys(Items.Armor)[Math.floor(Math.random() * Object.keys(Items.Armor).length)];
        item = Items.Armor[itemName];
    }
    else {
        const itemNum = Math.floor(Math.random() * Object.keys(Items.Weapons).length);
        itemName = Object.keys(Items.Weapons)[itemNum];
        item = Object.values(Items.Weapons)[itemNum];
        console.log(item)
    }
    for (const loot of Object.values(Items.Weapons)) {
        const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        const inventoryItem = createInventoryItem(loot, itemName);
        generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
    }
    for (const loot of Object.values(Items.Armor)) {
        const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        const inventoryItem = createInventoryItem(loot, itemName);
        generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
    }
    // create item
    // const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    // const inventoryItem = createInventoryItem(item, itemName);
    // generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
}

document.body.addEventListener("wheel", (e: WheelEvent) => {
    CameraSystem.Instance.zoomLevel += e.deltaY / 5000;
});

// generateGoblinBoss(200, 200);

// generateGolemBoss(500, 200);

// generateLaser(500, 500);
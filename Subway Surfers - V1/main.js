// Constant variables
const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const STATE_DURATION = 1500;
const SCORE_SPEED = 1;
const COIN_VALUE = 300;
const CLICK_DELAY = 300; //This is in milliseconds
const SPAWN_INCREMENT = 0.2;
const FALL_INCREMENT = 0.02;
const COIN_RADIUS = 25;
const OFFSET = 1;
const ORIGINAL_SPEED = 150;
const ORIGINAL_SPAWN_DELAY = 1000;

const image = new Image();
image.src = 'coin_01.png';
const music = new Audio('Game_Song.mp3')

const itemList = {
    Spear: {
        Width: 1, 
        Height: 1,
        URL: "spear.png"
    },
    Bow: {
        Width: 1,
        Height: 2,
        URL: "bow.png"
    },
    Armor: {
        Width: 2,
        Height: 2,
        URL: "armor.png"
    }
}
const spearImage = new Image;
spearImage.src = itemList.Spear.URL;
const bowImage = new Image;
bowImage.src = itemList.Bow.URL;
const armorImage = new Image;
armorImage.src = itemList.Armor.URL;

// const itemImage = {
//     Spear: spearImage,
//     Bow: bowImage
// }
// Player Information
const PlayerStates = {
    Running: "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "jumping",
    Ducking: "ducking"
};
const PLAYER_SIZE = {
    WIDTH: 65,
    HEIGHT: 100
}

// Obstacle Information
const OBJECT = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}
const obstacleColors = {
    Orange: "orange",
    Brown: "brown",
    Black: "black"
}
const spawnType = {
    generateObstacle: "generateObstacle",
    generateCoin: "generateCoin",
}
const LANE = {
    WIDTH: canvas.width/3,
    COUNT: 3
}
const obstacleType = [PlayerStates.Ducking, PlayerStates.Jumping,"Invincible"]
const objects = []

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
let lastTime = Date.now();
let lastClick = Date.now();
let lastSpawn = Date.now();
let spawnDelay = ORIGINAL_SPAWN_DELAY; //This is in milliseconds
let score = 0;
let highScore = 0;
let fallSpeed = ORIGINAL_SPEED;

// Key Information
const allPressedKeys = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});
const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    Space: 32,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
};

class Rects{
    constructor(x, y, width, height, color, requiredState, speed) {
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
    isColliding(player){
        return (
            this.x - this.width/2 <= player.x + PLAYER_SIZE.WIDTH/2 &&
            this.x + this.width/2 >= player.x - PLAYER_SIZE.WIDTH/2 &&
            this.y + this.height/2 >= player.y - PLAYER_SIZE.HEIGHT/2 &&
            this.y - this.height/2 <= player.y + PLAYER_SIZE.HEIGHT/2
        )
    }
    isDodging(player){
        return this.requiredState == player.state;
    }
    move(deltaTime){
        this.y += this.speed * deltaTime / 1000;
    }
}
class Circles{
    constructor(x, y, radius, color, speed){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }
    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
    isColliding(player){
        return (
            this.x - this.radius <= player.x + PLAYER_SIZE.WIDTH/2 &&
            this.x + this.radius >= player.x - PLAYER_SIZE.WIDTH/2 &&
            this.y + this.radius >= player.y - PLAYER_SIZE.HEIGHT/2 &&
            this.y - this.radius <= player.y + PLAYER_SIZE.HEIGHT/2
        )
    }
    move(deltaTime){
        this.y += this.speed * deltaTime / 1000;
    }
}

// Animation Information
const AnimationNames = {
    RunningBack: "runningBack",
    Jumping: "jumping",
    Ducking: "ducking"
}
// Should I combine the AnimationNames dictionary with the PlayerStates Dictionary?

const playerAnimationInfo = {
    animationCount: 4, 
    [AnimationNames.RunningBack]: {
        rowIndex: 3,
        frameCount: 12,
        framesPerSecond: 12
    },
    [AnimationNames.Jumping]: {
        rowIndex: 1,
        frameCount: 12,
        framesPerSecond: 12
    },
    [AnimationNames.Ducking]: {
        rowIndex: 2,
        frameCount: 12,
        framesPerSecond: 12
    }
};
///
class InventoryItem {
    constructor(width, height, iconURL) {
        this.width = width;
        this.height = height;
        this.iconURL = iconURL;
    }
}
class Inventory {
    constructor(width, height) {
        this.cells = [];
        this.width = width;
        this.height = height;
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = null;
            }
        }
    }
    placeItemCheck(item, cellRow, cellCol) {
        // Go through all the coordinates of the item and figure out if the cells are null;
        // If they are, place the item AND apply some effect to the player
        // If even 1 cell is taken, do nothing 
        for (let i = cellRow; i < cellRow + item.width; i++){
            for (let j = cellCol; j < cellCol + item.height; j++){
                if (this.cells[i][j] != null){
                    console.log("no")
                    return false;
                }
            }
        }
        return true;
    }
    placeItem(item, cellRow, cellCol){
        for (let i = cellRow; i < cellRow + item.width; i++){
            for (let j = cellCol; j < cellCol + item.height; j++){
                for (let j = 0; j < item.height; j++){
                    // this.cells[cellRow + i][cellCol + j] = item.iconURL
                    this.cells[cellRow][cellCol]= item.iconURL;
                }
            }
        }
    }
    draw() {
        // for every row and col
        //   go through every cell, that is the top-left coordinate of an item and draw the image
        // for every row and col
        //   go through every cell, draw box <-- context.strokeRect
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                context.strokeRect(50 + i * 50, 200 + j * 50, 50, 50);
                if (this.cells[i][j] != null){
                    // const item = this.cells[i][j];
                    // console.log(item);
                    // context.drawImage(itemImage.item, 50 + i * 50, 200 + j * 50, 50 * item.width, 50 * item.height);
                    if (this.cells[i][j] == spear.iconURL){
                        context.drawImage(spearImage, 50 + i * 50, 200 + j * 50, 50 * spear.width, 50 * spear.height);
                    }
                    if (this.cells[i][j] == bow.iconURL){
                        context.drawImage(bowImage, 50 + i * 50, 200 + j * 50, 50 * bow.width, 50 * bow.height);
                    }
                    if (this.cells[i][j] == armor.iconURL){
                        context.drawImage(armorImage, 50 + i * 50, 200 + j * 50, 50 * armor.width, 50 * armor.height);
                    }
                }
            }
        }
    }
}
const inventory = new Inventory(5,3);
const spear = new InventoryItem(itemList.Spear.Width,itemList.Spear.Height,itemList.Spear.URL);
const bow = new InventoryItem(itemList.Bow.Width,itemList.Bow.Height,itemList.Bow.URL);
const armor = new InventoryItem(itemList.Armor.Width,itemList.Armor.Height,itemList.Armor.URL);
inventory.placeItem(bow,1,0);
inventory.placeItem(spear,0,0);
inventory.placeItem(armor,3,1);
console.log(inventory);


///State Machine Code
class State {
    constructor(onActivation, update, onDeactivation) {
        this.onActivation = onActivation;
        //...
    }
}
// When do we begin updating/executing the state machine? Which array do we keep it in?
// What's the starting state? How do we know where to begin?
class StateMachine {
    constructor() {
    }
    addState(stateName, onActivation, update, onDeactivation) {
    }
    update(deltaTime) {

    }
}
const sm = new StateMachine();
const onRunningActivation = () => {
    playerAnimated.playAnimation(AnimationNames.RunningBack);
    this.myVariable = 5;
};
const onRunningUpdate = (deltaTime) => {
    if (this.myVariable == 5) {
    // if (deltaTime ....)
        return PlayerStates.Ducking;
    }
};
const onRunningDeactivation = () => {};
sm.addState(PlayerStates.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
sm.addState(PlayerStates.Running,
    () => {
        playerAnimated.playAnimation(AnimationNames.RunningBack);
        this.myVariable = 5;
    },
    (deltaTime) => {
        if (this.myVariable == 5) {
        // if (deltaTime ....)
            return PlayerStates.Ducking;
        }
    },
    () => {}
);

// Next steps
// 1. Complete the inventory
//    - create the UI for the inventory
//    - create several items and have them affect the game (extra health, extra speed, whatever)
// 2. Complete the state machine
//    - extract the "state machine" from the PlayerCharacter class into an actual state machine
//    - create a state machine for a new type of obstacle
//    - create a state machine for sound management
//          - different sounds when the game begins and restarts, when you reach a certain high score
// 3. Decide on the creative theme - LOTR-based? Something else?
//    - let's pick some art
//    - turn at least 1 type of obstacle into an animated spritesheet

class PlayerCharacter {
    constructor(x, y, spritesheetURL, animationInfo, lane, state, width, height){
        this.x = x;
        this.y = y;
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheetURL;
        this.animationInfo = animationInfo;
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this.timeSinceLastFrame = 0;
        this.lane = lane;
        this.state = state;
        this.width = width;
        this.height = height;
    }
    playAnimation(name) {
        this.currentAnimation = this.animationInfo[name];
    }
    changeLane(){
        this.x = this.lane * LANE.WIDTH - LANE.WIDTH/2;
    }
    processInput(){ 
        const playerDirectionChange = -(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]) + (allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight])
        if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
            music.play()
            if (lastClick <= Date.now() - CLICK_DELAY && this.lane + playerDirectionChange <= LANE.COUNT && this.lane + playerDirectionChange >= 1){
                this.lane += playerDirectionChange;
                lastClick = Date.now();
                this.changeLane();
                changeStateToRun();
            }
        }
        if (this.state == PlayerStates.Running){
            if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown]) {
                changeState(PlayerStates.Ducking);
                this.playAnimation(AnimationNames.Ducking)
            }
            else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp]) {
                changeState(PlayerStates.Jumping);
                this.playAnimation(AnimationNames.Jumping);
            }
        }
    }
    update(deltaTime) {
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
    draw(){
        if (this.currentAnimation == null) {
            return;
        }
        const frameW = this.spritesheet.width / this.currentAnimation.frameCount;
        const frameH = this.spritesheet.height / this.animationInfo.animationCount;
        console.assert(frameW > 0);
        console.assert(frameH > 0);
        const frameSX = this.currentAnimationFrame * frameW;
        const frameSY = this.currentAnimation.rowIndex * frameH;
        console.assert(frameW >= 0);
        console.assert(frameH >= 0);

        context.drawImage(this.spritesheet,
            frameSX, frameSY, frameW, frameH,
            this.x - this.width / 2, this.y - this.height / 2, this.width, this.height
        );
    }
}

// Player Animation
const playerAnimated = new PlayerCharacter(canvas.width/2, canvas.width/3, "hero.webp", playerAnimationInfo, 2, PlayerStates.Running, PLAYER_SIZE.WIDTH, PLAYER_SIZE.HEIGHT);
playerAnimated.playAnimation(AnimationNames.RunningBack);

//Start Loop
requestAnimationFrame(runFrame)

// Main processing loop 
function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // process input
    playerAnimated.processInput();
    // update state
    update(deltaTime);
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
}

function update(deltaTime){
    score += SCORE_SPEED;
    checkSpawn();
    loop(deltaTime);
    spawnDelay -= SPAWN_INCREMENT;
    fallSpeed += FALL_INCREMENT;
}


function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let object of objects){
        object.draw();
    }

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("SCORE: " + score, SCORE.x, SCORE.y);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + highScore, HIGH_SCORE.x, HIGH_SCORE.y);

    context.drawImage(image,200,50,50,50);
    playerAnimated.draw();

    inventory.draw();
}

// These functions calculate a certain value
function isDodging(obstacle){
    return obstacle.requiredState == playerAnimated.state;
}
function calculateLaneLocation(lane){
    return lane * LANE.WIDTH - LANE.WIDTH/2;
}
function pickLane(){
    return Math.floor(Math.random() * LANE.COUNT) + OFFSET;
}

// These functions carry out a certain action
function generateObstacle(){
    type = Math.floor(Math.random() * LANE.COUNT);
    objects.push(
        new Rects(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION , OBJECT.WIDTH, OBJECT.HEIGHT, Object.keys(obstacleColors)[type], obstacleType[type], fallSpeed)
    )
}
function generateCoin(){
    objects.push(
        new Circles(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION , COIN_RADIUS, "yellow", fallSpeed)
    )
}
function changeState(state){
    playerAnimated.state = state;
    setTimeout(changeStateToRun, STATE_DURATION);
}
function changeStateToRun(){
    playerAnimated.state = PlayerStates.Running;
    playerAnimated.playAnimation(AnimationNames.RunningBack);
}
function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType = Object.keys(spawnType)[Math.round(Math.random())];
        if (generateType == spawnType.generateObstacle){
            generateObstacle()
        }
        else if (generateType == spawnType.generateCoin){
            generateCoin();
        }
        lastSpawn = Date.now();
    }
}
function resetGame(){
    objects.splice(0);
    playerAnimated.lane = 2;
    playerAnimated.changeLane();
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_SPEED;
}

function loop(deltaTime){
    for (let i = 0; i < objects.length; i++){
        objects[i].speed = fallSpeed;
        objects[i].move(deltaTime);
        if (objects[i].y >= canvas.height + OBJECT.HEIGHT/2){
            objects.splice(i,1);
            continue;
        }
        if (objects[i].constructor == Circles){
            if (objects[i].isColliding(playerAnimated)){
                objects.splice(i,1);
                score += COIN_VALUE;
            }
        }
        else if (objects[i].constructor == Rects){
            if (objects[i].isColliding(playerAnimated) && !objects[i].isDodging(playerAnimated)){
                resetGame()
                if (score > highScore){
                    highScore = score;
                }
                score = 0;
            }
        }
    }
    playerAnimated.update(deltaTime);
}
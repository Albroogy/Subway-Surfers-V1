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
        object.draw()
    }

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("SCORE: " + score, SCORE.x, SCORE.y);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + highScore, HIGH_SCORE.x, HIGH_SCORE.y);

    context.drawImage(image,200,50,50,50);
    playerAnimated.draw();

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
        if (objects[i].y >= canvas.height){
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
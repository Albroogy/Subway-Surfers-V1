// Constant variables
const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const STATE_DURATION = 1000;
const SCORE_SPEED = 1;
const COIN_VALUE = 300;
const CLICK_DELAY = 300; //This is in milliseconds
const SPAWN_INCREMENT = 0.4;
const FALL_INCREMENT = 0.05;
const COIN_RADIUS = 25;
const OFFSET = 1;

const image = new Image();
image.src = 'coin_01.png';

//Dictionaries
const PlayerStates = {
    Running: "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "jumping",
    Ducking: "ducking"
};
const obstacleColors = {
    Orange: "orange",
    Brown: "brown",
    Black: "black"
}
const spawnType = {
    generateObstacle: "generateObstacle",
    generateCoin: "generateCoin",
}
const playerStateToColorMap = {
    [PlayerStates.Running]: "blue",
    [PlayerStates.Jumping]: "navy",
    [PlayerStates.Ducking]: "teal"
};
const HIGH_SCORE = {
    x: 50,
    y: 50
}
const SCORE = {
    x: 50,
    y: 100
}
const OBSTACLE = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}
const LANE = {
    WIDTH: canvas.width/3,
    COUNT: 3
}
const obstacleType = [PlayerStates.Ducking, PlayerStates.Jumping,"Invincible"]

// Changeble variables
let lastTime = Date.now();
let lastClick = Date.now();
let lastSpawn = Date.now();
let spawnDelay = 1000; //This is in milliseconds
let score = 0;
let highScore = 0;
let fallSpeed = 150;

// Key detection
const allPressedKeys = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});

// Classes
// class Objects{
//     calculateMove(deltaTime){
//         return this.speed * deltaTime / 1000;
//     }
// }

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
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    isColliding(player){
        return (
            this.x <= player.x + player.width &&
            this.x + this.width >= player.x &&
            this.y + this.height >= player.y &&
            this.y <= player.y + player.height
        )
    }
    isDodging(player){
        return this.requiredState == player.state;
    }
    move(deltaTime){
        this.x += this.speed * deltaTime / 1000;
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
            this.x - this.radius <= player.x + player.width &&
            this.x + this.radius >= player.x &&
            this.y + this.radius >= player.y &&
            this.y - this.radius <= player.y + player.height
        )
    }
    move(deltaTime){
        this.x += this.speed * deltaTime / 1000;
    }
}

// Arrays and Dictionaries 
const objects = []
const rects = []
const coins = []
const player = {
    x: canvas.width/2 -25,
    y: canvas.width/3,
    width: 50,
    height: 50,
    color: "blue",
    lane: 2,
    state: PlayerStates.Running
};
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

requestAnimationFrame(runFrame)

// Main processing loop 
function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // process input
    processInput();
    // update state
    update(deltaTime);
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
}
function processInput(){ 
    const playerDirectionChange = -(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]) + (allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight])
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
        if (lastClick <= Date.now() - CLICK_DELAY && player.lane + playerDirectionChange <= LANE.COUNT && player.lane + playerDirectionChange >= 1){
            player.lane += playerDirectionChange
            lastClick = Date.now();
            player.x = calculateLaneLocation(player.lane, player.width);
            changeStateToRun();
        }
    }
    if (player.state == PlayerStates.Running){
        if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown]) {
            changeState(PlayerStates.Ducking);
        }
        else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp]) {
            changeState(PlayerStates.Jumping);
        }
    }
}
function update(deltaTime){
    score += SCORE_SPEED;
    checkSpawn();
    loop(rects,deltaTime);
    loop(coins,deltaTime);
    player.color = playerStateToColorMap[player.state]
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

    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("SCORE: " + score, SCORE.x, SCORE.y);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + highScore, HIGH_SCORE.x, HIGH_SCORE.y);

    context.drawImage(image,200,50,50,50);

}

// These functions calculate a certain value
function isDodging(obstacle,player){
    return obstacle.requiredState == player.state;
}
function calculateLaneLocation(lane,width){
    return lane * LANE.WIDTH - LANE.WIDTH/2 - width/2;
}
function calculateMove(speed, deltaTime){
    return speed * deltaTime / 1000;
}
function pickLane(){
    return Math.floor(Math.random() * LANE.COUNT) + OFFSET;
}

// These functions carry out a certain action
function generateObstacle(){
    type = Math.floor(Math.random() * LANE.COUNT);
    objects.push(
        new Rects(calculateLaneLocation(pickLane(),OBSTACLE.WIDTH), OBSTACLE.SPAWN_LOCATION , OBSTACLE.WIDTH, OBSTACLE.HEIGHT, Object.keys(obstacleColors)[type], obstacleType[type], fallSpeed)
    )
}
function generateCoin(){
    objects.push(
        new Circles(calculateLaneLocation(pickLane(),0), OBSTACLE.SPAWN_LOCATION , COIN_RADIUS, "yellow", fallSpeed)
    )
}
function changeState(state){
    player.state = state;
    setTimeout(changeStateToRun, STATE_DURATION);
}
function changeStateToRun(){
    player.state = PlayerStates.Running;
}
function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType = Object.keys(spawnType)[Math.round(Math.random())];
        if (generateType == "generateObstacle"){
            generateObstacle()
        }
        else if (generateType == "generateCoin"){
            generateCoin();
        }
        lastSpawn = Date.now();
    }
}
function resetGame(){
    rects.splice(0);
    coins.splice(0);
    player.lane = 2;
    player.x = calculateLaneLocation(player.lane, player.width);
    spawnDelay = 1000;
    fallSpeed = 150;
}
// function loop(type,deltaTime){
//     for (let i = 0; i < type.length; i++){
//         type[i].speed = fallSpeed;
//         type[i].y += type[i].calculateMove(deltaTime)
//         if (type[i].y >= canvas.height){
//             type.splice(i,1);
//             continue;
//         }
//         if (type == coins){
//             if (type[i].isColliding(player)){
//                 coins.splice(i,1);
//                 score += COIN_VALUE;
//             }
//         }
//         else if (type == rects){
//             if (type[i].isColliding(player) && !type[i].isDodging(player)){
//                 resetGame()
//                 if (score > highScore){
//                     highScore = score;
//                 }
//                 score = 0;
//             }
//         }
//     }
// }

function loop(deltaTime){
    for (let object in objects){
        console.log(object.constructor)
        object.speed = fallSpeed;
        object.move(deltaTime)
        if (object.y >= canvas.height){
            type.splice(i,1);
            continue;
        }
        if (object.constructor == Circles){
            if (object.isColliding(player)){
                coins.splice(i,1);
                score += COIN_VALUE;
            }
        }
        else if (object.constructor == Rects){
            if (object.isColliding(player) && !object.isDodging(player)){
                resetGame()
                if (score > highScore){
                    highScore = score;
                }
                score = 0;
            }
        }
    }
}

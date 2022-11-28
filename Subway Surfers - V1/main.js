// Constant variables
const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const stateDuration = 1000;
const LANE_WIDTH = canvas.width/3;
const LANE_COUNT = 3;
const SCORE_SPEED = 1;
const COIN_VALUE = 300;
const clickDelay = 300; //This is in milliseconds

const image = new Image();
image.src = 'coin_01.png';

//Dictionaries
const PlayerStates = {
    Running: "Running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "Jumping",
    Ducking: "Ducking",
};
const obstacleColor = {
    Yellow: "yellow",
    Brown: "brown",
    Black: "black"
}
const spawnType = {
    generateObstacle: "generateObstacle",
    generateCoin: "generateCoin",
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
        context.arc(this.x, this.y, this.radius,0, 2*Math.PI, false);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
}

// Arrays and Dictionaries 
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
        if (lastClick <= Date.now() - clickDelay && player.lane + playerDirectionChange <= 3 && player.lane + playerDirectionChange >= 1){
            player.lane += playerDirectionChange
            console.log(player.lane)
            lastClick = Date.now();
            player.x = laneLocation(player.lane, player.width);
            runState();
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
    if (player.state == PlayerStates.Running){
        player.color = "blue";
    }
    else if (player.state == PlayerStates.Jumping){
        player.color = "navy";
    }
    else if (player.state == PlayerStates.Ducking){
        player.color = "teal";
    }
    spawnDelay -= 0.02;
    fallSpeed -= 0.01;
}

function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let rect of rects){
        rect.draw();
    }
    for (let coin of coins){
        coin.draw();
    }

    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("SCORE: " + score, 50, 100);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + highScore, 50, 50);

    context.drawImage(image,200,50,50,50);

}

// These functions calculate a certain value
function isColliding(obstacle, player){
    return (
        obstacle.x <= player.x + player.width &&
        obstacle.x + obstacle.width >= player.x &&
        obstacle.y + obstacle.height >= player.y &&
        obstacle.y <= player.y + player.height
    )
}
function isCoinColliding(coin, player){
    return (
        coin.x - coin.radius <= player.x + player.width &&
        coin.x + coin.radius >= player.x &&
        coin.y + coin.radius >= player.y &&
        coin.y - coin.radius <= player.y + player.height
    )
}
function isDodging(obstacle,player){
    return obstacle.requiredState == player.state;
}
function laneLocation(lane,width){
    return lane * LANE_WIDTH - LANE_WIDTH/2 - width/2;
}
function move(speed, deltaTime){
    return speed * deltaTime / 1000;
}
function obstacleLane(){
    return Math.floor(Math.random() * LANE_COUNT) + 1;
}

// These functions carry out a certain action
function generateObstacle(){
    type = Math.floor(Math.random() * LANE_COUNT);
    rects.push(
        new Rects(laneLocation(obstacleLane(),50), -50, 50, 50, Object.keys(obstacleColor)[type], obstacleType[type], fallSpeed)
    )
}
function generateCoin(){
    coins.push(
        new Circles(laneLocation(obstacleLane(),0), -50, 25, "yellow", fallSpeed)
    )
}
function changeState(state){
    player.state = state;
    setTimeout(runState, stateDuration);
}
function runState(){
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
    player.x = laneLocation(player.lane, player.width);
    spawnDelay = 1000;
    fallSpeed = 150;
}
function loop(type,deltaTime){
    for (let i = 0; i < type.length; i++){
        type[i].y += move(type[i].speed, deltaTime)
        if (type[i].y >= canvas.height){
            type.splice(i,1);
            continue;
        }
        if (type == coins){
            if (isCoinColliding(coins[i],player)){
                coins.splice(i,1);
                score += COIN_VALUE;
            }
        }
        else if (type == rects){
            if (isColliding(rects[i],player) && !isDodging(rects[i],player)){
                resetGame()
                if (score > highScore){
                    highScore = score;
                }
                score = 0;
            }
        }
    }
}

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
    SpaceBar: 32,
    Escape: 27
};

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
const JUMP_TIME = 800;
const DUCK_TIME = 600;
const COOLDOWN = 100;

const image = new Image();
image.src = 'coin_01.png';
const music = new Audio('Game_Song.mp3')

const Weapons = {
    Spear: "player.png",
    Bow: "playerBow.png"
}
const StartingItems = {
    Armor: "Leather_leather",
    Bow: null,
    Spear: "Thrust_spear_2",
    Boots: null
}
const playerImage = `https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/#?body=Body_color_zombie_green&head=Goblin_zombie_green&wrinkes=Wrinkles_zombie_green&beard=Beard_brown&hair=Bangslong_raven&shoulders=Legion_steel&arms=Armour_iron&chainmail=Chainmail_gray&legs=Armour_steel&weapon=${StartingItems.Spear}&quiver=Quiver_quiver&ammo=Ammo_arrow&armour=${StartingItems.Armor}`
console.log(playerImage)

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

const ItemList = {
    Spear: {
        Width: 2, 
        Height: 1,
        URL: spearImage.src,
        Image: spearImage
    },
    Bow: {
        Width: 1,
        Height: 2,
        URL: bowImage.src,
        Image: bowImage
    },
    Armor: {
        Width: 2,
        Height: 2,
        URL: armorImage.src,
        Image: armorImage
    },
    Boots: {
        Width: 1,
        Height: 1,
        URL: bootsImage.src,
        Image: bootsImage
    }
}

// Player Information
const PlayerStates = {
    Running: "running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "jumping",
    Ducking: "ducking",
    Roll: "roll",
    Dying: "dying"
};
const PLAYER = {
    WIDTH: 100,
    HEIGHT: 100,
}
// Game States Information
const GameStates = {
    Playing: "playing",
    InventoryMenu: "equippedInventoryMenu"
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
    Dragon: "dragon"
}
const LANE = {
    WIDTH: canvas.width/3,
    COUNT: 3
}
const ARROW = {
    WIDTH: 7.5,
    HEIGHT: 45
}
const ITEM = {
    WIDTH: 50,
    HEIGHT: 50
}
const LIVES = {
    x: 50,
    y: 150
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
let timeStart = Date.now();
let spawnDelay = ORIGINAL_SPAWN_DELAY; //This is in milliseconds
let score = 0;
let highScore = 0;
let fallSpeed = ORIGINAL_SPEED;
let gameState = GameStates.Playing;

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
            this.x - this.width/2 <= player.x + playerAnimated.width/2 &&
            this.x + this.width/2 >= player.x - playerAnimated.width/2 &&
            this.y + this.height/2 >= player.y - calculatePlayerStateHeight()&&
            this.y - this.height/2 <= player.y + playerAnimated.height/2
        )
    }
    isDodging(playerAnimated){
        return this.requiredState == playerAnimated.state;
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
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
    isColliding(player){
        return (
            this.x - this.radius <= player.x + playerAnimated.width/2 &&
            this.x + this.radius >= player.x - playerAnimated.width/2 &&
            this.y + this.radius >= player.y - calculatePlayerStateHeight()&&
            this.y - this.radius <= player.y + playerAnimated.height/2
        )
    }
    move(deltaTime){
        this.y += this.speed * deltaTime / 1000;
    }
}

class Arrow {
    constructor(x, y, imageUrl, width, height, speed){
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageUrl;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
    draw(){
        context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    move(deltaTime){
        this.y -= this.speed * deltaTime / 1000;
    }
    isColliding(object){
        return (
            this.x - this.width/2 <= object.x + object.width/2 &&
            this.x + this.width/2 >= object.x - object.width/2 &&
            this.y + this.height/2 >= object.y - object.height/2 &&
            this.y - this.height/2 <= object.y + object.height/2
        )
    }
}
// class Image {
//     constructor(x, y, spritesheetURL, width, height){
//         this.x = x;
//         this.y = y;
//         this.spritesheet = new Image();
//         this.spritesheet.src = spritesheetURL;
//         this.width = width;
//         this.height = height;
//     }
// }
// class StillImage extends Image {
//     draw(){
//         context.drawImage(this.spritesheet,this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//     }
// }

class AnimatedObject {
    constructor(x, y, width, height, spritesheetURL, animationInfo){
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
    playAnimation(name) {
        this.currentAnimation = this.animationInfo[name];
    }
    animationUpdate(deltaTime){
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
    update(deltaTime) {
        this.animationUpdate(deltaTime);
    }
    draw(){
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
        console.assert(frameW >= 0);
        console.assert(frameH >= 0);
        context.drawImage(this.spritesheet,
            frameSX, frameSY, frameW, frameH,
            this.x - this.width / 2, this.y - this.height / 2, this.width, this.height
        );
    }
}
class DragonEnemy extends AnimatedObject{
    constructor(x, y, width, height, spritesheetURL, animationInfo, speed){
        super(x, y, width, height, spritesheetURL, animationInfo);
        this.speed = speed;
        this.currentAnimation = this.animationInfo[DragonAnimationNames.Flying];
    }
    move(deltaTime){
        this.y += this.speed * deltaTime / 1000;
    }
}
// Dragon Animation Info
const DragonAnimationNames = {
    Flying: "flying",
}

const DragonAnimationInfo = {
    animationCount: 4, 
    [DragonAnimationNames.Flying]: {
        rowIndex: 0,
        frameCount: 4,
        framesPerSecond: 8
    }
};

class PlayerCharacter extends AnimatedObject{
    constructor(x, y, spritesheetURL, animationInfo, lane, state, width, height, startingItems, startingStats, weapons){
        super(x, y, width, height, spritesheetURL, animationInfo);
        this.equippedItems = startingItems;
        this.Stats = startingStats;
        this.weapon = null;
        this.weapons = weapons;
        this.directionChange = null;
        this.attacking = false;
        this.lane = lane;
        this.state = state;
        this.PREPARE_SPEAR_FRAMES = 4;
    }
    changeLane(){
        this.x = this.lane * LANE.WIDTH - LANE.WIDTH/2;
    }
    statsUpdate(){
        if (this.equippedItems.Armor == ItemList.Armor){
            this.Stats.Lives = 2;
        }
        if (this.equippedItems.Boots == ItemList.Boots){
            this.Stats.RollSpeed = 600;
        }
        if (this.equippedItems.Bow == ItemList.Bow){
            this.weapon = this.weapons.Bow;
            this.animationInfo = playerBowAnimationInfo;
        }
        if (this.equippedItems.Spear == ItemList.Spear){
            this.weapon = this.weapons.Spear;
            this.animationInfo = playerSpearAnimationInfo;
        }
        console.log(this.weapon);
        playerAnimated.spritesheet.src = this.weapon;
    }
    draw(){
        if (this.currentAnimation == null) {
            return;
        }
        // const frameW = this.spritesheet.width / this.currentAnimation.frameCount;
        const frameW = this.spritesheet.width / 13;
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
// Player Animation Information
const AnimationNames = {
    RunningBack: "runningBack",
    Jumping: "jumping",
    Ducking: "ducking",
    RollingLeft: "rollingLeft",
    RollingRight: "rollingRight",
    Dying: "dying"
}
const playerSpearAnimationInfo = {
    animationCount: 21, 
    [AnimationNames.RunningBack]: {
        rowIndex: 8,
        frameCount: 8,
        framesPerSecond: 8
    },
    [AnimationNames.Jumping]: {
        rowIndex: 0,
        frameCount: 7,
        framesPerSecond: 7
    },
    [AnimationNames.Ducking]: {
        rowIndex: 4,
        frameCount: 7,
        framesPerSecond: 7
    },
    [AnimationNames.RollingLeft]: {
        rowIndex: 9,
        frameCount: 9,
        framesPerSecond: 9
    },
    [AnimationNames.RollingRight]: {
        rowIndex: 11,
        frameCount: 9,
        framesPerSecond: 9
    },
    [AnimationNames.Dying]: {
        rowIndex: 20,
        frameCount: 6,
        framesPerSecond: 6
    }
};
const playerBowAnimationInfo = {
    animationCount: 21, 
    [AnimationNames.RunningBack]: {
        rowIndex: 8,
        frameCount: 8,
        framesPerSecond: 8
    },
    [AnimationNames.Jumping]: {
        rowIndex: 0,
        frameCount: 7,
        framesPerSecond: 7
    },
    [AnimationNames.Ducking]: {
        rowIndex: 16,
        frameCount: 13,
        framesPerSecond: 13
    },
    [AnimationNames.RollingLeft]: {
        rowIndex: 9,
        frameCount: 9,
        framesPerSecond: 9
    },
    [AnimationNames.RollingRight]: {
        rowIndex: 11,
        frameCount: 9,
        framesPerSecond: 9
    },
    [AnimationNames.Dying]: {
        rowIndex: 20,
        frameCount: 6,
        framesPerSecond: 6
    }
};

// Player Animation
const playerAnimated = new PlayerCharacter(canvas.width/2, canvas.width/3, playerImage, playerSpearAnimationInfo, 2, PlayerStates.Running, PLAYER.WIDTH, PLAYER.HEIGHT, StartingItems, StartingStats, Weapons);
playerAnimated.playAnimation(AnimationNames.RunningBack);

// Inventory
class InventoryItem {
    constructor(width, height, iconURL, image) {
        this.width = width;
        this.height = height;
        this.iconURL = iconURL;
        this.image = image
    }
}
class Inventory {
    constructor(width, height, x, y) {
        this.cells = [];
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
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
                    return false;
                }
            }
        }
        return true;
    }
    placeItem(item, cellRow, cellCol){
        if (this.placeItemCheck(item, cellRow, cellCol)){
            for (let i = 0; i < item.width; i++){
                for (let j = 0; j < item.height; j++){
                    this.cells[cellRow + parseInt(i)][cellCol + parseInt(j)] = item.URL;
                    this.cells[cellRow][cellCol] = item;
                    if (item.iconURL == ItemList.Armor.URL){
                        playerAnimated.equippedItems.Armor = ItemList.Armor;
                    }
                    if (item.iconURL == ItemList.Boots.URL){
                        playerAnimated.equippedItems.Boots = ItemList.Boots;
                    }
                    if (item.iconURL == ItemList.Spear.URL){
                        playerAnimated.equippedItems.Spear = ItemList.Spear;
                    }
                    if (item.iconURL == ItemList.Bow.URL){
                        playerAnimated.equippedItems.Bow = ItemList.Bow;
                    }
                    playerAnimated.statsUpdate();
                }
            }
        }
    }
    removeItem(item, cellRow, cellCol){
        for (let i = 0; i < item.width; i++){
            for (let j = 0; j < item.height; j++){
                this.cells[cellRow + parseInt(i)][cellCol + parseInt(j)] = null;
                playerAnimated.statsUpdate();
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
                context.strokeRect(this.x + i * ITEM.WIDTH, this.y + j * ITEM.HEIGHT, ITEM.WIDTH, ITEM.HEIGHT);
                if (this.cells[i][j] != null){
                    context.drawImage(this.cells[i][j].image, this.x + i * ITEM.WIDTH, this.y + j * ITEM.HEIGHT, ITEM.WIDTH * this.cells[i][j].width, ITEM.HEIGHT * this.cells[i][j].height)
                }
            }
        }
    }
    resetInventory(){
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = null;
            }
        }
    }
}


const equippedInventory = new Inventory(5, 3, 50, 200);
const itemsFound = new Inventory(10, 5, canvas.width/2, 0);
const spear = new InventoryItem(ItemList.Spear.Width,ItemList.Spear.Height,ItemList.Spear.URL, ItemList.Spear.Image);
const bow = new InventoryItem(ItemList.Bow.Width,ItemList.Bow.Height,ItemList.Bow.URL, ItemList.Bow.Image);
const armor = new InventoryItem(ItemList.Armor.Width,ItemList.Armor.Height,ItemList.Armor.URL, ItemList.Armor.Image);
const boots = new InventoryItem(ItemList.Boots.Width,ItemList.Boots.Height,ItemList.Boots.URL, ItemList.Boots.Image);
equippedInventory.placeItem(bow, 1, 0);
// equippedInventory.placeItem(spear, 0, 0);
equippedInventory.placeItem(armor, 2, 0);
equippedInventory.placeItem(boots, 0, 0);
console.log(equippedInventory);


///State Machine Code
class State {
    constructor(onActivation, update, onDeactivation) {
        this.onActivation = onActivation;
        this.update = update;
        this.onDeactivation = onDeactivation;
    }
}
// When do we begin updating/executing the state machine? Which array do we keep it in?
// What's the starting state? How do we know where to begin?
class StateMachine {
    constructor() {
        this.states = {};
        this.activeState = null;
    }
    addState(stateName, onActivation, update, onDeactivation) {
        this.states[stateName] = new State(onActivation, update, onDeactivation);
    }
    update(deltaTime) {
        if (this.activeState){
            const nextState = this.activeState.update(deltaTime);
            if (nextState){
                this.activeState.onDeactivation();
                this.activeState = this.states[nextState];
                this.activeState.onActivation();
                playerAnimated.currentAnimationFrame = 0;
            }
        }
    }
}
const playerSM = new StateMachine();
const dragonSM = new StateMachine();
const gameSM = new StateMachine();

//Adding the states

const onRunningActivation = () => {
    playerAnimated.playAnimation(AnimationNames.RunningBack);
    playerAnimated.state = PlayerStates.Running;
};
const onRunningUpdate = () => {
    playerAnimated.directionChange = -(allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]) + (allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]);
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft] || allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]){
        if (lastClick <= Date.now() - CLICK_DELAY && playerAnimated.lane + playerAnimated.directionChange <= LANE.COUNT && playerAnimated.lane + playerAnimated.directionChange >= 1){
            if (playerAnimated.directionChange != 0){
                playerAnimated.lane += playerAnimated.directionChange;
                lastClick = Date.now();
                return PlayerStates.Roll;
            }

        }
    }
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(COOLDOWN)) {
        return PlayerStates.Ducking;
    }
    else if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp] && checkTime(COOLDOWN)) {
        return PlayerStates.Jumping;
    }
    if (playerAnimated.Stats.Lives <= 0){
        return PlayerStates.Dying;
        // Game mechanic: As long as you keep on moving, you will never die, no matter your lives count.
    }
};
const onRunningDeactivation = () => {
};

const onJumpingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Jumping);
    playerAnimated.state = PlayerStates.Jumping;
}
const onJumpingUpdate = () => {
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount - OFFSET){
        return PlayerStates.Running;
    }
}
const onJumpingDeactivation = () => {
}

const onDuckingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Ducking);
    playerAnimated.state = PlayerStates.Ducking;
}
const onDuckingUpdate = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Spear){
        if (playerAnimated.currentAnimationFrame >= playerAnimated.PREPARE_SPEAR_FRAMES - OFFSET){
            playerAnimated.attacking = true;
        }
    }
    // if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount){
    //     objects.push(
    //         new Arrow(playerAnimated.x, playerAnimated.y, "arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ORIGINAL_SPEED)
    //     );
    // }
    // Why does this code not work?
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount - OFFSET){
        return PlayerStates.Running;
    }
}
const onDuckingDeactivation = () => {
    if (playerAnimated.weapon == playerAnimated.weapons.Bow){
        objects.push(
            new Arrow(playerAnimated.x, playerAnimated.y, "arrow.png", ARROW.WIDTH, ARROW.HEIGHT, ORIGINAL_SPEED)
        );
    }
    //Figure out a way to put this 1 frame before the animation ends to make it seems less akward
    if (playerAnimated.attacking != false){
        playerAnimated.attacking = false;
    }
}

const onRollActivation = () => {
    if (playerAnimated.directionChange >= 1){
        playerAnimated.playAnimation(AnimationNames.RollingRight);  
    }
    else{
        playerAnimated.playAnimation(AnimationNames.RollingLeft);  
    }
}
const onRollUpdate = (deltaTime) => {
    if (playerAnimated.directionChange >= 1){
        if (playerAnimated.x > playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2){
            playerAnimated.x = playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerStates.Running;
        }
    }
    else if (playerAnimated.directionChange <= -1){
        if (playerAnimated.x < playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2){
            playerAnimated.x = playerAnimated.lane * LANE.WIDTH - LANE.WIDTH/2;
            return PlayerStates.Running;
        }
    }
    playerAnimated.x += playerAnimated.Stats.RollSpeed * deltaTime/1000 * playerAnimated.directionChange;
}
const onRollDeactivation = () => {
}
const onDyingActivation = () => {
    playerAnimated.playAnimation(AnimationNames.Dying);
}
const onDyingUpdate = () => {
    if (playerAnimated.currentAnimationFrame >= playerAnimated.currentAnimation.frameCount - OFFSET){
        sleep(1000);
        return PlayerStates.Running; 
    }
}
const onDyingDeactivation = () => {
    resetGame();
}
const onPlayingActivation = () => {
    gameState = GameStates.Playing;
    console.log(GameStates.Playing);
}
const onPlayingUpdate = () => {
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
    function mouseClicked(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        console.log(`${e.clientX} ${e.clientY}`);
        if (equippedInventory.isColliding(e.clientX, e.clientY)){
            
        }
    }
    console.log(GameStates.InventoryMenu);
}
const onInventoryMenuUpdate = () => {
    if (allPressedKeys[KEYS.Escape]){
        return GameStates.Playing;
    }
}
const onInventoryMenuDeactivation = () => {
    // remove mouse clicked listener to save computer computing power
}

const onFlyingActivation = () => {
    for (object in objects){
        if (object.constructor == DragonEnemy){
            
        }
    }
}
const onFlyingUpdate = () => {

}
const onFlyingDeactivation = () => {
}

// Setting up state machines

playerSM.addState(PlayerStates.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
playerSM.addState(PlayerStates.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
playerSM.addState(PlayerStates.Ducking, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation);
playerSM.addState(PlayerStates.Roll, onRollActivation, onRollUpdate, onRollDeactivation);
playerSM.addState(PlayerStates.Dying, onDyingActivation, onDyingUpdate, onDyingDeactivation);

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
// Tasks:
// 1. Figure out how to add changeLane state to player. /

//Start Loop
requestAnimationFrame(runFrame)

// Main processing loop 
function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // process input
    // playerAnimated.processInput();
    // update state
    if (gameState == GameStates.Playing){
        update(deltaTime);        
    }
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
    gameSM.update(deltaTime);
}

function update(deltaTime){
    score += SCORE_SPEED;
    checkSpawn();
    loop(deltaTime);
    playerAnimated.update(deltaTime);
    spawnDelay -= SPAWN_INCREMENT;
    fallSpeed += FALL_INCREMENT;
    playerSM.update(deltaTime);
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
        if (playerAnimated.Stats.Lives > 0){
            context.font = "20px Arial";
            context.fillText(`LIVES: ${playerAnimated.Stats.Lives}`, LIVES.x, LIVES.y);
        }
        else{
            context.fillStyle = "red";
            context.font = "20px Arial";
            context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE)", LIVES.x, LIVES.y);
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

function calculateLaneLocation(lane){
    return lane * LANE.WIDTH - LANE.WIDTH/2;
}
function pickLane(){
    return Math.floor(Math.random() * LANE.COUNT) + OFFSET;
}
function checkTime(stateLength){
    return timeStart <= Date.now() - stateLength;
}
function sleep(time) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < time);
  }

// These functions carry out a certain action
function calculatePlayerStateHeight(){
    if (playerAnimated.attacking == true){
        return playerAnimated.height/2;
    }
    return 0;
}
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

function generateDragon(){
    objects.push(
        new DragonEnemy(calculateLaneLocation(pickLane()), OBJECT.SPAWN_LOCATION, 100, 100, "dragon.png", DragonAnimationInfo, fallSpeed)
    )
}
generateDragon();
function checkSpawn(){
    if (lastSpawn <= Date.now() - spawnDelay){
        let generateType = Object.keys(spawnType)[Math.floor(Math.random() * 2)];
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
    playerAnimated.Stats = StartingStats;
    equippedInventory.resetInventory();
    // equippedInventory.placeItem(bow,1,0);
    equippedInventory.placeItem(armor,2,0);
    equippedInventory.placeItem(boots,4,0);
    equippedInventory.placeItem(spear,0,0);
    spawnDelay = ORIGINAL_SPAWN_DELAY;
    fallSpeed = ORIGINAL_SPEED;
    if (score > highScore){
        highScore = score;
    }
    score = 0;
}
function destroyCollidingObjects(object1, object2){
    objects.splice(object1,1);
    objects.splice(object2,1);
}

function loop(deltaTime){
    for (let i = 0; i < objects.length; i++){
        objects[i].move(deltaTime);
        objects[i].speed = fallSpeed;
        if (objects[i].constructor == DragonEnemy){
            objects[i].update(deltaTime);
        }
        if (objects[i].constructor == Arrow){
            if (objects[i].y <= -objects[i].height){
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].y >= canvas.height + objects[i].height/2){
            objects.splice(i,1);
            continue;
        }
        if (objects[i].constructor == Circles){
            if (objects[i].isColliding(playerAnimated)){
                score += COIN_VALUE;
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].constructor == Rects){
            if (objects[i].isColliding(playerAnimated) && !objects[i].isDodging(playerAnimated)){
                if (playerAnimated.attacking != true){
                    playerAnimated.Stats.Lives -= 1;
                }
                objects.splice(i,1);
                continue;
            }
        }
        else if (objects[i].constructor == Arrow){
            const currentObject1 = objects[i];
            for (let j = 0; j < objects.length; j++){
                //There's a bug sometimes when firing arrows. SOLVED
                // Apparently in javascript, the coding language doesn't wait for the loop to finish running before going on to the next object. 
                // In order to solve this, I just defined a constant after the loops start to ensure the value stays the same.
                // I don't know why the value of i becomes undefined though as the loop continues... Can you explain this to me?
                if (objects[j].constructor == Rects){
                    const currentObject2 = objects[j];
                    console.assert(currentObject1);
                    console.assert(currentObject2);
                    if (currentObject1.isColliding(currentObject2)){
                        destroyCollidingObjects(objects.indexOf(currentObject1), objects.indexOf(currentObject2));
                    }
                continue;
                // For effiency's sake, should I split the objects array into 3 lane arrays? 
                // This way for collisions I will only need to check the objects that are on the same lane.
                }
            }
        }
    }
}
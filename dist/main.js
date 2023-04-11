System.register("entityComponent", [], function (exports_1, context_1) {
    "use strict";
    var Component, Entity;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Component = class Component {
                static COMPONENT_ID = "Component";
                _entity = null;
                attachToEntity(entity) {
                    this._entity = entity;
                    this.onAttached();
                }
                onAttached() {
                }
                update(deltaTime, gameSpeed) {
                }
                draw() {
                }
            };
            exports_1("Component", Component);
            Entity = class Entity {
                _name = "";
                _components = {};
                constructor(name = "") {
                    this._name = name;
                }
                get name() {
                    return this._name;
                }
                addComponent(componentId, component) {
                    this._components[componentId] = component;
                    component.attachToEntity(this);
                    console.log(componentId);
                }
                getComponent(componentId) {
                    return this._components[componentId];
                }
                update(deltaTime, gameSpeed) {
                    for (const key in this._components) {
                        this._components[key].update(deltaTime, gameSpeed);
                    }
                }
                draw() {
                    for (const key in this._components) {
                        this._components[key].draw();
                    }
                }
                print() {
                    console.log(`Entity ${this._name} with components: ${this._components}`);
                }
            };
            exports_1("Entity", Entity);
        }
    };
});
System.register("global", [], function (exports_2, context_2) {
    "use strict";
    var allPressedKeys, KEYS, mouseDown, mouse, canvas, context, OFFSET, IN_GAME_SECOND, IN_GAME_MINUTE, LANE, EntityName, Tag, timeStart;
    var __moduleName = context_2 && context_2.id;
    function checkTime(stateLength, timeStart) {
        return timeStart <= Date.now() - stateLength;
    }
    exports_2("checkTime", checkTime);
    function sleep(time) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < time);
    }
    exports_2("sleep", sleep);
    function calculatePlayerStateHeight(player) {
        if (player.attacking == true) {
            return player.height / 2;
        }
        return 0;
    }
    exports_2("calculatePlayerStateHeight", calculatePlayerStateHeight);
    function findLane(xCoordinate) {
        return (xCoordinate + LANE.WIDTH / 2) / LANE.WIDTH;
    }
    exports_2("findLane", findLane);
    function calculateLaneLocation(lane) {
        return lane * LANE.WIDTH - LANE.WIDTH / 2;
    }
    exports_2("calculateLaneLocation", calculateLaneLocation);
    return {
        setters: [],
        execute: function () {
            // Key Information
            exports_2("allPressedKeys", allPressedKeys = {});
            window.addEventListener("keydown", function (event) {
                allPressedKeys[event.keyCode] = true;
            });
            window.addEventListener("keyup", function (event) {
                allPressedKeys[event.keyCode] = false;
            });
            exports_2("KEYS", KEYS = {
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
                Escape: 27,
                E: 69,
                One: 49,
                Two: 50,
            });
            exports_2("mouseDown", mouseDown = false);
            exports_2("mouse", mouse = {
                x: 0,
                y: 0,
            });
            window.addEventListener("mousedown", function (event) {
                exports_2("mouseDown", mouseDown = true);
                mouse.x = event.x;
                mouse.y = event.y;
            });
            window.addEventListener("mouseup", function (event) {
                exports_2("mouseDown", mouseDown = false);
            });
            exports_2("canvas", canvas = document.getElementById("game-canvas"));
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            exports_2("context", context = canvas.getContext("2d"));
            exports_2("OFFSET", OFFSET = 1);
            exports_2("IN_GAME_SECOND", IN_GAME_SECOND = 10 ** 3);
            exports_2("IN_GAME_MINUTE", IN_GAME_MINUTE = IN_GAME_SECOND * 60);
            exports_2("LANE", LANE = {
                WIDTH: canvas.width / 3,
                COUNT: 3
            });
            (function (EntityName) {
                EntityName["Fireball"] = "fireball";
                EntityName["Arrow"] = "arrow";
                EntityName["Dragon"] = "dragon";
                EntityName["Player"] = "player";
                EntityName["Minotaur"] = "minotaur";
                EntityName["Coin"] = "coin";
                EntityName["Frankenstein"] = "frankenstein";
                EntityName["Skeleton"] = "skeleton";
                EntityName["Ghost"] = "ghost";
                EntityName["ItemFrame"] = "itemFrame";
                EntityName["RectEnemy"] = "rectEnemy";
                EntityName["GameEntity"] = "gameEntity";
            })(EntityName || (EntityName = {}));
            exports_2("EntityName", EntityName);
            (function (Tag) {
                Tag["Player"] = "player";
                Tag["Fireball"] = "fireball";
                Tag["Arrow"] = "arrow";
                Tag["Dragon"] = "dragon";
                Tag["Minotaur"] = "minotaur";
                Tag["Coin"] = "coin";
                Tag["Frankenstein"] = "frankenstein";
                Tag["Skeleton"] = "skeleton";
                Tag["Ghost"] = "ghost";
                Tag["ExtendedVisionPowerup"] = "ExtendedVisionPowerup";
                Tag["AuraPowerup"] = "AuraPowerup";
                Tag["DeathStarPowerup"] = "DeathStarPowerup";
                Tag["Powerup"] = "Powerup";
                Tag["Enemy"] = "Enemy";
                Tag["GoblinBoss"] = "GoblinBoss";
                Tag["Boss"] = "Boss";
                Tag["MoneyPouch"] = "MoneyPouch";
                Tag["Laser"] = "Laser";
                Tag["GolemBoss"] = "GolemBoss";
                Tag["ArmProjectile"] = "ArmProjectile";
                Tag["Loot"] = "Loot";
            })(Tag || (Tag = {}));
            exports_2("Tag", Tag);
            exports_2("timeStart", timeStart = Date.now());
        }
    };
});
System.register("components/positionComponent", ["entityComponent"], function (exports_3, context_3) {
    "use strict";
    var entityComponent_1, PositionComponent;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (entityComponent_1_1) {
                entityComponent_1 = entityComponent_1_1;
            }
        ],
        execute: function () {
            PositionComponent = class PositionComponent extends entityComponent_1.Component {
                static COMPONENT_ID = "Position";
                x;
                y;
                width;
                height;
                radius;
                rotation;
                constructor(x, y, width, height, radius = 0, rotation = 0) {
                    super();
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.radius = radius;
                    this.rotation = rotation;
                }
            };
            exports_3("default", PositionComponent);
        }
    };
});
System.register("components/animatedComponent", ["global", "entityComponent", "components/positionComponent"], function (exports_4, context_4) {
    "use strict";
    var global_1, entityComponent_2, positionComponent_1, AnimationInfo, AnimatedComponent;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (entityComponent_2_1) {
                entityComponent_2 = entityComponent_2_1;
            },
            function (positionComponent_1_1) {
                positionComponent_1 = positionComponent_1_1;
            }
        ],
        execute: function () {
            AnimationInfo = class AnimationInfo {
                animationCount = 0;
                maxAnimationFrameCount = 0;
                animations = {};
            };
            exports_4("AnimationInfo", AnimationInfo);
            AnimatedComponent = class AnimatedComponent extends entityComponent_2.Component {
                static COMPONENT_ID = "Animated";
                spritesheet;
                animationInfo;
                currentAnimation;
                currentAnimationFrame;
                _timeSinceLastFrame;
                _hasSpritesheetLoaded;
                _frameW = 0;
                _frameH = 0;
                shouldDraw = true;
                isFlipped = false;
                pauseAnimation = false;
                spritesheetHorizontal;
                constructor(spritesheetURL, animationInfo, spritesheetHorizontal = true) {
                    super();
                    this.spritesheet = new Image();
                    this._hasSpritesheetLoaded = false;
                    this.spritesheetHorizontal = spritesheetHorizontal;
                    this.spritesheet.onload = () => {
                        this._hasSpritesheetLoaded = true;
                        if (this.spritesheetHorizontal == false) {
                            this._frameW = this.spritesheet.width / this.animationInfo.animationCount;
                            this._frameH = this.spritesheet.height / animationInfo.maxAnimationFrameCount;
                        }
                        else {
                            this._frameW = this.spritesheet.width / animationInfo.maxAnimationFrameCount;
                            this._frameH = this.spritesheet.height / this.animationInfo.animationCount;
                        }
                    };
                    this.spritesheet.src = spritesheetURL;
                    this.animationInfo = animationInfo;
                    this.currentAnimation = null;
                    this.currentAnimationFrame = 0;
                    this._timeSinceLastFrame = 0;
                }
                update(deltaTime) {
                    this.animationUpdate(deltaTime);
                }
                playAnimation(name) {
                    this.currentAnimation = this.animationInfo.animations[name];
                }
                animationUpdate(deltaTime) {
                    if (this.currentAnimation == null || this.pauseAnimation == true) {
                        return;
                    }
                    const timeBetweenFrames = 1000 / this.currentAnimation.framesPerSecond;
                    this._timeSinceLastFrame += deltaTime;
                    if (this._timeSinceLastFrame >= timeBetweenFrames) {
                        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.currentAnimation.frameCount;
                        this._timeSinceLastFrame = 0;
                    }
                }
                draw() {
                    if (this._entity == null || this.currentAnimation == null || !this._hasSpritesheetLoaded || this.shouldDraw == false) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_1.default.COMPONENT_ID);
                    if (this.isFlipped == true) {
                        global_1.context.save();
                        global_1.context.translate(positionComponent.x, positionComponent.y);
                        global_1.context.scale(-1, 1);
                        global_1.context.translate(-positionComponent.x, -positionComponent.y);
                    }
                    const centerX = positionComponent.x - positionComponent.width / 2;
                    const centerY = positionComponent.y - positionComponent.height / 2;
                    if (positionComponent.rotation !== 0) {
                        global_1.context.save(); // save the current transformation matrix
                        global_1.context.translate(centerX, centerY); // move the origin to the object's position
                        global_1.context.rotate(positionComponent.rotation); // apply the object's current rotation
                        global_1.context.translate(-centerX, -centerY); // move the origin to the object's position
                    }
                    console.assert(this._frameW > 0);
                    console.assert(this._frameH > 0);
                    let frameSX;
                    let frameSY;
                    if (this.spritesheetHorizontal == false) {
                        frameSX = this.currentAnimation.rowIndex * this._frameW;
                        frameSY = this.currentAnimationFrame * this._frameH;
                    }
                    else {
                        frameSX = this.currentAnimationFrame * this._frameW;
                        frameSY = this.currentAnimation.rowIndex * this._frameH;
                    }
                    console.assert(frameSX >= 0);
                    console.assert(frameSY >= 0);
                    global_1.context.drawImage(this.spritesheet, frameSX, frameSY, this._frameW, this._frameH, positionComponent.x - positionComponent.width / 2, positionComponent.y - positionComponent.height / 2, positionComponent.width, positionComponent.height);
                    if (this.isFlipped == true) {
                        global_1.context.restore();
                    }
                    if (positionComponent.rotation !== 0) {
                        global_1.context.restore();
                    }
                }
            };
            exports_4("AnimatedComponent", AnimatedComponent);
        }
    };
});
System.register("components/arrowComponent", ["entityComponent", "components/positionComponent"], function (exports_5, context_5) {
    "use strict";
    var entityComponent_3, positionComponent_2, ArrowComponent;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (entityComponent_3_1) {
                entityComponent_3 = entityComponent_3_1;
            },
            function (positionComponent_2_1) {
                positionComponent_2 = positionComponent_2_1;
            }
        ],
        execute: function () {
            ArrowComponent = class ArrowComponent extends entityComponent_3.Component {
                static COMPONENT_ID = "Movement";
                speed = 0;
                direction;
                constructor(speed, direction) {
                    super();
                    this.speed = speed;
                    this.direction = direction;
                }
                update(deltaTime, gameSpeed) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_2.default.COMPONENT_ID);
                    console.assert(positionComponent != null);
                    positionComponent.x += this.speed * deltaTime / 1000 * this.direction.x * gameSpeed;
                    positionComponent.y += this.speed * deltaTime / 1000 * this.direction.y * gameSpeed;
                }
            };
            exports_5("default", ArrowComponent);
        }
    };
});
System.register("objects", [], function (exports_6, context_6) {
    "use strict";
    var objects, images;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            exports_6("objects", objects = []);
            exports_6("images", images = []);
        }
    };
});
System.register("components/imageComponent", ["global", "entityComponent", "components/positionComponent"], function (exports_7, context_7) {
    "use strict";
    var global_2, entityComponent_4, positionComponent_3, ImageComponent;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (global_2_1) {
                global_2 = global_2_1;
            },
            function (entityComponent_4_1) {
                entityComponent_4 = entityComponent_4_1;
            },
            function (positionComponent_3_1) {
                positionComponent_3 = positionComponent_3_1;
            }
        ],
        execute: function () {
            ImageComponent = class ImageComponent extends entityComponent_4.Component {
                static COMPONENT_ID = "Image";
                image;
                isLoaded = false;
                constructor(imageURL) {
                    super();
                    this.image = new Image();
                    this.image.onload = () => {
                        this.isLoaded = true;
                    };
                    this.image.src = imageURL;
                }
                draw() {
                    if (this._entity == null) {
                        return;
                    }
                    if (!this.isLoaded) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_3.default.COMPONENT_ID);
                    const imageWidth = positionComponent.width || this.image.width; // get image width, or use default
                    const imageHeight = positionComponent.height || this.image.height; // get image height, or use default
                    const centerX = positionComponent.x - imageWidth / 2;
                    const centerY = positionComponent.y - imageHeight / 2;
                    if (positionComponent.rotation !== 0) {
                        global_2.context.save(); // save the current transformation matrix
                        global_2.context.translate(centerX, centerY); // move the origin to the object's position
                        global_2.context.rotate(positionComponent.rotation); // apply the object's current rotation
                        global_2.context.translate(-centerX, -centerY); // move the origin to the object's position
                    }
                    global_2.context.drawImage(this.image, centerX, centerY, imageWidth, imageHeight);
                    if (positionComponent.rotation !== 0) {
                        global_2.context.restore();
                    }
                }
            };
            exports_7("ImageComponent", ImageComponent);
        }
    };
});
System.register("components/movementComponent", ["entityComponent", "components/positionComponent"], function (exports_8, context_8) {
    "use strict";
    var entityComponent_5, positionComponent_4, MovementComponent;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (entityComponent_5_1) {
                entityComponent_5 = entityComponent_5_1;
            },
            function (positionComponent_4_1) {
                positionComponent_4 = positionComponent_4_1;
            }
        ],
        execute: function () {
            MovementComponent = class MovementComponent extends entityComponent_5.Component {
                static COMPONENT_ID = "Movement";
                speed = 0;
                // Either a 1, 0, or -1
                yDirection = 0;
                constructor(speed, yDirection) {
                    super();
                    this.speed = speed;
                    this.yDirection = yDirection;
                }
                update(deltaTime, gameSpeed) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_4.default.COMPONENT_ID);
                    console.assert(positionComponent != null);
                    positionComponent.y += this.speed * deltaTime / 1000 * this.yDirection * gameSpeed;
                }
            };
            exports_8("default", MovementComponent);
        }
    };
});
System.register("components/stateMachineComponent", ["entityComponent"], function (exports_9, context_9) {
    "use strict";
    var entityComponent_6, State, StateMachine, StateMachineComponent;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (entityComponent_6_1) {
                entityComponent_6 = entityComponent_6_1;
            }
        ],
        execute: function () {
            State = class State {
                onActivation;
                update;
                onDeactivation;
                constructor(onActivation, update, onDeactivation) {
                    this.onActivation = onActivation;
                    this.update = update;
                    this.onDeactivation = onDeactivation;
                }
            };
            exports_9("State", State);
            StateMachine = class StateMachine {
                states;
                activeState;
                data;
                constructor() {
                    this.states = {};
                    this.activeState = null;
                    this.data = {
                        stateStart: 0,
                    };
                }
                addState(stateName, onActivation, update, onDeactivation) {
                    this.states[stateName] = new State(onActivation, update, onDeactivation);
                }
                update(deltaTime, currentObject) {
                    if (this.activeState) {
                        const nextState = this.activeState.update(deltaTime, currentObject);
                        // console.log(nextState)
                        if (nextState) {
                            this.activeState.onDeactivation(currentObject);
                            this.activeState = this.states[nextState];
                            this.activeState.onActivation(currentObject);
                        }
                    }
                }
            };
            exports_9("StateMachine", StateMachine);
            StateMachineComponent = class StateMachineComponent extends entityComponent_6.Component {
                static COMPONENT_ID = "StateMachine";
                activate(initialState) {
                    console.assert(this._entity != null);
                    this.stateMachine.activeState = this.stateMachine.states[initialState];
                    this.stateMachine.activeState.onActivation(this._entity);
                }
                update(deltaTime) {
                    if (this._entity) {
                        this.stateMachine.update(deltaTime, this._entity);
                    }
                }
                stateMachine = new StateMachine();
            };
            exports_9("default", StateMachineComponent);
        }
    };
});
System.register("components/inventoryComponent", ["global", "entityComponent"], function (exports_10, context_10) {
    "use strict";
    var global_3, entityComponent_7, Status, InventoryItemStat, InventoryItem, TakenInventoryItemSlot, Inventory, InventoryComponent, ItemInfo, InventorySlot, Weapons, Armors, Items, spearImage, bowImage, armorImage, bootsImage, ItemList;
    var __moduleName = context_10 && context_10.id;
    function equipStarterItems(currentObject) {
        const inventoryComponent = currentObject.getComponent(InventoryComponent.COMPONENT_ID);
        inventoryComponent.inventories[0].placeItem(ItemList.Bow, 1, 0);
        inventoryComponent.inventories[0].placeItem(ItemList.Armor, 2, 0);
        inventoryComponent.inventories[0].placeItem(ItemList.Boots, 0, 0);
        inventoryComponent.inventories[1].placeItem(ItemList.Spear, 0, 0);
    }
    exports_10("equipStarterItems", equipStarterItems);
    function createInventoryItem(item, name) {
        const newImage = new Image;
        newImage.src = item.src;
        const inventoryItem = new InventoryItem(item.width, item.height, item.src, newImage, name, item.type, item.stats);
        return inventoryItem;
    }
    exports_10("createInventoryItem", createInventoryItem);
    function addInventoryItem(inventoryItem, inventory) {
        const slot = inventory.findEmptySpot(inventoryItem);
        if (slot == null) {
            console.assert(slot == null);
            console.log("null");
            return;
        }
        inventory.placeItem(inventoryItem, slot.column, slot.row);
        console.log(inventory.cells);
    }
    exports_10("addInventoryItem", addInventoryItem);
    return {
        setters: [
            function (global_3_1) {
                global_3 = global_3_1;
            },
            function (entityComponent_7_1) {
                entityComponent_7 = entityComponent_7_1;
            }
        ],
        execute: function () {
            (function (Status) {
                Status["Add"] = "add";
                Status["Remove"] = "remove";
            })(Status || (Status = {}));
            (function (InventoryItemStat) {
                InventoryItemStat[InventoryItemStat["Lives"] = 0] = "Lives";
                InventoryItemStat[InventoryItemStat["RollSpeed"] = 1] = "RollSpeed";
                InventoryItemStat[InventoryItemStat["AttackSpeed"] = 2] = "AttackSpeed";
            })(InventoryItemStat || (InventoryItemStat = {}));
            exports_10("InventoryItemStat", InventoryItemStat);
            InventoryItem = class InventoryItem {
                width;
                height;
                iconURL;
                image;
                name;
                slot;
                stats;
                constructor(width, height, iconURL, image, name, slot, stats) {
                    this.width = width;
                    this.height = height;
                    this.iconURL = iconURL;
                    this.image = image;
                    this.name = name;
                    this.slot = slot;
                    this.stats = stats;
                }
            };
            exports_10("InventoryItem", InventoryItem);
            exports_10("TakenInventoryItemSlot", TakenInventoryItemSlot = { INVENTORY_SLOT_TAKEN: true });
            Inventory = class Inventory {
                width;
                height;
                x;
                y;
                cells;
                equippedItems;
                itemSize;
                _hiddenItem;
                highlight = false;
                _supportsEquipment;
                constructor(width, height, x, y, itemSize, supportsEquipment = false) {
                    this.equippedItems = {};
                    this.cells = [];
                    this.width = width;
                    this.height = height;
                    this.x = x;
                    this.y = y;
                    this._hiddenItem = "";
                    this.itemSize = itemSize;
                    this._supportsEquipment = supportsEquipment;
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
                    for (let i = cellRow; i < cellRow + item.width; i++) {
                        for (let j = cellCol; j < cellCol + item.height; j++) {
                            if (i > this.width - global_3.OFFSET || j > this.height - global_3.OFFSET) {
                                return false;
                            }
                            else if (this.cells[i][j] != null) {
                                if (this.cells[i][j] instanceof InventoryItem) {
                                    if (this.cells[i][j].name != item.name) {
                                        return false;
                                    }
                                }
                                else {
                                    if (this.cells[i][j].inventoryItem.name != item.name) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    return true;
                }
                placeItem(item, cellRow, cellCol) {
                    if (this.placeItemCheck(item, cellRow, cellCol)) {
                        for (let i = 0; i < item.width; i++) {
                            for (let j = 0; j < item.height; j++) {
                                this.cells[cellRow + i][cellCol + j] = { inventoryItem: item };
                                this.cells[cellRow][cellCol] = item;
                                this._updateEquippedItem(item, Status.Add);
                            }
                        }
                    }
                }
                removeItem(item) {
                    for (let i = 0; i < this.width; i++) {
                        for (let j = 0; j < this.height; j++) {
                            if (this.cells[i][j] instanceof InventoryItem) {
                                if (this.cells[i][j].name == item.name) {
                                    this._updateEquippedItem(item, Status.Remove);
                                    for (let a = 0; a < item.width; a++) {
                                        for (let b = 0; b < item.height; b++) {
                                            this.cells[a + i][b + j] = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                isEquipped(item) {
                    console.assert(this._supportsEquipment);
                    return Object.values(this.equippedItems).includes(item);
                }
                // public isInInventory(item: InventoryItem): boolean {
                //     return Object.values(this.equippedItems).includes(item);
                // }
                draw() {
                    // for every row and col
                    //   go through every cell, that is the top-left coordinate of an item and draw the image
                    // for every row and col
                    //   go through every cell, draw box <-- context.strokeRect
                    const centeringWidthOffset = this.width / 2 * this.itemSize.width;
                    const centeringHeightOffset = this.height / 2 * this.itemSize.height;
                    for (let i = 0; i < this.width; i++) {
                        for (let j = 0; j < this.height; j++) {
                            global_3.context.strokeStyle = "black";
                            global_3.context.strokeRect(this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width, this.itemSize.height);
                            const currentCell = this.cells[i][j];
                            if (currentCell instanceof InventoryItem && currentCell.name != this._hiddenItem) {
                                global_3.context.drawImage(currentCell.image, this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width * currentCell.width, this.itemSize.height * currentCell.height);
                            }
                        }
                    }
                    if (this.highlight == true) {
                        global_3.context.strokeStyle = "blue";
                        global_3.context.strokeRect(this.x - centeringWidthOffset, this.y - centeringHeightOffset, this.itemSize.width * this.width, this.itemSize.height * this.height);
                    }
                }
                resetInventory() {
                    for (let i = 0; i < this.width; i++) {
                        this.cells[i] = [];
                        for (let j = 0; j < this.height; j++) {
                            this.cells[i][j] = null;
                        }
                    }
                }
                updateStats(StartingStats) {
                    const stats = StartingStats;
                    for (const item of Object.values(this.equippedItems)) {
                        if (!item) {
                            continue;
                        }
                        for (const statModifier of item.stats) {
                            stats[statModifier.stat] += statModifier.modifiedValue;
                        }
                    }
                    console.log(stats);
                    return stats;
                }
                searchInventory(slot) {
                    if (this.cells[slot.row][slot.column] == null) {
                        return;
                    }
                    else if (this.cells[slot.row][slot.column].constructor == InventoryItem) {
                        return this.cells[slot.row][slot.column];
                    }
                    else {
                        return this.cells[slot.row][slot.column].inventoryItem;
                    }
                }
                hideItem(name) {
                    this._hiddenItem = name;
                }
                findEmptySpot(item) {
                    for (let i = 0; i < this.width; i++) {
                        for (let j = 0; j < this.height; j++) {
                            if (this.placeItemCheck(item, j, i)) {
                                const slot = { row: i, column: j };
                                return slot;
                            }
                        }
                    }
                }
                get count() {
                    let count = 0;
                    for (let i = 0; i < this.width; i++) {
                        for (let j = 0; j < this.height; j++) {
                            if (this.cells[i][j] instanceof InventoryItem) {
                                count++;
                            }
                        }
                    }
                    return count;
                }
                _updateEquippedItem(item, status) {
                    if (status == Status.Add) {
                        this.equippedItems[item.slot] = item;
                    }
                    else {
                        this.equippedItems[item.slot] = null;
                    }
                }
            };
            exports_10("Inventory", Inventory);
            InventoryComponent = class InventoryComponent extends entityComponent_7.Component {
                static COMPONENT_ID = "Inventory";
                inventories = [];
                constructor(inventories) {
                    super();
                    this.inventories = inventories;
                }
            };
            exports_10("InventoryComponent", InventoryComponent);
            exports_10("ItemInfo", ItemInfo = {
                Armor: {
                    src: "assets/images/armor.png"
                },
                Bow: {
                    src: "assets/images/bow.png"
                },
                Boots: {
                    src: "assets/images/boots.png"
                },
                Spear: {
                    src: "assets/images/spear.png"
                }
            });
            (function (InventorySlot) {
                InventorySlot[InventorySlot["Helmet"] = 0] = "Helmet";
                InventorySlot[InventorySlot["Chestplate"] = 1] = "Chestplate";
                InventorySlot[InventorySlot["Leggings"] = 2] = "Leggings";
                InventorySlot[InventorySlot["Boots"] = 3] = "Boots";
                InventorySlot[InventorySlot["Weapon"] = 4] = "Weapon";
            })(InventorySlot || (InventorySlot = {}));
            (function (Weapons) {
                Weapons["Kite"] = "kite";
                Weapons["Spartan"] = "spartan";
                Weapons["Crusader"] = "crusader";
                Weapons["Saber"] = "saber";
                Weapons["LongSword"] = "longSword";
                Weapons["Rapier"] = "rapier";
                Weapons["GlowSwordBlue"] = "glowSwordBlue";
                Weapons["GlowSwordRed"] = "glowSwordRed";
                Weapons["Scythe"] = "scythe";
                Weapons["Cane"] = "cane";
                Weapons["Mace"] = "mace";
                Weapons["Spear"] = "spear";
                Weapons["BasicBow"] = "basicBow";
                Weapons["BasicStaff"] = "basicStaff";
                Weapons["Crossbow"] = "crossbow";
                Weapons["DiamondStaff"] = "diamondStaff";
                Weapons["GreatBow"] = "greatBow";
                Weapons["QuickBow"] = "quickBow";
            })(Weapons || (Weapons = {}));
            exports_10("Weapons", Weapons);
            (function (Armors) {
                Armors["BlackHelmet"] = "blackHelmet";
                Armors["MagicHelmet"] = "magicHelmet";
                Armors["SteelHelmet"] = "steelHelmet";
                Armors["CopperHelmet"] = "copperHelmet";
                Armors["BronzeHelmet"] = "bronzeHelmet";
                Armors["VikingHelmet"] = "vikingHelmet";
                Armors["BronzeChestplate"] = "bronzeChestplate";
                Armors["CopperChestplate"] = "copperChestplate";
                Armors["LeatherChestplate"] = "leatherChestplate";
                Armors["LegionChestplate"] = "legionChestplate";
                Armors["SteelChestplate"] = "steelChestplate";
                Armors["BronzeLeggings"] = "bronzeLeggings";
                Armors["CopperLeggings"] = "copperLeggings";
                Armors["SteelLeggings"] = "steelLeggings";
                Armors["PantLeggings"] = "pantLeggings";
                Armors["BlackBoots"] = "blackBoots";
                Armors["SteelBoots"] = "steelBoots";
            })(Armors || (Armors = {}));
            exports_10("Armors", Armors);
            exports_10("Items", Items = {
                Armor: {
                    [Armors.BlackHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/black.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 1,
                        height: 1,
                    },
                    [Armors.MagicHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/magic.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 2,
                        height: 1,
                    },
                    [Armors.SteelHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/steel.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 1,
                        height: 1,
                    },
                    [Armors.CopperHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/copper.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 1,
                        height: 1,
                    },
                    [Armors.BronzeHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/bronze.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 1,
                        height: 1,
                    },
                    [Armors.VikingHelmet]: {
                        src: "assets/images/inventoryItems/armor/helmets/viking.png",
                        stats: [],
                        type: InventorySlot.Helmet,
                        width: 1,
                        height: 1,
                    },
                    [Armors.BronzeChestplate]: {
                        src: "assets/images/inventoryItems/armor/chestplates/bronze.png",
                        stats: [],
                        type: InventorySlot.Chestplate,
                        width: 2,
                        height: 2,
                    },
                    [Armors.CopperChestplate]: {
                        src: "assets/images/inventoryItems/armor/chestplates/copper.png",
                        stats: [],
                        type: InventorySlot.Chestplate,
                        width: 2,
                        height: 2,
                    },
                    [Armors.LeatherChestplate]: {
                        src: "assets/images/inventoryItems/armor/chestplates/leather.png",
                        stats: [],
                        type: InventorySlot.Chestplate,
                        width: 2,
                        height: 2,
                    },
                    [Armors.LegionChestplate]: {
                        src: "assets/images/inventoryItems/armor/chestplates/legion.png",
                        stats: [],
                        type: InventorySlot.Chestplate,
                        width: 2,
                        height: 2,
                    },
                    [Armors.SteelChestplate]: {
                        src: "assets/images/inventoryItems/armor/chestplates/steel.png",
                        stats: [],
                        type: InventorySlot.Chestplate,
                        width: 2,
                        height: 2,
                    },
                    [Armors.BronzeLeggings]: {
                        src: "assets/images/inventoryItems/armor/leggings/bronze.png",
                        stats: [],
                        type: InventorySlot.Leggings,
                        width: 2,
                        height: 1,
                    },
                    [Armors.CopperLeggings]: {
                        src: "assets/images/inventoryItems/armor/leggings/copper.png",
                        stats: [],
                        type: InventorySlot.Leggings,
                        width: 2,
                        height: 1,
                    },
                    [Armors.SteelLeggings]: {
                        src: "assets/images/inventoryItems/armor/leggings/steel.png",
                        stats: [],
                        type: InventorySlot.Leggings,
                        width: 2,
                        height: 1,
                    },
                    [Armors.PantLeggings]: {
                        src: "assets/images/inventoryItems/armor/leggings/pants.png",
                        stats: [],
                        type: InventorySlot.Leggings,
                        width: 2,
                        height: 1,
                    },
                    [Armors.BlackBoots]: {
                        src: "assets/images/inventoryItems/armor/boots/black.png",
                        stats: [],
                        type: InventorySlot.Boots,
                        width: 1,
                        height: 1,
                    },
                    [Armors.SteelBoots]: {
                        src: "assets/images/inventoryItems/armor/boots/steel.png",
                        stats: [],
                        type: InventorySlot.Boots,
                        width: 1,
                        height: 1,
                    },
                },
                Weapons: {
                    [Weapons.Saber]: {
                        src: "assets/images/inventoryItems/weapons/melee/saber.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 1,
                    },
                    [Weapons.LongSword]: {
                        src: "assets/images/inventoryItems/weapons/melee/longSword.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.Rapier]: {
                        src: "assets/images/inventoryItems/weapons/melee/rapier.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 1,
                    },
                    [Weapons.GlowSwordBlue]: {
                        src: "assets/images/inventoryItems/weapons/melee/glowSwordBlue.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 1,
                    },
                    [Weapons.GlowSwordRed]: {
                        src: "assets/images/inventoryItems/weapons/melee/glowSwordRed.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 1,
                    },
                    [Weapons.Scythe]: {
                        src: "assets/images/inventoryItems/weapons/melee/scythe.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 2,
                    },
                    [Weapons.Cane]: {
                        src: "assets/images/inventoryItems/weapons/melee/cane.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 2,
                    },
                    [Weapons.Mace]: {
                        src: "assets/images/inventoryItems/weapons/melee/mace.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 1,
                    },
                    [Weapons.Spear]: {
                        src: "assets/images/inventoryItems/weapons/melee/spear.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 1,
                    },
                    [Weapons.BasicBow]: {
                        src: "assets/images/inventoryItems/weapons/ranged/basicBow.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.BasicStaff]: {
                        src: "assets/images/inventoryItems/weapons/ranged/basicStaff.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 2,
                    },
                    [Weapons.Crossbow]: {
                        src: "assets/images/inventoryItems/weapons/ranged/crossbow.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 1,
                    },
                    [Weapons.DiamondStaff]: {
                        src: "assets/images/inventoryItems/weapons/ranged/diamondStaff.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 1,
                        height: 2,
                    },
                    [Weapons.GreatBow]: {
                        src: "assets/images/inventoryItems/weapons/ranged/greatBow.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.QuickBow]: {
                        src: "assets/images/inventoryItems/weapons/ranged/quickBow.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.Kite]: {
                        src: "assets/images/inventoryItems/weapons/shields/kite.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.Spartan]: {
                        src: "assets/images/inventoryItems/weapons/shields/spartan.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                    [Weapons.Crusader]: {
                        src: "assets/images/inventoryItems/weapons/shields/crusader.png",
                        stats: [],
                        type: InventorySlot.Weapon,
                        width: 2,
                        height: 2,
                    },
                }
            });
            spearImage = new Image;
            spearImage.src = ItemInfo.Spear.src;
            bowImage = new Image;
            bowImage.src = ItemInfo.Bow.src;
            armorImage = new Image;
            armorImage.src = ItemInfo.Armor.src;
            bootsImage = new Image;
            bootsImage.src = ItemInfo.Boots.src;
            exports_10("ItemList", ItemList = {
                Spear: new InventoryItem(2, 1, spearImage.src, spearImage, "Spear", InventorySlot.Weapon, []),
                Bow: new InventoryItem(1, 2, bowImage.src, bowImage, "Bow", InventorySlot.Weapon, []),
                Armor: new InventoryItem(2, 2, armorImage.src, armorImage, "Armor", InventorySlot.Chestplate, [{ stat: InventoryItemStat.Lives, modifiedValue: 1 }]),
                Boots: new InventoryItem(1, 1, bootsImage.src, bootsImage, "Boots", InventorySlot.Boots, [{ stat: InventoryItemStat.RollSpeed, modifiedValue: 100 }]),
            });
        }
    };
});
System.register("components/drawCircleComponent", ["entityComponent", "components/positionComponent"], function (exports_11, context_11) {
    "use strict";
    var entityComponent_8, positionComponent_5, DrawCircleComponent;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (entityComponent_8_1) {
                entityComponent_8 = entityComponent_8_1;
            },
            function (positionComponent_5_1) {
                positionComponent_5 = positionComponent_5_1;
            }
        ],
        execute: function () {
            DrawCircleComponent = class DrawCircleComponent extends entityComponent_8.Component {
                static COMPONENT_ID = "DrawCircle";
                _color = "black";
                _context;
                constructor(context, color) {
                    super();
                    this._context = context;
                    this._color = color;
                }
                draw() {
                    if (this._entity == null) {
                        return;
                    }
                    const position = this._entity.getComponent(positionComponent_5.default.COMPONENT_ID);
                    console.assert(position != null);
                    this._context.beginPath();
                    this._context.arc(position.x, position.y, position.radius, 0, 2 * Math.PI, false);
                    this._context.closePath();
                    this._context.fillStyle = this._color;
                    this._context.fill();
                }
            };
            exports_11("default", DrawCircleComponent);
        }
    };
});
System.register("components/gameComponent", ["entityComponent", "global", "objects", "components/imageComponent", "components/inventoryComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_12, context_12) {
    "use strict";
    var entityComponent_9, global_4, objects_1, imageComponent_1, inventoryComponent_1, playerComponent_1, positionComponent_6, stateMachineComponent_1, GameState, gameState, GameComponent, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation, onAchievementsMenuActivation, onAchievementsMenuUpdate, onAchievementsMenuDeactivation, mouseDownBoolean, curriedMouseMove, curriedMouseUp;
    var __moduleName = context_12 && context_12.id;
    function mouseDown(e) {
        removeEventListener('mouseup', curriedMouseUp);
        mouseDownBoolean = true;
        let mouse = {
            x: e.clientX,
            y: e.clientY,
            width: 25,
            height: 25
        };
        const inventoryComponent = playerComponent_1.player.getComponent(inventoryComponent_1.InventoryComponent.COMPONENT_ID);
        for (const inventory of inventoryComponent.inventories) {
            if (checkMouseCollision(mouse, inventory)) {
                const inventorySlotPosition = calculateInventorySlotPosition(mouse, inventory);
                const inventoryItem = inventory.searchInventory(inventorySlotPosition);
                if (inventoryItem) {
                    inventory.hideItem(inventoryItem.name);
                    const item = new entityComponent_9.Entity(global_4.EntityName.ItemFrame);
                    item.addComponent(positionComponent_6.default.COMPONENT_ID, new positionComponent_6.default(mouse.x, mouse.y, inventoryItem.width * 50, inventoryItem.height * 50, 0));
                    item.addComponent(imageComponent_1.ImageComponent.COMPONENT_ID, new imageComponent_1.ImageComponent(inventoryItem.image.src));
                    objects_1.images.push(item);
                    const positionComponent = objects_1.images[0].getComponent(positionComponent_6.default.COMPONENT_ID);
                    curriedMouseMove = mouseMove.bind(undefined, mouse, positionComponent, inventoryComponent);
                    curriedMouseUp = mouseUp.bind(undefined, mouse, inventoryComponent, inventory, inventoryItem);
                    addEventListener('mousemove', curriedMouseMove);
                    addEventListener('mouseup', curriedMouseUp);
                }
            }
        }
    }
    function mouseMove(mouse, positionComponent, inventoryComponent, e) {
        setObjectToClientXY(positionComponent, e);
        setObjectToClientXY(mouse, e);
        for (const selectedInventory of inventoryComponent.inventories) {
            if (checkMouseCollision(mouse, selectedInventory)) {
                selectedInventory.highlight = true;
            }
            else if (selectedInventory.highlight == true) {
                selectedInventory.highlight = false;
            }
        }
    }
    function mouseUp(mouse, inventoryComponent, inventory, inventoryItem, e) {
        removeEventListener('mousemove', curriedMouseMove);
        mouseDownBoolean = false;
        setObjectToClientXY(mouse, e);
        for (const placeInventory of inventoryComponent.inventories) {
            if (placeInventory.highlight == true) {
                placeInventory.highlight = false;
            }
            if (checkMouseCollision(mouse, placeInventory)) {
                const newInventorySlotPosition = calculateInventorySlotPositionWithOffset(mouse, placeInventory, inventoryItem);
                newInventorySlotPosition.column = checkNumberSmallerThanZero(newInventorySlotPosition.column);
                newInventorySlotPosition.row = checkNumberSmallerThanZero(newInventorySlotPosition.row);
                if (placeInventory.placeItemCheck(inventoryItem, newInventorySlotPosition.row, newInventorySlotPosition.column)) {
                    console.log(inventoryItem);
                    inventory.removeItem(inventoryItem);
                    placeInventory.placeItem(inventoryItem, newInventorySlotPosition.row, newInventorySlotPosition.column);
                    const playerComponent = playerComponent_1.player.getComponent(playerComponent_1.PlayerComponent.COMPONENT_ID);
                    playerComponent.updateStats();
                    playerComponent.updateAnimationBasedOnWeapon();
                }
            }
        }
        objects_1.images.splice(0, 1);
        inventory.hideItem("");
    }
    function checkMouseCollision(mouse, inventory) {
        return (mouse.x - mouse.width / 2 <= inventory.x + inventory.width * inventory.itemSize.width / 2 &&
            mouse.x + mouse.width / 2 >= inventory.x - inventory.width * inventory.itemSize.width / 2 &&
            mouse.y + mouse.height / 2 >= inventory.y - inventory.height * inventory.itemSize.height / 2 &&
            mouse.y - mouse.height / 2 <= inventory.y + inventory.height * inventory.itemSize.height / 2);
    }
    function calculateInventorySlotPosition(mouse, inventory) {
        return {
            row: Math.floor((mouse.x - inventory.x + inventory.width * inventory.itemSize.width / 2) / inventory.itemSize.width),
            column: Math.floor((mouse.y - inventory.y + inventory.height * inventory.itemSize.height / 2) / inventory.itemSize.height)
        };
    }
    function calculateInventorySlotPositionWithOffset(mouse, inventory, inventoryItem) {
        return {
            row: Math.floor((mouse.x - inventory.x + inventory.width * inventory.itemSize.width / 2 - 25 * (inventoryItem.width - 1)) / inventory.itemSize.width),
            column: Math.floor((mouse.y - inventory.y + inventory.height * inventory.itemSize.height / 2 - 25 * (inventoryItem.height - 1)) / inventory.itemSize.height)
        };
    }
    function checkNumberSmallerThanZero(number) {
        if (number < 0) {
            number = 0;
        }
        return number;
    }
    function setObjectToClientXY(object, event) {
        object.x = event.clientX;
        object.y = event.clientY;
    }
    return {
        setters: [
            function (entityComponent_9_1) {
                entityComponent_9 = entityComponent_9_1;
            },
            function (global_4_1) {
                global_4 = global_4_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (imageComponent_1_1) {
                imageComponent_1 = imageComponent_1_1;
            },
            function (inventoryComponent_1_1) {
                inventoryComponent_1 = inventoryComponent_1_1;
            },
            function (playerComponent_1_1) {
                playerComponent_1 = playerComponent_1_1;
            },
            function (positionComponent_6_1) {
                positionComponent_6 = positionComponent_6_1;
            },
            function (stateMachineComponent_1_1) {
                stateMachineComponent_1 = stateMachineComponent_1_1;
            }
        ],
        execute: function () {
            (function (GameState) {
                GameState["Playing"] = "playing";
                GameState["InventoryMenu"] = "inventoryMenu";
                GameState["AchievementsMenu"] = "AchievementsMenu";
            })(GameState || (GameState = {}));
            exports_12("GameState", GameState);
            exports_12("gameState", gameState = GameState.Playing);
            GameComponent = class GameComponent extends entityComponent_9.Component {
                static COMPONENT_ID = "Game";
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_1.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
                    stateMachineComponent.stateMachine.addState(GameState.InventoryMenu, onInventoryMenuActivation, onInventoryMenuUpdate, onInventoryMenuDeactivation);
                    stateMachineComponent.stateMachine.addState(GameState.AchievementsMenu, onAchievementsMenuActivation, onAchievementsMenuUpdate, onAchievementsMenuDeactivation);
                    stateMachineComponent.activate(GameState.Playing);
                }
            };
            exports_12("default", GameComponent);
            // Adding the states for gameSM
            exports_12("onPlayingActivation", onPlayingActivation = () => {
                exports_12("gameState", gameState = GameState.Playing);
                console.log(GameState.Playing);
            });
            exports_12("onPlayingUpdate", onPlayingUpdate = () => {
                if (global_4.allPressedKeys[global_4.KEYS.One]) {
                    return GameState.InventoryMenu;
                }
                if (global_4.allPressedKeys[global_4.KEYS.Two]) {
                    return GameState.AchievementsMenu;
                }
            });
            exports_12("onPlayingDeactivation", onPlayingDeactivation = () => {
            });
            exports_12("onInventoryMenuActivation", onInventoryMenuActivation = () => {
                exports_12("gameState", gameState = GameState.InventoryMenu);
                // EventListener to see if mouse clicked
                addEventListener('mousedown', mouseDown);
                console.log(GameState.InventoryMenu);
            });
            exports_12("onInventoryMenuUpdate", onInventoryMenuUpdate = () => {
                if (global_4.allPressedKeys[global_4.KEYS.Escape]) {
                    return GameState.Playing;
                }
            });
            exports_12("onInventoryMenuDeactivation", onInventoryMenuDeactivation = () => {
                removeEventListener('mousedown', mouseDown);
            });
            exports_12("onAchievementsMenuActivation", onAchievementsMenuActivation = () => {
                exports_12("gameState", gameState = GameState.AchievementsMenu);
            });
            exports_12("onAchievementsMenuUpdate", onAchievementsMenuUpdate = () => {
                if (global_4.allPressedKeys[global_4.KEYS.Escape]) {
                    return GameState.Playing;
                }
            });
            exports_12("onAchievementsMenuDeactivation", onAchievementsMenuDeactivation = () => {
            });
            mouseDownBoolean = true;
        }
    };
});
System.register("components/parallaxComponent", ["entityComponent", "global"], function (exports_13, context_13) {
    "use strict";
    var entityComponent_10, global_5, ParallaxComponent;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (entityComponent_10_1) {
                entityComponent_10 = entityComponent_10_1;
            },
            function (global_5_1) {
                global_5 = global_5_1;
            }
        ],
        execute: function () {
            ParallaxComponent = class ParallaxComponent extends entityComponent_10.Component {
                static COMPONENT_ID = "Parallax";
                _textures;
                _speeds;
                _xPositions;
                topSourceX = 0;
                bottomSourceX;
                constructor(textures, speed) {
                    super();
                    this._textures = textures;
                    this._speeds = [];
                    this._xPositions = [];
                    for (let i = 0; i < textures.length; i++) {
                        this._speeds[i] = (i / textures.length) * speed;
                        this._xPositions[i] = 0;
                    }
                    this.bottomSourceX = 590;
                }
                update(deltaTime, gameSpeed) {
                    for (let i = 0; i < this._speeds.length; i++) {
                        this._xPositions[i] -= this._speeds[i] * gameSpeed;
                        if (this._xPositions[i] <= -this._textures[i].width) {
                            this._xPositions[i] = 0;
                        }
                    }
                }
                draw() {
                    global_5.context.save();
                    global_5.context.scale(global_5.canvas.width / this._textures[0].width, global_5.canvas.height / this._textures[0].height);
                    // context.scale(1.5, 1.5);
                    for (let i = 0; i < this._textures.length; i++) {
                        const tex = this._textures[i];
                        global_5.context.drawImage(tex, 0, 0, tex.width, tex.height, this._xPositions[i], 0, tex.width, tex.height); // right part
                        global_5.context.drawImage(tex, 0, 0, tex.width, tex.height, tex.width + this._xPositions[i], 0, tex.width, tex.height); // left part
                    }
                    global_5.context.restore();
                }
            };
            exports_13("ParallaxComponent", ParallaxComponent);
        }
    };
});
System.register("components/soundComponent", ["entityComponent", "global"], function (exports_14, context_14) {
    "use strict";
    var entityComponent_11, global_6, SoundComponent;
    var __moduleName = context_14 && context_14.id;
    function audioTrackEnded(sounds, thisSoundNumber, soundComponent) {
        if (thisSoundNumber >= sounds.length) {
            return;
        }
        soundComponent.playSound(sounds[thisSoundNumber]);
        const curriedAudioTrackEnded = audioTrackEnded.bind(undefined, sounds, thisSoundNumber + global_6.OFFSET, soundComponent);
        soundComponent.loadedSounds[thisSoundNumber].addEventListener("ended", curriedAudioTrackEnded);
    }
    return {
        setters: [
            function (entityComponent_11_1) {
                entityComponent_11 = entityComponent_11_1;
            },
            function (global_6_1) {
                global_6 = global_6_1;
            }
        ],
        execute: function () {
            SoundComponent = class SoundComponent extends entityComponent_11.Component {
                static COMPONENT_ID = "Sound";
                _loadedSounds = {};
                constructor(sounds) {
                    super();
                    this._loadedSounds = sounds;
                }
                playSound(soundName) {
                    this._loadedSounds[soundName].play();
                }
                playSoundOnLoop(soundName) {
                    this.playSound(soundName);
                    this._loadedSounds[soundName].loop = true;
                }
                stopLooping(soundName) {
                    this._loadedSounds[soundName].loop = false;
                }
                playSounds(sounds) {
                    this.playSound(sounds[0]);
                    const curriedAudioTrackEnded = audioTrackEnded.bind(undefined, sounds, 1, this);
                    this._loadedSounds[sounds[0]].addEventListener("ended", curriedAudioTrackEnded);
                }
                get loadedSounds() {
                    return this._loadedSounds;
                }
            };
            exports_14("SoundComponent", SoundComponent);
        }
    };
});
System.register("systems/gameSystem", ["components/gameComponent", "components/parallaxComponent", "components/soundComponent", "components/stateMachineComponent", "entityComponent", "global"], function (exports_15, context_15) {
    "use strict";
    var gameComponent_1, parallaxComponent_1, soundComponent_1, stateMachineComponent_2, entityComponent_12, global_7, backgroundTextures, textureCount, TEXTURE_WIDTH, TEXTURE_HEIGHT, GameSound, GameAudio, gameEntity;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (gameComponent_1_1) {
                gameComponent_1 = gameComponent_1_1;
            },
            function (parallaxComponent_1_1) {
                parallaxComponent_1 = parallaxComponent_1_1;
            },
            function (soundComponent_1_1) {
                soundComponent_1 = soundComponent_1_1;
            },
            function (stateMachineComponent_2_1) {
                stateMachineComponent_2 = stateMachineComponent_2_1;
            },
            function (entityComponent_12_1) {
                entityComponent_12 = entityComponent_12_1;
            },
            function (global_7_1) {
                global_7 = global_7_1;
            }
        ],
        execute: function () {
            backgroundTextures = [];
            textureCount = 8;
            TEXTURE_WIDTH = 1920;
            TEXTURE_HEIGHT = 1080;
            for (let i = 0; i < textureCount; i++) {
                const texture = new Image(TEXTURE_WIDTH, TEXTURE_HEIGHT);
                texture.src = `assets/images/PARALLAX/layer_0${Math.abs(i - textureCount)}.png`;
                backgroundTextures.push(texture);
            }
            (function (GameSound) {
                GameSound["Track1"] = "track1";
                GameSound["Track2"] = "track2";
                GameSound["Track3"] = "track3";
                GameSound["PlayerHit"] = "playerHit";
                GameSound["ArrowHit"] = "arrowHit";
            })(GameSound || (GameSound = {}));
            exports_15("GameSound", GameSound);
            GameAudio = {
                [GameSound.Track1]: new Audio('assets/audio/track1.mp3'),
                [GameSound.Track2]: new Audio('assets/audio/where-the-brave-may-live-forever-viking-background-music-109867.mp3'),
                [GameSound.Track3]: new Audio('assets/audio/dance-of-nordic-leaves-epic-folk-original-soundtrack-8324.mp3'),
                [GameSound.PlayerHit]: new Audio('assets/audio/playerHit.mp3'),
                [GameSound.ArrowHit]: new Audio('assets/audio/arrowHit.mp3'),
            };
            exports_15("gameEntity", gameEntity = new entityComponent_12.Entity(global_7.EntityName.GameEntity));
            gameEntity.addComponent(parallaxComponent_1.ParallaxComponent.COMPONENT_ID, new parallaxComponent_1.ParallaxComponent(backgroundTextures, 10));
            gameEntity.addComponent(stateMachineComponent_2.default.COMPONENT_ID, new stateMachineComponent_2.default);
            gameEntity.addComponent(gameComponent_1.default.COMPONENT_ID, new gameComponent_1.default());
            gameEntity.addComponent(soundComponent_1.SoundComponent.COMPONENT_ID, new soundComponent_1.SoundComponent(GameAudio));
        }
    };
});
System.register("components/tagComponent", ["entityComponent"], function (exports_16, context_16) {
    "use strict";
    var entityComponent_13, TagComponent;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (entityComponent_13_1) {
                entityComponent_13 = entityComponent_13_1;
            }
        ],
        execute: function () {
            TagComponent = class TagComponent extends entityComponent_13.Component {
                static COMPONENT_ID = "Tag";
                _tags;
                constructor(tags) {
                    super();
                    this._tags = new Set(tags);
                }
                hasTag(tag) {
                    return this._tags.has(tag);
                }
                addTag(tag) {
                    this._tags.add(tag);
                }
                removeTag(tag) {
                    this._tags.delete(tag);
                }
                get tags() {
                    return Array.from(this._tags);
                }
            };
            exports_16("TagComponent", TagComponent);
        }
    };
});
System.register("components/frankensteinComponent", ["entityComponent", "components/animatedComponent", "components/movementComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_17, context_17) {
    "use strict";
    var entityComponent_14, animatedComponent_1, movementComponent_1, playerComponent_2, positionComponent_7, stateMachineComponent_3, FrankensteinState, playerPositionComponent, FrankensteinComponent, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation, onHittingActivation, onHittingUpdate, onHittingDeactivation, FrankensteinAnimationNames, FrankensteinAnimationInfo;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (entityComponent_14_1) {
                entityComponent_14 = entityComponent_14_1;
            },
            function (animatedComponent_1_1) {
                animatedComponent_1 = animatedComponent_1_1;
            },
            function (movementComponent_1_1) {
                movementComponent_1 = movementComponent_1_1;
            },
            function (playerComponent_2_1) {
                playerComponent_2 = playerComponent_2_1;
            },
            function (positionComponent_7_1) {
                positionComponent_7 = positionComponent_7_1;
            },
            function (stateMachineComponent_3_1) {
                stateMachineComponent_3 = stateMachineComponent_3_1;
            }
        ],
        execute: function () {
            (function (FrankensteinState) {
                FrankensteinState["WalkingDown"] = "walkingDown";
                FrankensteinState["Hitting"] = "hitting";
            })(FrankensteinState || (FrankensteinState = {}));
            exports_17("FrankensteinState", FrankensteinState);
            FrankensteinComponent = class FrankensteinComponent extends entityComponent_14.Component {
                static COMPONENT_ID = "Frankenstein";
                lastHit = 0;
                health = 2;
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_3.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(FrankensteinState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
                    stateMachineComponent.stateMachine.addState(FrankensteinState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
                    stateMachineComponent.activate(FrankensteinState.WalkingDown);
                    playerPositionComponent = playerComponent_2.player.getComponent(positionComponent_7.default.COMPONENT_ID);
                }
            };
            exports_17("default", FrankensteinComponent);
            onWalkingDownActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_1.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.WalkingDown];
                const movementComponent = currentObject.getComponent(movementComponent_1.default.COMPONENT_ID);
                if (movementComponent.yDirection != 1) {
                    movementComponent.yDirection = 1;
                }
            };
            onWalkingDownUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_7.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + playerPositionComponent.height / 2 && playerPositionComponent.y >= positionComponent.y) {
                    return FrankensteinState.Hitting;
                }
            };
            onWalkingDownDeactivation = () => {
            };
            onHittingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_1.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[FrankensteinAnimationNames.Hitting];
                console.log(FrankensteinState.Hitting);
                const movementComponent = currentObject.getComponent(movementComponent_1.default.COMPONENT_ID);
                if (movementComponent.yDirection != 0) {
                    movementComponent.yDirection = 0;
                }
            };
            onHittingUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_7.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x != positionComponent.x) {
                    return FrankensteinState.WalkingDown;
                }
            };
            onHittingDeactivation = () => {
            };
            // Frankenstein Animation Info
            exports_17("FrankensteinAnimationNames", FrankensteinAnimationNames = {
                WalkingDown: "walkingDown",
                Hitting: "hitting",
            });
            exports_17("FrankensteinAnimationInfo", FrankensteinAnimationInfo = {
                animationCount: 21,
                maxAnimationFrameCount: 13,
                animations: {
                    [FrankensteinAnimationNames.WalkingDown]: {
                        rowIndex: 10,
                        frameCount: 9,
                        framesPerSecond: 6
                    },
                    [FrankensteinAnimationNames.Hitting]: {
                        rowIndex: 14,
                        frameCount: 6,
                        framesPerSecond: 6
                    }
                }
            });
        }
    };
});
System.register("systems/cameraSystem", ["global"], function (exports_18, context_18) {
    "use strict";
    var global_8, CameraSystem;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (global_8_1) {
                global_8 = global_8_1;
            }
        ],
        execute: function () {
            CameraSystem = class CameraSystem {
                static Instance = new CameraSystem();
                cameraAngle = 0;
                cameraX = 0;
                cameraY = 0;
                zoomLevel = 1;
                translatePoint = {
                    x: global_8.canvas.width / 2,
                    y: global_8.canvas.height / 2
                };
                beginDraw() {
                    global_8.context.save();
                    global_8.context.rotate(this.cameraAngle);
                    global_8.context.translate(this.translatePoint.x, this.translatePoint.y);
                    global_8.context.scale(this.zoomLevel, this.zoomLevel);
                    global_8.context.translate(-this.translatePoint.x, -this.translatePoint.y);
                }
                endDraw() {
                    global_8.context.restore();
                }
            };
            exports_18("default", CameraSystem);
        }
    };
});
System.register("components/skeletonComponent", ["entityComponent", "components/animatedComponent", "components/movementComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_19, context_19) {
    "use strict";
    var entityComponent_15, animatedComponent_2, movementComponent_2, playerComponent_3, positionComponent_8, stateMachineComponent_4, SkeletonState, playerPositionComponent, SkeletonComponent, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation, onHittingActivation, onHittingUpdate, onHittingDeactivation, SkeletonAnimationNames, SkeletonAnimationInfo;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (entityComponent_15_1) {
                entityComponent_15 = entityComponent_15_1;
            },
            function (animatedComponent_2_1) {
                animatedComponent_2 = animatedComponent_2_1;
            },
            function (movementComponent_2_1) {
                movementComponent_2 = movementComponent_2_1;
            },
            function (playerComponent_3_1) {
                playerComponent_3 = playerComponent_3_1;
            },
            function (positionComponent_8_1) {
                positionComponent_8 = positionComponent_8_1;
            },
            function (stateMachineComponent_4_1) {
                stateMachineComponent_4 = stateMachineComponent_4_1;
            }
        ],
        execute: function () {
            (function (SkeletonState) {
                SkeletonState["WalkingDown"] = "walkingDown";
                SkeletonState["Hitting"] = "hitting";
            })(SkeletonState || (SkeletonState = {}));
            exports_19("SkeletonState", SkeletonState);
            playerPositionComponent = null;
            SkeletonComponent = class SkeletonComponent extends entityComponent_15.Component {
                static COMPONENT_ID = "Skeleton";
                lastHit = 0;
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_4.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(SkeletonState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
                    stateMachineComponent.stateMachine.addState(SkeletonState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
                    stateMachineComponent.activate(SkeletonState.WalkingDown);
                    playerPositionComponent = playerComponent_3.player.getComponent(positionComponent_8.default.COMPONENT_ID);
                }
            };
            exports_19("default", SkeletonComponent);
            onWalkingDownActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_2.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[SkeletonAnimationNames.WalkingDown];
                const movementComponent = currentObject.getComponent(movementComponent_2.default.COMPONENT_ID);
                if (movementComponent.yDirection != 1) {
                    movementComponent.yDirection = 1;
                }
            };
            onWalkingDownUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_8.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + 50 && playerPositionComponent.y > positionComponent.y) {
                    return SkeletonState.Hitting;
                }
            };
            onWalkingDownDeactivation = () => {
            };
            onHittingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_2.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[SkeletonAnimationNames.Hitting];
                console.log(SkeletonState.Hitting);
                const movementComponent = currentObject.getComponent(movementComponent_2.default.COMPONENT_ID);
                if (movementComponent.yDirection != 0) {
                    movementComponent.yDirection = 0;
                }
            };
            onHittingUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_8.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x != positionComponent.x) {
                    return SkeletonState.WalkingDown;
                }
            };
            onHittingDeactivation = () => {
            };
            // Skeleton Animation Info
            exports_19("SkeletonAnimationNames", SkeletonAnimationNames = {
                WalkingDown: "walkingDown",
                Hitting: "hitting",
            });
            exports_19("SkeletonAnimationInfo", SkeletonAnimationInfo = {
                animationCount: 21,
                maxAnimationFrameCount: 13,
                animations: {
                    [SkeletonAnimationNames.WalkingDown]: {
                        rowIndex: 10,
                        frameCount: 9,
                        framesPerSecond: 8
                    },
                    [SkeletonAnimationNames.Hitting]: {
                        rowIndex: 14,
                        frameCount: 6,
                        framesPerSecond: 8
                    }
                }
            });
        }
    };
});
System.register("components/healthBarComponent", ["entityComponent", "global", "components/positionComponent"], function (exports_20, context_20) {
    "use strict";
    var entityComponent_16, global_9, positionComponent_9, EntityBar, HealthBarComponent;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (entityComponent_16_1) {
                entityComponent_16 = entityComponent_16_1;
            },
            function (global_9_1) {
                global_9 = global_9_1;
            },
            function (positionComponent_9_1) {
                positionComponent_9 = positionComponent_9_1;
            }
        ],
        execute: function () {
            EntityBar = class EntityBar {
                _maxHealth;
                _currentHealth;
                _color;
                _width;
                _height;
                _location = {
                    x: 0,
                    y: 0
                };
                _entity = null;
                _movesWithEntity;
                constructor(maxHealth, color, xPosition, yPosition, width, height, movesWithEntity = false) {
                    this._maxHealth = maxHealth;
                    this._currentHealth = maxHealth;
                    this._color = color;
                    this._width = width;
                    this._height = height;
                    this._location.x = xPosition;
                    this._location.y = yPosition;
                    this._movesWithEntity = movesWithEntity;
                }
                draw() {
                    console.assert(this._location != null);
                    // Calculate the width of the health bar based on the current health
                    const healthPercent = this._currentHealth / this._maxHealth;
                    const healthBarWidth = this._width * healthPercent;
                    if (this._movesWithEntity == true && this._entity) {
                        const positionComponent = this._entity.getComponent(positionComponent_9.default.COMPONENT_ID);
                        global_9.context.fillStyle = "gray";
                        global_9.context.fillRect(positionComponent.x + this._location.x - this._width / 2, positionComponent.y + this._location.y - this._height / 2, this._width, this._height);
                        // Draw the health bar itself
                        global_9.context.fillStyle = this._color;
                        global_9.context.fillRect(positionComponent.x + this._location.x - this._width / 2, positionComponent.y + this._location.y - this._height / 2, healthBarWidth, this._height);
                    }
                    else {
                        // Draw the background of the health bar
                        global_9.context.fillStyle = "gray";
                        global_9.context.fillRect(this._location.x - this._width / 2, this._location.y - this._height / 2, this._width, this._height);
                        // Draw the health bar itself
                        global_9.context.fillStyle = this._color;
                        global_9.context.fillRect(this._location.x - this._width / 2, this._location.y - this._height / 2, healthBarWidth, this._height);
                    }
                }
                setHealth(health) {
                    this._currentHealth = health;
                }
                attachToEntity(entity) {
                    this._entity = entity;
                }
            };
            exports_20("EntityBar", EntityBar);
            HealthBarComponent = class HealthBarComponent extends entityComponent_16.Component {
                static COMPONENT_ID = "HealthBar";
                _entityBars;
                constructor(entityBars) {
                    super();
                    this._entityBars = entityBars;
                }
                draw() {
                    for (const bar of this._entityBars) {
                        bar.draw();
                    }
                }
                onAttached() {
                    for (const bar of this._entityBars) {
                        bar.attachToEntity(this._entity);
                    }
                }
                get entityBars() {
                    return this._entityBars;
                }
            };
            exports_20("default", HealthBarComponent);
        }
    };
});
System.register("components/goblinBossComponent", ["entityComponent", "entityGenerator", "global", "objects", "components/animatedComponent", "components/healthBarComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_21, context_21) {
    "use strict";
    var entityComponent_17, entityGenerator_1, global_10, objects_2, animatedComponent_3, healthBarComponent_1, playerComponent_4, positionComponent_10, stateMachineComponent_5, GoblinBossState, playerPositionComponent, GoblinBossComponent, onGroundSlamActivation, onGroundSlamUpdate, onGroundSlamDeactivation, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation, onTauntActivation, onTauntUpdate, onTauntDeactivation, onMoneyPouchActivation, onMoneyPouchUpdate, onMoneyPouchDeactivation, onMoneyThrowActivation, onMoneyThrowUpdate, onMoneyThrowDeactivation, onHealingActivation, onHealingUpdate, onHealingDeactivation, onJumpActivation, onJumpUpdate, onJumpDeactivation, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation, GoblinBossAnimationNames, GoblinBossAnimationInfo;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (entityComponent_17_1) {
                entityComponent_17 = entityComponent_17_1;
            },
            function (entityGenerator_1_1) {
                entityGenerator_1 = entityGenerator_1_1;
            },
            function (global_10_1) {
                global_10 = global_10_1;
            },
            function (objects_2_1) {
                objects_2 = objects_2_1;
            },
            function (animatedComponent_3_1) {
                animatedComponent_3 = animatedComponent_3_1;
            },
            function (healthBarComponent_1_1) {
                healthBarComponent_1 = healthBarComponent_1_1;
            },
            function (playerComponent_4_1) {
                playerComponent_4 = playerComponent_4_1;
            },
            function (positionComponent_10_1) {
                positionComponent_10 = positionComponent_10_1;
            },
            function (stateMachineComponent_5_1) {
                stateMachineComponent_5 = stateMachineComponent_5_1;
            }
        ],
        execute: function () {
            (function (GoblinBossState) {
                GoblinBossState["Stationary"] = "Stationary";
                GoblinBossState["GroundSlam"] = "GroundSlam";
                GoblinBossState["Taunt"] = "Taunt";
                GoblinBossState["Healing"] = "Healing";
                GoblinBossState["MoneyPouch"] = "MoneyPouch";
                GoblinBossState["MoneyThrow"] = "MoneyThrow";
                GoblinBossState["Jump"] = "Jump";
                GoblinBossState["ChangeLane"] = "ChangeLane";
                GoblinBossState["Defeat"] = "Defeat";
            })(GoblinBossState || (GoblinBossState = {}));
            exports_21("GoblinBossState", GoblinBossState);
            playerPositionComponent = null;
            GoblinBossComponent = class GoblinBossComponent extends entityComponent_17.Component {
                static COMPONENT_ID = "GoblinBoss";
                health = 20;
                landingLocation = 0;
                goblinRestY = 100;
                lastHit = 0;
                walkDirection = 0;
                walkSpeed = 150;
                lane = 2;
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_5.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.GroundSlam, onGroundSlamActivation, onGroundSlamUpdate, onGroundSlamDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.Stationary, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.Taunt, onTauntActivation, onTauntUpdate, onTauntDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyPouch, onMoneyPouchActivation, onMoneyPouchUpdate, onMoneyPouchDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.MoneyThrow, onMoneyThrowActivation, onMoneyThrowUpdate, onMoneyThrowDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.Healing, onHealingActivation, onHealingUpdate, onHealingDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.Jump, onJumpActivation, onJumpUpdate, onJumpDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.ChangeLane, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation);
                    stateMachineComponent.stateMachine.addState(GoblinBossState.Defeat, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation);
                    stateMachineComponent.activate(GoblinBossState.GroundSlam);
                    playerPositionComponent = playerComponent_4.player.getComponent(positionComponent_10.default.COMPONENT_ID);
                }
                changeLane(deltaTime) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_10.default.COMPONENT_ID);
                    positionComponent.x += this.walkSpeed * deltaTime / 1000 * this.walkDirection;
                }
                chooseDirection() {
                    let randomNum = Math.random();
                    if (randomNum > 0.5) {
                        this.walkDirection = 1;
                    }
                    else {
                        this.walkDirection = -1;
                    }
                    if (this.lane + this.walkDirection < 1 || this.lane + this.walkDirection > 3) {
                        this.chooseDirection();
                    }
                    else {
                        this.lane += this.walkDirection;
                    }
                }
                update() {
                    if (this._entity == null) {
                        return;
                    }
                    const healthBarComponent = this._entity.getComponent(healthBarComponent_1.default.COMPONENT_ID);
                    healthBarComponent.entityBars[0].setHealth(this.health); // Health bar
                }
            };
            exports_21("default", GoblinBossComponent);
            onGroundSlamActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.GroundSlam];
                const positionComponent = currentObject.getComponent(positionComponent_10.default.COMPONENT_ID);
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                if (goblinBossComponent.landingLocation != 0) {
                    positionComponent.x = global_10.calculateLaneLocation(goblinBossComponent.landingLocation);
                    positionComponent.y = playerPositionComponent.y;
                }
            };
            onGroundSlamUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart;
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    animatedComponent.pauseAnimation = true;
                    if (global_10.checkTime(global_10.IN_GAME_SECOND * 1.5, stateStart)) {
                        animatedComponent.pauseAnimation = false;
                        return GoblinBossState.Stationary;
                    }
                }
            };
            onGroundSlamDeactivation = (currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_10.default.COMPONENT_ID);
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                if (goblinBossComponent.landingLocation != 0) {
                    positionComponent.x = global_10.calculateLaneLocation(goblinBossComponent.lane);
                    positionComponent.y = goblinBossComponent.goblinRestY;
                }
            };
            onStationaryActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Stationary];
            };
            onStationaryUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart;
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                if (goblinBossComponent.health < 0) {
                    return GoblinBossState.Defeat;
                }
                if (global_10.checkTime(global_10.IN_GAME_SECOND * 2, stateStart)) {
                    const randomNum = Math.random();
                    if (randomNum < 0.2) {
                        return GoblinBossState.MoneyPouch;
                    }
                    else if (randomNum < 0.4) {
                        const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                        if (goblinBossComponent.health < 20) {
                            return GoblinBossState.Healing;
                        }
                    }
                    else if (randomNum < 0.6) {
                        return GoblinBossState.Jump;
                    }
                    else if (randomNum < 0.8) {
                        return GoblinBossState.ChangeLane;
                    }
                    else {
                        return GoblinBossState.Taunt;
                    }
                }
            };
            onStationaryDeactivation = () => {
            };
            onTauntActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Taunt];
            };
            onTauntUpdate = (deltatime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    return GoblinBossState.Stationary;
                }
            };
            onTauntDeactivation = () => {
            };
            onMoneyPouchActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.MoneyPouch];
            };
            onMoneyPouchUpdate = (deltatime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    return GoblinBossState.MoneyThrow;
                }
            };
            onMoneyPouchDeactivation = () => {
            };
            onMoneyThrowActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.MoneyThrow];
            };
            onMoneyThrowUpdate = (deltatime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    entityGenerator_1.generateMoneyPouch(currentObject);
                    return GoblinBossState.Stationary;
                }
            };
            onMoneyThrowDeactivation = () => {
            };
            onHealingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Healing];
            };
            onHealingUpdate = (deltatime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                    goblinBossComponent.health += 5;
                    return GoblinBossState.Stationary;
                }
            };
            onHealingDeactivation = () => {
            };
            onJumpActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Jump];
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                goblinBossComponent.landingLocation = global_10.findLane(playerPositionComponent.x);
            };
            onJumpUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_5.default.COMPONENT_ID).stateMachine.data.stateStart;
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    animatedComponent.shouldDraw = false;
                    if (global_10.checkTime(global_10.IN_GAME_SECOND * 1.5, stateStart)) {
                        animatedComponent.shouldDraw = true;
                        return GoblinBossState.GroundSlam;
                    }
                }
            };
            onJumpDeactivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.shouldDraw = true;
            };
            onChangeLaneActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.ChangeLane];
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                goblinBossComponent.chooseDirection();
                if (goblinBossComponent.walkDirection == 1) {
                    animatedComponent.isFlipped = false;
                }
                else {
                    animatedComponent.isFlipped = true;
                }
                animatedComponent.currentAnimationFrame = 0;
            };
            onChangeLaneUpdate = (deltaTime, currentObject) => {
                const goblinBossComponent = currentObject.getComponent(GoblinBossComponent.COMPONENT_ID);
                const positionComponent = currentObject.getComponent(positionComponent_10.default.COMPONENT_ID);
                goblinBossComponent.changeLane(deltaTime);
                if (goblinBossComponent.walkDirection == 1) {
                    if (positionComponent.x > global_10.calculateLaneLocation(goblinBossComponent.lane)) {
                        positionComponent.x = global_10.calculateLaneLocation(goblinBossComponent.lane);
                        return GoblinBossState.Stationary;
                    }
                }
                else {
                    if (positionComponent.x < global_10.calculateLaneLocation(goblinBossComponent.lane)) {
                        positionComponent.x = global_10.calculateLaneLocation(goblinBossComponent.lane);
                        return GoblinBossState.Stationary;
                    }
                }
            };
            onChangeLaneDeactivation = (currentObject) => {
            };
            onDefeatActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GoblinBossAnimationNames.Defeat];
                animatedComponent.currentAnimationFrame = 0;
            };
            onDefeatUpdate = (deltaTime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_3.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_10.OFFSET) {
                    return GoblinBossState.Stationary;
                }
            };
            onDefeatDeactivation = (currentObject) => {
                objects_2.objects.splice(objects_2.objects.indexOf(currentObject), 1);
            };
            // Goblin Boss Animation Info
            (function (GoblinBossAnimationNames) {
                GoblinBossAnimationNames[GoblinBossAnimationNames["Stationary"] = 0] = "Stationary";
                GoblinBossAnimationNames[GoblinBossAnimationNames["GroundSlam"] = 1] = "GroundSlam";
                GoblinBossAnimationNames[GoblinBossAnimationNames["Taunt"] = 2] = "Taunt";
                GoblinBossAnimationNames[GoblinBossAnimationNames["Healing"] = 3] = "Healing";
                GoblinBossAnimationNames[GoblinBossAnimationNames["MoneyPouch"] = 4] = "MoneyPouch";
                GoblinBossAnimationNames[GoblinBossAnimationNames["MoneyThrow"] = 5] = "MoneyThrow";
                GoblinBossAnimationNames[GoblinBossAnimationNames["Jump"] = 6] = "Jump";
                GoblinBossAnimationNames[GoblinBossAnimationNames["ChangeLane"] = 7] = "ChangeLane";
                GoblinBossAnimationNames[GoblinBossAnimationNames["Defeat"] = 8] = "Defeat";
            })(GoblinBossAnimationNames || (GoblinBossAnimationNames = {}));
            exports_21("GoblinBossAnimationInfo", GoblinBossAnimationInfo = {
                animationCount: 11,
                maxAnimationFrameCount: 16,
                animations: {
                    [GoblinBossAnimationNames.Stationary]: {
                        rowIndex: 0,
                        frameCount: 4,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.GroundSlam]: {
                        rowIndex: 10,
                        frameCount: 7,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.Taunt]: {
                        rowIndex: 8,
                        frameCount: 6,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.Healing]: {
                        rowIndex: 5,
                        frameCount: 16,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.MoneyPouch]: {
                        rowIndex: 3,
                        frameCount: 12,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.MoneyThrow]: {
                        rowIndex: 4,
                        frameCount: 8,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.Jump]: {
                        rowIndex: 9,
                        frameCount: 6,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.ChangeLane]: {
                        rowIndex: 1,
                        frameCount: 6,
                        framesPerSecond: 6
                    },
                    [GoblinBossAnimationNames.Defeat]: {
                        rowIndex: 7,
                        frameCount: 11,
                        framesPerSecond: 6
                    },
                }
            });
        }
    };
});
System.register("components/golemBossComponent", ["entityComponent", "entityGenerator", "global", "objects", "components/animatedComponent", "components/healthBarComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_22, context_22) {
    "use strict";
    var entityComponent_18, entityGenerator_2, global_11, objects_3, animatedComponent_4, healthBarComponent_2, playerComponent_5, positionComponent_11, stateMachineComponent_6, GolemBossState, playerPositionComponent, GolemBossComponent, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation, onLaserBeamActivation, onLaserBeamUpdate, onLaserBeamDeactivation, onLaserRainActivation, onLaserRainUpdate, onLaserRainDeactivation, onArmProjectileAttackActivation, onArmProjectileAttackUpdate, onArmProjectileAttackDeactivation, onRegainArmorActivation, onRegainArmorUpdate, onRegainArmorDeactivation, GolemBossAnimationNames, GolemBossAnimationInfo;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (entityComponent_18_1) {
                entityComponent_18 = entityComponent_18_1;
            },
            function (entityGenerator_2_1) {
                entityGenerator_2 = entityGenerator_2_1;
            },
            function (global_11_1) {
                global_11 = global_11_1;
            },
            function (objects_3_1) {
                objects_3 = objects_3_1;
            },
            function (animatedComponent_4_1) {
                animatedComponent_4 = animatedComponent_4_1;
            },
            function (healthBarComponent_2_1) {
                healthBarComponent_2 = healthBarComponent_2_1;
            },
            function (playerComponent_5_1) {
                playerComponent_5 = playerComponent_5_1;
            },
            function (positionComponent_11_1) {
                positionComponent_11 = positionComponent_11_1;
            },
            function (stateMachineComponent_6_1) {
                stateMachineComponent_6 = stateMachineComponent_6_1;
            }
        ],
        execute: function () {
            (function (GolemBossState) {
                GolemBossState["Stationary"] = "Stationary";
                GolemBossState["ChangeLane"] = "ChangeLane";
                GolemBossState["ArmProjectileAttack"] = "ArmProjectileAttack";
                GolemBossState["LaserBeam"] = "LaserBeam";
                GolemBossState["LaserRain"] = "LaserRain";
                GolemBossState["RegainArmor"] = "RegainArmor";
                GolemBossState["Defeat"] = "Defeat";
            })(GolemBossState || (GolemBossState = {}));
            exports_22("GolemBossState", GolemBossState);
            playerPositionComponent = null;
            GolemBossComponent = class GolemBossComponent extends entityComponent_18.Component {
                static COMPONENT_ID = "GolemBoss";
                health = 20;
                armor = 3;
                landingLocation = 0;
                lastHit = 0;
                walkDirection = 0;
                walkSpeed = 150;
                lane = 2;
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_6.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(GolemBossState.Stationary, onStationaryActivation, onStationaryUpdate, onStationaryDeactivation);
                    stateMachineComponent.stateMachine.addState(GolemBossState.ChangeLane, onChangeLaneActivation, onChangeLaneUpdate, onChangeLaneDeactivation);
                    stateMachineComponent.stateMachine.addState(GolemBossState.LaserBeam, onLaserBeamActivation, onLaserBeamUpdate, onLaserBeamDeactivation);
                    stateMachineComponent.stateMachine.addState(GolemBossState.ArmProjectileAttack, onArmProjectileAttackActivation, onArmProjectileAttackUpdate, onArmProjectileAttackDeactivation);
                    stateMachineComponent.stateMachine.addState(GolemBossState.LaserRain, onLaserRainActivation, onLaserRainUpdate, onLaserRainDeactivation);
                    stateMachineComponent.stateMachine.addState(GolemBossState.Defeat, onDefeatActivation, onDefeatUpdate, onDefeatDeactivation);
                    stateMachineComponent.activate(GolemBossState.Stationary);
                    playerPositionComponent = playerComponent_5.player.getComponent(positionComponent_11.default.COMPONENT_ID);
                }
                changeLane(deltaTime) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_11.default.COMPONENT_ID);
                    positionComponent.x += this.walkSpeed * deltaTime / 1000 * this.walkDirection;
                }
                chooseDirection() {
                    let randomNum = Math.random();
                    if (randomNum > 0.5) {
                        this.walkDirection = 1;
                    }
                    else {
                        this.walkDirection = -1;
                    }
                    if (this.lane + this.walkDirection < 1 || this.lane + this.walkDirection > 3) {
                        this.chooseDirection();
                    }
                    else {
                        this.lane += this.walkDirection;
                    }
                }
                update() {
                    if (this._entity == null) {
                        return;
                    }
                    const healthBarComponent = this._entity.getComponent(healthBarComponent_2.default.COMPONENT_ID);
                    healthBarComponent.entityBars[0].setHealth(this.health); // Health bar
                    healthBarComponent.entityBars[1].setHealth(this.armor); // Armor bar
                }
            };
            exports_22("default", GolemBossComponent);
            onStationaryActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_6.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Stationary];
            };
            onStationaryUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_6.default.COMPONENT_ID).stateMachine.data.stateStart;
                const golemBossComponent = currentObject.getComponent(GolemBossComponent.COMPONENT_ID);
                if (golemBossComponent.health < 0) {
                    return GolemBossState.Defeat;
                }
                if (global_11.checkTime(global_11.IN_GAME_SECOND * 2, stateStart)) {
                    // const randomNum = Math.random();
                    // if (randomNum < 0.2) {
                    //     return GolemBossState.ArmProjectileAttack;
                    // }
                    // else if (randomNum < 0.4) {
                    //     const goblinBossComponent = currentObject.getComponent<GolemBossComponent>(GolemBossComponent.COMPONENT_ID)!;
                    //     if (goblinBossComponent.armor < 3){
                    //         return GolemBossState.RegainArmor;
                    //     }
                    // }
                    // else if (randomNum < 0.6) {
                    //     return GolemBossState.LaserBeam;
                    // }
                    // else if (randomNum < 0.8) {
                    //     return GolemBossState.ChangeLane;
                    // }
                    // else {
                    return GolemBossState.LaserRain;
                    // }
                }
            };
            onStationaryDeactivation = () => {
            };
            onChangeLaneActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Stationary];
                const golemBossComponent = currentObject.getComponent(GolemBossComponent.COMPONENT_ID);
                golemBossComponent.chooseDirection();
                if (golemBossComponent.walkDirection == 1) {
                    animatedComponent.isFlipped = false;
                }
                else {
                    animatedComponent.isFlipped = true;
                }
                animatedComponent.currentAnimationFrame = 0;
            };
            onChangeLaneUpdate = (deltaTime, currentObject) => {
                const golemBossComponent = currentObject.getComponent(GolemBossComponent.COMPONENT_ID);
                const positionComponent = currentObject.getComponent(positionComponent_11.default.COMPONENT_ID);
                golemBossComponent.changeLane(deltaTime);
                if (golemBossComponent.walkDirection == 1) {
                    if (positionComponent.x > global_11.calculateLaneLocation(golemBossComponent.lane)) {
                        positionComponent.x = global_11.calculateLaneLocation(golemBossComponent.lane);
                        return GolemBossState.Stationary;
                    }
                }
                else {
                    if (positionComponent.x < global_11.calculateLaneLocation(golemBossComponent.lane)) {
                        positionComponent.x = global_11.calculateLaneLocation(golemBossComponent.lane);
                        return GolemBossState.Stationary;
                    }
                }
            };
            onChangeLaneDeactivation = (currentObject) => {
            };
            onDefeatActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.Defeat];
                animatedComponent.currentAnimationFrame = 0;
            };
            onDefeatUpdate = (deltaTime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_11.OFFSET) {
                    return GolemBossState.Stationary;
                }
            };
            onDefeatDeactivation = (currentObject) => {
                objects_3.objects.splice(objects_3.objects.indexOf(currentObject), 1);
            };
            onLaserBeamActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.LaserBeam];
                animatedComponent.currentAnimationFrame = 0;
            };
            onLaserBeamUpdate = (deltaTime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_11.OFFSET) {
                    return GolemBossState.Stationary;
                }
            };
            onLaserBeamDeactivation = (currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_11.default.COMPONENT_ID);
                entityGenerator_2.generateLaser(positionComponent.x, positionComponent.y);
            };
            onLaserRainActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_6.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.LaserRain];
                animatedComponent.currentAnimationFrame = 0;
                for (let i = 0; i < 5; i++) {
                    let laserX = Math.random() * global_11.canvas.width;
                    let laserY = Math.random() * global_11.canvas.height;
                    entityGenerator_2.generateLaser(laserX, laserY);
                }
            };
            onLaserRainUpdate = (deltaTime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_6.default.COMPONENT_ID).stateMachine.data.stateStart;
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_11.OFFSET) {
                    animatedComponent.pauseAnimation = true;
                    if (global_11.checkTime(global_11.IN_GAME_SECOND * 3, stateStart)) {
                        animatedComponent.pauseAnimation = false;
                        return GolemBossState.Stationary;
                    }
                }
            };
            onLaserRainDeactivation = (currentObject) => {
            };
            onArmProjectileAttackActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.ArmProjectileAttack];
                animatedComponent.currentAnimationFrame = 0;
            };
            onArmProjectileAttackUpdate = (deltaTime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_11.OFFSET) {
                    return GolemBossState.Stationary;
                }
            };
            onArmProjectileAttackDeactivation = (currentObject) => {
                entityGenerator_2.generateArmProjectile(currentObject);
            };
            onRegainArmorActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GolemBossAnimationNames.RegainArmor];
                animatedComponent.currentAnimationFrame = 0;
            };
            onRegainArmorUpdate = (deltaTime, currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_4.AnimatedComponent.COMPONENT_ID);
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_11.OFFSET) {
                    return GolemBossState.Stationary;
                }
            };
            onRegainArmorDeactivation = (currentObject) => {
                const golemBossComponent = currentObject.getComponent(GolemBossComponent.COMPONENT_ID);
                golemBossComponent.armor = 3;
            };
            // Goblin Boss Animation Info
            (function (GolemBossAnimationNames) {
                GolemBossAnimationNames[GolemBossAnimationNames["Stationary"] = 0] = "Stationary";
                GolemBossAnimationNames[GolemBossAnimationNames["ArmProjectileAttack"] = 1] = "ArmProjectileAttack";
                GolemBossAnimationNames[GolemBossAnimationNames["LaserBeam"] = 2] = "LaserBeam";
                GolemBossAnimationNames[GolemBossAnimationNames["LaserRain"] = 3] = "LaserRain";
                GolemBossAnimationNames[GolemBossAnimationNames["RegainArmor"] = 4] = "RegainArmor";
                GolemBossAnimationNames[GolemBossAnimationNames["Defeat"] = 5] = "Defeat";
            })(GolemBossAnimationNames || (GolemBossAnimationNames = {}));
            exports_22("GolemBossAnimationInfo", GolemBossAnimationInfo = {
                animationCount: 9,
                maxAnimationFrameCount: 10,
                animations: {
                    [GolemBossAnimationNames.Stationary]: {
                        rowIndex: 0,
                        frameCount: 4,
                        framesPerSecond: 6
                    },
                    [GolemBossAnimationNames.ArmProjectileAttack]: {
                        rowIndex: 2,
                        frameCount: 9,
                        framesPerSecond: 6
                    },
                    [GolemBossAnimationNames.LaserBeam]: {
                        rowIndex: 4,
                        frameCount: 7,
                        framesPerSecond: 6
                    },
                    [GolemBossAnimationNames.LaserRain]: {
                        rowIndex: 3,
                        frameCount: 8,
                        framesPerSecond: 6
                    },
                    [GolemBossAnimationNames.Defeat]: {
                        rowIndex: 7,
                        frameCount: 10,
                        framesPerSecond: 6
                    },
                }
            });
        }
    };
});
System.register("components/lootComponent", ["entityComponent"], function (exports_23, context_23) {
    "use strict";
    var entityComponent_19, LootComponent;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (entityComponent_19_1) {
                entityComponent_19 = entityComponent_19_1;
            }
        ],
        execute: function () {
            LootComponent = class LootComponent extends entityComponent_19.Component {
                static COMPONENT_ID = "Loot";
                inventoryItem = null;
                constructor(inventoryItem) {
                    super();
                    this.inventoryItem = inventoryItem;
                }
            };
            exports_23("LootComponent", LootComponent);
        }
    };
});
System.register("systems/collisionSystem", ["components/positionComponent", "components/drawCircleComponent", "global", "components/tagComponent", "components/frankensteinComponent", "objects", "components/playerComponent", "components/soundComponent", "systems/gameSystem", "main", "components/animatedComponent", "systems/cameraSystem", "components/skeletonComponent", "components/inventoryComponent", "components/goblinBossComponent", "components/golemBossComponent", "components/lootComponent"], function (exports_24, context_24) {
    "use strict";
    var positionComponent_12, drawCircleComponent_1, global_12, tagComponent_1, frankensteinComponent_1, objects_4, playerComponent_6, soundComponent_2, gameSystem_1, main_1, animatedComponent_5, cameraSystem_1, skeletonComponent_1, inventoryComponent_2, goblinBossComponent_1, golemBossComponent_1, lootComponent_1, CollisionSystem, extendedVisionCollectedAgain, auraCollectedAgain;
    var __moduleName = context_24 && context_24.id;
    function playerCoinCollision(player, object) {
        const COIN_VALUE = 300;
        main_1.addScore(COIN_VALUE);
        main_1.addGold(1);
        main_1.deleteObject(object);
    }
    function playerFrankensteinCollision(player, object) {
        const playerComponent = player.getComponent(playerComponent_6.PlayerComponent.COMPONENT_ID);
        if (playerComponent.attacking) {
            const positionComponent = object.getComponent(positionComponent_12.default.COMPONENT_ID);
            const frankensteinComponent = object.getComponent(frankensteinComponent_1.default.COMPONENT_ID);
            for (let i = 0; i < 200; i++) {
                positionComponent.y -= 1;
            }
            frankensteinComponent.health -= 1;
            if (frankensteinComponent.health < 1) {
                main_1.deleteObject(object);
            }
            else {
                const animatedComponent = object.getComponent(animatedComponent_5.AnimatedComponent.COMPONENT_ID);
                animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
            }
        }
        else {
            const frankensteinComponent = object.getComponent(frankensteinComponent_1.default.COMPONENT_ID);
            if (global_12.checkTime(global_12.IN_GAME_SECOND * 3, frankensteinComponent.lastHit)) {
                playerComponent.stats[inventoryComponent_2.InventoryItemStat.Lives] -= 1;
                frankensteinComponent.lastHit = Date.now();
            }
        }
    }
    function playerSkeletonCollision(player, object) {
        const playerComponent = player.getComponent(playerComponent_6.PlayerComponent.COMPONENT_ID);
        if (playerComponent.attacking) {
            main_1.deleteObject(object);
        }
        else {
            const skeletonComponent = object.getComponent(skeletonComponent_1.default.COMPONENT_ID);
            if (global_12.checkTime(global_12.IN_GAME_SECOND * 3, skeletonComponent.lastHit)) {
                playerComponent.stats[inventoryComponent_2.InventoryItemStat.Lives] -= 1;
                skeletonComponent.lastHit = Date.now();
                console.log("hit");
            }
        }
    }
    function playerGoblinBossCollision(arrow, object) {
        const playerComponent = playerComponent_6.player.getComponent(playerComponent_6.PlayerComponent.COMPONENT_ID);
        const goblinBossComponent = object.getComponent(goblinBossComponent_1.default.COMPONENT_ID);
        if (global_12.checkTime(global_12.IN_GAME_SECOND * 2, goblinBossComponent.lastHit)) {
            playerComponent.stats[inventoryComponent_2.InventoryItemStat.Lives] -= 1;
            goblinBossComponent.lastHit = Date.now();
            console.log("hit");
        }
    }
    function playerExtendedVisionPowerupCollision(player, object) {
        const zoomChange = 0.2;
        if (cameraSystem_1.default.Instance.zoomLevel != 1) {
            extendedVisionCollectedAgain = true;
        }
        else {
            const startZoom = cameraSystem_1.default.Instance.zoomLevel;
            const endZoom = startZoom - zoomChange; // Set the end zoom level here
            zoomCamera(startZoom, endZoom);
        }
        setTimeout(() => {
            if (extendedVisionCollectedAgain == false) {
                const startZoom = cameraSystem_1.default.Instance.zoomLevel;
                const endZoom = startZoom + zoomChange; // Set the end zoom level here
            }
            else {
                extendedVisionCollectedAgain = false;
            }
        }, global_12.IN_GAME_SECOND * 15);
        main_1.deleteObject(object);
    }
    function zoomCamera(startZoom, endZoom) {
        const duration = 100; // Number of frames for the transition
        let elapsedFrames = 0;
        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }
        function updateZoom() {
            if (elapsedFrames >= duration) {
                return; // End the transition if we've reached the end
            }
            const t = elapsedFrames / duration; // Calculate the progress of the transition
            const newZoom = lerp(startZoom, endZoom, t); // Calculate the new zoom level
            cameraSystem_1.default.Instance.zoomLevel = newZoom; // Update the camera zoom level
            elapsedFrames++;
            // Call this function again on the next frame to continue the transition
            requestAnimationFrame(updateZoom);
        }
        // Start the transition
        requestAnimationFrame(updateZoom);
    }
    function playerAuraPowerupCollision(player, object) {
        const playerComponent = player.getComponent(playerComponent_6.PlayerComponent.COMPONENT_ID);
        if (playerComponent.aura == false) {
            playerComponent.aura = true;
        }
        else {
            auraCollectedAgain = true;
        }
        setTimeout(() => {
            if (auraCollectedAgain == false) {
                playerComponent.aura = false;
            }
            else {
                auraCollectedAgain = false;
            }
        }, global_12.IN_GAME_SECOND * 15);
        main_1.deleteObject(object);
    }
    function playerDeathStarPowerupCollision(player, object) {
        main_1.deleteObject(object);
        let toBeDeleted = [];
        for (const object of objects_4.objects) {
            const tagComponent = object.getComponent(tagComponent_1.TagComponent.COMPONENT_ID);
            if (tagComponent.tags.includes(global_12.Tag.Enemy) && !tagComponent.tags.includes(global_12.Tag.Boss)) {
                toBeDeleted.push(object);
            }
        }
        for (object of toBeDeleted) {
            main_1.deleteObject(object);
        }
    }
    function playerLootCollision(player, object) {
        const lootComponent = object.getComponent(lootComponent_1.LootComponent.COMPONENT_ID);
        const inventoryComponent = player.getComponent(inventoryComponent_2.InventoryComponent.COMPONENT_ID);
        if (lootComponent.inventoryItem != null) {
            inventoryComponent_2.addInventoryItem(lootComponent.inventoryItem, inventoryComponent.inventories[1]);
        }
        main_1.deleteObject(object);
    }
    function playerGenericCollision(player, object) {
        const playerComponent = player.getComponent(playerComponent_6.PlayerComponent.COMPONENT_ID);
        if (playerComponent.attacking == false) {
            if (playerComponent.aura == true) {
                playerComponent.aura = false;
            }
            else {
                playerComponent.stats[inventoryComponent_2.InventoryItemStat.Lives] -= 1;
                const soundComponent = gameSystem_1.gameEntity.getComponent(soundComponent_2.SoundComponent.COMPONENT_ID);
                soundComponent.playSound(gameSystem_1.GameSound.PlayerHit);
            }
        }
        main_1.deleteObject(object);
    }
    function arrowFrankensteinCollision(arrow, object) {
        const frankensteinComponent = object.getComponent(frankensteinComponent_1.default.COMPONENT_ID);
        frankensteinComponent.health -= 1;
        if (frankensteinComponent.health < 1) {
            main_1.deleteObject(object);
            main_1.deleteObject(arrow);
        }
        else {
            dealDamageToCollidingObjects(arrow, object);
        }
        playArrowImpactSound();
    }
    function arrowGenericCollision(arrow, object) {
        main_1.deleteObject(object);
        main_1.deleteObject(arrow);
        playArrowImpactSound();
    }
    function arrowGoblinBossCollision(arrow, object) {
        const goblinBossComponent = object.getComponent(goblinBossComponent_1.default.COMPONENT_ID);
        goblinBossComponent.health -= 1;
        objects_4.objects.splice(objects_4.objects.indexOf(arrow), 1);
        playArrowImpactSound();
        console.log(goblinBossComponent.health);
    }
    function arrowGolemBossCollision(arrow, object) {
        const golemBossComponent = object.getComponent(golemBossComponent_1.default.COMPONENT_ID);
        if (golemBossComponent.armor > 0) {
            golemBossComponent.armor -= 1;
        }
        else {
            golemBossComponent.health -= 1;
        }
        objects_4.objects.splice(objects_4.objects.indexOf(arrow), 1);
        playArrowImpactSound();
        console.log(golemBossComponent.health);
    }
    function playArrowImpactSound() {
        const soundComponent = gameSystem_1.gameEntity.getComponent(soundComponent_2.SoundComponent.COMPONENT_ID);
        soundComponent.playSound(gameSystem_1.GameSound.ArrowHit);
    }
    function dealDamageToCollidingObjects(object1, object2) {
        objects_4.objects.splice(objects_4.objects.indexOf(object1), 1);
        const animatedComponent = object2.getComponent(animatedComponent_5.AnimatedComponent.COMPONENT_ID);
        animatedComponent.spritesheet.src = "assets/images/frankensteinHurt.png";
    }
    exports_24("dealDamageToCollidingObjects", dealDamageToCollidingObjects);
    return {
        setters: [
            function (positionComponent_12_1) {
                positionComponent_12 = positionComponent_12_1;
            },
            function (drawCircleComponent_1_1) {
                drawCircleComponent_1 = drawCircleComponent_1_1;
            },
            function (global_12_1) {
                global_12 = global_12_1;
            },
            function (tagComponent_1_1) {
                tagComponent_1 = tagComponent_1_1;
            },
            function (frankensteinComponent_1_1) {
                frankensteinComponent_1 = frankensteinComponent_1_1;
            },
            function (objects_4_1) {
                objects_4 = objects_4_1;
            },
            function (playerComponent_6_1) {
                playerComponent_6 = playerComponent_6_1;
            },
            function (soundComponent_2_1) {
                soundComponent_2 = soundComponent_2_1;
            },
            function (gameSystem_1_1) {
                gameSystem_1 = gameSystem_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (animatedComponent_5_1) {
                animatedComponent_5 = animatedComponent_5_1;
            },
            function (cameraSystem_1_1) {
                cameraSystem_1 = cameraSystem_1_1;
            },
            function (skeletonComponent_1_1) {
                skeletonComponent_1 = skeletonComponent_1_1;
            },
            function (inventoryComponent_2_1) {
                inventoryComponent_2 = inventoryComponent_2_1;
            },
            function (goblinBossComponent_1_1) {
                goblinBossComponent_1 = goblinBossComponent_1_1;
            },
            function (golemBossComponent_1_1) {
                golemBossComponent_1 = golemBossComponent_1_1;
            },
            function (lootComponent_1_1) {
                lootComponent_1 = lootComponent_1_1;
            }
        ],
        execute: function () {
            CollisionSystem = class CollisionSystem {
                static registry = {
                    [global_12.Tag.Player]: {
                        [global_12.Tag.Coin]: playerCoinCollision,
                        [global_12.Tag.Frankenstein]: playerFrankensteinCollision,
                        [global_12.Tag.Fireball]: playerGenericCollision,
                        [global_12.Tag.MoneyPouch]: playerGenericCollision,
                        [global_12.Tag.Skeleton]: playerSkeletonCollision,
                        [global_12.Tag.Dragon]: playerGenericCollision,
                        [global_12.Tag.Minotaur]: playerGenericCollision,
                        [global_12.Tag.Ghost]: playerGenericCollision,
                        [global_12.Tag.GoblinBoss]: playerGoblinBossCollision,
                        [global_12.Tag.ExtendedVisionPowerup]: playerExtendedVisionPowerupCollision,
                        [global_12.Tag.AuraPowerup]: playerAuraPowerupCollision,
                        [global_12.Tag.DeathStarPowerup]: playerDeathStarPowerupCollision,
                        [global_12.Tag.Loot]: playerLootCollision,
                        [global_12.Tag.Laser]: playerGenericCollision,
                        [global_12.Tag.ArmProjectile]: playerGenericCollision,
                    },
                    [global_12.Tag.Arrow]: {
                        [global_12.Tag.Frankenstein]: arrowFrankensteinCollision,
                        [global_12.Tag.Skeleton]: arrowGenericCollision,
                        [global_12.Tag.Dragon]: arrowGenericCollision,
                        [global_12.Tag.Minotaur]: arrowGenericCollision,
                        [global_12.Tag.Ghost]: arrowGenericCollision,
                        [global_12.Tag.GoblinBoss]: arrowGoblinBossCollision,
                        [global_12.Tag.GolemBoss]: arrowGolemBossCollision,
                    }
                };
                static checkObjectsColliding(obj1, obj2) {
                    // do both of these have a position component (As they should!?)
                    if (obj1.getComponent(positionComponent_12.default.COMPONENT_ID) == null || obj2.getComponent(positionComponent_12.default.COMPONENT_ID) == null) {
                        return;
                    }
                    const positionComponent1 = obj1.getComponent(positionComponent_12.default.COMPONENT_ID);
                    const positionComponent2 = obj2.getComponent(positionComponent_12.default.COMPONENT_ID);
                    // do any of these have a circular component (because if they do, we have to do a different check)
                    if (obj1.getComponent(drawCircleComponent_1.default.COMPONENT_ID) != null || obj2.getComponent(drawCircleComponent_1.default.COMPONENT_ID) != null) {
                        if (obj1.getComponent(drawCircleComponent_1.default.COMPONENT_ID) != null && obj2.getComponent(drawCircleComponent_1.default.COMPONENT_ID) != null) {
                            return (positionComponent1.x - positionComponent1.radius <= positionComponent2.x + positionComponent2.radius &&
                                positionComponent1.x + positionComponent1.radius >= positionComponent2.x - positionComponent2.radius &&
                                positionComponent1.y + positionComponent1.radius >= positionComponent2.y - positionComponent2.radius &&
                                positionComponent1.y - positionComponent1.radius <= positionComponent2.y + positionComponent2.radius);
                        }
                        else if (obj1.getComponent(drawCircleComponent_1.default.COMPONENT_ID) != null && obj1.getComponent(drawCircleComponent_1.default.COMPONENT_ID) == null) {
                            return (positionComponent1.x - positionComponent1.radius <= positionComponent2.x + positionComponent2.width / 2 &&
                                positionComponent1.x + positionComponent1.radius >= positionComponent2.x - positionComponent2.width / 2 &&
                                positionComponent1.y + positionComponent1.radius >= positionComponent2.y - positionComponent2.height / 2 &&
                                positionComponent1.y - positionComponent1.radius <= positionComponent2.y + positionComponent2.height / 2);
                        }
                        else {
                            return (positionComponent1.x - positionComponent1.width / 2 <= positionComponent2.x + positionComponent2.radius &&
                                positionComponent1.x + positionComponent1.width / 2 >= positionComponent2.x - positionComponent2.radius &&
                                positionComponent1.y + positionComponent1.height / 2 >= positionComponent2.y - positionComponent2.radius &&
                                positionComponent1.y - positionComponent1.height / 2 <= positionComponent2.y + positionComponent2.radius);
                        }
                    }
                    else {
                        return (positionComponent1.x - positionComponent1.width / 2 <= positionComponent2.x + positionComponent2.width / 2 &&
                            positionComponent1.x + positionComponent1.width / 2 >= positionComponent2.x - positionComponent2.width / 2 &&
                            positionComponent1.y + positionComponent1.height / 2 >= positionComponent2.y - positionComponent2.height / 2 &&
                            positionComponent1.y - positionComponent1.height / 2 <= positionComponent2.y + positionComponent2.height / 2);
                    }
                }
                static matchPair(entity1, entity2) {
                    const tagComponent1 = entity1.getComponent(tagComponent_1.TagComponent.COMPONENT_ID);
                    const tagComponent2 = entity2.getComponent(tagComponent_1.TagComponent.COMPONENT_ID);
                    console.log(tagComponent1.tags, tagComponent2.tags);
                    // console.log("colliding");
                    for (const tag1 of tagComponent1.tags) {
                        const firstTag = tag1;
                        for (const tag2 of tagComponent2.tags) {
                            const secondTag = tag2;
                            if (this.registry[firstTag] && this.registry[firstTag][secondTag]) {
                                this.registry[firstTag][secondTag](entity1, entity2);
                            }
                            else if (this.registry[secondTag] && this.registry[secondTag][firstTag]) {
                                this.registry[secondTag][firstTag](entity2, entity1);
                            }
                        }
                    }
                }
            };
            exports_24("default", CollisionSystem);
            extendedVisionCollectedAgain = false;
            auraCollectedAgain = false;
        }
    };
});
System.register("components/imagePartComponent", ["global", "entityComponent", "components/positionComponent"], function (exports_25, context_25) {
    "use strict";
    var global_13, entityComponent_20, positionComponent_13, ImagePartComponent;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (global_13_1) {
                global_13 = global_13_1;
            },
            function (entityComponent_20_1) {
                entityComponent_20 = entityComponent_20_1;
            },
            function (positionComponent_13_1) {
                positionComponent_13 = positionComponent_13_1;
            }
        ],
        execute: function () {
            ImagePartComponent = class ImagePartComponent extends entityComponent_20.Component {
                static COMPONENT_ID = "ImagePart";
                image;
                imageSX;
                imageSY;
                imageSW;
                imageSH;
                constructor(imageURL, imageSX, imageSY, imageSW, imageSH) {
                    super();
                    this.image = new Image();
                    this.image.src = imageURL;
                    this.imageSX = imageSX;
                    this.imageSY = imageSY;
                    this.imageSW = imageSW;
                    this.imageSH = imageSH;
                }
                draw() {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_13.default.COMPONENT_ID);
                    global_13.context.drawImage(this.image, this.imageSX, this.imageSY, this.imageSW, this.imageSH, positionComponent.x - positionComponent.width / 2, positionComponent.y - positionComponent.height / 2, positionComponent.width, positionComponent.height);
                }
            };
            exports_25("ImagePartComponent", ImagePartComponent);
        }
    };
});
System.register("systems/achievementSystem", ["global", "systems/saveGameSystem"], function (exports_26, context_26) {
    "use strict";
    var global_14, saveGameSystem_1, AchievementName, ValueType, AchievementSystem;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (global_14_1) {
                global_14 = global_14_1;
            },
            function (saveGameSystem_1_1) {
                saveGameSystem_1 = saveGameSystem_1_1;
            }
        ],
        execute: function () {
            (function (AchievementName) {
                AchievementName["GoldCollector"] = "Gold Collector";
                AchievementName["GoldHorder"] = "Gold Horder";
                AchievementName["GoldMonger"] = "Gold Monger";
                AchievementName["Apprentice"] = "Apprentice";
                AchievementName["Warrior"] = "Master Warrior";
                AchievementName["Sensei"] = "Sensei";
                AchievementName["GoblinBossDefeated"] = "GoblinBossDefeated";
                AchievementName["GolemBossDefeated"] = "GolemBossDefeated";
                AchievementName["ItemCollector"] = "ItemCollector";
                AchievementName["ItemHorder"] = "ItemHorder";
                AchievementName["ItemMonger"] = "ItemMonger";
            })(AchievementName || (AchievementName = {}));
            (function (ValueType) {
                ValueType["Gold"] = "gold";
                ValueType["EnemiesDefeated"] = "enemiesDefeated";
                ValueType["GoblinBossDefeated"] = "GoblinBossDefeated";
                ValueType["GolemBossDefeated"] = "GolemBossDefeated";
                ValueType["Item"] = "Item";
            })(ValueType || (ValueType = {}));
            exports_26("ValueType", ValueType);
            AchievementSystem = class AchievementSystem {
                static Instance = new AchievementSystem();
                _achievements;
                constructor() {
                    if (saveGameSystem_1.default.Instance.loadData(saveGameSystem_1.SaveKey.AchievementInfo)) {
                        this._achievements = saveGameSystem_1.default.Instance.loadData(saveGameSystem_1.SaveKey.AchievementInfo);
                        console.log(saveGameSystem_1.default.Instance.loadData(saveGameSystem_1.SaveKey.AchievementInfo));
                    }
                    else {
                        this._achievements = [
                            {
                                name: AchievementName.GoldCollector,
                                description: "Collect 100 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Gold,
                                requisite: 100
                            },
                            {
                                name: AchievementName.GoldHorder,
                                description: "Collect 300 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Gold,
                                requisite: 300
                            },
                            {
                                name: AchievementName.GoldMonger,
                                description: "Collect 500 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Gold,
                                requisite: 500
                            },
                            {
                                name: AchievementName.Apprentice,
                                description: "Defeat 10 enemies",
                                isUnlocked: false,
                                valueType: ValueType.EnemiesDefeated,
                                requisite: 10
                            },
                            {
                                name: AchievementName.Warrior,
                                description: "Defeat 100 enemies",
                                isUnlocked: false,
                                valueType: ValueType.EnemiesDefeated,
                                requisite: 100
                            },
                            {
                                name: AchievementName.Sensei,
                                description: "Defeat 300 enemies",
                                isUnlocked: false,
                                valueType: ValueType.EnemiesDefeated,
                                requisite: 300
                            },
                            {
                                name: AchievementName.ItemCollector,
                                description: "Collect 8 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Item,
                                requisite: 8
                            },
                            {
                                name: AchievementName.ItemHorder,
                                description: "Collect 16 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Item,
                                requisite: 16
                            },
                            {
                                name: AchievementName.ItemMonger,
                                description: "Collect 24 pieces of gold",
                                isUnlocked: false,
                                valueType: ValueType.Item,
                                requisite: 24
                            },
                            {
                                name: AchievementName.GoblinBossDefeated,
                                description: "Goblin boss defeated",
                                isUnlocked: false,
                                valueType: ValueType.GoblinBossDefeated,
                                requisite: 1
                            },
                            {
                                name: AchievementName.GolemBossDefeated,
                                description: "Golem boss defeated",
                                isUnlocked: false,
                                valueType: ValueType.GolemBossDefeated,
                                requisite: 1
                            },
                        ];
                    }
                }
                checkAchievements(gold, enemiesDefeated, bossesDefeated, itemsCount) {
                    const achievementsLeft = this.getLockedAchievements();
                    for (const achievement of achievementsLeft) {
                        switch (achievement.valueType) {
                            case ValueType.Gold:
                                this.checkAchievementAccomplishedFunction(gold, achievement.name, achievement.requisite);
                                break;
                            case ValueType.EnemiesDefeated:
                                this.checkAchievementAccomplishedFunction(enemiesDefeated, achievement.name, achievement.requisite);
                                break;
                            case ValueType.GoblinBossDefeated:
                                this.checkAchievementAccomplishedFunction(bossesDefeated[ValueType.GoblinBossDefeated], achievement.name, achievement.requisite);
                                break;
                            case ValueType.GolemBossDefeated:
                                this.checkAchievementAccomplishedFunction(bossesDefeated[ValueType.GolemBossDefeated], achievement.name, achievement.requisite);
                                break;
                            case ValueType.Item:
                                this.checkAchievementAccomplishedFunction(itemsCount, achievement.name, achievement.requisite);
                                break;
                            default:
                                break;
                        }
                    }
                }
                checkAchievementAccomplishedFunction(value, name, requisite) {
                    if (value >= requisite) {
                        AchievementSystem.Instance.unlockAchievement(name);
                    }
                }
                unlockAchievement(name) {
                    const achievement = this._achievements.find(a => a.name === name);
                    if (achievement && !achievement.isUnlocked) {
                        achievement.isUnlocked = true;
                        console.log(`Achievement unlocked: ${achievement.name}`);
                    }
                }
                getLockedAchievements() {
                    return this._achievements.filter(a => !a.isUnlocked);
                }
                getUnlockedAchievements() {
                    return this._achievements.filter(a => a.isUnlocked);
                }
                drawAchievements() {
                    const width = global_14.canvas.width / this._achievements.length;
                    const height = global_14.canvas.width / this._achievements.length;
                    let x = width / 2;
                    let y = height / 2;
                    for (const achievement of this._achievements) {
                        this.drawSingleAchievement(achievement, x, y, width, height);
                        if (x < global_14.canvas.width - width * 1.5) {
                            x += width;
                        }
                        else {
                            x = width / 2;
                            y += height;
                        }
                    }
                }
                drawSingleAchievement(achievement, x, y, width, height) {
                    global_14.context.fillStyle = "gray";
                    global_14.context.fillRect(x - width / 2, y - height / 2, width, height);
                    global_14.context.strokeStyle = "blue";
                    global_14.context.lineWidth = 2;
                    global_14.context.strokeRect(x - width / 2, y - height / 2, width, height);
                    global_14.context.fillStyle = "black";
                    global_14.context.font = "25px Arial";
                    global_14.context.fillText(achievement.description, x - width / 4, y);
                    if (achievement.isUnlocked) {
                        global_14.context.fillStyle = "yellow";
                        global_14.context.fillText("Completed", x - width / 4, y + 50);
                    }
                }
                get AchievementInfo() {
                    return this._achievements;
                }
            };
            exports_26("default", AchievementSystem);
        }
    };
});
System.register("systems/saveGameSystem", [], function (exports_27, context_27) {
    "use strict";
    var SaveGameSystem, SaveKey;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
            SaveGameSystem = class SaveGameSystem {
                static Instance = new SaveGameSystem();
                saveData(key, data) {
                    localStorage.setItem(key, JSON.stringify(data));
                }
                loadData(key) {
                    const textRepresentation = localStorage.getItem(key);
                    if (!textRepresentation) {
                        return null;
                    }
                    return JSON.parse(textRepresentation);
                }
                saveGameData(gold, highScore, achievementInfo, foundItems) {
                    this.saveData(SaveKey.Gold, gold);
                    this.saveData(SaveKey.HighScore, highScore);
                    this.saveData(SaveKey.AchievementInfo, achievementInfo);
                    this.saveData(SaveKey.FoundItems, foundItems);
                }
            };
            exports_27("default", SaveGameSystem);
            (function (SaveKey) {
                SaveKey["Gold"] = "gold";
                SaveKey["HighScore"] = "highScore";
                SaveKey["AchievementInfo"] = "achivementInfo";
                SaveKey["FoundItems"] = "FoundItems";
            })(SaveKey || (SaveKey = {}));
            exports_27("SaveKey", SaveKey);
        }
    };
});
System.register("main", ["components/playerComponent", "global", "entityComponent", "components/positionComponent", "components/drawCircleComponent", "components/animatedComponent", "components/movementComponent", "systems/gameSystem", "objects", "systems/collisionSystem", "components/inventoryComponent", "components/gameComponent", "components/soundComponent", "components/imagePartComponent", "systems/cameraSystem", "systems/saveGameSystem", "components/tagComponent", "systems/achievementSystem", "entityGenerator"], function (exports_28, context_28) {
    "use strict";
    var playerComponent_7, playerComponent_8, global_15, entityComponent_21, positionComponent_14, drawCircleComponent_2, animatedComponent_6, movementComponent_3, gameSystem_2, objects_5, collisionSystem_1, inventoryComponent_3, gameComponent_2, soundComponent_3, imagePartComponent_1, cameraSystem_2, saveGameSystem_2, tagComponent_2, achievementSystem_1, entityGenerator_3, playerComponent, gold, score, highScore, ORIGINAL_FALL_SPEED, fallSpeed, ORIGINAL_SPAWN_DELAY, spawnDelay, lastTime, ORIGINAL_ENEMY_INTERVAL_TIME, objectIntervalTime, nextobjectTime, ORIGINAL_OBJECT_TYPES_COUNT, objectTypesCount, lastSpawn, playerImage, EnemyType, EnemyTypeGenerator, ORIGINAL_ENEMIES_PER_LANE, enemiesPerLane, ORIGINAL_SPAWN_TYPES, currentSpawnTypes, PowerupType, PowerupTypeGenerator, enemiesDefeated, BossesDefeated;
    var __moduleName = context_28 && context_28.id;
    function startMusicTracks() {
        const soundComponent = gameSystem_2.gameEntity.getComponent(soundComponent_3.SoundComponent.COMPONENT_ID);
        if (!soundComponent.loadedSounds[gameSystem_2.GameSound.Track1].played) {
            return;
        }
        // soundComponent.playSound(GameSound.Track1);
        const sounds = [gameSystem_2.GameSound.Track1, gameSystem_2.GameSound.Track2, gameSystem_2.GameSound.Track3];
        soundComponent.playSounds(sounds);
        document.body.removeEventListener('keydown', startMusicTracks);
    }
    function addScore(scoreIncreaseValue) {
        score += scoreIncreaseValue;
    }
    exports_28("addScore", addScore);
    function addGold(goldIncreaseValue) {
        gold += goldIncreaseValue;
    }
    exports_28("addGold", addGold);
    function changeSpawnDelay(spawnIncrement) {
        exports_28("spawnDelay", spawnDelay -= spawnIncrement);
    }
    exports_28("changeSpawnDelay", changeSpawnDelay);
    function changeFallSpeed(fallIncrement) {
        exports_28("fallSpeed", fallSpeed += fallIncrement);
    }
    exports_28("changeFallSpeed", changeFallSpeed);
    function resetValues() {
        exports_28("spawnDelay", spawnDelay = ORIGINAL_SPAWN_DELAY);
        exports_28("fallSpeed", fallSpeed = ORIGINAL_FALL_SPEED);
        objectTypesCount = ORIGINAL_OBJECT_TYPES_COUNT;
        objectIntervalTime = ORIGINAL_ENEMY_INTERVAL_TIME;
        currentSpawnTypes = ORIGINAL_SPAWN_TYPES;
        enemiesPerLane = ORIGINAL_ENEMIES_PER_LANE;
        enemiesPerLane = [0, 0, 0];
        if (score > highScore) {
            highScore = score;
        }
        score = 0;
    }
    exports_28("resetValues", resetValues);
    // Main processing objectsLoop 
    function runFrame() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        let gameSpeed = 1;
        if (playerComponent.state != playerComponent_8.PlayerState.Running || global_15.allPressedKeys[global_15.KEYS.E]) {
            gameSpeed = 1;
        }
        else {
            gameSpeed = 0.3;
        }
        // update state
        if (gameComponent_2.gameState == gameComponent_2.GameState.Playing) {
            update(deltaTime, gameSpeed);
        }
        // draw the world
        draw();
        // be called one more time
        requestAnimationFrame(runFrame);
        checkobjectTypesCount(currentTime);
        gameSystem_2.gameEntity.update(deltaTime, gameSpeed);
    }
    function checkobjectTypesCount(currentTime) {
        if (currentTime >= nextobjectTime && objectTypesCount <= Object.keys(EnemyType).length) {
            objectTypesCount += 1;
            currentSpawnTypes.push(Object.values(EnemyType)[objectTypesCount - global_15.OFFSET]);
            nextobjectTime += objectIntervalTime;
            objectIntervalTime += 5 * global_15.IN_GAME_SECOND;
        }
    }
    function update(deltaTime, gameSpeed) {
        const SPAWN_INCREMENT = 0.1;
        const FALL_INCREMENT = 0.02;
        const SCORE_INCREMENT = 0.001;
        let scoreIncreaseSpeed = 1;
        addScore(scoreIncreaseSpeed);
        const inventoryComponent = playerComponent_7.player.getComponent(inventoryComponent_3.InventoryComponent.COMPONENT_ID);
        let itemsCount = inventoryComponent.inventories[0].count + inventoryComponent.inventories[1].count;
        achievementSystem_1.default.Instance.checkAchievements(gold, enemiesDefeated, BossesDefeated, itemsCount);
        if (global_15.checkTime(spawnDelay, lastSpawn)) {
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
        playerComponent_7.player.update(deltaTime, gameSpeed);
        changeSpawnDelay(SPAWN_INCREMENT);
        changeFallSpeed(FALL_INCREMENT);
        scoreIncreaseSpeed += SCORE_INCREMENT;
        // console.log(`This is the score increase speed: ${scoreIncreaseSpeed}`);
    }
    function draw() {
        // 2d context can do primitive graphic object manipulation
        // it can draw points, lines, and anything composed of those
        // it has predefined commands for basic objects like players, coins and images
        // when drawing, we can decide whether we want to stroke or fill the path
        // before we start drawing, clear the canvas
        global_15.context.clearRect(0, 0, global_15.canvas.width, global_15.canvas.height);
        if (gameComponent_2.gameState == gameComponent_2.GameState.Playing) {
            cameraSystem_2.default.Instance.beginDraw();
            gameSystem_2.gameEntity.draw();
            for (let i = objects_5.objects.length - global_15.OFFSET; i >= 0; i--) {
                objects_5.objects[i].draw();
            }
            cameraSystem_2.default.Instance.endDraw();
            // Text postition innformation
            const GOLD_TEXT_LOCATION = {
                x: 50,
                y: 150
            };
            const LIVES_TEXT_LOCATION = {
                x: 50,
                y: 200
            };
            const HIGH_SCORE_LOCATION = {
                x: 50,
                y: 50
            };
            const SCORE_LOCATION = {
                x: 50,
                y: 100
            };
            global_15.context.fillStyle = "black";
            global_15.context.font = "20px Arial";
            global_15.context.fillText(`SCORE: ${score}`, SCORE_LOCATION.x, SCORE_LOCATION.y);
            global_15.context.font = "20px Arial";
            global_15.context.fillText(`HIGH SCORE: ${highScore}`, HIGH_SCORE_LOCATION.x, HIGH_SCORE_LOCATION.y);
            global_15.context.fillText(`GOLD: ${gold}`, GOLD_TEXT_LOCATION.x, GOLD_TEXT_LOCATION.y);
            global_15.context.font = "20px Arial";
            if (playerComponent.stats[inventoryComponent_3.InventoryItemStat.Lives] > 0) {
                global_15.context.font = "20px Arial";
                global_15.context.fillText(`LIVES: ${playerComponent.stats[inventoryComponent_3.InventoryItemStat.Lives]}`, LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
            }
            else {
                global_15.context.fillStyle = "red";
                global_15.context.font = "20px Arial";
                global_15.context.fillText("CERTAIN DEATH (MOVE TO STAY ALIVE. DO NOT GET HIT)", LIVES_TEXT_LOCATION.x, LIVES_TEXT_LOCATION.y);
            }
        }
        else if (gameComponent_2.gameState == gameComponent_2.GameState.InventoryMenu) {
            // draw player inventories
            if (playerComponent_7.player.getComponent(inventoryComponent_3.InventoryComponent.COMPONENT_ID) == null) {
                return;
            }
            const inventoryComponent = playerComponent_7.player.getComponent(inventoryComponent_3.InventoryComponent.COMPONENT_ID);
            for (const inventory of inventoryComponent.inventories) {
                inventory.draw();
            }
            for (const image of objects_5.images) {
                image.draw();
            }
            playerImage.draw();
        }
        else if (gameComponent_2.gameState == gameComponent_2.GameState.AchievementsMenu) {
            // draw achievements
            achievementSystem_1.default.Instance.drawAchievements();
        }
    }
    function spawnEnemy() {
        const spawnProbabilities = currentSpawnTypes.map((spawnType, index) => {
            const difficultyFactor = index + 1; // Difficulty factor = enemy type index + 1
            const baseProbability = 1 / Object.values(currentSpawnTypes).length; // Base probability for each enemy type
            const difficultyBonus = difficultyFactor * 0.1; // Increase probability by 10% for each difficulty factor
            const spawnProbability = baseProbability + difficultyBonus;
            return spawnProbability;
        });
        let spawnIndex = weightedRandom(spawnProbabilities);
        let generateType = Object.values(currentSpawnTypes)[spawnIndex];
        let weights = enemiesPerLane.map(count => 1 / (count + 1));
        let objectLane = weightedRandom(weights) + global_15.OFFSET;
        for (let i = 0; i < enemiesPerLane.length; i++) {
            if (i == objectLane - global_15.OFFSET) {
                enemiesPerLane[i] += 1;
            }
        }
        let objectLaneLocation = global_15.calculateLaneLocation(objectLane);
        EnemyTypeGenerator[generateType](objectLaneLocation, fallSpeed);
    }
    function weightedRandom(weights) {
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
    function spawnPowerup() {
        let spawnIndex = Math.floor(Math.random() * Object.values(PowerupType).length);
        console.log(spawnIndex);
        let generateType = Object.values(PowerupType)[spawnIndex];
        let objectLane = Math.ceil(Math.random() * global_15.LANE.COUNT);
        let objectLaneLocation = global_15.calculateLaneLocation(objectLane);
        console.log(generateType, objectLaneLocation);
        PowerupTypeGenerator[generateType](objectLaneLocation, fallSpeed);
    }
    function objectsLoop(deltaTime, gameSpeed, FALL_INCREMENT) {
        for (let i = 0; i < objects_5.objects.length; i++) {
            if (objects_5.objects[i].getComponent(positionComponent_14.default.COMPONENT_ID) == null) {
                console.log("object doesn't have a position component");
                return;
            }
            else if (objects_5.objects[i].getComponent(movementComponent_3.default.COMPONENT_ID) != null) {
                const movementComponent = objects_5.objects[i].getComponent(movementComponent_3.default.COMPONENT_ID);
                const positionComponent = objects_5.objects[i].getComponent(positionComponent_14.default.COMPONENT_ID);
                if (objects_5.objects[i].getComponent(drawCircleComponent_2.default.COMPONENT_ID) == null) {
                    if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.height / 2)) {
                        const object = objects_5.objects[i];
                        deleteObject(object);
                        continue;
                    }
                }
                else {
                    if (outOfBoundsCheck(movementComponent, positionComponent, positionComponent.radius)) {
                        const object = objects_5.objects[i];
                        deleteObject(object);
                        continue;
                    }
                }
                movementComponent.speed += FALL_INCREMENT;
            }
            objects_5.objects[i].update(deltaTime, gameSpeed);
            if (objects_5.objects[i].name == global_15.EntityName.Arrow) {
                const arrow = objects_5.objects[i];
                for (let j = 0; j < objects_5.objects.length; j++) {
                    const object = objects_5.objects[j];
                    const tagComponent = object.getComponent(tagComponent_2.TagComponent.COMPONENT_ID);
                    if (tagComponent.tags.includes(global_15.Tag.Enemy)) {
                        console.assert(arrow != undefined);
                        console.assert(object != undefined);
                        if (collisionSystem_1.default.checkObjectsColliding(arrow, object)) {
                            collisionSystem_1.default.matchPair(arrow, object);
                        }
                        continue;
                    }
                }
            }
            else if (objects_5.objects[i] != playerComponent_7.player && collisionSystem_1.default.checkObjectsColliding(objects_5.objects[i], playerComponent_7.player)) {
                collisionSystem_1.default.matchPair(objects_5.objects[i], playerComponent_7.player);
            }
        }
    }
    function outOfBoundsCheck(movementComponent, positionComponent, shapeDistance) {
        if (movementComponent.yDirection == -1 && positionComponent.y <= -shapeDistance ||
            movementComponent.yDirection == 1 && positionComponent.y >= global_15.canvas.height + shapeDistance) {
            return true;
        }
        return false;
    }
    function deleteObject(object) {
        objects_5.objects.splice(objects_5.objects.indexOf(object), 1);
        const tagComponent = object.getComponent(tagComponent_2.TagComponent.COMPONENT_ID);
        if (tagComponent.tags.includes(global_15.Tag.Enemy)) {
            if (tagComponent.tags.includes(global_15.Tag.Boss)) {
                generateItem(object);
                if (tagComponent.tags.includes(global_15.Tag.GoblinBoss)) {
                    BossesDefeated[achievementSystem_1.ValueType.GoblinBossDefeated] = 1;
                }
                if (tagComponent.tags.includes(global_15.Tag.GolemBoss)) {
                    BossesDefeated[achievementSystem_1.ValueType.GolemBossDefeated] = 1;
                }
            }
            else if (Math.random() > 0.000001) {
                generateItem(object);
            }
            const positionComponent = object.getComponent(positionComponent_14.default.COMPONENT_ID);
            let objectLane = global_15.findLane(positionComponent.x);
            for (let i = 0; i < enemiesPerLane.length; i++) {
                if (i == objectLane - global_15.OFFSET) {
                    enemiesPerLane[i] -= 1;
                    const tagComponent = object.getComponent(tagComponent_2.TagComponent.COMPONENT_ID);
                    if (!tagComponent.tags.includes(global_15.Tag.Coin)) {
                        enemiesDefeated += 1;
                    }
                }
            }
        }
    }
    exports_28("deleteObject", deleteObject);
    function generateItem(object) {
        let itemName = "";
        let item = null;
        let randomNum = Math.random();
        if (randomNum < 0.5) {
            itemName = Object.keys(inventoryComponent_3.Items.Armor)[Math.floor(Math.random() * Object.keys(inventoryComponent_3.Items.Armor).length)];
            item = inventoryComponent_3.Items.Armor[itemName];
        }
        else {
            const itemNum = Math.floor(Math.random() * Object.keys(inventoryComponent_3.Items.Weapons).length);
            itemName = Object.keys(inventoryComponent_3.Items.Weapons)[itemNum];
            item = Object.values(inventoryComponent_3.Items.Weapons)[itemNum];
            console.log(item);
        }
        for (const loot of Object.values(inventoryComponent_3.Items.Weapons)) {
            const positionComponent = object.getComponent(positionComponent_14.default.COMPONENT_ID);
            const inventoryItem = inventoryComponent_3.createInventoryItem(loot, itemName);
            entityGenerator_3.generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
        }
        for (const loot of Object.values(inventoryComponent_3.Items.Armor)) {
            const positionComponent = object.getComponent(positionComponent_14.default.COMPONENT_ID);
            const inventoryItem = inventoryComponent_3.createInventoryItem(loot, itemName);
            entityGenerator_3.generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
        }
        // create item
        // const positionComponent = object.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
        // const inventoryItem = createInventoryItem(item, itemName);
        // generateLoot(positionComponent.x, positionComponent.y, fallSpeed, inventoryItem);
    }
    return {
        setters: [
            function (playerComponent_7_1) {
                playerComponent_7 = playerComponent_7_1;
                playerComponent_8 = playerComponent_7_1;
            },
            function (global_15_1) {
                global_15 = global_15_1;
            },
            function (entityComponent_21_1) {
                entityComponent_21 = entityComponent_21_1;
            },
            function (positionComponent_14_1) {
                positionComponent_14 = positionComponent_14_1;
            },
            function (drawCircleComponent_2_1) {
                drawCircleComponent_2 = drawCircleComponent_2_1;
            },
            function (animatedComponent_6_1) {
                animatedComponent_6 = animatedComponent_6_1;
            },
            function (movementComponent_3_1) {
                movementComponent_3 = movementComponent_3_1;
            },
            function (gameSystem_2_1) {
                gameSystem_2 = gameSystem_2_1;
            },
            function (objects_5_1) {
                objects_5 = objects_5_1;
            },
            function (collisionSystem_1_1) {
                collisionSystem_1 = collisionSystem_1_1;
            },
            function (inventoryComponent_3_1) {
                inventoryComponent_3 = inventoryComponent_3_1;
            },
            function (gameComponent_2_1) {
                gameComponent_2 = gameComponent_2_1;
            },
            function (soundComponent_3_1) {
                soundComponent_3 = soundComponent_3_1;
            },
            function (imagePartComponent_1_1) {
                imagePartComponent_1 = imagePartComponent_1_1;
            },
            function (cameraSystem_2_1) {
                cameraSystem_2 = cameraSystem_2_1;
            },
            function (saveGameSystem_2_1) {
                saveGameSystem_2 = saveGameSystem_2_1;
            },
            function (tagComponent_2_1) {
                tagComponent_2 = tagComponent_2_1;
            },
            function (achievementSystem_1_1) {
                achievementSystem_1 = achievementSystem_1_1;
            },
            function (entityGenerator_3_1) {
                entityGenerator_3 = entityGenerator_3_1;
            }
        ],
        execute: function () {
            document.body.addEventListener('keydown', startMusicTracks);
            window.addEventListener("beforeunload", function (e) {
                // Save game state here
                const inventoryComponent = playerComponent_7.player.getComponent(inventoryComponent_3.InventoryComponent.COMPONENT_ID);
                saveGameSystem_2.default.Instance.saveGameData(gold, highScore, achievementSystem_1.default.Instance.AchievementInfo, inventoryComponent.inventories[1].cells);
            });
            // Player Component
            playerComponent = playerComponent_7.player.getComponent(playerComponent_7.PlayerComponent.COMPONENT_ID);
            // Changeble variables
            gold = 0;
            score = 0;
            highScore = 0;
            ORIGINAL_FALL_SPEED = 150;
            exports_28("fallSpeed", fallSpeed = ORIGINAL_FALL_SPEED);
            exports_28("ORIGINAL_SPAWN_DELAY", ORIGINAL_SPAWN_DELAY = 1500);
            exports_28("spawnDelay", spawnDelay = ORIGINAL_SPAWN_DELAY);
            // Load Game Data
            if (saveGameSystem_2.default.Instance.loadData(saveGameSystem_2.SaveKey.Gold) != null) {
                gold = saveGameSystem_2.default.Instance.loadData(saveGameSystem_2.SaveKey.Gold);
            }
            if (saveGameSystem_2.default.Instance.loadData(saveGameSystem_2.SaveKey.HighScore) != null) {
                highScore = saveGameSystem_2.default.Instance.loadData(saveGameSystem_2.SaveKey.HighScore);
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
            playerComponent_7.resetGame();
            requestAnimationFrame(runFrame);
            lastTime = Date.now();
            ORIGINAL_ENEMY_INTERVAL_TIME = 10 * global_15.IN_GAME_SECOND;
            objectIntervalTime = ORIGINAL_ENEMY_INTERVAL_TIME;
            nextobjectTime = Date.now() + objectIntervalTime;
            ORIGINAL_OBJECT_TYPES_COUNT = 1;
            objectTypesCount = ORIGINAL_OBJECT_TYPES_COUNT;
            lastSpawn = Date.now() - spawnDelay; //This is in milliseconds
            playerImage = new entityComponent_21.Entity();
            playerImage.addComponent(positionComponent_14.default.COMPONENT_ID, new positionComponent_14.default(500, 500, playerComponent_7.PLAYER.WIDTH * 5, playerComponent_7.PLAYER.HEIGHT * 5, 0));
            playerImage.addComponent(imagePartComponent_1.ImagePartComponent.COMPONENT_ID, new imagePartComponent_1.ImagePartComponent(playerComponent_7.player.getComponent(animatedComponent_6.AnimatedComponent.COMPONENT_ID).spritesheet.src, 0, 140, 60, 60));
            (function (EnemyType) {
                EnemyType["GenerateSkeleton"] = "generateSkeleton";
                EnemyType["GenerateDragon"] = "generateDragon";
                EnemyType["GenerateMinotaur"] = "generateMinotaur";
                EnemyType["GenerateFrankenstein"] = "generateFrankenstein";
                EnemyType["GenerateGhost"] = "generateGhost";
            })(EnemyType || (EnemyType = {}));
            EnemyTypeGenerator = {
                [EnemyType.GenerateSkeleton]: entityGenerator_3.generateSkeleton,
                [EnemyType.GenerateDragon]: entityGenerator_3.generateDragon,
                [EnemyType.GenerateMinotaur]: entityGenerator_3.generateMinotaur,
                [EnemyType.GenerateFrankenstein]: entityGenerator_3.generateFrankenstein,
                [EnemyType.GenerateGhost]: entityGenerator_3.generateGhost
            };
            ORIGINAL_ENEMIES_PER_LANE = [0, 0, 0];
            enemiesPerLane = ORIGINAL_ENEMIES_PER_LANE;
            ORIGINAL_SPAWN_TYPES = [EnemyType.GenerateSkeleton];
            currentSpawnTypes = ORIGINAL_SPAWN_TYPES;
            (function (PowerupType) {
                PowerupType["Coin"] = "coin";
                PowerupType["ExtendedVision"] = "extendedVision";
                PowerupType["Aura"] = "aura";
                PowerupType["DeathStar"] = "deathStar";
            })(PowerupType || (PowerupType = {}));
            PowerupTypeGenerator = {
                [PowerupType.Coin]: entityGenerator_3.generateCoin,
                [PowerupType.ExtendedVision]: entityGenerator_3.generateExtendedVision,
                [PowerupType.Aura]: entityGenerator_3.generateAura,
                [PowerupType.DeathStar]: entityGenerator_3.generateDeathStar,
            };
            enemiesDefeated = 0;
            BossesDefeated = {
                [achievementSystem_1.ValueType.GoblinBossDefeated]: 0,
                [achievementSystem_1.ValueType.GolemBossDefeated]: 0,
            };
            document.body.addEventListener("wheel", (e) => {
                cameraSystem_2.default.Instance.zoomLevel += e.deltaY / 5000;
            });
        }
    };
});
System.register("components/playerComponent", ["entityComponent", "components/positionComponent", "components/animatedComponent", "global", "components/stateMachineComponent", "objects", "components/inventoryComponent", "main", "components/tagComponent", "entityGenerator", "systems/saveGameSystem"], function (exports_29, context_29) {
    "use strict";
    var entityComponent_22, positionComponent_15, animatedComponent_7, global_16, stateMachineComponent_7, objects_6, inventoryComponent_4, main_2, tagComponent_3, entityGenerator_4, saveGameSystem_3, PlayerState, PlayerAnimationName, PlayerComponent, weaponAnimations, StartingItems, StartingStats, PLAYER_MOVEMENT_COOLDOWN, CLICK_DELAY, lastClick, playerSpearAnimationInfo, playerBowAnimationInfo, PLAYER, itemSize, equippedInventory, itemsFound, playerInventory, player, playerComponent, animatedComponent, positionComponent, smComponent, onRunningActivation, onRunningUpdate, onRunningDeactivation, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation, onRollActivation, onRollUpdate, onRollDeactivation, onDyingActivation, onDyingUpdate, onDyingDeactivation;
    var __moduleName = context_29 && context_29.id;
    function resetGame() {
        // LOAD GAME STATE HERE
        const playerComponent = player.getComponent(PlayerComponent.COMPONENT_ID);
        const inventoryComponent = player.getComponent(inventoryComponent_4.InventoryComponent.COMPONENT_ID);
        objects_6.objects.splice(0);
        objects_6.objects.push(player);
        playerComponent.lane = 2;
        playerComponent.setLane();
        for (const inventory of inventoryComponent.inventories) {
            inventory.resetInventory();
        }
        inventoryComponent_4.equipStarterItems(player);
        playerComponent.updateStats();
        playerComponent.updateAnimationBasedOnWeapon();
        smComponent.activate(PlayerState.Running);
        main_2.resetValues();
    }
    exports_29("resetGame", resetGame);
    function checkInput(stateStart) {
        if (checkRollInput() == PlayerState.Roll) {
            return PlayerState.Roll;
        }
        // else if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown] && checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)) {
        //     return PlayerState.Ducking;
        // }
        else if (global_16.allPressedKeys[global_16.KEYS.W] || global_16.allPressedKeys[global_16.KEYS.ArrowUp] && global_16.checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)) {
            return PlayerState.Jumping;
        }
        else if (playerComponent.stats[inventoryComponent_4.InventoryItemStat.Lives] <= 0 && global_16.checkTime(200, stateStart) || playerComponent.stats[inventoryComponent_4.InventoryItemStat.Lives] <= -3) {
            return PlayerState.Dying;
            // Game mechanic: As long as you keep on moving, you will never die, no matter your lives count.
        }
        else if (global_16.mouseDown == true && global_16.checkTime(PLAYER_MOVEMENT_COOLDOWN, stateStart)) {
            return PlayerState.Ducking;
        }
    }
    function checkRollInput() {
        if (global_16.allPressedKeys[global_16.KEYS.A] || global_16.allPressedKeys[global_16.KEYS.ArrowLeft] || global_16.allPressedKeys[global_16.KEYS.D] || global_16.allPressedKeys[global_16.KEYS.ArrowRight]) {
            if (global_16.checkTime(CLICK_DELAY, lastClick) && playerComponent.lane + playerComponent.directionChange <= global_16.LANE.COUNT && playerComponent.lane + playerComponent.directionChange >= 1) {
                if (playerComponent.directionChange != 0) {
                    playerComponent.lane += playerComponent.directionChange;
                    lastClick = Date.now();
                    return PlayerState.Roll;
                }
            }
        }
    }
    return {
        setters: [
            function (entityComponent_22_1) {
                entityComponent_22 = entityComponent_22_1;
            },
            function (positionComponent_15_1) {
                positionComponent_15 = positionComponent_15_1;
            },
            function (animatedComponent_7_1) {
                animatedComponent_7 = animatedComponent_7_1;
            },
            function (global_16_1) {
                global_16 = global_16_1;
            },
            function (stateMachineComponent_7_1) {
                stateMachineComponent_7 = stateMachineComponent_7_1;
            },
            function (objects_6_1) {
                objects_6 = objects_6_1;
            },
            function (inventoryComponent_4_1) {
                inventoryComponent_4 = inventoryComponent_4_1;
            },
            function (main_2_1) {
                main_2 = main_2_1;
            },
            function (tagComponent_3_1) {
                tagComponent_3 = tagComponent_3_1;
            },
            function (entityGenerator_4_1) {
                entityGenerator_4 = entityGenerator_4_1;
            },
            function (saveGameSystem_3_1) {
                saveGameSystem_3 = saveGameSystem_3_1;
            }
        ],
        execute: function () {
            (function (PlayerState) {
                PlayerState["Running"] = "running";
                PlayerState["Jumping"] = "jumping";
                PlayerState["Ducking"] = "ducking";
                PlayerState["Roll"] = "roll";
                PlayerState["Dying"] = "dying";
            })(PlayerState || (PlayerState = {}));
            exports_29("PlayerState", PlayerState);
            ;
            exports_29("PlayerAnimationName", PlayerAnimationName = {
                RunningBack: "runningBack",
                Jumping: "jumping",
                Ducking: "ducking",
                RollingLeft: "rollingLeft",
                RollingRight: "rollingRight",
                Dying: "dying"
            });
            PlayerComponent = class PlayerComponent extends entityComponent_22.Component {
                static COMPONENT_ID = "Player";
                stats;
                weapon;
                weaponAnimations;
                directionChange;
                attacking;
                lane;
                state;
                PREPARE_SPEAR_FRAMES;
                aura;
                constructor(lane, state, startingStats, weaponAnimations) {
                    super();
                    this.stats = startingStats;
                    this.weapon = null;
                    this.weaponAnimations = weaponAnimations;
                    this.directionChange = 0;
                    this.attacking = false;
                    this.lane = lane;
                    this.state = state;
                    this.PREPARE_SPEAR_FRAMES = 4;
                    this.aura = false;
                }
                onAttached() {
                    super.onAttached();
                    this.setLane();
                }
                roll(deltaTime) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_15.default.COMPONENT_ID);
                    positionComponent.x += this.stats[inventoryComponent_4.InventoryItemStat.RollSpeed] * deltaTime / 1000 * this.directionChange;
                }
                updateStats() {
                    if (this._entity == null) {
                        return;
                    }
                    const inventoryComponent = this._entity.getComponent(inventoryComponent_4.InventoryComponent.COMPONENT_ID);
                    this.stats = inventoryComponent.inventories[0].updateStats(StartingStats);
                }
                updateAnimationBasedOnWeapon() {
                    if (this._entity == null) {
                        return;
                    }
                    const animated = this._entity.getComponent(animatedComponent_7.AnimatedComponent.COMPONENT_ID);
                    const inventoryComponent = this._entity.getComponent(inventoryComponent_4.InventoryComponent.COMPONENT_ID);
                    const equippedInventory = inventoryComponent.inventories[0];
                    if (equippedInventory.isEquipped(inventoryComponent_4.ItemList.Spear)) {
                        this.weapon = this.weaponAnimations.Spear;
                        animated.animationInfo = playerSpearAnimationInfo;
                    }
                    else if (equippedInventory.isEquipped(inventoryComponent_4.ItemList.Bow)) {
                        this.weapon = this.weaponAnimations.Bow;
                        animated.animationInfo = playerBowAnimationInfo;
                    }
                    if (this.weapon != null) {
                        animated.spritesheet.src = this.weapon;
                    }
                }
                setLane() {
                    console.assert(this._entity != null);
                    const positionComponent = this._entity.getComponent(positionComponent_15.default.COMPONENT_ID);
                    positionComponent.x = this.lane * global_16.LANE.WIDTH - global_16.LANE.WIDTH / 2;
                }
                draw() {
                    if (this.aura) {
                        const aura = new Image();
                        aura.src = "assets/images/aura.png";
                        global_16.context.drawImage(aura, positionComponent.x - positionComponent.width / 2, positionComponent.y - positionComponent.height / 2, 100, 100);
                    }
                }
            };
            exports_29("PlayerComponent", PlayerComponent);
            // Player Information
            weaponAnimations = {
                Spear: "assets/images/player.png",
                Bow: "assets/images/playerBow.png"
            };
            StartingItems = {
                Armor: "&weapon=Leather_leather",
                Bow: null,
                Spear: "&armour=Thrust_spear_2",
                Boots: null
            };
            exports_29("StartingStats", StartingStats = {
                [inventoryComponent_4.InventoryItemStat.Lives]: 1,
                [inventoryComponent_4.InventoryItemStat.RollSpeed]: 400,
                [inventoryComponent_4.InventoryItemStat.AttackSpeed]: 2
            });
            PLAYER_MOVEMENT_COOLDOWN = 10;
            CLICK_DELAY = 300; //This is in milliseconds
            lastClick = Date.now();
            // Player Animation Information
            exports_29("playerSpearAnimationInfo", playerSpearAnimationInfo = {
                animationCount: 21,
                maxAnimationFrameCount: 13,
                animations: {
                    [PlayerAnimationName.RunningBack]: {
                        rowIndex: 8,
                        frameCount: 8,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Jumping]: {
                        rowIndex: 0,
                        frameCount: 7,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Ducking]: {
                        rowIndex: 4,
                        frameCount: 7,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.RollingLeft]: {
                        rowIndex: 9,
                        frameCount: 9,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.RollingRight]: {
                        rowIndex: 11,
                        frameCount: 9,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Dying]: {
                        rowIndex: 20,
                        frameCount: 6,
                        framesPerSecond: 6
                    }
                }
            });
            exports_29("playerBowAnimationInfo", playerBowAnimationInfo = {
                animationCount: 21,
                maxAnimationFrameCount: 13,
                animations: {
                    [PlayerAnimationName.RunningBack]: {
                        rowIndex: 8,
                        frameCount: 8,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Jumping]: {
                        rowIndex: 0,
                        frameCount: 7,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Ducking]: {
                        rowIndex: 16,
                        frameCount: 13,
                        framesPerSecond: 14
                    },
                    [PlayerAnimationName.RollingLeft]: {
                        rowIndex: 9,
                        frameCount: 9,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.RollingRight]: {
                        rowIndex: 11,
                        frameCount: 9,
                        framesPerSecond: 7
                    },
                    [PlayerAnimationName.Dying]: {
                        rowIndex: 20,
                        frameCount: 6,
                        framesPerSecond: 6
                    }
                }
            });
            // Figure out how to combine these two animation info dictionaries
            exports_29("PLAYER", PLAYER = {
                WIDTH: 100,
                HEIGHT: 100,
            });
            itemSize = {
                width: 50,
                height: 50
            };
            exports_29("equippedInventory", equippedInventory = new inventoryComponent_4.Inventory(5, 3, 200, 200, itemSize, true));
            exports_29("itemsFound", itemsFound = new inventoryComponent_4.Inventory(10, 5, global_16.canvas.width * 3 / 4, 200, itemSize));
            if (saveGameSystem_3.default.Instance.loadData(saveGameSystem_3.SaveKey.FoundItems) != null) {
                itemsFound.cells = saveGameSystem_3.default.Instance.loadData(saveGameSystem_3.SaveKey.FoundItems);
                console.log(itemsFound.cells);
            }
            exports_29("playerInventory", playerInventory = [equippedInventory, itemsFound]);
            exports_29("player", player = new entityComponent_22.Entity("Player"));
            player.addComponent(positionComponent_15.default.COMPONENT_ID, new positionComponent_15.default(global_16.canvas.width / 2, global_16.canvas.width / 3, PLAYER.WIDTH, PLAYER.HEIGHT, 0));
            player.addComponent(animatedComponent_7.AnimatedComponent.COMPONENT_ID, new animatedComponent_7.AnimatedComponent(weaponAnimations.Bow, playerBowAnimationInfo));
            player.addComponent(PlayerComponent.COMPONENT_ID, new PlayerComponent(1, PlayerState.Running, StartingStats, weaponAnimations));
            player.addComponent(stateMachineComponent_7.default.COMPONENT_ID, new stateMachineComponent_7.default());
            player.addComponent(inventoryComponent_4.InventoryComponent.COMPONENT_ID, new inventoryComponent_4.InventoryComponent(playerInventory));
            player.addComponent(tagComponent_3.TagComponent.COMPONENT_ID, new tagComponent_3.TagComponent([global_16.Tag.Player]));
            // Player States
            playerComponent = player.getComponent(PlayerComponent.COMPONENT_ID);
            animatedComponent = player.getComponent(animatedComponent_7.AnimatedComponent.COMPONENT_ID);
            positionComponent = player.getComponent(positionComponent_15.default.COMPONENT_ID);
            smComponent = player.getComponent(stateMachineComponent_7.default.COMPONENT_ID);
            onRunningActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_7.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                animatedComponent.playAnimation(PlayerAnimationName.RunningBack);
                playerComponent.state = PlayerState.Running;
                animatedComponent.currentAnimationFrame = 0;
            };
            onRunningUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_7.default.COMPONENT_ID).stateMachine.data.stateStart;
                playerComponent.directionChange = ~~(global_16.allPressedKeys[global_16.KEYS.D] || global_16.allPressedKeys[global_16.KEYS.ArrowRight]) -
                    ~~(global_16.allPressedKeys[global_16.KEYS.A] || global_16.allPressedKeys[global_16.KEYS.ArrowLeft]);
                return checkInput(stateStart);
            };
            onRunningDeactivation = () => {
            };
            onJumpingActivation = () => {
                animatedComponent.playAnimation(PlayerAnimationName.Jumping);
                playerComponent.state = PlayerState.Jumping;
                animatedComponent.currentAnimationFrame = 0;
            };
            onJumpingUpdate = () => {
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_16.OFFSET) {
                    return PlayerState.Running;
                }
            };
            onJumpingDeactivation = () => {
            };
            onDuckingActivation = () => {
                animatedComponent.playAnimation(PlayerAnimationName.Ducking);
                playerComponent.state = PlayerState.Ducking;
                animatedComponent.currentAnimationFrame = 0;
            };
            onDuckingUpdate = () => {
                // if (playerComponent!.weapon == playerComponent!.weaponAnimations.Spear){
                //     if (animatedComponent!.currentAnimationFrame >= playerComponent!.PREPARE_SPEAR_FRAMES - OFFSET){
                //         playerComponent!.attacking = true;
                //         const spearAttackY = canvas.width/3 - positionComponent!.height/2;
                //         positionComponent!.y = spearAttackY;
                //     }
                // }
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_16.OFFSET) {
                    return PlayerState.Running;
                }
            };
            onDuckingDeactivation = () => {
                if (playerComponent.attacking != false) {
                    playerComponent.attacking = false;
                    const playerWalkingY = global_16.canvas.width / 3;
                    positionComponent.y = playerWalkingY;
                }
                if (playerComponent.weapon == playerComponent.weaponAnimations.Bow) {
                    entityGenerator_4.generateArrow(positionComponent);
                }
            };
            onRollActivation = () => {
                if (playerComponent.directionChange >= 1) {
                    animatedComponent.playAnimation(PlayerAnimationName.RollingRight);
                }
                else {
                    animatedComponent.playAnimation(PlayerAnimationName.RollingLeft);
                }
                animatedComponent.currentAnimationFrame = 0;
                playerComponent.state = PlayerState.Roll;
            };
            onRollUpdate = (deltaTime) => {
                const currentLaneX = playerComponent.lane * global_16.LANE.WIDTH - global_16.LANE.WIDTH / 2;
                if (playerComponent.directionChange >= 1) {
                    if (positionComponent.x > currentLaneX) {
                        positionComponent.x = currentLaneX;
                        return PlayerState.Running;
                    }
                    else if (positionComponent.x < currentLaneX - global_16.LANE.WIDTH / 2) {
                        if (checkRollInput() == PlayerState.Roll) {
                            return PlayerState.Roll;
                        }
                    }
                }
                else if (playerComponent.directionChange <= -1) {
                    if (positionComponent.x < currentLaneX) {
                        positionComponent.x = currentLaneX;
                        return PlayerState.Running;
                    }
                    else if (positionComponent.x > currentLaneX + global_16.LANE.WIDTH / 2) {
                        if (checkRollInput() == PlayerState.Roll) {
                            return PlayerState.Roll;
                        }
                    }
                }
                playerComponent.roll(deltaTime);
            };
            onRollDeactivation = () => {
            };
            onDyingActivation = () => {
                animatedComponent.playAnimation(PlayerAnimationName.Dying);
                animatedComponent.currentAnimationFrame = 0;
            };
            onDyingUpdate = () => {
                if (animatedComponent.currentAnimationFrame >= animatedComponent.currentAnimation.frameCount - global_16.OFFSET) {
                    global_16.sleep(1000);
                    return PlayerState.Running;
                }
            };
            onDyingDeactivation = () => {
                resetGame();
            };
            smComponent.stateMachine.addState(PlayerState.Running, onRunningActivation, onRunningUpdate, onRunningDeactivation);
            smComponent.stateMachine.addState(PlayerState.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
            smComponent.stateMachine.addState(PlayerState.Ducking, onDuckingActivation, onDuckingUpdate, onDuckingDeactivation);
            smComponent.stateMachine.addState(PlayerState.Roll, onRollActivation, onRollUpdate, onRollDeactivation);
            smComponent.stateMachine.addState(PlayerState.Dying, onDyingActivation, onDyingUpdate, onDyingDeactivation);
            smComponent.activate(PlayerState.Running);
        }
    };
});
System.register("components/dragonComponent", ["entityComponent", "components/positionComponent", "objects", "components/animatedComponent", "global", "components/imageComponent", "components/movementComponent", "components/stateMachineComponent", "components/playerComponent", "components/soundComponent", "components/tagComponent"], function (exports_30, context_30) {
    "use strict";
    var entityComponent_23, positionComponent_16, objects_7, animatedComponent_8, global_17, imageComponent_2, movementComponent_4, stateMachineComponent_8, playerComponent_9, soundComponent_4, tagComponent_4, DragonState, DragonSound, DRAGON, playerPositionComponent, DragonComponent, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation, onFiringActivation, onFiringUpdate, onFiringDeactivation, DragonAnimationNames, DragonAnimationInfo;
    var __moduleName = context_30 && context_30.id;
    function generateFireball(positionComponent, currentObject) {
        const fireball = new entityComponent_23.Entity(global_17.EntityName.Fireball);
        const FIREBALL = {
            WIDTH: 50,
            HEIGHT: 50,
            SPEED: 150,
            DIRECTION: 1,
            URL: "assets/images/fireball.png"
        };
        fireball.addComponent(positionComponent_16.default.COMPONENT_ID, new positionComponent_16.default(positionComponent.x, positionComponent.y + global_17.OFFSET * 25, FIREBALL.WIDTH, FIREBALL.HEIGHT, 0));
        fireball.addComponent(imageComponent_2.ImageComponent.COMPONENT_ID, new imageComponent_2.ImageComponent(FIREBALL.URL));
        fireball.addComponent(movementComponent_4.default.COMPONENT_ID, new movementComponent_4.default(FIREBALL.SPEED, FIREBALL.DIRECTION));
        fireball.addComponent(tagComponent_4.TagComponent.COMPONENT_ID, new tagComponent_4.TagComponent([global_17.Tag.Fireball]));
        objects_7.objects.push(fireball);
        const soundComponent = currentObject.getComponent(soundComponent_4.SoundComponent.COMPONENT_ID);
        soundComponent.playSound(DragonSound.Roar);
    }
    return {
        setters: [
            function (entityComponent_23_1) {
                entityComponent_23 = entityComponent_23_1;
            },
            function (positionComponent_16_1) {
                positionComponent_16 = positionComponent_16_1;
            },
            function (objects_7_1) {
                objects_7 = objects_7_1;
            },
            function (animatedComponent_8_1) {
                animatedComponent_8 = animatedComponent_8_1;
            },
            function (global_17_1) {
                global_17 = global_17_1;
            },
            function (imageComponent_2_1) {
                imageComponent_2 = imageComponent_2_1;
            },
            function (movementComponent_4_1) {
                movementComponent_4 = movementComponent_4_1;
            },
            function (stateMachineComponent_8_1) {
                stateMachineComponent_8 = stateMachineComponent_8_1;
            },
            function (playerComponent_9_1) {
                playerComponent_9 = playerComponent_9_1;
            },
            function (soundComponent_4_1) {
                soundComponent_4 = soundComponent_4_1;
            },
            function (tagComponent_4_1) {
                tagComponent_4 = tagComponent_4_1;
            }
        ],
        execute: function () {
            (function (DragonState) {
                DragonState["Flying"] = "flying";
                DragonState["Firing"] = "firing";
            })(DragonState || (DragonState = {}));
            exports_30("DragonState", DragonState);
            (function (DragonSound) {
                DragonSound["Roar"] = "roar";
            })(DragonSound || (DragonSound = {}));
            exports_30("DragonSound", DragonSound);
            DRAGON = {
                SIGHT: 300,
            };
            playerPositionComponent = null;
            DragonComponent = class DragonComponent extends entityComponent_23.Component {
                static COMPONENT_ID = "Dragon";
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_8.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(DragonState.Flying, onFlyingActivation, onFlyingUpdate, onFlyingDeactivation);
                    stateMachineComponent.stateMachine.addState(DragonState.Firing, onFiringActivation, onFiringUpdate, onFiringDeactivation);
                    stateMachineComponent.activate(DragonState.Flying);
                    playerPositionComponent = playerComponent_9.player.getComponent(positionComponent_16.default.COMPONENT_ID);
                }
            };
            exports_30("default", DragonComponent);
            onFlyingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_8.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[DragonAnimationNames.Flying];
            };
            onFlyingUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_16.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + DRAGON.SIGHT && playerPositionComponent.y > positionComponent.y) {
                    return DragonState.Firing;
                }
            };
            onFlyingDeactivation = () => {
            };
            onFiringActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_8.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
                const movementComponent = currentObject.getComponent(movementComponent_4.default.COMPONENT_ID);
                const animatedComponent = currentObject.getComponent(animatedComponent_8.AnimatedComponent.COMPONENT_ID);
                const positionComponent = currentObject.getComponent(positionComponent_16.default.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[DragonAnimationNames.Flying];
                if (movementComponent.yDirection != 0) {
                    movementComponent.yDirection = 0;
                }
                generateFireball(positionComponent, currentObject);
            };
            onFiringUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_8.default.COMPONENT_ID).stateMachine.data.stateStart;
                const positionComponent = currentObject.getComponent(positionComponent_16.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (global_17.checkTime(1000, stateStart)) {
                    if (playerPositionComponent.x != positionComponent.x && playerPositionComponent.y <= positionComponent.y + DRAGON.SIGHT && playerPositionComponent.y > positionComponent.y || global_17.checkTime(2000, stateStart)) {
                        return DragonState.Flying;
                    }
                }
            };
            onFiringDeactivation = (currentObject) => {
                const movementComponent = currentObject.getComponent(movementComponent_4.default.COMPONENT_ID);
                movementComponent.yDirection = 1;
            };
            // Dragon Animation Info
            exports_30("DragonAnimationNames", DragonAnimationNames = {
                Flying: "flying"
            });
            exports_30("DragonAnimationInfo", DragonAnimationInfo = {
                animationCount: 4,
                maxAnimationFrameCount: 4,
                animations: {
                    [DragonAnimationNames.Flying]: {
                        rowIndex: 0,
                        frameCount: 4,
                        framesPerSecond: 8
                    }
                }
            });
        }
    };
});
System.register("components/ghost", ["entityComponent", "global", "components/animatedComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_31, context_31) {
    "use strict";
    var entityComponent_24, global_18, animatedComponent_9, playerComponent_10, positionComponent_17, stateMachineComponent_9, GhostState, playerPositionComponent, GhostComponent, onWalkingActivation, onWalkingUpdate, onWalkingDeactivation, onAttackingActivation, onAttackingUpdate, onAttackingDeactivation, GhostAnimationNames, GhostAnimationInfo;
    var __moduleName = context_31 && context_31.id;
    function chooseWalkingAnimation(currentObject) {
        const ghostComponent = currentObject.getComponent(GhostComponent.COMPONENT_ID);
        const animatedComponent = currentObject.getComponent(animatedComponent_9.AnimatedComponent.COMPONENT_ID);
        switch (ghostComponent.direction.x) {
            case -1:
                // ghost is moving left
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving left and up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorthWest];
                        break;
                    case 0:
                        // ghost is moving left
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingWest];
                        break;
                    case 1:
                        // ghost is moving left and down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouthWest];
                        break;
                }
                break;
            case 0:
                // ghost is not moving left or right
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorth];
                        break;
                    case 1:
                        // ghost is moving down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouth];
                        break;
                }
                break;
            case 1:
                // ghost is moving right
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving right and up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingNorthEast];
                        break;
                    case 0:
                        // ghost is moving right
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingEast];
                        break;
                    case 1:
                        // ghost is moving right and down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.WalkingSouthEast];
                        break;
                }
                break;
        }
    }
    function chooseAttackingAnimation(currentObject) {
        const ghostComponent = currentObject.getComponent(GhostComponent.COMPONENT_ID);
        const animatedComponent = currentObject.getComponent(animatedComponent_9.AnimatedComponent.COMPONENT_ID);
        switch (ghostComponent.direction.x) {
            case -1:
                // ghost is moving left
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving left and up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorthWest];
                        break;
                    case 0:
                        // ghost is moving left
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingWest];
                        break;
                    case 1:
                        // ghost is moving left and down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouthWest];
                        break;
                }
                break;
            case 0:
                // ghost is not moving left or right
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorth];
                        break;
                    case 1:
                        // ghost is moving down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouth];
                        break;
                }
                break;
            case 1:
                // ghost is moving right
                switch (ghostComponent.direction.y) {
                    case -1:
                        // ghost is moving right and up
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingNorthEast];
                        break;
                    case 0:
                        // ghost is moving right
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingEast];
                        break;
                    case 1:
                        // ghost is moving right and down
                        animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[GhostAnimationNames.AttackingSouthEast];
                        break;
                }
                break;
        }
    }
    return {
        setters: [
            function (entityComponent_24_1) {
                entityComponent_24 = entityComponent_24_1;
            },
            function (global_18_1) {
                global_18 = global_18_1;
            },
            function (animatedComponent_9_1) {
                animatedComponent_9 = animatedComponent_9_1;
            },
            function (playerComponent_10_1) {
                playerComponent_10 = playerComponent_10_1;
            },
            function (positionComponent_17_1) {
                positionComponent_17 = positionComponent_17_1;
            },
            function (stateMachineComponent_9_1) {
                stateMachineComponent_9 = stateMachineComponent_9_1;
            }
        ],
        execute: function () {
            (function (GhostState) {
                GhostState["Walking"] = "walking";
                GhostState["Attacking"] = "attacking";
            })(GhostState || (GhostState = {}));
            exports_31("GhostState", GhostState);
            playerPositionComponent = null;
            GhostComponent = class GhostComponent extends entityComponent_24.Component {
                static COMPONENT_ID = "Ghost";
                speed = 150;
                direction = {
                    x: 0,
                    y: 0
                };
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_9.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(GhostState.Walking, onWalkingActivation, onWalkingUpdate, onWalkingDeactivation);
                    stateMachineComponent.stateMachine.addState(GhostState.Attacking, onAttackingActivation, onAttackingUpdate, onAttackingDeactivation);
                    stateMachineComponent.activate(GhostState.Walking);
                    playerPositionComponent = playerComponent_10.player.getComponent(positionComponent_17.default.COMPONENT_ID);
                }
            };
            exports_31("default", GhostComponent);
            onWalkingActivation = (currentObject) => {
                currentObject.getComponent(stateMachineComponent_9.default.COMPONENT_ID).stateMachine.data.stateStart = Date.now();
            };
            onWalkingUpdate = (deltatime, currentObject) => {
                let stateStart = currentObject.getComponent(stateMachineComponent_9.default.COMPONENT_ID).stateMachine.data.stateStart;
                const playerX = playerPositionComponent.x;
                const playerY = playerPositionComponent.y;
                const positionComponent = currentObject.getComponent(positionComponent_17.default.COMPONENT_ID);
                const ghostComponent = currentObject.getComponent(GhostComponent.COMPONENT_ID);
                if (global_18.checkTime(1000, stateStart)) {
                    const deltaX = playerX - positionComponent.x;
                    const deltaY = playerY - positionComponent.y;
                    if (deltaX < 100 || deltaX > -100) {
                        return GhostState.Attacking;
                    }
                    if (deltaX < 0) {
                        ghostComponent.direction.x = -1;
                    }
                    else if (deltaX > 0) {
                        ghostComponent.direction.x = 1;
                    }
                    else {
                        ghostComponent.direction.x = 0;
                    }
                    if (deltaY < 0) {
                        ghostComponent.direction.y = -1;
                    }
                    else if (deltaY > 0) {
                        ghostComponent.direction.y = 1;
                    }
                    else {
                        ghostComponent.direction.y = 0;
                    }
                    chooseWalkingAnimation(currentObject);
                }
                stateStart = Date.now();
                positionComponent.x += ghostComponent.direction.x * ghostComponent.speed * deltatime / 1000;
                positionComponent.y += ghostComponent.direction.y * ghostComponent.speed * deltatime / 1000;
            };
            onWalkingDeactivation = () => {
            };
            onAttackingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_9.AnimatedComponent.COMPONENT_ID);
                chooseAttackingAnimation(currentObject);
            };
            onAttackingUpdate = (deltatime, currentObject) => {
                const playerX = playerPositionComponent.x;
                const positionComponent = currentObject.getComponent(positionComponent_17.default.COMPONENT_ID);
                const deltaX = playerX - positionComponent.x;
                if (deltaX > 100 || deltaX < -100) {
                    return GhostState.Walking;
                }
            };
            onAttackingDeactivation = () => {
            };
            // Ghost Animation Info
            exports_31("GhostAnimationNames", GhostAnimationNames = {
                WalkingEast: "walkingEast",
                WalkingNorth: "walkingNorth",
                WalkingNorthEast: "walkingNorthEast",
                WalkingNorthWest: "walkingNorthWest",
                WalkingSouth: "walkingSouth",
                WalkingSouthEast: "walkingSouthEast",
                WalkingSouthWest: "walkingSouthWest",
                WalkingWest: "walkingWest",
                AttackingEast: "attackingEast",
                AttackingNorth: "attackingNorth",
                AttackingNorthEast: "attackingNorthEast",
                AttackingNorthWest: "attackingNorthWest",
                AttackingSouth: "attackingSouth",
                AttackingSouthEast: "attackingSouthEast",
                AttackingSouthWest: "attackingSouthWest",
                AttackingWest: "attackingWest",
                Death: "death"
            });
            exports_31("GhostAnimationInfo", GhostAnimationInfo = {
                animationCount: 17,
                maxAnimationFrameCount: 24,
                animations: {
                    [GhostAnimationNames.Death]: {
                        rowIndex: 0,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingEast]: {
                        rowIndex: 1,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingNorth]: {
                        rowIndex: 2,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingNorthEast]: {
                        rowIndex: 3,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingNorthWest]: {
                        rowIndex: 4,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingSouth]: {
                        rowIndex: 5,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingSouthEast]: {
                        rowIndex: 6,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingSouthWest]: {
                        rowIndex: 7,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.AttackingWest]: {
                        rowIndex: 8,
                        frameCount: 24,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingEast]: {
                        rowIndex: 9,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingNorth]: {
                        rowIndex: 10,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingNorthEast]: {
                        rowIndex: 11,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingNorthWest]: {
                        rowIndex: 12,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingSouth]: {
                        rowIndex: 13,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingSouthEast]: {
                        rowIndex: 14,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingSouthWest]: {
                        rowIndex: 15,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                    [GhostAnimationNames.WalkingWest]: {
                        rowIndex: 16,
                        frameCount: 12,
                        framesPerSecond: 8
                    },
                }
            });
        }
    };
});
System.register("components/homingMissileComponent", ["entityComponent", "components/playerComponent", "components/positionComponent"], function (exports_32, context_32) {
    "use strict";
    var entityComponent_25, playerComponent_11, positionComponent_18, HomingMissileComponent;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (entityComponent_25_1) {
                entityComponent_25 = entityComponent_25_1;
            },
            function (playerComponent_11_1) {
                playerComponent_11 = playerComponent_11_1;
            },
            function (positionComponent_18_1) {
                positionComponent_18 = positionComponent_18_1;
            }
        ],
        execute: function () {
            HomingMissileComponent = class HomingMissileComponent extends entityComponent_25.Component {
                static COMPONENT_ID = "HomingMissile";
                speed = 0;
                direction = { x: 0, y: 0 };
                constructor(speed) {
                    super();
                    this.speed = speed;
                }
                update(deltaTime, gameSpeed) {
                    if (this._entity == null) {
                        return;
                    }
                    const positionComponent = this._entity.getComponent(positionComponent_18.default.COMPONENT_ID);
                    const playerPositionComponent = playerComponent_11.player.getComponent(positionComponent_18.default.COMPONENT_ID);
                    console.assert(positionComponent != null);
                    let angle = Math.atan2(playerPositionComponent.y - positionComponent.y, playerPositionComponent.x - positionComponent.x);
                    this.direction = {
                        x: Math.cos(angle),
                        y: Math.sin(angle)
                    };
                    positionComponent.rotation = angle;
                    positionComponent.x += this.speed * deltaTime / 1000 * this.direction.x * gameSpeed;
                    positionComponent.y += this.speed * deltaTime / 1000 * this.direction.y * gameSpeed;
                }
            };
            exports_32("default", HomingMissileComponent);
        }
    };
});
System.register("components/laserComponent", ["entityComponent", "components/animatedComponent"], function (exports_33, context_33) {
    "use strict";
    var entityComponent_26, animatedComponent_10, LaserComponent, LaserAnimationNames, LaserAnimationInfo;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (entityComponent_26_1) {
                entityComponent_26 = entityComponent_26_1;
            },
            function (animatedComponent_10_1) {
                animatedComponent_10 = animatedComponent_10_1;
            }
        ],
        execute: function () {
            LaserComponent = class LaserComponent extends entityComponent_26.Component {
                static COMPONENT_ID = "Laser";
                onAttached() {
                    const animatedComponent = this._entity.getComponent(animatedComponent_10.AnimatedComponent.COMPONENT_ID);
                    animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[LaserAnimationNames.LaserBeam];
                }
            };
            exports_33("default", LaserComponent);
            (function (LaserAnimationNames) {
                LaserAnimationNames[LaserAnimationNames["LaserBeam"] = 0] = "LaserBeam";
            })(LaserAnimationNames || (LaserAnimationNames = {}));
            exports_33("LaserAnimationInfo", LaserAnimationInfo = {
                animationCount: 1,
                maxAnimationFrameCount: 14,
                animations: {
                    [LaserAnimationNames.LaserBeam]: {
                        rowIndex: 0,
                        frameCount: 14,
                        framesPerSecond: 6
                    },
                }
            });
        }
    };
});
System.register("components/minotaurComponent", ["entityComponent", "components/animatedComponent", "components/movementComponent", "components/playerComponent", "components/positionComponent", "components/stateMachineComponent"], function (exports_34, context_34) {
    "use strict";
    var entityComponent_27, animatedComponent_11, movementComponent_5, playerComponent_12, positionComponent_19, stateMachineComponent_10, MinotaurState, MINOTAUR, playerPositionComponent, MinotaurComponent, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation, onWalkingUpActivation, onWalkingUpUpdate, onWalkingUpDeactivation, onHittingActivation, onHittingUpdate, onHittingDeactivation, MinotaurAnimationNames, MinotaurAnimationInfo;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (entityComponent_27_1) {
                entityComponent_27 = entityComponent_27_1;
            },
            function (animatedComponent_11_1) {
                animatedComponent_11 = animatedComponent_11_1;
            },
            function (movementComponent_5_1) {
                movementComponent_5 = movementComponent_5_1;
            },
            function (playerComponent_12_1) {
                playerComponent_12 = playerComponent_12_1;
            },
            function (positionComponent_19_1) {
                positionComponent_19 = positionComponent_19_1;
            },
            function (stateMachineComponent_10_1) {
                stateMachineComponent_10 = stateMachineComponent_10_1;
            }
        ],
        execute: function () {
            (function (MinotaurState) {
                MinotaurState["WalkingDown"] = "walkingDown";
                MinotaurState["WalkingUp"] = "walkingUp";
                MinotaurState["Jumping"] = "jumping";
                MinotaurState["Hitting"] = "hitting";
            })(MinotaurState || (MinotaurState = {}));
            exports_34("MinotaurState", MinotaurState);
            MINOTAUR = {
                SIGHT: 300,
                JUMPING_SPEED: 300,
                WALKING_SPEED: 150
            };
            playerPositionComponent = null;
            MinotaurComponent = class MinotaurComponent extends entityComponent_27.Component {
                static COMPONENT_ID = "Minotaur";
                onAttached() {
                    const stateMachineComponent = this._entity.getComponent(stateMachineComponent_10.default.COMPONENT_ID);
                    stateMachineComponent.stateMachine.addState(MinotaurState.WalkingDown, onWalkingDownActivation, onWalkingDownUpdate, onWalkingDownDeactivation);
                    stateMachineComponent.stateMachine.addState(MinotaurState.Jumping, onJumpingActivation, onJumpingUpdate, onJumpingDeactivation);
                    stateMachineComponent.stateMachine.addState(MinotaurState.WalkingUp, onWalkingUpActivation, onWalkingUpUpdate, onWalkingUpDeactivation);
                    stateMachineComponent.stateMachine.addState(MinotaurState.Hitting, onHittingActivation, onHittingUpdate, onHittingDeactivation);
                    stateMachineComponent.activate(MinotaurState.WalkingDown);
                    playerPositionComponent = playerComponent_12.player.getComponent(positionComponent_19.default.COMPONENT_ID);
                }
            };
            exports_34("default", MinotaurComponent);
            onWalkingDownActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_11.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.WalkingDown];
            };
            onWalkingDownUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_19.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y <= positionComponent.y + MINOTAUR.SIGHT && playerPositionComponent.y > positionComponent.y) {
                    return MinotaurState.Jumping;
                }
            };
            onWalkingDownDeactivation = () => {
            };
            onJumpingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_11.AnimatedComponent.COMPONENT_ID);
                const movementComponent = currentObject.getComponent(movementComponent_5.default.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.Jumping];
                movementComponent.speed = MINOTAUR.JUMPING_SPEED;
            };
            onJumpingUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_19.default.COMPONENT_ID);
                const animatedComponent = currentObject.getComponent(animatedComponent_11.AnimatedComponent.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.y < positionComponent.y - 200 && animatedComponent.currentAnimationFrame == 5) {
                    return MinotaurState.WalkingUp;
                }
            };
            onJumpingDeactivation = () => {
            };
            onWalkingUpActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_11.AnimatedComponent.COMPONENT_ID);
                const movementComponent = currentObject.getComponent(movementComponent_5.default.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.WalkingUp];
                movementComponent.speed = 150;
                movementComponent.yDirection = -1;
            };
            onWalkingUpUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_19.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x == positionComponent.x && playerPositionComponent.y >= positionComponent.y - 100 && playerPositionComponent.y < positionComponent.y) {
                    return MinotaurState.Hitting;
                }
            };
            onWalkingUpDeactivation = () => {
            };
            onHittingActivation = (currentObject) => {
                const animatedComponent = currentObject.getComponent(animatedComponent_11.AnimatedComponent.COMPONENT_ID);
                animatedComponent.currentAnimation = animatedComponent.animationInfo.animations[MinotaurAnimationNames.Hitting];
                console.log(MinotaurState.Hitting);
            };
            onHittingUpdate = (deltatime, currentObject) => {
                const positionComponent = currentObject.getComponent(positionComponent_19.default.COMPONENT_ID);
                if (playerPositionComponent == null) {
                    return;
                }
                else if (playerPositionComponent.x != positionComponent.x) {
                    return MinotaurState.WalkingUp;
                }
            };
            onHittingDeactivation = () => {
            };
            // Minotaur Animation Info
            exports_34("MinotaurAnimationNames", MinotaurAnimationNames = {
                WalkingDown: "walkingDown",
                WalkingUp: "walkingUp",
                Jumping: "jumping",
                Hitting: "hitting",
            });
            exports_34("MinotaurAnimationInfo", MinotaurAnimationInfo = {
                animationCount: 21,
                maxAnimationFrameCount: 13,
                animations: {
                    [MinotaurAnimationNames.WalkingDown]: {
                        rowIndex: 10,
                        frameCount: 9,
                        framesPerSecond: 6
                    },
                    [MinotaurAnimationNames.WalkingUp]: {
                        rowIndex: 8,
                        frameCount: 9,
                        framesPerSecond: 6
                    },
                    [MinotaurAnimationNames.Jumping]: {
                        rowIndex: 20,
                        frameCount: 6,
                        framesPerSecond: 8
                    },
                    [MinotaurAnimationNames.Hitting]: {
                        rowIndex: 4,
                        frameCount: 8,
                        framesPerSecond: 8
                    }
                }
            });
        }
    };
});
System.register("entityGenerator", ["components/animatedComponent", "components/arrowComponent", "components/dragonComponent", "components/frankensteinComponent", "components/ghost", "components/goblinBossComponent", "components/golemBossComponent", "components/healthBarComponent", "components/homingMissileComponent", "components/imageComponent", "components/laserComponent", "components/lootComponent", "components/minotaurComponent", "components/movementComponent", "components/playerComponent", "components/positionComponent", "components/skeletonComponent", "components/soundComponent", "components/stateMachineComponent", "components/tagComponent", "entityComponent", "global", "objects"], function (exports_35, context_35) {
    "use strict";
    var animatedComponent_12, arrowComponent_1, dragonComponent_1, frankensteinComponent_2, ghost_1, goblinBossComponent_2, golemBossComponent_2, healthBarComponent_3, homingMissileComponent_1, imageComponent_3, laserComponent_1, lootComponent_2, minotaurComponent_1, movementComponent_6, playerComponent_13, positionComponent_20, skeletonComponent_2, soundComponent_5, stateMachineComponent_11, tagComponent_5, entityComponent_28, global_19, objects_8, OBJECT;
    var __moduleName = context_35 && context_35.id;
    function generateCoin(objectLaneLocation, fallSpeed) {
        const coin = new entityComponent_28.Entity(global_19.EntityName.Coin);
        coin.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
        coin.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent("assets/images/coin.png"));
        coin.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        coin.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Coin, global_19.Tag.Powerup]));
        objects_8.objects.push(coin);
    }
    exports_35("generateCoin", generateCoin);
    function generateExtendedVision(objectLaneLocation, fallSpeed) {
        const extendedVisionPowerup = new entityComponent_28.Entity("ExtendedVisionPowerup");
        extendedVisionPowerup.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
        extendedVisionPowerup.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent("assets/images/extendedVisionPowerup.png"));
        extendedVisionPowerup.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        extendedVisionPowerup.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.ExtendedVisionPowerup, global_19.Tag.Powerup]));
        objects_8.objects.push(extendedVisionPowerup);
    }
    exports_35("generateExtendedVision", generateExtendedVision);
    function generateAura(objectLaneLocation, fallSpeed) {
        const positionComponent = playerComponent_13.player.getComponent(positionComponent_20.default.COMPONENT_ID);
        const auraPowerup = new entityComponent_28.Entity("ExtendedVisionPowerup");
        auraPowerup.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, positionComponent.width, positionComponent.height, 0));
        auraPowerup.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent("assets/images/aura.png"));
        auraPowerup.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        auraPowerup.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.AuraPowerup, global_19.Tag.Powerup]));
        objects_8.objects.push(auraPowerup);
    }
    exports_35("generateAura", generateAura);
    function generateDeathStar(objectLaneLocation, fallSpeed) {
        const deathStarPowerup = new entityComponent_28.Entity("ExtendedVisionPowerup");
        deathStarPowerup.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT + global_19.OFFSET * 10, 0));
        deathStarPowerup.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent("assets/images/deathStar.png"));
        deathStarPowerup.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        deathStarPowerup.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.DeathStarPowerup, global_19.Tag.Powerup]));
        objects_8.objects.push(deathStarPowerup);
    }
    exports_35("generateDeathStar", generateDeathStar);
    function generateLoot(x, y, fallSpeed, item) {
        const loot = new entityComponent_28.Entity("Loot");
        loot.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(x, y, item.width * OBJECT.WIDTH, item.height * OBJECT.HEIGHT, 0));
        loot.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent(item.image.src));
        loot.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        loot.addComponent(lootComponent_2.LootComponent.COMPONENT_ID, new lootComponent_2.LootComponent(item));
        loot.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Loot]));
        objects_8.objects.push(loot);
    }
    exports_35("generateLoot", generateLoot);
    function generateDragon(objectLaneLocation, fallSpeed) {
        const DragonAudio = {
            [dragonComponent_1.DragonSound.Roar]: new Audio('assets/audio/dragon-roar.mp3')
        };
        const dragon = new entityComponent_28.Entity(global_19.EntityName.Dragon);
        dragon.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
        dragon.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/dragon.png", dragonComponent_1.DragonAnimationInfo));
        dragon.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        dragon.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        dragon.addComponent(dragonComponent_1.default.COMPONENT_ID, new dragonComponent_1.default());
        dragon.addComponent(soundComponent_5.SoundComponent.COMPONENT_ID, new soundComponent_5.SoundComponent(DragonAudio));
        dragon.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Dragon, global_19.Tag.Enemy]));
        objects_8.objects.push(dragon);
    }
    exports_35("generateDragon", generateDragon);
    function generateMinotaur(objectLaneLocation, fallSpeed) {
        const MINOTAUR_WIDTH = 75;
        const MINOTAUR_HEIGHT = 75;
        const minotaur = new entityComponent_28.Entity(global_19.EntityName.Minotaur);
        minotaur.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, MINOTAUR_WIDTH, MINOTAUR_HEIGHT, 0));
        minotaur.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/minotaur.png", minotaurComponent_1.MinotaurAnimationInfo));
        minotaur.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        minotaur.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        minotaur.addComponent(minotaurComponent_1.default.COMPONENT_ID, new minotaurComponent_1.default());
        minotaur.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Minotaur, global_19.Tag.Enemy]));
        objects_8.objects.push(minotaur);
    }
    exports_35("generateMinotaur", generateMinotaur);
    function generateFrankenstein(objectLaneLocation, fallSpeed) {
        const FRANKENSTEIN_WIDTH = 100;
        const FRANKENSTEIN_HEIGHT = 100;
        const frankenstein = new entityComponent_28.Entity(global_19.EntityName.Frankenstein);
        frankenstein.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, FRANKENSTEIN_WIDTH, FRANKENSTEIN_HEIGHT, 0));
        frankenstein.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/frankenstein.png", frankensteinComponent_2.FrankensteinAnimationInfo));
        frankenstein.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        frankenstein.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        frankenstein.addComponent(frankensteinComponent_2.default.COMPONENT_ID, new frankensteinComponent_2.default());
        frankenstein.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Frankenstein, global_19.Tag.Enemy]));
        objects_8.objects.push(frankenstein);
    }
    exports_35("generateFrankenstein", generateFrankenstein);
    function generateSkeleton(objectLaneLocation, fallSpeed) {
        const SKELOTON_WIDTH = 75;
        const SKELOTON_HEIGHT = 75;
        const skeleton = new entityComponent_28.Entity(global_19.EntityName.Skeleton);
        skeleton.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, SKELOTON_WIDTH, SKELOTON_HEIGHT, 0));
        skeleton.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/skeleton.png", skeletonComponent_2.SkeletonAnimationInfo));
        skeleton.addComponent(movementComponent_6.default.COMPONENT_ID, new movementComponent_6.default(fallSpeed, 1));
        skeleton.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        skeleton.addComponent(skeletonComponent_2.default.COMPONENT_ID, new skeletonComponent_2.default());
        skeleton.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Skeleton, global_19.Tag.Enemy]));
        objects_8.objects.push(skeleton);
    }
    exports_35("generateSkeleton", generateSkeleton);
    function generateGhost(objectLaneLocation) {
        const GHOST_WIDTH = 200;
        const GHOST_HEIGHT = 200;
        const ghost = new entityComponent_28.Entity(global_19.EntityName.Ghost);
        ghost.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, OBJECT.SPAWN_LOCATION, GHOST_WIDTH, GHOST_HEIGHT, 0));
        ghost.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/ghost.png", ghost_1.GhostAnimationInfo));
        ghost.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        ghost.addComponent(ghost_1.default.COMPONENT_ID, new ghost_1.default());
        ghost.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Ghost, global_19.Tag.Enemy]));
        objects_8.objects.push(ghost);
    }
    exports_35("generateGhost", generateGhost);
    function generateArrow(positionComponent) {
        const arrow = new entityComponent_28.Entity(global_19.EntityName.Arrow);
        const ARROW = {
            WIDTH: 7.5,
            HEIGHT: 45,
            SPEED: 300,
            URL: "assets/images/arrow.png"
        };
        let angle = Math.atan2(global_19.mouse.y - positionComponent.y, global_19.mouse.x - positionComponent.x);
        const Direction = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        angle += Math.PI / 2;
        arrow.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(positionComponent.x, positionComponent.y, ARROW.WIDTH, ARROW.HEIGHT, 0, angle));
        arrow.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent(ARROW.URL));
        arrow.addComponent(arrowComponent_1.default.COMPONENT_ID, new arrowComponent_1.default(ARROW.SPEED, Direction));
        arrow.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Arrow]));
        objects_8.objects.push(arrow);
    }
    exports_35("generateArrow", generateArrow);
    function generateMoneyPouch(currentObject) {
        const positionComponent = currentObject.getComponent(positionComponent_20.default.COMPONENT_ID);
        const playerPositionComponent = playerComponent_13.player.getComponent(positionComponent_20.default.COMPONENT_ID);
        const moneyPouch = new entityComponent_28.Entity("MoneyPouch");
        const MONEY_POUCH = {
            WIDTH: 30,
            HEIGHT: 30,
            SPEED: 400,
            URL: "assets/images/moneyPouch.png"
        };
        let angle = Math.atan2(playerPositionComponent.y - positionComponent.y, playerPositionComponent.x - positionComponent.x);
        const Direction = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        moneyPouch.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(positionComponent.x, positionComponent.y, MONEY_POUCH.WIDTH, MONEY_POUCH.HEIGHT, 0, angle));
        moneyPouch.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent(MONEY_POUCH.URL));
        moneyPouch.addComponent(arrowComponent_1.default.COMPONENT_ID, new arrowComponent_1.default(MONEY_POUCH.SPEED, Direction));
        moneyPouch.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.MoneyPouch]));
        objects_8.objects.push(moneyPouch);
    }
    exports_35("generateMoneyPouch", generateMoneyPouch);
    function generateLaser(objectLaneLocation, yPosition) {
        const laser = new entityComponent_28.Entity("Laser");
        const LASER = {
            WIDTH: 1000,
            HEIGHT: 200,
            URL: "assets/images/laser.png"
        };
        let angle = Math.PI / 2;
        laser.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, yPosition, LASER.WIDTH, LASER.HEIGHT, 0, angle));
        laser.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.Laser]));
        laser.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent(LASER.URL, laserComponent_1.LaserAnimationInfo, false));
        laser.addComponent(laserComponent_1.default.COMPONENT_ID, new laserComponent_1.default());
        objects_8.objects.push(laser);
    }
    exports_35("generateLaser", generateLaser);
    function generateArmProjectile(currentObject) {
        const positionComponent = currentObject.getComponent(positionComponent_20.default.COMPONENT_ID);
        const armProjectile = new entityComponent_28.Entity("ArmProjectile");
        const ARM_PROJECTILE = {
            WIDTH: 200,
            HEIGHT: 200,
            SPEED: 400,
            URL: "assets/images/armProjectile.png"
        };
        armProjectile.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(positionComponent.x, positionComponent.y, ARM_PROJECTILE.WIDTH, ARM_PROJECTILE.HEIGHT));
        armProjectile.addComponent(imageComponent_3.ImageComponent.COMPONENT_ID, new imageComponent_3.ImageComponent(ARM_PROJECTILE.URL));
        armProjectile.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.ArmProjectile]));
        armProjectile.addComponent(homingMissileComponent_1.default.COMPONENT_ID, new homingMissileComponent_1.default(ARM_PROJECTILE.SPEED));
        objects_8.objects.push(armProjectile);
    }
    exports_35("generateArmProjectile", generateArmProjectile);
    // Bosses
    function generateGoblinBoss(objectLaneLocation, yPosition) {
        const GOBLIN_WIDTH = 150;
        const GOBLIN_HEIGHT = 150;
        const goblin = new entityComponent_28.Entity("GoblinBoss");
        goblin.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, yPosition, GOBLIN_WIDTH, GOBLIN_HEIGHT, 0));
        goblin.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/goblinBossRight.png", goblinBossComponent_2.GoblinBossAnimationInfo));
        goblin.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        goblin.addComponent(goblinBossComponent_2.default.COMPONENT_ID, new goblinBossComponent_2.default());
        goblin.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.GoblinBoss, global_19.Tag.Boss, global_19.Tag.Enemy]));
        let EntityBar1 = new healthBarComponent_3.EntityBar(20, "red", 0, -50, 100, 20, true);
        goblin.addComponent(healthBarComponent_3.default.COMPONENT_ID, new healthBarComponent_3.default([EntityBar1]));
        objects_8.objects.push(goblin);
    }
    exports_35("generateGoblinBoss", generateGoblinBoss);
    function generateGolemBoss(objectLaneLocation, yPosition) {
        const GOLEM_WIDTH = 150;
        const GOLEM_HEIGHT = 150;
        const golem = new entityComponent_28.Entity("GoblinBoss");
        golem.addComponent(positionComponent_20.default.COMPONENT_ID, new positionComponent_20.default(objectLaneLocation, yPosition, GOLEM_WIDTH, GOLEM_HEIGHT, 0));
        golem.addComponent(animatedComponent_12.AnimatedComponent.COMPONENT_ID, new animatedComponent_12.AnimatedComponent("assets/images/golem.png", golemBossComponent_2.GolemBossAnimationInfo));
        golem.addComponent(stateMachineComponent_11.default.COMPONENT_ID, new stateMachineComponent_11.default());
        golem.addComponent(golemBossComponent_2.default.COMPONENT_ID, new golemBossComponent_2.default());
        golem.addComponent(tagComponent_5.TagComponent.COMPONENT_ID, new tagComponent_5.TagComponent([global_19.Tag.GolemBoss, global_19.Tag.Boss, global_19.Tag.Enemy]));
        let EntityBar1 = new healthBarComponent_3.EntityBar(20, "red", 0, -70, 100, 20, true);
        let EntityBar2 = new healthBarComponent_3.EntityBar(3, "blue", 0, -50, 100, 20, true);
        golem.addComponent(healthBarComponent_3.default.COMPONENT_ID, new healthBarComponent_3.default([EntityBar1, EntityBar2]));
        objects_8.objects.push(golem);
    }
    exports_35("generateGolemBoss", generateGolemBoss);
    return {
        setters: [
            function (animatedComponent_12_1) {
                animatedComponent_12 = animatedComponent_12_1;
            },
            function (arrowComponent_1_1) {
                arrowComponent_1 = arrowComponent_1_1;
            },
            function (dragonComponent_1_1) {
                dragonComponent_1 = dragonComponent_1_1;
            },
            function (frankensteinComponent_2_1) {
                frankensteinComponent_2 = frankensteinComponent_2_1;
            },
            function (ghost_1_1) {
                ghost_1 = ghost_1_1;
            },
            function (goblinBossComponent_2_1) {
                goblinBossComponent_2 = goblinBossComponent_2_1;
            },
            function (golemBossComponent_2_1) {
                golemBossComponent_2 = golemBossComponent_2_1;
            },
            function (healthBarComponent_3_1) {
                healthBarComponent_3 = healthBarComponent_3_1;
            },
            function (homingMissileComponent_1_1) {
                homingMissileComponent_1 = homingMissileComponent_1_1;
            },
            function (imageComponent_3_1) {
                imageComponent_3 = imageComponent_3_1;
            },
            function (laserComponent_1_1) {
                laserComponent_1 = laserComponent_1_1;
            },
            function (lootComponent_2_1) {
                lootComponent_2 = lootComponent_2_1;
            },
            function (minotaurComponent_1_1) {
                minotaurComponent_1 = minotaurComponent_1_1;
            },
            function (movementComponent_6_1) {
                movementComponent_6 = movementComponent_6_1;
            },
            function (playerComponent_13_1) {
                playerComponent_13 = playerComponent_13_1;
            },
            function (positionComponent_20_1) {
                positionComponent_20 = positionComponent_20_1;
            },
            function (skeletonComponent_2_1) {
                skeletonComponent_2 = skeletonComponent_2_1;
            },
            function (soundComponent_5_1) {
                soundComponent_5 = soundComponent_5_1;
            },
            function (stateMachineComponent_11_1) {
                stateMachineComponent_11 = stateMachineComponent_11_1;
            },
            function (tagComponent_5_1) {
                tagComponent_5 = tagComponent_5_1;
            },
            function (entityComponent_28_1) {
                entityComponent_28 = entityComponent_28_1;
            },
            function (global_19_1) {
                global_19 = global_19_1;
            },
            function (objects_8_1) {
                objects_8 = objects_8_1;
            }
        ],
        execute: function () {
            OBJECT = {
                WIDTH: 50,
                HEIGHT: 50,
                SPAWN_LOCATION: -50
            };
        }
    };
});
System.register("components/drawOutlineComponent", ["entityComponent", "components/positionComponent"], function (exports_36, context_36) {
    "use strict";
    var entityComponent_29, positionComponent_21, DrawOutlineComponent;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (entityComponent_29_1) {
                entityComponent_29 = entityComponent_29_1;
            },
            function (positionComponent_21_1) {
                positionComponent_21 = positionComponent_21_1;
            }
        ],
        execute: function () {
            DrawOutlineComponent = class DrawOutlineComponent extends entityComponent_29.Component {
                static COMPONENT_ID = "DrawOutline";
                _color = "black";
                _context;
                constructor(context, color) {
                    super();
                    this._context = context;
                    this._color = color;
                }
                update(deltaTime) {
                    if (this._entity == null) {
                        return;
                    }
                    const position = this._entity.getComponent(positionComponent_21.default.COMPONENT_ID);
                    console.assert(position != null);
                    this._context.strokeStyle = this._color;
                    this._context.strokeRect(position.x - position.width / 2, position.y - position.height / 2, position.width, position.height);
                }
            };
            exports_36("default", DrawOutlineComponent);
        }
    };
});
System.register("components/drawRectComponent", ["entityComponent", "components/positionComponent"], function (exports_37, context_37) {
    "use strict";
    var entityComponent_30, positionComponent_22, DrawRectComponent;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (entityComponent_30_1) {
                entityComponent_30 = entityComponent_30_1;
            },
            function (positionComponent_22_1) {
                positionComponent_22 = positionComponent_22_1;
            }
        ],
        execute: function () {
            DrawRectComponent = class DrawRectComponent extends entityComponent_30.Component {
                static COMPONENT_ID = "DrawRect";
                _color = "black";
                _context;
                constructor(context, color) {
                    super();
                    this._context = context;
                    this._color = color;
                }
                update(deltaTime) {
                    if (this._entity == null) {
                        return;
                    }
                    const position = this._entity.getComponent(positionComponent_22.default.COMPONENT_ID);
                    console.assert(position != null);
                    this._context.fillStyle = this._color;
                    this._context.fillRect(position.x - position.width / 2, position.y - position.height / 2, position.width, position.height);
                }
            };
            exports_37("default", DrawRectComponent);
        }
    };
});
System.register("components/hitboxComponent", ["entityComponent"], function (exports_38, context_38) {
    "use strict";
    var entityComponent_31, HitboxComponent;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (entityComponent_31_1) {
                entityComponent_31 = entityComponent_31_1;
            }
        ],
        execute: function () {
            HitboxComponent = class HitboxComponent extends entityComponent_31.Component {
                static COMPONENT_ID = "Hitbox";
                hitboxes;
                constructor(hitboxes) {
                    super();
                    this.hitboxes = hitboxes;
                }
            };
            exports_38("HitboxComponent", HitboxComponent);
        }
    };
});
System.register("systems/bossSystem", ["entityGenerator", "global"], function (exports_39, context_39) {
    "use strict";
    var entityGenerator_5, global_20, BossSystem, BossType, PowerupTypeGenerator;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (entityGenerator_5_1) {
                entityGenerator_5 = entityGenerator_5_1;
            },
            function (global_20_1) {
                global_20 = global_20_1;
            }
        ],
        execute: function () {
            BossSystem = class BossSystem {
                static Instance = new BossSystem();
                nextBossTime = Date.now() + global_20.IN_GAME_MINUTE * 0.1;
                nextBossIndex = 0;
                bosses = [BossType.GoblinBoss];
                bossSpawnPoint = {
                    x: global_20.calculateLaneLocation(2),
                    y: 100
                };
                checkNextBossSpawn(currentTime) {
                    if (currentTime > this.nextBossTime) {
                        PowerupTypeGenerator[this.bosses[this.nextBossIndex]](this.bossSpawnPoint.x, this.bossSpawnPoint.y);
                        this.nextBossIndex += 1;
                        this.nextBossTime += global_20.IN_GAME_MINUTE * 0.1;
                    }
                }
            };
            exports_39("default", BossSystem);
            (function (BossType) {
                BossType[BossType["GoblinBoss"] = 0] = "GoblinBoss";
            })(BossType || (BossType = {}));
            ;
            PowerupTypeGenerator = {
                [BossType.GoblinBoss]: entityGenerator_5.generateGoblinBoss,
            };
        }
    };
});
//# sourceMappingURL=main.js.map
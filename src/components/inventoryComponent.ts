import { context, OFFSET } from "../global";
import { Component, Entity } from "../entityComponent";

enum Status{
    Add = "add",
    Remove = "remove"
}


export enum InventoryItemStat {
    Lives,
    RollSpeed,
    AttackSpeed
}

type StatPair = { stat: InventoryItemStat, modifiedValue: number };

export class InventoryItem {
    public width: number;
    public height: number;
    public iconURL: string;
    public image: HTMLImageElement;
    public name: string;
    public slot: InventorySlot;
    public stats: Array<StatPair>;
    constructor(width: number, height: number, iconURL: string, image: HTMLImageElement, name: string, slot: InventorySlot, stats: Array<StatPair>) {
        this.width = width;
        this.height = height;
        this.iconURL = iconURL;
        this.image = image;
        this.name = name;
        this.slot = slot;
        this.stats = stats;
    }
}

export const TakenInventoryItemSlot = { INVENTORY_SLOT_TAKEN: true };
export type slot = { row: number, column: number };
export type Cells = Array<Array<InventoryItem | Record<string, InventoryItem> | null>>;

export class Inventory{
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public cells: Cells
    public equippedItems: Record <InventorySlot, InventoryItem | null>;
    public itemSize: Record<string, number>;
    private _hiddenItem: string;
    public highlight: boolean = false;

    private _supportsEquipment: boolean;

    constructor(width: number, height: number, x: number, y: number, itemSize: Record<string, number>, supportsEquipment: boolean = false) {
        this.equippedItems = {} as Record <InventorySlot, InventoryItem | null>;
        this.cells = [];
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this._hiddenItem = "";
        this.itemSize = itemSize
        this._supportsEquipment = supportsEquipment;
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = null;
            }
        }
    }
    public placeItemCheck(item: InventoryItem, cellRow: number, cellCol: number): boolean {
        // Go through all the coordinates of the item and figure out if the cells are null;
        // If they are, place the item AND apply some effect to the player
        // If even 1 cell is taken, do nothing 
        for (let i = cellRow; i < cellRow + item.width; i++){
            for (let j = cellCol; j < cellCol + item.height; j++){
                if (i > this.width - OFFSET || j > this.height - OFFSET){
                    return false;
                }
                else if (this.cells[i][j] != null){
                    if (this.cells[i][j] instanceof InventoryItem){
                        if (this.cells[i][j]!.name != item.name){
                            return false;
                        }
                    }
                    else{
                        if ((this.cells[i][j]! as  Record<string, InventoryItem>).inventoryItem.name != item.name){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    public placeItem(item: InventoryItem, cellRow: number, cellCol: number){
        if (this.placeItemCheck(item, cellRow, cellCol)){
            for (let i = 0; i < item.width; i++){
                for (let j = 0; j < item.height; j++){
                    this.cells[cellRow + i][cellCol + j] = {inventoryItem: item};
                    this.cells[cellRow][cellCol] = item;
                    this._updateEquippedItem(item, Status.Add);
                }
            }
        }
    }
    public removeItem(item: InventoryItem){
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.cells[i][j] instanceof InventoryItem){
                    if (this.cells[i][j]!.name == item.name){
                        this._updateEquippedItem(item, Status.Remove);
                        for (let a = 0; a < item.width; a++){
                            for (let b = 0; b < item.height; b++){
                                this.cells[a + i][b + j] = null;
                            }
                        }
                    }
                }
            }
        }
    }
    public isEquipped(item: InventoryItem): boolean {
        console.assert(this._supportsEquipment);
        return Object.values(this.equippedItems).includes(item);
    }
    // public isInInventory(item: InventoryItem): boolean {
    //     return Object.values(this.equippedItems).includes(item);
    // }
    public draw() {
        // for every row and col
        //   go through every cell, that is the top-left coordinate of an item and draw the image
        // for every row and col
        //   go through every cell, draw box <-- context.strokeRect
        const centeringWidthOffset = this.width/2 * this.itemSize.width;
        const centeringHeightOffset = this.height/2 * this.itemSize.height;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                context.strokeStyle = "black";
                context.strokeRect(this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width, this.itemSize.height);
                const currentCell = this.cells[i][j];
                if (currentCell instanceof InventoryItem && currentCell.name != this._hiddenItem){
                    context.drawImage(currentCell.image, this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width * currentCell.width, this.itemSize.height * currentCell.height);
                }
            }
        }
        if (this.highlight == true){
            context.strokeStyle = "blue";
            context.strokeRect(this.x - centeringWidthOffset, this.y - centeringHeightOffset, this.itemSize.width * this.width, this.itemSize.height * this.height);
        }
    }
    public resetInventory(){
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = null;
            }
        }
    }

    public updateStats(StartingStats: Record<InventoryItemStat, number>): Record<InventoryItemStat, number>  {
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
    
    public searchInventory(slot: slot): InventoryItem | void{
        if (this.cells[slot.row][slot.column] == null){
            return;
        }
        else if (this.cells[slot.row][slot.column]!.constructor == InventoryItem){
            return this.cells[slot.row][slot.column]! as InventoryItem;
        }
        else{
            return (this.cells[slot.row][slot.column]! as Record<string, InventoryItem>).inventoryItem;
        }
    }
    public hideItem(name: string){
        this._hiddenItem = name;
    }
    public findEmptySpot(item: InventoryItem) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.placeItemCheck(item, j, i)) {
                    const slot: slot = {row: i, column: j};
                    return slot;
                }
            }
        }
    }
    public get count() {
        let count = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.cells[i][j] instanceof InventoryItem){
                    count++;
                }
            }
        }
        return count;
    }
    private _updateEquippedItem(item: InventoryItem, status: string){
        if (status == Status.Add){
            this.equippedItems[item.slot] = item;
        }
        else{
            this.equippedItems[item.slot] = null;
        }
    }
}
export class InventoryComponent extends Component {
    public static COMPONENT_ID: string = "Inventory";

    public inventories: Array<Inventory> = [];
    constructor(inventories: Array<Inventory>){
        super();
        this.inventories = inventories;
    }
}

export const ItemInfo: Record<string, Record<string, string>> = {
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
}


enum InventorySlot {
    Helmet,
    Chestplate,
    Leggings,
    Boots,
    Weapon
}

export enum Weapons {
    Kite = "kite",
    Spartan = "spartan",
    Crusader = "crusader",
    Saber = "saber",
    LongSword = "longSword",
    Rapier = "rapier",
    GlowSwordBlue = "glowSwordBlue",
    GlowSwordRed = "glowSwordRed",
    Scythe = "scythe",
    Cane = "cane",
    Mace = "mace",
    Spear = "spear",
    BasicBow = "basicBow",
    BasicStaff = "basicStaff",
    Crossbow = "crossbow",
    DiamondStaff = "diamondStaff",
    GreatBow = "greatBow",
    QuickBow = "quickBow",
}

export enum Armors {
    BlackHelmet = "blackHelmet",
    MagicHelmet = "magicHelmet",
    SteelHelmet = "steelHelmet",
    CopperHelmet = "copperHelmet",
    BronzeHelmet = "bronzeHelmet",
    VikingHelmet = "vikingHelmet",
    BronzeChestplate = "bronzeChestplate",
    CopperChestplate = "copperChestplate",
    LeatherChestplate = "leatherChestplate",
    LegionChestplate = "legionChestplate",
    SteelChestplate = "steelChestplate",
    BronzeLeggings = "bronzeLeggings",
    CopperLeggings = "copperLeggings",
    SteelLeggings = "steelLeggings",
    PantLeggings = "pantLeggings",
    BlackBoots = "blackBoots",
    SteelBoots = "steelBoots",
}

export interface ItemInfo {
    src: string;
    stats: StatPair[];
    type: InventorySlot;
    width: number;
    height: number;
}

interface Items {
    Armor: {
        [key: string]: ItemInfo;
    };
    Weapons: {
        [key: string]: ItemInfo;
    };
}

export const Items: Items = {
    Armor: {
        [Armors.BlackHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/black.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 1,
            height: 1,
        },
        [Armors.MagicHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/magic.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 2,
            height: 1,
        },
        [Armors.SteelHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/steel.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 1,
            height: 1,
        },
        [Armors.CopperHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/copper.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 1,
            height: 1,
        },
        [Armors.BronzeHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/bronze.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 1,
            height: 1,
        },
        [Armors.VikingHelmet]: {
            src: "assets/images/inventoryitems/armor/helmets/viking.png",
            stats: [],
            type: InventorySlot.Helmet,
            width: 1,
            height: 1,
        },
        [Armors.BronzeChestplate]: {
            src: "assets/images/inventoryitems/armor/chestplates/bronze.png",
            stats: [],
            type: InventorySlot.Chestplate,
            width: 2,
            height: 2,
        },
        [Armors.CopperChestplate]: {
            src: "assets/images/inventoryitems/armor/chestplates/copper.png",
            stats: [],
            type: InventorySlot.Chestplate,
            width: 2,
            height: 2,
        },
        [Armors.LeatherChestplate]: {
            src: "assets/images/inventoryitems/armor/chestplates/leather.png",
            stats: [],
            type: InventorySlot.Chestplate,
            width: 2,
            height: 2,
        },
        [Armors.LegionChestplate]: {
            src: "assets/images/inventoryitems/armor/chestplates/legion.png",
            stats: [],
            type: InventorySlot.Chestplate,
            width: 2,
            height: 2,
        },
        [Armors.SteelChestplate]: {
            src: "assets/images/inventoryitems/armor/chestplates/steel.png",
            stats: [],
            type: InventorySlot.Chestplate,
            width: 2,
            height: 2,
        },
        [Armors.BronzeLeggings]: {
            src: "assets/images/inventoryitems/armor/leggings/bronze.png",
            stats: [],
            type: InventorySlot.Leggings,
            width: 2,
            height: 1,
        },
        [Armors.CopperLeggings]: {
            src: "assets/images/inventoryitems/armor/leggings/copper.png",
            stats: [],
            type: InventorySlot.Leggings,
            width: 2,
            height: 1,
        },
        [Armors.SteelLeggings]: {
            src: "assets/images/inventoryitems/armor/leggings/steel.png",
            stats: [],
            type: InventorySlot.Leggings,
            width: 2,
            height: 1,
        },
        [Armors.PantLeggings]: {
            src: "assets/images/inventoryitems/armor/leggings/pants.png",
            stats: [],
            type: InventorySlot.Leggings,
            width: 2,
            height: 1,
        },
        [Armors.BlackBoots]: {
            src: "assets/images/inventoryitems/armor/boots/black.png",
            stats: [],
            type: InventorySlot.Boots,
            width: 1,
            height: 1,
        },
        [Armors.SteelBoots]: {
            src: "assets/images/inventoryitems/armor/boots/steel.png",
            stats: [],
            type: InventorySlot.Boots,
            width: 1,
            height: 1,
        },
    },
    Weapons: {
        [Weapons.Saber]: {
            src: "assets/images/inventoryitems/weapons/melee/saber.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 1,
        },
        [Weapons.LongSword]: {
            src: "assets/images/inventoryitems/weapons/melee/longSword.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.Rapier]: {
            src: "assets/images/inventoryitems/weapons/melee/rapier.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 1,
        },
        [Weapons.GlowSwordBlue]: {
            src: "assets/images/inventoryitems/weapons/melee/glowSwordBlue.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 1,
        },
        [Weapons.GlowSwordRed]: {
            src: "assets/images/inventoryitems/weapons/melee/glowSwordRed.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 1,
        },
        [Weapons.Scythe]: {
            src: "assets/images/inventoryitems/weapons/melee/scythe.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 2,
        },
        [Weapons.Cane]: {
            src: "assets/images/inventoryitems/weapons/melee/cane.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 2,
        },
        [Weapons.Mace]: {
            src: "assets/images/inventoryitems/weapons/melee/mace.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 1,
        },
        [Weapons.Spear]: {
            src: "assets/images/inventoryitems/weapons/melee/spear.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 1,
        },
        [Weapons.BasicBow]: {
            src: "assets/images/inventoryitems/weapons/ranged/basicBow.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.BasicStaff]: {
            src: "assets/images/inventoryitems/weapons/ranged/basicStaff.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 2,
        },
        [Weapons.Crossbow]: {
            src: "assets/images/inventoryitems/weapons/ranged/crossbow.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 1,
        },
        [Weapons.DiamondStaff]: {
            src: "assets/images/inventoryitems/weapons/ranged/diamondStaff.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 1,
            height: 2,
        },
        [Weapons.GreatBow]: {
            src: "assets/images/inventoryitems/weapons/ranged/greatBow.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.QuickBow]: {
            src: "assets/images/inventoryitems/weapons/ranged/quickBow.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.Kite]: {
            src: "assets/images/inventoryitems/weapons/shields/kite.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.Spartan]: {
            src: "assets/images/inventoryitems/weapons/shields/spartan.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
        [Weapons.Crusader]: {
            src: "assets/images/inventoryitems/weapons/shields/crusader.png",
            stats: [],
            type: InventorySlot.Weapon,
            width: 2,
            height: 2,
        },
    }
}

const spearImage = new Image;
spearImage.src = ItemInfo.Spear.src;
const bowImage = new Image;
bowImage.src = ItemInfo.Bow.src;
const armorImage = new Image;
armorImage.src = ItemInfo.Armor.src;
const bootsImage = new Image;
bootsImage.src = ItemInfo.Boots.src;

export const ItemList: Record<string, InventoryItem> = {
    Spear: new InventoryItem(2, 1, spearImage.src, spearImage, "Spear", InventorySlot.Weapon, []),
    Bow: new InventoryItem(1, 2, bowImage.src, bowImage, "Bow", InventorySlot.Weapon, []),
    Armor: new InventoryItem(2, 2, armorImage.src, armorImage, "Armor", InventorySlot.Chestplate, [{stat: InventoryItemStat.Lives, modifiedValue: 1}]),
    Boots: new InventoryItem(1, 1, bootsImage.src, bootsImage, "Boots", InventorySlot.Boots, [{stat: InventoryItemStat.RollSpeed, modifiedValue: 100}]),
}

export function equipStarterItems(currentObject: Entity){
    const inventoryComponent: InventoryComponent = currentObject.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;
    inventoryComponent.inventories[0].placeItem(ItemList.Bow, 1, 0);
    inventoryComponent.inventories[0].placeItem(ItemList.Armor, 2, 0);
    inventoryComponent.inventories[0].placeItem(ItemList.Boots, 0, 0);
    inventoryComponent.inventories[1].placeItem(ItemList.Spear, 0, 0);
}

export function createInventoryItem(item: ItemInfo, name: string) {
    const newImage = new Image;
    newImage.src = item.src;
    const inventoryItem = new InventoryItem(item.width, item.height, item.src, newImage, name, item.type, item.stats);
    return inventoryItem;
}

export function addInventoryItem(inventoryItem: InventoryItem, inventory: Inventory) {
    const slot = inventory.findEmptySpot(inventoryItem);
    if (slot == null) {
        console.assert(slot == null);
        console.log("null")
        return;
    }
    inventory.placeItem(inventoryItem, slot.column, slot.row);
    console.log(inventory.cells)
}
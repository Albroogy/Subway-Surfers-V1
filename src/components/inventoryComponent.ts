import { context, OFFSET } from "../global";
import { Component, Entity } from "../entityComponent";
import { slot } from "./gameComponent";

enum Status{
    Add = "add",
    Remove = "remove"
}

export class InventoryItem {
    public width: number;
    public height: number;
    public iconURL: string;
    public image: HTMLImageElement;
    public name: string
    constructor(width: number, height: number, iconURL: string, image: HTMLImageElement, name: string) {
        this.width = width;
        this.height = height;
        this.iconURL = iconURL;
        this.image = image;
        this.name = name;
    }
}

export const TakenInventoryItemSlot = { INVENTORY_SLOT_TAKEN: true };

export class Inventory{
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public cells: Array<Array<InventoryItem | Record<string, InventoryItem> | null>>
    public equippedItems: Record <string, string | null>;
    public itemSize: Record<string, number>;
    private _hiddenItem: string;
    public highlight: boolean = false;

    constructor(width: number, height: number, x: number, y: number, itemSize: Record<string, number>) {
        this.equippedItems = {};
        this.cells = [];
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this._hiddenItem = "";
        this.itemSize = itemSize
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
        return Object.values(this.equippedItems).includes(item.name);
    }
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
                    context.drawImage(currentCell.image, this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width * currentCell.width, this.itemSize.height * currentCell.height)
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

    public updateStats(stats: Record<string, number>): void {
        if (this.equippedItems.Armor != null){
            stats.Lives = 2;
        }
        else {
            stats.Lives = 1;
        }
        if (this.equippedItems.Boots != null){
            stats.RollSpeed = 500;
        }
        else {
            stats.RollSpeed = 400;
        }
        console.log(stats);
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
    private _updateEquippedItem(item: InventoryItem, status: string){
        if (status == Status.Add){
            if (item.name == ItemList.Armor.name){
                this.equippedItems.Armor = ItemList.Armor.name;
            }
            if (item.name == ItemList.Boots.name){
                this.equippedItems.Boots = ItemList.Boots.name;
            }
            if (item.name == ItemList.Spear.name){
                this.equippedItems.Spear = ItemList.Spear.name;
            }
            if (item.name == ItemList.Bow.name){
                this.equippedItems.Bow = ItemList.Bow.name;
            }
        }
        else{
            if (item.name == ItemList.Armor.name){
                this.equippedItems.Armor = null;
            }
            if (item.name == ItemList.Boots.name){
                this.equippedItems.Boots = null;
            }
            if (item.name == ItemList.Spear.name){
                this.equippedItems.Spear = null;
            }
            if (item.name == ItemList.Bow.name){
                this.equippedItems.Bow = null;
            }
        }
    }
    // public highlight(){
    //     const centeringWidthOffset = this.width/2 * this.itemSize.width;
    //     const centeringHeightOffset = this.height/2 * this.itemSize.height;

    //     context.strokeStyle = "blue";
    //     context.strokeRect(this.x - centeringWidthOffset, this.y - centeringHeightOffset, this.itemSize.width * this.width, this.itemSize.height * this.height);
    //     console.log(this.x - centeringWidthOffset, this.y - centeringHeightOffset, this.itemSize.width * this.width, this.itemSize.height * this.height)
    // }
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

const spearImage = new Image;
spearImage.src = ItemInfo.Spear.src;
const bowImage = new Image;
bowImage.src = ItemInfo.Bow.src;
const armorImage = new Image;
armorImage.src = ItemInfo.Armor.src;
const bootsImage = new Image;
bootsImage.src = ItemInfo.Boots.src;

export const ItemList: Record<string, InventoryItem> = {
    Spear: new InventoryItem(2, 1, spearImage.src, spearImage, "Spear"),
    Bow: new InventoryItem(1, 2, bowImage.src, bowImage, "Bow"),
    Armor: new InventoryItem(2, 2, armorImage.src, armorImage, "Armor"),
    Boots: new InventoryItem(1, 1, bootsImage.src, bootsImage, "Boots")
}

export function equipStarterItems(currentObject: Entity){
    const inventoryComponent: InventoryComponent = currentObject.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;
    inventoryComponent.inventories[0].placeItem(ItemList.Bow, 1, 0);
    inventoryComponent.inventories[0].placeItem(ItemList.Armor, 2, 0);
    inventoryComponent.inventories[0].placeItem(ItemList.Boots, 0, 0);
    inventoryComponent.inventories[1].placeItem(ItemList.Spear, 0, 0);
}


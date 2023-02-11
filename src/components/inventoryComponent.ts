import { context } from "../global";
import { Component, Entity } from "../entityComponent";
import { slot } from "./gameComponent";

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
                if (this.cells[i][j] != null){
                    return false;
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
                    if (item.iconURL == ItemList.Armor.iconURL){
                        this.equippedItems.Armor = ItemList.Armor.name;
                    }
                    if (item.iconURL == ItemList.Boots.iconURL){
                        this.equippedItems.Boots = ItemList.Boots.name;
                    }
                    if (item.iconURL == ItemList.Spear.iconURL){
                        this.equippedItems.Spear = ItemList.Spear.name;
                    }
                    if (item.iconURL == ItemList.Bow.iconURL){
                        this.equippedItems.Bow = ItemList.Bow.name;
                    }
                }
            }
        }
    }
    public removeItem(item: { width: number; height: number; }, cellRow: number, cellCol: number){
        for (let i = 0; i < item.width; i++){
            for (let j = 0; j < item.height; j++){
                this.cells[cellRow + i][cellCol + j] = null;
            }
        }
    }
    public isEquipped(item: InventoryItem): boolean {
        return Object.keys(this.equippedItems).includes(item.name);
    }
    public draw() {
        // for every row and col
        //   go through every cell, that is the top-left coordinate of an item and draw the image
        // for every row and col
        //   go through every cell, draw box <-- context.strokeRect
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const centeringWidthOffset = this.width/2 * this.itemSize.width;
                const centeringHeightOffset = this.height/2 * this.itemSize.height;

                context.strokeRect(this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width, this.itemSize.height);
                const currentCell = this.cells[i][j];
                if (currentCell instanceof InventoryItem && currentCell.name != this._hiddenItem){
                    context.drawImage(currentCell.image, this.x + i * this.itemSize.width - centeringWidthOffset, this.y + j * this.itemSize.height - centeringHeightOffset, this.itemSize.width * currentCell.width, this.itemSize.height * currentCell.height)
                }
            }
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
            // why do I need this code for it to work / not be undefined?
        }
        if (this.equippedItems.Boots != null){
            stats.RollSpeed = 500;
        }
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
}
export class InventoryComponent extends Component {
    public static COMPONENT_ID: string = "Inventory";

    public inventories: Array<Inventory> = [];
    constructor(inventories: Array<Inventory>){
        super();
        this.inventories = inventories;
    }
}

const spearImage = new Image;
spearImage.src = "assets/images/spear.png";
const bowImage = new Image;
bowImage.src = "assets/images/bow.png";
const armorImage = new Image;
armorImage.src = "assets/images/armor.png";
const bootsImage = new Image;
bootsImage.src = "assets/images/boots.png";

export const ItemInfo: Record<string, Record<string, string>> = {
    Armor: {
        src: "assets/images/armor.png"
    }
}

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
}


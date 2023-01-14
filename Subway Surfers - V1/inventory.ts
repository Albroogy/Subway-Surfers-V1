import {playerAnimated} from "./main"
import {context} from "./main"
import {ITEM, ItemList} from "./main"

// Inventory
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
export class Inventory {
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public cells: Array<Array<InventoryItem | typeof TakenInventoryItemSlot | null>>
    constructor(width: number, height: number, x: number, y: number) {
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
    placeItemCheck(item: InventoryItem, cellRow: number, cellCol: number): boolean {
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
    placeItem(item: InventoryItem, cellRow: number, cellCol: number){
        if (this.placeItemCheck(item, cellRow, cellCol)){
            for (let i = 0; i < item.width; i++){
                for (let j = 0; j < item.height; j++){
                    this.cells[cellRow + i][cellCol + j] = TakenInventoryItemSlot;
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
    removeItem(item: { width: number; height: number; }, cellRow: number, cellCol: number){
        for (let i = 0; i < item.width; i++){
            for (let j = 0; j < item.height; j++){
                this.cells[cellRow + i][cellCol + j] = null;
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
                const currentCell = this.cells[i][j];
                if (currentCell instanceof InventoryItem){
                    context.drawImage(currentCell.image, this.x + i * ITEM.WIDTH, this.y + j * ITEM.HEIGHT, ITEM.WIDTH * currentCell.width, ITEM.HEIGHT * currentCell.height)
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
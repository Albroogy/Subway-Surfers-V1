import { canvas, context } from "../global";
import { Component, Entity } from "../entityComponent";
import PlayerComponent from "./playerComponent";

const ITEM = {
    WIDTH: 50,
    HEIGHT: 50
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
export class InventoryComponent extends Component {
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public cells: Array<Array<InventoryItem | typeof TakenInventoryItemSlot | null>>
    constructor(width: number, height: number, x: number, y: number) {
        super();
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
    placeItem(item: InventoryItem, cellRow: number, cellCol: number, currentObject: PlayerComponent){
        if (this.placeItemCheck(item, cellRow, cellCol)){
            for (let i = 0; i < item.width; i++){
                for (let j = 0; j < item.height; j++){
                    this.cells[cellRow + i][cellCol + j] = TakenInventoryItemSlot;
                    this.cells[cellRow][cellCol] = item;
                    if (item.iconURL == ItemList.Armor.URL){
                        currentObject.equippedItems.Armor = ItemList.Armor.Name;
                    }
                    if (item.iconURL == ItemList.Boots.URL){
                        currentObject.equippedItems.Boots = ItemList.Boots.Name;
                    }
                    if (item.iconURL == ItemList.Spear.URL){
                        currentObject.equippedItems.Spear = ItemList.Spear.Name;
                    }
                    if (item.iconURL == ItemList.Bow.URL){
                        currentObject.equippedItems.Bow = ItemList.Bow.Name;
                    }
                    currentObject.statsUpdate();
                }
            }
        }
    }
    removeItem(item: { width: number; height: number; }, cellRow: number, cellCol: number, currentObject: PlayerComponent){
        for (let i = 0; i < item.width; i++){
            for (let j = 0; j < item.height; j++){
                this.cells[cellRow + i][cellCol + j] = null;
                currentObject.statsUpdate();
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

const spearImage = new Image;
spearImage.src = "../assets/images/spear.png";
const bowImage = new Image;
bowImage.src = "../assets/images/bow.png";
const armorImage = new Image;
armorImage.src = "../assets/images/armor.png";
const bootsImage = new Image;
bootsImage.src = "../assets/images/boots.png";

export type EquipmentItem = {
    Width: number, 
    Height: number,
    URL: string,
    Image: HTMLImageElement,
    Name: string
};

export const ItemList: Record<string, EquipmentItem> = {
    Spear: {
        Width: 2, 
        Height: 1,
        URL: spearImage.src,
        Image: spearImage,
        Name: "Spear"
    },
    Bow: {
        Width: 1,
        Height: 2,
        URL: bowImage.src,
        Image: bowImage,
        Name: "Bow"
    },
    Armor: {
        Width: 2,
        Height: 2,
        URL: armorImage.src,
        Image: armorImage,
        Name: "Armor"
    },
    Boots: {
        Width: 1,
        Height: 1,
        URL: bootsImage.src,
        Image: bootsImage,
        Name: "Boots"
    }
}


const spear = new InventoryItem(ItemList.Spear.Width,ItemList.Spear.Height,ItemList.Spear.URL, ItemList.Spear.Image, ItemList.Spear.Name);
const bow = new InventoryItem(ItemList.Bow.Width,ItemList.Bow.Height,ItemList.Bow.URL, ItemList.Bow.Image, ItemList.Bow.Name);
const armor = new InventoryItem(ItemList.Armor.Width,ItemList.Armor.Height,ItemList.Armor.URL, ItemList.Armor.Image, ItemList.Armor.Name);
const boots = new InventoryItem(ItemList.Boots.Width,ItemList.Boots.Height,ItemList.Boots.URL, ItemList.Boots.Image, ItemList.Boots.Name);

export const equippedInventory = new Entity;
equippedInventory.addComponent(InventoryComponent.COMPONENT_ID, new InventoryComponent(5, 3, 50, 200));
export const itemsFound = new Entity;
itemsFound.addComponent(InventoryComponent.COMPONENT_ID, new InventoryComponent(10, 5, canvas.width/2, 0));

export function equipStarterItems(currentObject: Entity){
    const inventoryComponent: InventoryComponent = currentObject.getComponent<InventoryComponent>(InventoryComponent.COMPONENT_ID)!;
    const playerComponent: PlayerComponent = currentObject.getComponent<PlayerComponent>(PlayerComponent.COMPONENT_ID)!;
    inventoryComponent.placeItem(bow, 1, 0, playerComponent);
    inventoryComponent.placeItem(armor, 2, 0, playerComponent);
    inventoryComponent.placeItem(boots, 0, 0, playerComponent);
}


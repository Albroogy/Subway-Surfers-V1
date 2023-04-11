import {Component} from "../entityComponent";
import { InventoryItem } from "./inventoryComponent";

export class LootComponent extends Component { 
    public static COMPONENT_ID: string = "Loot";

    public inventoryItem: InventoryItem | null = null;
    
    constructor(inventoryItem: InventoryItem) {
        super();
        this.inventoryItem = inventoryItem;
    }
}
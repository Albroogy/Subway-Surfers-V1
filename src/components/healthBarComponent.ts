import { Component, Entity } from "../entityComponent";
import { context, Coordinate } from "../global";
import PositionComponent from "./positionComponent";

export class EntityBar {
    private _maxHealth: number;
    private _currentHealth: number;
    private _color: string;
    private _width: number;
    private _height: number;
    private _location: Coordinate = {
        x: 0,
        y: 0
    }
    private _entity: Entity | null = null;
    private _movesWithEntity: boolean;

    constructor(maxHealth: number, color: string, xPosition: number, yPosition: number, width: number, height: number, movesWithEntity: boolean = false) {
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
        this._color = color;
        this._width = width;
        this._height = height;
        this._location.x = xPosition;
        this._location.y = yPosition;
        this._movesWithEntity = movesWithEntity;
    }
    
    public draw(): void {
        console.assert(this._location != null);
        
        // Calculate the width of the health bar based on the current health
        const healthPercent = this._currentHealth / this._maxHealth;
        const healthBarWidth = this._width * healthPercent;
        
        if (this._movesWithEntity == true && this._entity) {
            const positionComponent = this._entity.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
            context.fillStyle = "gray";
            context.fillRect(positionComponent.x + this._location.x - this._width/2, positionComponent.y + this._location.y - this._height/2, this._width, this._height);
            
            // Draw the health bar itself
            context.fillStyle = this._color;
            context.fillRect(positionComponent.x + this._location.x - this._width/2, positionComponent.y + this._location.y - this._height/2, healthBarWidth, this._height);
        }
        else {
        // Draw the background of the health bar
        context.fillStyle = "gray";
        context.fillRect(this._location.x - this._width/2, this._location.y - this._height/2, this._width, this._height);
        
        // Draw the health bar itself
        context.fillStyle = this._color;
        context.fillRect(this._location.x - this._width/2, this._location.y - this._height/2, healthBarWidth, this._height);
        }
    }
    
    public setHealth(health: number): void {
        this._currentHealth = health;
    }

    public attachToEntity(entity: Entity) {
        this._entity = entity;
    }
}

export default class HealthBarComponent extends Component { 
    public static COMPONENT_ID: string = "HealthBar";
    private _entityBars: Array<EntityBar>;

    constructor(entityBars: Array<EntityBar>) {
        super();
        this._entityBars = entityBars;
    }
    
    public draw(): void {
        for (const bar of this._entityBars) {
            bar.draw();
        }
    }

    public onAttached(): void {
        for (const bar of this._entityBars) {
            bar.attachToEntity(this._entity!);
        }
    }

    public get entityBars() {
        return this._entityBars;
    }
}
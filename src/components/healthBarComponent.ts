import { Component } from "../entityComponent";
import { context, Coordinate } from "../global";
import PositionComponent from "./positionComponent";

export default class HealthBarComponent extends Component { 
    public static COMPONENT_ID: string = "HealthBar";
    private _maxHealth: number;
    private _currentHealth: number;
    private _color: string;
    private _width: number;
    private _height: number;
    private _location: Coordinate = {
        x: 0,
        y: 0
    }

    constructor(maxHealth: number, color: string, xPosition: number, yPosition: number, width: number, height: number) {
        super();
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
        this._color = color;
        this._width = width;
        this._height = height;
        this._location.x = xPosition;
        this._location.y = yPosition;
    }
    
    public update(deltaTime: number): void {
        if (this._entity == null) {
            return;
        }
        
        console.assert(this._location != null);
        
        // Calculate the width of the health bar based on the current health
        const healthPercent = this._currentHealth / this._maxHealth;
        const healthBarWidth = this._width * healthPercent;
        
        // Draw the background of the health bar
        context.fillStyle = "gray";
        context.fillRect(this._location.x - this._width/2, this._location.y - this._height/2, this._width, this._height);
        
        // Draw the health bar itself
        context.fillStyle = this._color;
        context.fillRect(this._location.x - this._width/2, this._location.y - this._height/2, healthBarWidth, this._height);
    }
    
    public setHealth(health: number): void {
        this._currentHealth = health;
    }
}
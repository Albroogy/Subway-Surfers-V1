export class Component {
    public static COMPONENT_ID: string = "Component";

    protected _entity: Entity | null = null;

    public attachToEntity(entity: Entity) {
        this._entity = entity;
        this.onAttached();
    }
    public onAttached(): void {
    }
    public update(deltaTime: number, gameSpeed: number): void {
    }
    public draw(): void {
    }

}

export class Entity {
    private _name: string = "";
    private _components: Record<string, Component> = {};

    constructor(name: string = "") {
        this._name = name;
    }

    public get name(): string {
        return  this._name;
    }
    
    public addComponent(componentId: string, component: Component): void {
        this._components[componentId] = component;
        component.attachToEntity(this);
        console.log(componentId);
    }

    public getComponent<ComponentType extends Component>(componentId: string): ComponentType | null {
        return this._components[componentId] as ComponentType;
    }

    public update(deltaTime: number, gameSpeed: number): void {
        for (const key in this._components) {
            this._components[key].update(deltaTime, gameSpeed);
        }
    }

    public draw(): void {
        for (const key in this._components) {
            this._components[key].draw();
        }
    }

    public print(): void {
        console.log(`Entity ${this._name} with components: ${this._components}`);
    }
}

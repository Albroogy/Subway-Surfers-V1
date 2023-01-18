import Component from "./components/component";

export default class Entity {
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
    }

    public getComponent<ComponentType extends Component>(componentId: string): ComponentType | null {
        return this._components[componentId] as ComponentType;
    }

    public update(deltaTime: number): void {
        for (const key in this._components) {
            this._components[key].update(deltaTime);
        }
    }

    public print(): void {
        console.log(`Entity ${this._name} with components: ${this._components}`);
    }
}

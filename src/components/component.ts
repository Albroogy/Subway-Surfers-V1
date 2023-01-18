import Entity from "../entity";

export default class Component {
    public static COMPONENT_ID: string = "Component";

    protected _entity: Entity | null = null;

    public attachToEntity(entity: Entity) {
        this._entity = entity;
    }
    public update(deltaTime: number): void {

    }
}

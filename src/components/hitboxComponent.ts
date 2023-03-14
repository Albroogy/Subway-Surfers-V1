import { Component } from "../entityComponent";

export interface Hitbox {
    shape: "rectangle" | "circle";
    width?: number;
    height?: number;
    radius?: number;
}

export class HitboxComponent extends Component {
    public static COMPONENT_ID: string = "Hitbox";
    
    public hitboxes: Hitbox[];

    constructor(hitboxes: Hitbox[]) {
        super();
        this.hitboxes = hitboxes;
    }
}

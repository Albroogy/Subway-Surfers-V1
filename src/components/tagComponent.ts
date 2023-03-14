import { Component } from "../entityComponent";
import { Tag } from "../global";

export class TagComponent extends Component {
    public static COMPONENT_ID: string = "Tag";
  
    private _tags: Set<Tag>;
  
    constructor(tags: Set<Tag>) {
      super();
      this._tags = new Set(tags);
    }
  
    public hasTag(tag: Tag): boolean {
      return this._tags.has(tag);
    }
  
    public addTag(tag: Tag): void {
      this._tags.add(tag);
    }
  
    public removeTag(tag: Tag): void {
      this._tags.delete(tag);
    }
  
    public get tags(): Tag[] {
      return Array.from(this._tags);
    }
}


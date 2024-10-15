import { ElementId } from "../../id";
import { IModelBase } from "../../iModelBase";
import { ModelType } from "../../modelType";

export class Layer implements IModelBase {
    readonly elementId: ElementId;
    readonly modelType: ModelType.Service;
    
    private name: string;
    private thickness: number;

    getName() {
        return this.name;
    }

    getThickness() {
        return this.thickness;
    }

    constructor(name: string, thickness: number, key?: string) {
        this.name = name;
        this.thickness = thickness;
    }
}
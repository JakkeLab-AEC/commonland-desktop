import { ElementId } from "../../id";
import { IModelBase } from "../../iModelBase";
import { ModelType } from "../../modelType";
import { ServiceModel } from "../servicemodel";

export class Layer extends ServiceModel {
    
    private name: string;
    private thickness: number;

    getName() {
        return this.name;
    }

    getThickness() {
        return this.thickness;
    }

    constructor(name: string, thickness: number, key?: string) {
        super(key);
        this.name = name;
        this.thickness = thickness;
    }
}
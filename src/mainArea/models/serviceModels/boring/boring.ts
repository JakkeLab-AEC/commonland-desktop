import { BoringDTO } from "../../../../dto/serviceModel/BoringDTO";
import { ElementId } from "../../id";
import { ModelType } from "../../modelType";
import { ServiceModel } from "../servicemodel";
import { Layer } from "./layer";
import { SPTResult } from "./sptResult";

export class Boring extends ServiceModel {
    private location: {
        x: number,
        y: number,
    };
    
    private topoTop: number;
    private undergroundWater: number;
    
    private layers: Layer[];
    private sptResult: SPTResult;

    addLayer(layer: Layer) {
        this.layers.push(layer);
    }

    removeLayerByIndex(index: number) {
        if(this.layers.length == 0) {
            throw new Error('There is no layer of this boring.')
        } else {
            this.layers = this.layers.splice(index, 1);
        }
    }

    serialize():BoringDTO {
        const data: BoringDTO = {
            topoTop: this.topoTop,
            undergroundWater: this.undergroundWater,
            layers: this.layers.map(layer => { 
                return {
                    id: layer.elementId.getValue(),
                    name: layer.getName(),
                    thickness: layer.getThickness(),
            }}),
            location: this.location,
            sptResults: this.sptResult.getAllResults(),
            id: this.elementId.getValue(),
            modelType: this.modelType
        }

        return data;
    }

    constructor(
        location: {x: number, y: number}, 
        topoTop: number, 
        undergroundWater: number, 
        key?: string
    ) {
        super(key);
        this.topoTop = topoTop;
        this.undergroundWater = undergroundWater;
        this.location = location;
        this.layers = [];
    }
}
import { BoringDTO } from "../../../../dto/serviceModel/BoringDTO";
import { ServiceModel } from "../servicemodel";
import { Layer } from "./layer";
import { SPTResult } from "./sptResult";

export class Boring extends ServiceModel {
    private name: string;
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

    removeLayer(id: string) {
        const index = this.layers.findIndex(layer => layer.elementId.getValue() == id);
        if(index != -1) {
            this.layers.splice(index, 1);
        }
    }

    serialize():BoringDTO {
        const data: BoringDTO = {
            name: this.name,
            topoTop: this.topoTop,
            undergroundWater: this.undergroundWater,
            layers: this.layers.map((layer, index) => { 
                return {
                    id: layer.elementId.getValue(),
                    layerIndex: index,
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

    getName() {
        return this.name;
    }

    getId() {
        return this.elementId;
    }

    getLocation() {
        return this.location;
    }

    getTopoTop() {
        return this.topoTop;
    }

    getUndergroundWater() {
        return this.undergroundWater;
    }

    getLayers() {
        return this.layers;
    }

    getSPTResult() {
        return this.sptResult;
    }

    static deserialize(dto: BoringDTO):Boring {
        const boring = new Boring(dto.name, dto.location, dto.topoTop, dto.undergroundWater, dto.id);
        const orderedLayers = dto.layers.sort((a, b) => a.layerIndex - b.layerIndex);
        orderedLayers.forEach(layer => {
            boring.addLayer(new Layer(layer.name, layer.thickness, layer.id));
        });
        
        const orderedSpts = dto.sptResults.sort((a, b) => a.depth - b.depth);
        orderedSpts.forEach(spt => {
            boring.sptResult.registerResult(spt.depth, {hitCount: spt.hitCount, distance: spt.distance});
        })
        
        return boring;
    }

    clone(): Boring {
        // New boring instnace
        const clonedBoring = new Boring(
            this.name, 
            { ...this.location },  // copy
            this.topoTop, 
            this.undergroundWater, 
            this.elementId.getValue()
        );

        // Copy layers
        clonedBoring.layers = this.layers.map(layer => new Layer(layer.getName(), layer.getThickness(), layer.elementId.getValue()));

        // Copy spt results
        const sptResultsCopy = new SPTResult();
        const orderedSpts = this.sptResult.getAllResults();
        orderedSpts.forEach(spt => {
            sptResultsCopy.registerResult(spt.depth, {hitCount: spt.hitCount, distance: spt.distance});
        });
        clonedBoring.sptResult = sptResultsCopy;

        return clonedBoring;
    }

    constructor(
        name: string,
        location: {x: number, y: number}, 
        topoTop: number, 
        undergroundWater: number, 
        key?: string
    ) {
        super(key);
        this.name = name;
        this.topoTop = topoTop;
        this.undergroundWater = undergroundWater;
        this.location = location;
        this.layers = [];
        this.sptResult = new SPTResult();
    }
}
import React from "react";
import { LayerComponent } from "./layer";
import { LayerSetHeader } from "./layerHeader";
import { Layer } from "../../../../../../mainArea/models/serviceModels/boring/layer";

interface LayerSetProps {
    layers: Layer[]
    onCreate: () => void;
    onDelete: (id: string) => void;
}

export const LayerSet:React.FC<LayerSetProps> = ({layers, onDelete, onCreate}) => {
    const LayerComponents = layers.map(layer => {
        return(
            <LayerComponent layerId={layer.elementId.getValue()} layerName={layer.getName()} thickness={layer.getThickness()} onDelete={onDelete}/>
        )
    });

    return (
        <div className="h-full">
            <LayerSetHeader onCreate={onCreate}/>
            <hr/>
            <div className="flex flex-col h-full gap-1" style={{overflowY: 'auto'}}>
                {LayerComponents}
            </div>
        </div>
    )
}

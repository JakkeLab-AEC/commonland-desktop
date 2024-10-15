import React from "react";
import { Layer } from "./layer";
import { LayerSetHeader } from "./layerHeader";

interface LayerSetProps {
    layers: {id: string, name: string, thickness: number}[],
}

export const LayerSet:React.FC<LayerSetProps> = ({layers}) => {
    const LayerComponents = layers.map(layer => {
        return(
            <Layer layerId={layer.id} layerName={layer.name} thickness={layer.thickness} />
        )
    });

    return (
        <div>
            <LayerSetHeader />
            <hr/>
            {LayerComponents}
        </div>
    )
}

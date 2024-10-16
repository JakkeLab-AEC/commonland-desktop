import React from "react"
import { HamburgerIcon } from "../../../../../assets/icons/hamburterIcon";
import { DeleteIcon } from "../../../../../assets/icons/deleteIcon";
import { ButtonDelete } from "../../../../../components/buttons/buttonDelete";

export interface LayerProps {
    layerId: string;
    layerName?: string;
    thickness?: number;
    onDelete: (id: string) => void;
}

export const LayerComponent: React.FC<LayerProps> = ({ layerId, layerName, thickness=0.01, onDelete }) => {

    return (
      <div className="flex flex-row space-x-2 h-[32px] items-center">
        <div className="flex w-[32px]">
          <HamburgerIcon />
        </div>
        <div className="flex w-[120px]">
          <input
            className="border w-full"
            defaultValue={layerName}
          />
        </div>
        <div className="flex-grow">
          <input
            className="border w-full"
            type='number'
            defaultValue={thickness}
            step={0.01}
          />
        </div>
        <div>
            <ButtonDelete id={layerId} onDeleteHandler={onDelete}/>
        </div>
      </div>
    );
  };
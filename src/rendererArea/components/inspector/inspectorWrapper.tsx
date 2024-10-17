import React, { ReactNode, useState } from "react"
import { Inspector } from "./inspector"
import { useHomeStore } from "../../../rendererArea/homeStatus/homeStatusModel";


export const InspectorWrapper:React.FC = () => {
    const {
        inspectorVisibility,
        inspectorTitle,
        inspetorContent,
        inspectorSize,
        setInspectorVisiblity,
    } = useHomeStore();
    
    const onCloseHandler = () => {
        setInspectorVisiblity(false);
    }

    return (
        <div>
            {inspectorVisibility && 
            <Inspector 
                title={inspectorTitle} 
                width={inspectorSize.width} 
                height={inspectorSize.height} 
                onClickCloseHandler={onCloseHandler} 
                children={inspetorContent} />}
        </div>
    )
}

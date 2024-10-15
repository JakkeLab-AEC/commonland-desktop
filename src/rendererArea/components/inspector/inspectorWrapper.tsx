import React, { ReactNode, useState } from "react"
import { Inspector } from "./inspector"
import { useHomeStore } from "../../../rendererArea/homeStatus/homeStatusModel";

interface InspectorWrapperProps {
    width: number;
    height: number;
}

export const InspectorWrapper:React.FC<InspectorWrapperProps> = ({width, height}) => {
    const {
        inspectorVisibility,
        inspectorTitle,
        inspetorContent,
        setInspectorVisiblity,
    } = useHomeStore();
    
    const onCloseHandler = () => {
        setInspectorVisiblity(false);
    }

    return (
        <div>
            {inspectorVisibility && <Inspector title={inspectorTitle} width={width} height={height} onClickCloseHandler={onCloseHandler} children={inspetorContent} />}
        </div>
    )
}

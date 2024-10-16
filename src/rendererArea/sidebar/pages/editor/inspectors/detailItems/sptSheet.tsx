import React, { useRef, useState } from "react"
import {ButtonPositive} from "../../../../../components/buttons/buttonPositive";
import { ContextMenu, ContextMenuItemProp } from "../../../../../components/contextmenu/contextMenu";
import { SPTResult } from "../../../../../../mainArea/models/serviceModels/boring/sptResult";
import { Inspector } from "../../../../../../rendererArea/components/inspector/inspector";
import { ButtonNegative } from "../../../../../../rendererArea/components/buttons/buttonNegative";

interface SPTResultUnitProp {
    depth: number,
    hitCount: number,
    distance: number
}

export const SPTResultUnit:React.FC<SPTResultUnitProp> = ({depth, hitCount, distance}) => {
    return(
        <div className="flex flex-row">
            <div className="w-[48px]">
                {depth.toFixed(1)}
            </div>
            <div className="flex-1 flex flex-row gap-1">
                <div className="w-[36px]">
                    <input type="number" defaultValue={hitCount} className="w-[36px] border" min={1} max={99} maxLength={2}/>
                </div>
                <div>/</div>
                <div className="w-[24px]">
                    <input type="number" defaultValue={distance} className="w-[36px] border" min={1} max={99} maxLength={2}/>
                </div>
            </div>
        </div>
    )
}

interface SPTResultSetProp {
    result: SPTResult;
}


const SPTResults: React.FC<SPTResultSetProp> = ({ result }) => (
    <div className="flex flex-col gap-2 p-2 h-[300px]">
        {result.getAllResults().map((spt, index) => (
            <SPTResultUnit key={index} depth={spt.depth} hitCount={spt.hitCount} distance={spt.distance} />
        ))}
    </div>
);

interface SPTSheetProps {
    SPTResultValues: SPTResult
    onClickSetDepth?: (e: number) => void;
}



export const SPTSheet:React.FC<SPTSheetProps> = ({SPTResultValues, onClickSetDepth}) => {
    const [contextMenuVisibility, toggleContextMenu] = useState<boolean>(false);
    const [sptSettingVisibility, setSptSettingVisibility] = useState<boolean>(false);
    const depthRef = useRef<HTMLInputElement>(null);

    const showContextMenu = () => {
        toggleContextMenu(!contextMenuVisibility);
    }

    const closeContextMenu = () => {
        toggleContextMenu(false);
    }

    const openPreviewWindow = () => {
        window.electronWindowControlAPI.createNewWindow();
    }

    const SPTRangeWindow = () => {
        return (
        <div style={{position: 'absolute', left: 452}}>
            <Inspector title={"SPT 범위설정"} width={160} height={116} onClickCloseHandler={closeSPTRangeWindow}>
                <div className="flex flex-col p-2 gap-2">
                    <div className="flex flex-row gap-2">
                        <div className="flex w-[48px] flex-grow">
                            깊이
                        </div>
                        <div className="flex">
                            <input
                                className="border w-[92px]"
                                type='number'
                                defaultValue={1}
                                min={1}
                                ref={depthRef} />
                        </div>
                    </div>
                    <div className="flex gap-2 self-end">
                        <ButtonPositive text={"설정"} isEnabled={true} width={32} onClickHandler={onClickSubmitRange}/>
                        <ButtonNegative text={"취소"} isEnabled={true} width={32} onClickHandler={closeSPTRangeWindow}/>
                    </div>
                </div>
            </Inspector>
        </div>
    )}

    const openSPTRangeWindow = () => {
        setSptSettingVisibility(true);
    }

    const closeSPTRangeWindow = () => {
        setSptSettingVisibility(false);
    }

    const onClickSubmitRange = () => {
        if(onClickSetDepth && depthRef.current) {
            onClickSetDepth(parseFloat(depthRef.current.value));
        }

        closeSPTRangeWindow();
    }

    const contextMenuItemProps:ContextMenuItemProp[] = [
        {displayString: '깊이설정', isActionIdBased: false, closeHandler: closeContextMenu, action: openSPTRangeWindow},
        {displayString: '미리보기', isActionIdBased: false, closeHandler: closeContextMenu, action: openPreviewWindow},
    ];

    return (
        <div className="flex flex-col flex-grow" style={{height: '100%'}}>
            <div className="flex items-center p-2 border-b">
                <div className="w-1/4 font-semibold">심도</div>
                <div className="flex-grow font-semibold">N치</div>
                <ButtonPositive text={"..."} width={32} onClickHandler={showContextMenu} isEnabled={true}/>
            </div>
            <div className="flex flex-grow" style={{overflowY: 'auto'}}>
                <SPTResults result={SPTResultValues} />
            </div>
            {contextMenuVisibility && 
            <div style={{top: 44, right: 60, position: 'absolute'}}>
                <ContextMenu menuItemProps={contextMenuItemProps} width={120} onClose={closeContextMenu}/>
            </div>}
            {sptSettingVisibility && <SPTRangeWindow />}
        </div>
    );
}

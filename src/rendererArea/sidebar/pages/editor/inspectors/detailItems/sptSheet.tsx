import React, { useState } from "react"
import {ButtonPositive} from "../../../../../components/buttons/buttonPositive";
import { ContextMenu, ContextMenuItemProp } from "../../../../../components/contextmenu/contextMenu";

interface SPTResultProp {
    depth: number,
    hitCount: number,
    distance: number
}

export const SPTResult:React.FC<SPTResultProp> = ({depth, hitCount, distance}) => {
    return(
        <div className="flex flex-row">
            <div className="w-[48px]">
                {depth}
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
    results: SPTResultProp[];
}


const SPTResults: React.FC<SPTResultSetProp> = ({ results }) => (
    <div className="flex flex-col gap-2 p-2 h-[300px]">
        {results.map((spt, index) => (
            <SPTResult key={index} depth={spt.depth} hitCount={spt.hitCount} distance={spt.distance} />
        ))}
    </div>
);

const sampleSPTResults:SPTResultProp[] = [
    {depth: 1.0, hitCount: 2, distance: 30},
    {depth: 2.0, hitCount: 2, distance: 30},
    {depth: 3.0, hitCount: 2, distance: 30},
    {depth: 4.0, hitCount: 2, distance: 30},
    {depth: 5.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
    {depth: 6.0, hitCount: 2, distance: 30},
];

export const SPTSheet = () => {
    const[contextMenuVisibility, toggleContextMenu] = useState<boolean>(false);

    const showContextMenu = () => {
        toggleContextMenu(!contextMenuVisibility);
    }

    const closeContextMenu = () => {
        toggleContextMenu(false);
    }

    const openPreviewWindow = () => {
        window.electronWindowControlAPI.createNewWindow();
    }

    const contextMenuItemProps:ContextMenuItemProp[] = [
        {displayString: '깊이설정', isActionIdBased: false, closeHandler: closeContextMenu},
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
                <SPTResults results={sampleSPTResults} />
            </div>
            {contextMenuVisibility && 
            <div style={{top: 44, right: 60, position: 'absolute'}}>
                <ContextMenu menuItemProps={contextMenuItemProps} width={120} onClose={closeContextMenu}/>
            </div>}
        </div>
    );
}

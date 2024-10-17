import { useLanguageStore } from "../../../../../rendererArea/language/languageStore";
import { ButtonNegative } from "../../../../../rendererArea/components/buttons/buttonNegative";
import {ButtonPositive} from "../../../../../rendererArea/components/buttons/buttonPositive";
import { useEffect, useRef, useState } from "react";
import { FoldableControl } from "../../../../../rendererArea/components/foldableControl/foldableControl";
import React from "react";
import { LayerSet } from "./detailItems/layers";
import { SPTSheet } from "./detailItems/sptSheet";
import { Boring } from "../../../../../mainArea/models/serviceModels/boring/boring";
import { useHomeStore } from "../../../../../rendererArea/homeStatus/homeStatusModel";
import { Layer } from "../../../../../mainArea/models/serviceModels/boring/layer";
import { SPTResult, SPTResultSet } from "../../../../../mainArea/models/serviceModels/boring/sptResult";
import { useEditorPageStore } from "../EditorPageStore";

interface BoringEditorProps {
    boring: Boring
}

export const BoringEditor: React.FC<BoringEditorProps> = ({boring}) => {
    const { findValue } = useLanguageStore();
    const {setInspectorVisiblity} = useHomeStore();
    const {
        updateBoring
    } = useEditorPageStore();

    const [currentLayers, setLayers] = useState<Layer[]>(boring.getLayers());
    const [currentSPTResult] = useState<SPTResultSet>(boring.getSPTResultSet());
    const tbBoringName = useRef(null);
    
    const onClickCancel = () => {
        setInspectorVisiblity(false);
    }

    const onClickSave = async () => {
        const updateJob = updateBoring(boring);
    }

    const onDeleteLayer = (id: string) => {
        boring.removeLayer(id);
        setLayers([...boring.getLayers()]);  // 새로운 레이어 배열로 상태 업데이트
    }

    const onCreateLayer = () => {
        const layer = new Layer('레이어', 1);
        boring.addLayer(layer);
        setLayers([...boring.getLayers()]);  // 새로운 레이어 배열로 상태 업데이트
    }

    const onClickSetSPTDepth = (depth: number) => {
        boring.getSPTResultSet().buildEmptySets(depth);
    }

    const onChangeSPTValueHandler = (id: string, depth: number, hitCount: number, distance: number) => {
        boring.getSPTResultSet().updateResult(depth, new SPTResult(depth, hitCount, distance));
    }

    const onChangeLayerValueHandler = (id: string, name: string, thickness: number) => {
        boring.updateLayer(id, name, thickness);
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row flex-grow" style={{overflowY: 'hidden', borderBottomWidth: 1}}>
                {/* Left column with fixed height content */}
                <div className="flex flex-col w-[260px]" style={{borderRightWidth: 1}}>
                    {/* Boring name */}
                    <div className="grid grid-cols-[76px_1fr] p-2">
                        <div>{findValue("BoringEditor", "boringNameHeader")}</div>
                        <input ref={tbBoringName} className="border w-full" defaultValue={boring.getName()}/>
                    </div>
                    <hr />
                    {/* Coordinates */}
                    <div className="grid grid-cols-[76px_1fr] p-2 gap-y-2">
                        <div>{findValue("BoringEditor", "boringCoordinate")}</div>
                        <div className="grid grid-cols-[28px_1fr] gap-x-2">
                            <div>X:</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={boring.getLocation().x}/>
                        </div>
                        <div></div>
                        <div className="grid grid-cols-[28px_1fr] gap-x-2">
                            <div>Y:</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={boring.getLocation().y}/>
                        </div>
                    </div>
                    <hr />
                    {/* EL, GL Levels */}
                    <div className="grid grid-cols-[76px_1fr] p-2 gap-y-2">
                        <div>{findValue("BoringEditor", "boringLevels")}</div>
                        <div className="grid grid-cols-[84px_1fr] gap-x-2">
                            <div>{findValue("BoringEditor", "elevation")} EL</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={boring.getTopoTop()} />
                        </div>
                        <div></div>
                        <div className="grid grid-cols-[84px_1fr] gap-x-2">
                            <div>{findValue("BoringEditor", "undergroundwater")} GL</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={boring.getUndergroundWater()} />
                        </div>
                    </div>
                    <hr />
                    {/* Layers */}
                    <div className="p-2 h-[320px]">
                        <LayerSet 
                            layers={currentLayers} 
                            onDelete={onDeleteLayer} 
                            onCreate={onCreateLayer}
                            onChangeValueListner={onChangeLayerValueHandler}/>
                    </div>
                </div>
                <div className="flex flex-grow">
                    <SPTSheet onClickSetDepth={onClickSetSPTDepth} onChangeValueSetListner={onChangeSPTValueHandler} SPTResultSet={currentSPTResult}/>
                </div>
            </div>

            {/* Save buttons */}
            <div className="flex self-end">
                <div className="flex flex-row gap-2 justify-end p-2">
                    <ButtonPositive text={"저장"} width={48} isEnabled={true} onClickHandler={onClickSave}/>
                    <ButtonNegative text={"취소"} width={48} isEnabled={true} onClickHandler={onClickCancel}/>
                </div>
            </div>
        </div>
    );
};

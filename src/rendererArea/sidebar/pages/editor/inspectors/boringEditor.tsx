import { useLanguageStore } from "../../../../../rendererArea/language/languageStore";
import { ButtonNegative } from "../../../../../rendererArea/components/buttons/buttonNegative";
import {ButtonPositive} from "../../../../../rendererArea/components/buttons/buttonPositive";
import { useRef } from "react";
import { FoldableControl } from "../../../../../rendererArea/components/foldableControl/foldableControl";
import React from "react";
import { LayerSet } from "./detailItems/layers";
import { SPTSheet } from "./detailItems/sptSheet";


const sampleLayers:{id: string, name: string, thickness: number}[] = [
    {id: 'test1', name: '매립층', thickness: 4},
    {id: 'test2', name: '풍화토', thickness: 4},
    {id: 'test3', name: '풍화암', thickness: 4},
    {id: 'test4', name: '기반암', thickness: 4},
];

export const BoringEditor: React.FC = () => {
    const { findValue } = useLanguageStore();
    const tbBoringName = useRef(null);
  
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row flex-grow" style={{overflowY: 'hidden', borderBottomWidth: 1}}>
                {/* Left column with fixed height content */}
                <div className="flex flex-col w-[260px]" style={{borderRightWidth: 1}}>
                    {/* Boring name */}
                    <div className="grid grid-cols-[76px_1fr] p-2">
                        <div>{findValue("BoringEditor", "boringNameHeader")}</div>
                        <input ref={tbBoringName} className="border w-full" />
                    </div>
                    <hr />
                    {/* Coordinates */}
                    <div className="grid grid-cols-[76px_1fr] p-2 gap-y-2">
                        <div>{findValue("BoringEditor", "boringCoordinate")}</div>
                        <div className="grid grid-cols-[28px_1fr] gap-x-2">
                            <div>X:</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={0}/>
                        </div>
                        <div></div>
                        <div className="grid grid-cols-[28px_1fr] gap-x-2">
                            <div>Y:</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={0}/>
                        </div>
                    </div>
                    <hr />
                    {/* EL, GL Levels */}
                    <div className="grid grid-cols-[76px_1fr] p-2 gap-y-2">
                        <div>{findValue("BoringEditor", "boringLevels")}</div>
                        <div className="grid grid-cols-[84px_1fr] gap-x-2">
                            <div>{findValue("BoringEditor", "elevation")} EL</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={0} />
                        </div>
                        <div></div>
                        <div className="grid grid-cols-[84px_1fr] gap-x-2">
                            <div>{findValue("BoringEditor", "undergroundwater")} GL</div>
                            <input ref={tbBoringName} className="border w-full" type="number" step={0.01} defaultValue={0} />
                        </div>
                    </div>
                    <hr />
                    {/* Layers */}
                    <div className="p-2">
                        <FoldableControl title={"지층"}>
                            <LayerSet layers={sampleLayers} />
                        </FoldableControl>
                    </div>
                </div>
                <div className="flex flex-grow">
                    <SPTSheet/>
                </div>
            </div>

            {/* Save buttons */}
            <div className="flex self-end">
                <div className="flex flex-row gap-2 justify-end p-2">
                    <ButtonPositive text={"저장"} width={48} isEnabled={true} />
                    <ButtonNegative text={"취소"} width={48} isEnabled={true} />
                </div>
            </div>
        </div>
    );
};

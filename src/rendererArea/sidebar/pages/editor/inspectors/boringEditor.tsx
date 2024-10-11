import { useLanguageStore } from "../../../../../rendererArea/language/languageStore";
import ButtonNegative from "../../../../../rendererArea/components/buttons/buttonNegative";
import ButtonPositive from "../../../../../rendererArea/components/buttons/buttonPositive";
import { useRef } from "react";

export interface BoringEditorProps {
    boringName: string;
}

export const BoringEditor = () => {
    const {
        findValue,
    } = useLanguageStore();
    
    const tbBoringName = useRef(null);
    return (
        <div className="flex flex-col h-full">
            {/* Boring name */}
            <div className="flex flex-row p-2">
                <div className="flex w-[76px]">
                    {findValue('BoringEditor','boringNameHeader')}
                </div>
                <div className="flex-grow pl-2">
                    <input 
                        ref={tbBoringName}
                        className="border w-full"/>
                </div>
            </div>
            <hr/>
            <div className="flex flex-row p-2">
                <div className="flex w-[62px]">
                    {findValue('BoringEditor','boringCoordinate')}
                </div>
                <div className="flex flex-row pl-2 gap-2">
                    <div className="w-[48px]">
                        X : 
                    </div>
                    <div>
                        <input 
                            ref={tbBoringName}
                            className="border w-full"
                            type='number'/>
                    </div>
                    <div className="w-[48px]">
                        Y : 
                    </div>
                    <div>
                        <input 
                            ref={tbBoringName}
                            className="border w-full"
                            type='number'/>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="p-2">
                <div className="flex flex-row gap-2">
                    <div className="w-[128px]">
                        지반표고
                    </div>
                    <div>
                        <input 
                            ref={tbBoringName}
                            className="border w-full"
                            type='number'/>
                    </div>
                    <div className="w-[120px]">
                        지하수위
                    </div>
                    <div>
                        <input 
                            ref={tbBoringName}
                            className="border w-full"
                            type='number'/>
                    </div>
                </div>
            </div>
            {/* 하단 버튼 */}
            <div className="mt-auto">
                <hr />
                <div className="flex flex-row gap-2 justify-end p-2">
                    <ButtonPositive text={"저장"} width={48} />
                    <ButtonNegative text={"취소"} width={48} />
                </div>
            </div>
        </div>
    )
}

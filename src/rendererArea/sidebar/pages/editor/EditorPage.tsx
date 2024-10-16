import { useHomeStore } from "../../../../rendererArea/homeStatus/homeStatusModel";
import { ListBox } from "../../../../rendererArea/components/listbox/listBox"
import { ListBoxItem } from "../../../../rendererArea/components/listbox/listBoxItem"
import React, { useEffect, useState } from "react"
import { BoringEditor } from "./inspectors/boringEditor";
import { useLanguageStore } from "../../../../rendererArea/language/languageStore";
import {ButtonPositive} from "../../../../rendererArea/components/buttons/buttonPositive";
import {ButtonNegative} from "../../../../rendererArea/components/buttons/buttonNegative";
import { useEditorPageStore } from "./EditorPageStore";
import { Boring } from "../../../../mainArea/models/serviceModels/boring/boring";
import { generateUUID } from "three/src/math/MathUtils";

interface InspectorContent {
    boring: Boring
}

const InspectorContent:React.FC<InspectorContent> = ({boring}) => {
    return (<BoringEditor boring={boring.clone()}/>)
}

export const BoringManager = () => {
    const {
        findValue,
    } = useLanguageStore();
    
    const {
        setInspectorVisiblity,
        setInspectorTitle,
        setInspectorContent,
        setInspectorSize
    } = useHomeStore();

    const {
        fetchAllBorings,
        insertBoring,
        selectBoring,
        borings,
        boringDisplayItems,
    } = useEditorPageStore();

    const onClickHandler = (id: string) => {
        const selectedBoring = selectBoring(id);
        setInspectorContent(<InspectorContent key={selectedBoring.getId().getValue()} boring={selectedBoring}/>)

        const boringName = selectedBoring.getName();
        setInspectorTitle(`${findValue('BoringEditor', 'editorHeader')} : ${boringName.length > 16 ? boringName.substring(0, 15)+'...' : boringName}`);
        setInspectorSize({width: 440, height: 600})
        setInspectorVisiblity(true);
    }

    const onClickAddBoring = async () => {
        const newBoring = new Boring(generateUUID(), {x: 0, y: 0}, 0, 0);
      
        // Insert new boring
        await insertBoring(newBoring);
      
        // Fetch updated borings
        await fetchAllBorings();
      
        // Re-wrap the display data after fetching updated borings
        await wrapBoringDisplayData(borings);
      };

    const wrapBoringDisplayData = async (borings: Map<string, Boring>) => {
        const boringsMap:Map<string, string> = new Map();
        console.log(borings);
        borings.forEach(boring => {
            boringsMap.set(boring.getId().getValue(), boring.getName());
        });
    }

    useEffect(() => {
        fetchAllBorings();
    }, [fetchAllBorings]);
    

    return (
        <div className="flex flex-col">
            <div className="flex flex-row mb-1 gap-1" style={{userSelect:'none'}}>
                <div className="flex-grow">
                    {findValue('BoringManager', 'boringList')}
                </div>
                <ButtonPositive text={"추가"} width={40} isEnabled={true} onClickHandler={onClickAddBoring}/>
                <ButtonNegative text={"삭제"} width={40} isEnabled={true} />
            </div>
            <div>
                <ListBox height={460} items={boringDisplayItems} onClickHandler={onClickHandler} header={findValue('BoringManager', 'boringList')}/>
            </div>
        </div>
    )
}

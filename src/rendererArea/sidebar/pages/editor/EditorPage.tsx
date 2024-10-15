import { useHomeStore } from "../../../../rendererArea/homeStatus/homeStatusModel";
import { ListBox } from "../../../../rendererArea/components/listbox/listBox"
import { ListBoxItem } from "../../../../rendererArea/components/listbox/listBoxItem"
import React, { useEffect } from "react"
import { BoringEditor } from "./inspectors/boringEditor";
import { useLanguageStore } from "../../../../rendererArea/language/languageStore";

const boreHoles = (n: number) => {
    const items: [string, string][] = []; // 튜플 배열로 타입 명시
    for(let i = 1; i <= n; i++) {
        const numbering = String(i).padStart(2, '0');
        items.push([`${i}`, `BH-${numbering}`]);
    }
    return items;
}

const sampleItems: Map<string, string> = new Map(boreHoles(15));

interface InspectorContent {
    id: string
}

const InspectorContent:React.FC<InspectorContent> = () => {
    return (<BoringEditor />)
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

    const onClickHandler = (id: string) => {
        setInspectorContent(<InspectorContent id={id}/>)
        setInspectorTitle(`${findValue('BoringEditor', 'editorHeader')} : ${sampleItems.get(id)}`);
        setInspectorSize({width: 440, height: 600})
        setInspectorVisiblity(true);
    }

    useEffect(() => {
        onClickHandler('1');
    }, []);
    

    return (
        <div className="flex flex-col">
            <div className="mb-1" style={{userSelect:'none'}}>
                {findValue('BoringManager', 'boringList')}
            </div>
            <div>
                <ListBox height={460} items={sampleItems} onClickHandler={onClickHandler} header={findValue('BoringManager', 'boringList')}/>
            </div>
        </div>
    )
}

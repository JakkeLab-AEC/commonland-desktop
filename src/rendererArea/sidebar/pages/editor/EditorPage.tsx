import { useHomeStore } from "../../../../rendererArea/homeStatus/homeStatusModel";
import { ListBox } from "../../../../rendererArea/components/listbox/listBox"
import { ListBoxItem } from "../../../../rendererArea/components/listbox/listBoxItem"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
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
    const prefixRef = useRef<HTMLInputElement>(null);
    const indexRef = useRef<HTMLInputElement>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const {
        findValue,
    } = useLanguageStore();
    
    const {
        setInspectorVisiblity,
        setInspectorTitle,
        setInspectorContent,
        setInspectorSize,
        registerInspectorClosingListner
    } = useHomeStore();

    const {
        fetchAllBorings,
        insertBoring,
        selectBoring,
        searchBoringName,
        removeBoring,
        unselectBoring,
        borings,
        boringDisplayItems,
        selectedBoringId
    } = useEditorPageStore();

    
    const onClickHandler = (id: string) => {
        const selectedBoring = selectBoring(id);
        setInspectorContent(<InspectorContent key={selectedBoring.getId().getValue()} boring={selectedBoring}/>)

        const boringName = selectedBoring.getName();
        setInspectorTitle(`${findValue('BoringEditor', 'editorHeader')} : ${boringName.length > 16 ? boringName.substring(0, 15)+'...' : boringName}`);
        setInspectorSize({width: 440, height: 600})

        registerInspectorClosingListner(unselectBoring)
        setInspectorVisiblity(true);
    }

    const onClickAddBoring = async () => {
        if(!prefixRef.current.value || prefixRef.current.value.length == 0) {
            alert('접두어를 입력해 주세요');
            return;
        }

        if(!indexRef.current.value || parseInt(indexRef.current.value) == 0) {
            alert('시작번호를 1보다 큰 정수로 입력해 주세요');
            return;
        }

        // Seearch names
        const searchedNames = await searchBoringName(prefixRef.current.value, parseInt(indexRef.current.value));
        
        if(!searchedNames) {
            return;
        }

        let boringName: string;
        if(searchedNames.length == 0) {
            boringName = `${prefixRef.current.value}-${indexRef.current.value}`;
        } else {
            const extractedNumbers = searchedNames.map(item => {
                // Extract the number after the hyphen
                const match = item.match(/-(\d+)$/);
                return match ? parseInt(match[1], 10) : null;
            }).filter(num => num !== null);
            const targetIndex = Math.max(...extractedNumbers) + 1;
            boringName = `${prefixRef.current.value}-${targetIndex}`;
        }

        const newBoring = new Boring(boringName, {x: 0, y: 0}, 0, 0);
      
        // Insert new boring
        await insertBoring(newBoring);
      
        // Fetch updated borings
        await fetchAllBorings();
      
        // Re-wrap the display data after fetching updated borings
        await wrapBoringDisplayData(borings);
    };

    const onClickRemoveBoring = async () => {
        const newSet = new Set(checkedItems);
        if(newSet.has(selectedBoringId)) {
            setInspectorVisiblity(false);
        }
        const result = await removeBoring(newSet.values().toArray());

        if(result) {
            setCheckedItems(new Set());
        }
    }

    const wrapBoringDisplayData = async (borings: Map<string, Boring>) => {
        const boringsMap:Map<string, string> = new Map();
        borings.forEach(boring => {
            boringsMap.set(boring.getId().getValue(), boring.getName());
        });
    }

    const allowedCharacters = /^[a-zA-Z]*$/;
    
    const onChangePrefixHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (!allowedCharacters.test(value) && prefixRef.current) {
            prefixRef.current.value = value.slice(0, -1);
          }
    }

    const onCheckedItemHandler = (id: string, checked: boolean) => {
        const newSet = new Set(checkedItems);
        if(checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setCheckedItems(newSet);
    }

    useEffect(() => {
        fetchAllBorings();
    }, []);
    

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-1" style={{userSelect:'none'}}>
                <div className="flex-grow">
                    {findValue('BoringManager', 'boringList')}
                </div>
            </div>
            <div>
                <ListBox 
                    height={460} 
                    items={boringDisplayItems} 
                    onClickHandler={onClickHandler} 
                    onCheckedHandler={onCheckedItemHandler}
                    header={findValue('BoringManager', 'boringListBoxHeader')}/>
            </div>
            <div className="flex flex-row gap-1">
                <div className="flex flex-row flex-grow">
                    <div className="w-[48px]">
                        접두어
                    </div>
                    <input 
                        className="h-full border-b w-[120px]"
                        onChange={onChangePrefixHandler}
                        ref={prefixRef}
                        placeholder="영문 알파벳"/>
                </div>
                <div className="flex flex-row gap-2 self-end">
                    <ButtonPositive text={"추가"} width={40} isEnabled={true} onClickHandler={onClickAddBoring}/>
                    <ButtonNegative text={"삭제"} width={40} isEnabled={true} onClickHandler={onClickRemoveBoring}/>
                </div>
            </div>
            <div className="flex flex-row gap-1">
                <div>
                    시작번호
                </div>
                <input
                    type='number'
                    defaultValue={1}
                    className="border-b w-[44px]"
                    ref={indexRef}/>
            </div>
        </div>
    )
}

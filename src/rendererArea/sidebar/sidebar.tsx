import React, { useState } from "react";
import './sidebarstyle.css';
import Button from "./iconButton";
import SamplePage from "./pages/samplePage";
import { TestPage } from "./pages/testPage";
import { BoringManager } from "./pages/editor/EditorPage";
import { useLanguageStore } from "../language/languageStore";

export default function Sidebar() {
    const [currentMenuIndex, setCurrentMenuIndex] = useState(1);

    const navigateMenu = (index: number) => {
        setCurrentMenuIndex(index);
    };

    const {
        localeCode,
        displayStrings,
        findValue,
    } = useLanguageStore();

    const menuNavigations: Array<{menuName:string, menuPage: JSX.Element, displayHeader: string, menuClickHandler: (index: number) => void}> = [{
        menuName: "SA", 
        menuPage: (<SamplePage />),
        displayHeader: 'Sample',
        menuClickHandler: navigateMenu
    }, {
        menuName: "Editor", 
        menuPage: (<BoringManager />), 
        displayHeader: findValue('BoringManager', 'pageHeader'),
        menuClickHandler: navigateMenu
    }, {
        menuName: "TEST", 
        menuPage: (<TestPage />), 
        displayHeader: 'Test',
        menuClickHandler: navigateMenu
    },
];
    
    return (
        <div className="w-[334px] h-full flex flex-row" style={{borderWidth: 1, borderColor: 'silver', borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
            <div className="h-full w-12 flex flex-col" style={{backgroundColor: "#ECECEC"}}>
                {menuNavigations.map((item, index) => {
                    const isEnabled = index == currentMenuIndex ? true : false;
                    if(item.menuName != null || item.menuName == '' && item.menuPage != null || item.menuClickHandler != null)
                        return <Button key={index} menuName={item.menuName} isEnabled={isEnabled} navigateHandler={item.menuClickHandler} index={index}/>
                })}
            </div>
            <div className="flex-grow flex flex-col gap-1 pb-8" style={{backgroundColor: 'white', borderTopRightRadius: 8, borderBottomRightRadius: 8, padding: 8}}>
                <div style={{fontWeight: 700, fontSize: 20}}>
                    {menuNavigations[currentMenuIndex].displayHeader}
                </div>
                <hr style={{borderBottomWidth: 0.25, borderColor: 'silver'}}/>
                <div className="mt-1 h-full overflow-y-auto sidebar-area">
                    {/* Menu Page */}
                    {menuNavigations[currentMenuIndex].menuPage}
                </div>
            </div>
        </div>
    )
}
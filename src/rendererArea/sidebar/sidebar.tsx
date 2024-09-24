import React, { useState } from "react";
import './sidebarstyle.css';
import Button from "./iconButton";
import SamplePage from "./pages/samplePage";

export default function Sidebar() {
    const [currentMenuIndex, setCurrentMenuIndex] = useState(0);

    const navigateMenu = (index: number) => {
        setCurrentMenuIndex(index);
    };

    const menuNavigations: Array<{menuName:string, menuPage: JSX.Element, menuClickHandler: (index: number) => void}> = [{
        menuName: "SA", 
        menuPage: (<SamplePage />), 
        menuClickHandler: navigateMenu
    }
];
    
    return (
        <div className="w-[334px] h-full flex flex-row" style={{borderWidth: 1, borderColor: 'silver', borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
            <div className="h-full w-12 flex flex-col" style={{backgroundColor: "#ECECEC"}}>
                {menuNavigations.map((item, index) => {
                    const isEnabled = index == currentMenuIndex ? true : false;
                    return <Button key={index} menuName={item.menuName} isEnabled={isEnabled} navigateHandler={item.menuClickHandler} index={index}/>
                })}
            </div>
            <div className="flex-grow flex flex-col gap-1 pb-8" style={{backgroundColor: 'white', borderTopRightRadius: 8, borderBottomRightRadius: 8, padding: 8}}>
                <div style={{fontWeight: 700, fontSize: 20}}>
                    {menuNavigations[currentMenuIndex].menuName}
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
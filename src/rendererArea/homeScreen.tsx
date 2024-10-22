import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import './homeStyle.css'
import Header from "./components/header/header";
import { appInfo } from "../../appConfig";
import { ThreeViewPort } from "./components/threeViewport/threeViewport";
import { InspectorWrapper } from "./components/inspector/inspectorWrapper";
import { VisibilityOptions } from "./homescreenitems/visibilityOptions";
import { useHomeStore } from "./homeStatus/homeStatusModel";

export default function HomeScreen() {    
    const {
        currentHomeId,
    } = useHomeStore();

    const [homeId, setHomeId] = useState<string>(currentHomeId);

    useEffect(() => {
        setHomeId(homeId);
    },[currentHomeId])

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{position: 'absolute', width:'100%'}}>
                <Header appName={appInfo.ApplicationName} />
            </div>
            <div id="main-sidebar" style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16}}>
                <Sidebar />
            </div>
            <div style={{position:'absolute', justifyContent: 'center'}}>
                <InspectorWrapper />
            </div>
            <div>
                <ThreeViewPort />
            </div>
            <div style={{position: 'absolute', right: 16, bottom: 16}}>
                {/* <VisibilityOptions/> */}
            </div>

            {/* currentHomeId 값을 숨긴 input 필드에 마운트 */}
            <input type="hidden" value={currentHomeId} />
        </div>
    )
}
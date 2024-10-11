import React from "react";
import Sidebar from "./sidebar/sidebar";
import './homeStyle.css'
import Header from "./components/header/header";
import { appInfo } from "../../appConfig";
import { ThreeViewPort } from "./components/threeViewport/threeViewport";
import { Inspector } from "./components/inspector/inspector";
import { InspectorWrapper } from "./components/inspector/inspectorWrapper";
import { useHomeStore } from "./homeStatus/homeStatusModel";

export default function HomeScreen() {
    return (
        <div>
            <div style={{position: 'absolute', width:'100%'}}>
                <Header appName={appInfo.ApplicationName} />
            </div>
            <div id="main-sidebar" style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16}}>
                <Sidebar />
            </div>
            <div style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16, left: 360}}>
                <InspectorWrapper width={360} height={400} />
            </div>
            <div>
                <ThreeViewPort />
            </div>
        </div>
    )
}
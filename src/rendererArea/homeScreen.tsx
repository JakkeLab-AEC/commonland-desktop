import React from "react";
import Sidebar from "./sidebar/sidebar";
import './homeStyle.css'
import Header from "./components/header/header";
import { appInfo } from "../../appConfig";
import { ThreeViewPort } from "./components/threeViewport/threeViewport";
import { InspectorWrapper } from "./components/inspector/inspectorWrapper";

export default function HomeScreen() {
    return (
        <div>
            <div style={{position: 'absolute', width:'100%'}}>
                <Header appName={appInfo.ApplicationName} />
            </div>
            <div id="main-sidebar" style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16}}>
                <Sidebar />
            </div>
            <div style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16, left: 340}}>
                <InspectorWrapper />
            </div>
            <div>
                <ThreeViewPort />
            </div>
        </div>
    )
}
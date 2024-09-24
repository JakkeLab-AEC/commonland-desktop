import React from "react";
import Sidebar from "./sidebar/sidebar";
import './homeStyle.css'
import Header from "./components/header/header";
import { appInfo } from "../../appConfig";

export default function Home() {
    return (
        <div>
            <div style={{position: 'absolute', width:'100%'}}>
                <Header appName={appInfo.ApplicationName} />
            </div>
            <div id="main-sidebar" style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16}}>
                <Sidebar />
            </div>
        </div>
    )
}
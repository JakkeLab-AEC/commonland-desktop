'use client';

import { useState } from "react";
import AccountButton from "./account/accountButton";
import AccountPopup from "./account/accountPopup";
import ServiceLogo from "./logo/servicelogo";
import React from "react";
import ButtonNeutral from "../buttons/buttonNeutral";


export default function Header({appName}:{appName: string}) {
    const [profileState, setProfileState] = useState(false);
    const toggleProfile = () => {
        setProfileState(!profileState)
    };

    const signOut = () => {

    }

    const showPreferences = () => {

    }


    return (
        <div className="w-full flex key-color-main h-[48px] items-center pl-20 pr-4 " style={{borderBottomWidth: 2, borderColor: "silver"}}>
            <div className="main-header flex-grow">
                <ServiceLogo appName={appName} />
            </div>
            <div className="mr-4">
                <ButtonNeutral onClickHandler={showPreferences} text={"환경설정"} width={80} isEnabled={false}/>
            </div>
            <div>
                <AccountButton onClickHandler={toggleProfile}/>
            </div>
            <div style={{position: 'absolute', top: 60, right: 16}}>
                {profileState && <AccountPopup username="Test" teamname="Test" signOutHandler={signOut}/>}
            </div>
        </div>
    )
}
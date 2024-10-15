import { ReactNode } from "react";
import { create } from "zustand";

interface homeStatusProps {
    inspectorVisibility: boolean,
    inspectorSize: {width: number, height: number},
    inspetorContent: ReactNode;
    inspectorTitle: string,
    setInspectorTitle: (title: string) => void,
    setInspectorVisiblity: (visiblity: boolean) => void,
    setInspectorSize: (option: {width: number, height: number}) => void,
    setInspectorContent: (content: ReactNode) => void,
}

export const useHomeStore = create<homeStatusProps>((set, get) => ({
    inspectorVisibility: false,
    inspectorSize: {width: 360, height: 420},
    inspetorContent: null,
    inspectorTitle: "Default Inspector",
    setInspectorVisiblity: (visibility: boolean) => {
        set(() => {
            return {inspectorVisibility: visibility}
        })
    },
    setInspectorSize: (option: {width: number, height: number}) => {
        const {width, height} = option;
        set(() => {
            return {inspectorSize:{width: width, height: height}}
        })
    },
    setInspectorTitle: (title: string) => {
        set(() => {
            return {inspectorTitle : title}
        })
    },
    setInspectorContent: (content: ReactNode) => {
        set(() => {
            return {inspetorContent: content}
        })
    }
}));
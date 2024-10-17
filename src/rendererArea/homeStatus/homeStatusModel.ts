import { ReactNode } from "react";
import { create } from "zustand";

interface homeStatusProps {
    inspectorVisibility: boolean,
    inspectorSize: {width: number, height: number},
    inspetorContent: ReactNode;
    inspectorTitle: string,
    inspectorClosingListeners: Array<() => void>,
    setInspectorTitle: (title: string) => void,
    setInspectorVisiblity: (visiblity: boolean) => void,
    setInspectorSize: (option: {width: number, height: number}) => void,
    setInspectorContent: (content: ReactNode) => void,
    registerInspectorClosingListner: (listener: () => void) => void,
}

export const useHomeStore = create<homeStatusProps>((set, get) => ({
    inspectorVisibility: false,
    inspectorSize: {width: 360, height: 420},
    inspetorContent: null,
    inspectorTitle: "Default Inspector",
    inspectorClosingListeners: [],
    setInspectorVisiblity: (visibility: boolean) => {
        const listeners = get().inspectorClosingListeners;
        if(!visibility) {
            listeners.forEach(listener => listener());
        }

        set(() => {
            return {
                inspectorVisibility: visibility,
                inspectorClosingListeners: [],
            }
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
    },
    registerInspectorClosingListner: (listener: () => void) => {
        const listeners = [...get().inspectorClosingListeners];
        listeners.push(listener);

        set(() => {
            return {
                inspectorClosingListeners: listeners
            }
        })
    }
}));
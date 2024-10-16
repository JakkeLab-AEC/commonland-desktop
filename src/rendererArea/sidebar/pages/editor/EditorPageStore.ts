import { Boring } from "../../../../mainArea/models/serviceModels/boring/boring";
import { create } from "zustand";

interface EditorPageStore {
    borings: Map<string, Boring>;
    boringDisplayItems: Map<string, string>;
    fetchAllBorings:() => Promise<void>;
    createNewBoring: () => void;
    insertBoring: (boring: Boring) => void;
    updateBoring: (id: string, boring: Boring) => void;
    removeBoring: (id: string) => void;
    selectBoring: (id: string) => Boring;
}

export const useEditorPageStore = create<EditorPageStore>((set, get) => ({
    borings: new Map(),
    boringDisplayItems: new Map(),
    fetchAllBorings: async () => {
        const fetchJob = await window.electronBoringDataAPI.fetchAllBorings();
        if(fetchJob.result) {
            const borings:[string, Boring][] = [];
            const boringDisplayItems:[string, string][] = [];
            fetchJob.fetchedBorings.forEach(boring => {
                const targetBoring = Boring.deserialize(boring);
                borings.push([targetBoring.getId().getValue(), targetBoring]);
                boringDisplayItems.push([targetBoring.getId().getValue(), targetBoring.getName()]);
            });

            const newBorings: Map<string, Boring> = new Map(borings);
            const newBoringDisplayItems: Map<string, string> = new Map(boringDisplayItems);
            set(() => { 
                return {
                    borings: newBorings,
                    boringDisplayItems: newBoringDisplayItems
                }
            });
        }
    },
    createNewBoring: () => {
        
    },
    insertBoring: async (boring: Boring) => {
        const boringDto = boring.serialize();
        const insertJob = await window.electronBoringDataAPI.insertBoring(boringDto);
    },
    updateBoring: (id: string, boring: Boring) => {
        
    },
    removeBoring: (id: string) => {

    },
    selectBoring: (id: string) => {
        const status = get();
        return status.borings.get(id);
    }
}));
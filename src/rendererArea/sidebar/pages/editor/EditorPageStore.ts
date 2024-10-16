import { Boring } from "../../../../mainArea/models/serviceModels/boring/boring";
import { create } from "zustand";

interface EditorPageStore {
    borings: Map<string, Boring>;
    fetchBorings:() => void;
    createNewBoring: () => void;
    insertBoring: (boring: Boring) => void;
    updateBoring: (id: string, boring: Boring) => void;
    removeBoring: (id: string) => void;
    selectBoring: (id: string) => Boring;
}

export const useEditorPageStore = create<EditorPageStore>((set, get) => ({
    borings: new Map(),
    fetchBorings: async () => {
        const fetchJob = await window.electronBoringDataAPI.fetchAllBorings();
        if(fetchJob.result) {
            const borings:[string, Boring][] = fetchJob.fetchedBorings.map(boring => {
                const targetBoring = Boring.deserialize(boring);
                return [targetBoring.getId().getValue(), targetBoring]
            });

            const newBorings:Map<string, Boring> = new Map(borings);

            set(() => { return {borings: newBorings}});
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
import { Boring } from "../../../../mainArea/models/serviceModels/boring/boring";
import { create } from "zustand";

interface EditorPageStore {
    borings: Map<string, Boring>;
    boringDisplayItems: Map<string, string>;
    selectedBoringId: string;
    fetchAllBorings:() => Promise<void>;
    createNewBoring: () => void;
    insertBoring: (boring: Boring) => void;
    updateBoring: (boring: Boring) => void;
    removeBoring: (id: string[]) => Promise<boolean>;
    selectBoring: (id: string) => Boring;
    unselectBoring: () => void;
    searchBoringName: (prefix: string, index: number) => Promise<string[]>;
}

export const useEditorPageStore = create<EditorPageStore>((set, get) => ({
    borings: new Map(),
    boringDisplayItems: new Map(),
    selectedBoringId: null,
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
    updateBoring: async (boring: Boring) => {
        const updateJob = await window.electronBoringDataAPI.updateBoring(boring.serialize());
        get().fetchAllBorings();
    },
    removeBoring: async (ids: string[]) => {
        const removeJob = await window.electronBoringDataAPI.removeBoring(ids);
        console.log(removeJob);
        get().fetchAllBorings();
        return removeJob.result;
    },
    selectBoring: (id: string) => {
        const status = get();
        set(() => {
            return {selectedBoringId: id}
        })
        return status.borings.get(id);
    },
    searchBoringName: async (prefix: string, index: number) => {
        const searchJob = await window.electronBoringDataAPI.searchBoringNames(prefix, index);
        if(searchJob.result) {
            return searchJob.searchedNames;
        } else {
            if(searchJob.searchedNames) {
                return searchJob.searchedNames;
            } else {
                return null;
            }
        }
    },
    unselectBoring: () => {
        set(() => {
            return {selectedBoringId: null}
        })
    }
}));
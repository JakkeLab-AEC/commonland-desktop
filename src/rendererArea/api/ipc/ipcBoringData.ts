import { BoringDTO } from "../../../dto/serviceModel/BoringDTO";

export interface IElectronIPCBoringData {
    insertBoring: (boringDto: BoringDTO) => Promise<{result: boolean, message?: string}>;
    fetchAllBorings: () => Promise<{result: boolean, message?: string, fetchedBorings: BoringDTO[]}>;
    updateBoring: (boringDto: BoringDTO) => Promise<{result: boolean, message?: string}>;
    searchBoringNames: (prefix: string, index:number) => Promise<{result: boolean, message?: string, searchedNames: string[]}>;
    removeBoring: (ids: string[]) => Promise<{result: boolean, message?: string}>;
}

declare global {
    interface Window {
        electronBoringDataAPI: IElectronIPCBoringData;
    }
}
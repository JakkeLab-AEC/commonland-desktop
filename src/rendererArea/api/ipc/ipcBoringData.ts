import { BoringDTO } from "../../../dto/serviceModel/BoringDTO";

export interface IElectronIPCBoringData {
    insertBoring: (boringDto: BoringDTO) => Promise<{result: boolean, message?: string}>;
    fetchAllBorings: () => Promise<{result: boolean, message?: string, fetchedBorings: BoringDTO[]}>;
}

declare global {
    interface Window {
        electronBoringDataAPI: IElectronIPCBoringData;
    }
}
import { IpcMain } from "electron";
import { AppController } from "../appController/appController";
import { BoringDTO } from "../../dto/serviceModel/BoringDTO";

export const setIpcBoringRepository = (ipcMain: IpcMain) => {
    ipcMain.handle('boring-repository-insert', async (_, boringDto: BoringDTO) => {
        const insertJob = await AppController.getInstance().getRepository('Boring').insertBoring(boringDto);
        return insertJob;
    })

    ipcMain.handle('boring-repository-fetch-all', async(_) => {
        const fetchJob = await AppController.getInstance().getRepository('Boring').fetchAllBorings();
        return fetchJob;
    });
}
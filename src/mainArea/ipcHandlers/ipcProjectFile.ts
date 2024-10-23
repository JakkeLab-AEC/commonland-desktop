import { app, dialog, FileFilter, IpcMain } from "electron"
import { ProjectRead, ProjectWrite } from "../appController/projectIO";

export const setIpcProjectIOHandler = (ipcMain: IpcMain) => {
    ipcMain.handle('project-file-save', async (_) => {
        try {
            const filters: FileFilter[] = [];
            filters.push({
                name: 'JSON file',
                extensions: ['json'],
            });

            const {filePath} = await dialog.showSaveDialog({
                title: '프로젝트 파일 저장',
                defaultPath: app.getPath('desktop') + '/project.json',
                filters: filters
            });

            // 파일 경로가 선택되지 않은 경우 처리
            if (!filePath) {
                return { result: false, message: 'No file path selected' };
            }

            const projectWriter = new ProjectWrite();
            projectWriter.setFilePath(filePath);
            await projectWriter.createSaveFile();

            return {result: true}
        } catch (error) {
            console.log(error);
            return {result: false, message: error}
        }
    });

    ipcMain.handle('project-file-read', async (_) => {
        try {
            const filters: FileFilter[] = [];
            filters.push({
                name: 'JSON file',
                extensions: ['json'],
            });

            const {filePaths} = await dialog.showOpenDialog({
                title: '프로젝트 파일 불러오기',
                defaultPath: app.getPath('desktop'),
                filters: filters,
                properties: ['openFile']
            });
            
            // 파일 경로가 선택되지 않은 경우 처리
            if (!filePaths || filePaths.length == 0) {
                return { result: false, message: 'No file path selected' };
            }
            
            // 프로젝트 파일 불러오는 기능은 여기에 작성
            const filePath = filePaths[0];
            const projectReader = new ProjectRead();
            projectReader.setFilePath(filePath);
            const loadJob = await projectReader.loadProjectFile();

            if(!loadJob || !loadJob.result) {
                throw new Error('Failed to load project file.');
            }

            return {result: true}
        } catch (error) {
            return {result: false, message: error}
        }
    });
}
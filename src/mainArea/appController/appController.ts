import { Database } from "sqlite";
import { UIController } from "./uicontroller/uicontroller";

export class AppController {
    private static Instance: AppController;
    private db:Database;
    private uiController: UIController;

    private constructor() {
        this.uiController = new UIController();
    }

    public static InitiateAppController(){
        AppController.Instance = new AppController();
    }

    public static getInstance(){
        return AppController.Instance;
    }

    getDatabase() {
        return this.db;
    }
}
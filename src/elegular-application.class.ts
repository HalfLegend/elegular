import BrowserWindow = Electron.BrowserWindow;
import {ElegularAppEventManager} from "./event/app-event/elegular-app-event-manager.class";
import {WindowId, ElegularWindowConfig} from "./angular-window-module-config";
import {ElegularWindow} from "./window/elegular-window.class";
import {ElegularWindowManager} from "./window/elegular-window-manager.class";
import * as electron from "electron";
export class ElegularApplication {
    /**
     * Register ElegularWindowConfig
     * @param angularWindowModuleConfigList
     */
    public static registerAngularWindowModuleConfig(...angularWindowModuleConfigList: ElegularWindowConfig[]):void {
        ElegularWindowManager.registerAngularWindowModuleConfig(...angularWindowModuleConfigList);
    }

    /**
     * To startup the application.
     */
    public static runApplication(): void {
        ElegularAppEventManager.registerDefaultEvents();
        ElegularWindowManager.initialize();
    }

    public static get appEventManager(): ElegularAppEventManager {
        return ElegularAppEventManager;
    }

    public static createWindow(configOrId: ElegularWindowConfig|WindowId): ElegularWindow{
        return ElegularWindowManager.createWindow(configOrId);
    }

    public static exit(exitCode: number): void{
        electron.app.exit(exitCode);
    }

    public static quit(): void{
        electron.app.quit();
    }
}





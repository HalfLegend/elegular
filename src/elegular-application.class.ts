import BrowserWindow = Electron.BrowserWindow;
import {ElegularAppEventManager} from "./event/app-event/elegular-app-event-manager.class";
import {WindowId, ElegularWindowOptions, GlobalElegularOptions} from "./angular-options";
import {ElegularWindow} from "./window/elegular-window.class";
import {ElegularWindowManager} from "./window/elegular-window-manager.class";
import * as electron from "electron";
export class ElegularApplication {
    private static _globalElegularOptions: GlobalElegularOptions;
    public static get globalElegularOptions(): GlobalElegularOptions {
        return ElegularApplication._globalElegularOptions;
    }

    public static configureGlobal(globalElegularOptions: GlobalElegularOptions) {
        ElegularApplication._globalElegularOptions = globalElegularOptions;
    }

    /**
     * Register ElegularWindowOptions
     * @param angularWindowModuleConfigList
     */
    public static registerAngularWindowModuleConfig(...angularWindowModuleConfigList: ElegularWindowOptions[]): void {
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

    public static createWindow(configOrId: ElegularWindowOptions | WindowId): ElegularWindow {
        return ElegularWindowManager.createWindow(configOrId);
    }

    public static exit(exitCode: number): void {
        electron.app.exit(exitCode);
    }

    public static quit(): void {
        electron.app.quit();
    }
}





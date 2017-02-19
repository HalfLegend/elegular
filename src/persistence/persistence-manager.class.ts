import * as fs from "fs-promise";
import {StringTooling} from "../tooling/string-tooling.class";
import {WindowName} from "../angular-options";
import {ObjectTooling} from "../tooling/object-tooling.class";

export class PersistenceManager {
    /**
     * WindowName -> FolderName
     */
    private static _windowIdFileNameMap: Map<WindowName, string>;

    public static initialize(): void {
        if (!PersistenceManager._windowIdFileNameMap) {
            try {
                PersistenceManager._windowIdFileNameMap = ObjectTooling.objectToMap(fs.readJsonSync("./elegular-internal/window-id-map.json"));
            }
            catch(e){
                PersistenceManager._windowIdFileNameMap = new Map<string, string>();
            }
        }
    }

    private static  initializeWindow(windowId: WindowName): string {
        let folderName = PersistenceManager._windowIdFileNameMap.get(windowId);
        if (!folderName) {
            folderName = StringTooling.generateRandomString();
            fs.mkdirSync("./elegular-internal/" + folderName);
            PersistenceManager._windowIdFileNameMap.set(windowId, folderName);
        }
        return folderName;
    }

    public static async readStoredWindowStatusAsync(windowId: WindowName): Promise<WindowStatus> {
        let folderName = PersistenceManager._windowIdFileNameMap.get(windowId);
        let windowStatus :WindowStatus = null;
        if (folderName) {
            try {
                windowStatus = await fs.readJson("./elegular-internal/" + folderName + "/stored-window-status.json");
            }
            catch (e) {
                windowStatus = null;
            }
        }
        return windowStatus;
    }

    public static storeWindowStatus(windowName: WindowName, windowStatus: WindowStatus): void {
        let folderName = PersistenceManager.initializeWindow(windowName);
        try {
            let folderPath = "./elegular-internal/" + folderName;
            if (!fs.existsSync(folderPath)) {
                fs.mkdirsSync(folderPath);
            }
            fs.writeJsonSync(folderPath + "/stored-window-status.json", windowStatus);
        }
        catch(e) {
            console.error(e);
        }
    }

    public static storeWindowIdMap(): void {
        try {
            if (PersistenceManager._windowIdFileNameMap) {
                let folderPath = "./elegular-internal/";
                if(!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                fs.writeJsonSync("./elegular-internal/window-id-map.json", ObjectTooling.mapToObject(PersistenceManager._windowIdFileNameMap));
            }
        }
        catch(e) {
            console.error(e);
        }
    }
}
PersistenceManager.initialize();
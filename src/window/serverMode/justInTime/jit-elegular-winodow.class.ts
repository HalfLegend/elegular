import * as electron from "electron";
import {ElegularWindowBase} from "../../elegular-winodw-base.class";
import {ElegularWindowOptions} from "../../../angular-options";
import {WindowServerManager} from "../window-server-manager.class";
export class JitElegularWindow extends ElegularWindowBase{
    constructor(angularWindowModuleConfig: ElegularWindowOptions) {
        super();
        WindowServerManager.registerServerWindow(angularWindowModuleConfig);
        let BrowserWindowConstructor = electron.BrowserWindow;
        this._browserWindow = new BrowserWindowConstructor(angularWindowModuleConfig.windowOptions);
        this._browserWindow.webContents.openDevTools();
        this._browserWindow.loadURL("http://localhost:8889/abc");
    }
}
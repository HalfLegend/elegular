import * as _ from "lodash";
import * as election from "electron";
import {ElegularWindow} from "./elegular-window.class";
import BrowserWindow = Electron.BrowserWindow;
import {WindowId, ElegularWindowConfig} from "../angular-window-module-config";
import IpcMain = Electron.IpcMain;
import IpcMainEvent = Electron.IpcMainEvent;

export class ElegularWindowManager {
    private static _internalGlobalWindowFunctionMap: Map<string, Function> = new Map<string, Function>();

    public static initialize() {
        let ipcMain: IpcMain = election.ipcMain;
        let callbackSync = (event: IpcMainEvent, windowIndex: number, functionName: string, ...args) => {
            event.returnValue = ElegularWindowManager.callInternalWindowFunction(windowIndex, functionName, ...args);
        };

        ipcMain.on("##elegular-internal-window-function-sync", callbackSync);
        let callbackAsync = (event: IpcMainEvent, windowIndex: number, functionName: string, messageId: number, ...args) => {
            let result = ElegularWindowManager.callInternalWindowFunction(windowIndex, functionName, ...args);

            if (functionName != "close")
            {
                event.sender.send("##elegular-internal-window-function-async-reply", functionName, messageId, result);
            }
        };
        ipcMain.on("##elegular-internal-window-function-async",callbackAsync);

        ElegularWindowManager._internalGlobalWindowFunctionMap.set("createWindow", (configOrId: ElegularWindowConfig|WindowId)=>{
            let elegularWindow = ElegularWindowManager.createWindow(configOrId);
            return elegularWindow.id;
        });
    }

    private static callInternalWindowFunction(windowIndex: number, functionName: string, ...args): any{

        let f: Function = null;
        if (windowIndex != null)
        {
            let win = ElegularWindowManager.getWindowByIndex(windowIndex);
            if (win != null)
            {
                f = win[functionName];
            }
        }
        if (!f)
        {
            f = ElegularWindowManager._internalGlobalWindowFunctionMap.get(functionName);
        }
        return f(...args);
    }

    private static _windowMap: Map<BrowserWindow, ElegularWindow> = new Map<BrowserWindow, ElegularWindow>();

    public static registerWindow(electronWindow: ElegularWindow) {
        this._windowMap.set(electronWindow.browserWindow, electronWindow);
    }

    private static _angularWindowModuleConfigMap: Map<WindowId, ElegularWindowConfig> = new Map<WindowId, ElegularWindowConfig>();

    public static registerAngularWindowModuleConfig(...angularWindowModuleConfigList: ElegularWindowConfig[]): void {
        for (let angularWindowModuleConfig of angularWindowModuleConfigList) {
            ElegularWindowManager._angularWindowModuleConfigMap.set(angularWindowModuleConfig.windowId, angularWindowModuleConfig);
        }
    }

    public static getWindowByIndex(windowId: number): ElegularWindow {
        return this.getWindowByBrowserWindow(election.BrowserWindow.fromId(windowId));
    }

    public static getWindowByBrowserWindow(browserWindow: BrowserWindow): ElegularWindow {
        return this._windowMap.get(browserWindow);
    }

    public static createMainWindow(): Array<ElegularWindow> {
        let result: Array<ElegularWindow> = [];
        for (let config of ElegularWindowManager._angularWindowModuleConfigMap.values()) {
            if (config.isMainWindow) {
                result.push(ElegularWindowManager.createWindow(config));
            }
        }
        return result;
    }

    // TODO: implementation for MacOX
    public static reCreateWindow() {
        //ElegularWindowManager.createMainWindow();
    }

    public static createWindow(configOrId: ElegularWindowConfig|WindowId): ElegularWindow {
        let angularWindowModuleConfig: ElegularWindowConfig;

        if (_.isObject(configOrId)) {
            angularWindowModuleConfig = <ElegularWindowConfig>configOrId;
        }
        else {
            angularWindowModuleConfig = ElegularWindowManager._angularWindowModuleConfigMap.get(<WindowId>configOrId);
        }
        return new ElegularWindow(angularWindowModuleConfig);
    }
}
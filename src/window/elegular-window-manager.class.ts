import * as _ from "lodash";
import * as election from "electron";
import {FileElegularWindow} from "./fileMode/file-elegular-window.class";
import BrowserWindow = Electron.BrowserWindow;
import {
    WindowName, ElegularWindowOptions, WindowServeOptions,
    LoadMode
} from "../angular-options";
import IpcMain = Electron.IpcMain;
import IpcMainEvent = Electron.IpcMainEvent;
import {ElegularApplication} from "../elegular-application.class";
import {JitElegularWindow} from "./serverMode/justInTime/jit-elegular-winodow.class";

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
            if (functionName != "close") {
                event.sender.send("##elegular-internal-window-function-async-reply", functionName, messageId, result);
            }
        };
        ipcMain.on("##elegular-internal-window-function-async", callbackAsync);

        ElegularWindowManager._internalGlobalWindowFunctionMap.set("createWindow", (configOrId: ElegularWindowOptions
                                                                                        | WindowName) => {
            let elegularWindow = ElegularWindowManager.createWindow(configOrId);
            return elegularWindow.id;
        });
    }

    private static callInternalWindowFunction(windowIndex: number, functionName: string, ...args): any {
        let f: Function = null;
        if (windowIndex != null) {
            let win = ElegularWindowManager.getWindowById(windowIndex);
            if (win != null) {
                f = win[functionName];
                f = f.bind(win);
            }
        }
        if (!f) {
            f = ElegularWindowManager._internalGlobalWindowFunctionMap.get(functionName);
        }
        return f(...args);
    }

    private static _windowMap: Map<BrowserWindow, FileElegularWindow> = new Map<BrowserWindow, FileElegularWindow>();

    public static registerWindow(electronWindow: FileElegularWindow) {
        this._windowMap.set(electronWindow.browserWindow, electronWindow);
    }

    private static _angularWindowModuleConfigMap: Map<WindowName, ElegularWindowOptions> = new Map<WindowName, ElegularWindowOptions>();

    public static registerAngularWindowModuleConfig(...angularWindowModuleConfigList: ElegularWindowOptions[]): void {
        for (let angularWindowModuleConfig of angularWindowModuleConfigList) {
            ElegularWindowManager._angularWindowModuleConfigMap.set(angularWindowModuleConfig.windowName, angularWindowModuleConfig);
        }
    }

    public static getWindowById(windowId: number): FileElegularWindow {
        return this.getWindowByBrowserWindow(election.BrowserWindow.fromId(windowId));
    }

    public static getWindowByBrowserWindow(browserWindow: BrowserWindow): FileElegularWindow {
        return this._windowMap.get(browserWindow);
    }

    public static createMainWindow(): Array<FileElegularWindow> {
        let result: Array<FileElegularWindow> = [];
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

    public static createWindow(configOrId: ElegularWindowOptions | WindowName): FileElegularWindow {
        let elegularWindowOptions: ElegularWindowOptions;

        if (_.isObject(configOrId)) {
            elegularWindowOptions = <ElegularWindowOptions>configOrId;
        }
        else {
            elegularWindowOptions = ElegularWindowManager._angularWindowModuleConfigMap.get(<WindowName>configOrId);
        }

        elegularWindowOptions = ElegularWindowManager.mergeElegularWindowOptionsWithGlobal(elegularWindowOptions);
        let elegularWindowConstructor = ElegularWindowManager.selectWindow(elegularWindowOptions.windowServeOptions);
        return new elegularWindowConstructor(elegularWindowOptions);
    }

    private static mergeElegularWindowOptionsWithGlobal(elegularWindowOptions: ElegularWindowOptions): ElegularWindowOptions {
        elegularWindowOptions = _.cloneDeep(elegularWindowOptions);

        let globalElegularWindowOptions = ElegularApplication.globalElegularOptions;
        _.merge(elegularWindowOptions, globalElegularWindowOptions);

        return elegularWindowOptions;
    }

    private static selectWindow(windowServeOptions: WindowServeOptions): IElegularWindowConstructor {
        let result: IElegularWindowConstructor;
        if (!windowServeOptions) {
            windowServeOptions = {};
        }
        if (!windowServeOptions.loadMode) {
            if (!windowServeOptions.serverMode) {
                windowServeOptions.loadMode = LoadMode.File;
            }
            else {
                windowServeOptions.loadMode = LoadMode.Server;
            }
        }

        if (windowServeOptions.loadMode == LoadMode.Server) {
            result = JitElegularWindow;
        }
        else {
            result = FileElegularWindow;
        }
        return result;
    }
}

interface IElegularWindowConstructor {
    new(elegularWindowOptions: ElegularWindowOptions);
}
import BrowserWindowOptions = Electron.BrowserWindowOptions;
export type WindowId = string | number | symbol;
export interface ElegularWindowConfig {
    windowId: WindowId;
    angularModulePath: string;
    isMainWindow?: boolean;
    isOpenDevTool?: boolean;
    isUseSystemJS?:boolean;
    windowOptions?: BrowserWindowOptions;
}
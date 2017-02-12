import BrowserWindowOptions = Electron.BrowserWindowOptions;
import Config = SystemJSLoader.Config;
export type WindowId = string | number | symbol;
export interface ElegularWindowConfig {
    windowId: WindowId;
    angularModulePath: string;
    isMainWindow?: boolean;
    isOpenDevTool?: boolean;
    isUseSystemJS?:boolean;
    systemJsConfig?:Config
    windowOptions?: BrowserWindowOptions;
}
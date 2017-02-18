import BrowserWindowOptions = Electron.BrowserWindowOptions;
import Config = SystemJSLoader.Config;
export type WindowId = string | number | symbol;
// These options are loaded at backend.
export interface ElegularWindowOptions extends GlobalElegularOptions{
    windowId: WindowId;
    angularModulePath?: string;
    isMainWindow?: boolean;
    isOpenDevTool?: boolean;
    isStoreWindowStatus?:boolean;
    windowOptions?: BrowserWindowOptions;
}

export interface GlobalElegularWindowOptions {
    systemJsConfig?:SystemJsConfig,
    isProductionMode?:boolean
}

export interface GlobalElegularOptions extends GlobalElegularWindowOptions {
}

interface SystemJsConfig extends Config{
    // true by default
    isUseSystemJS?:boolean;
}
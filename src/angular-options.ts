import BrowserWindowOptions = Electron.BrowserWindowConstructorOptions;
import Config = SystemJSLoader.Config;
export type WindowName = string | number | symbol;
// These options are loaded at backend.
export interface ElegularWindowOptions extends GlobalElegularOptions{
    windowName: WindowName;
    angularModulePath?: string;
    isMainWindow?: boolean;
    isOpenDevTool?: boolean;
    isStoreWindowStatus?:boolean;
    windowOptions?: BrowserWindowOptions;
}

export interface GlobalElegularWindowOptions {
    systemJsConfig?:SystemJsConfig,
    isProductionMode?:boolean,
    windowServeOptions?: WindowServeOptions
}

export interface WindowServeOptions{
    loadMode?: LoadMode,
    serverMode?: ServerMode
}

export enum LoadMode{
    File, Server
}

export enum ServerMode{
    JIT,AOT
}

export interface GlobalElegularOptions extends GlobalElegularWindowOptions {
}

interface SystemJsConfig extends Config{
    // true by default
    isUseSystemJS?:boolean;
}
import BrowserWindowOptions = Electron.BrowserWindowOptions;
import * as electron from "electron";
import BrowserWindow = Electron.BrowserWindow;
import * as fs from "fs-promise";
import * as path from "path";
import {AngularLoadContext} from "../angular-load-context.class";
import {ElegularWindowOptions} from "../../angular-options";
import {ElegularWindowManager} from "../elegular-window-manager.class";
import Size = Electron.Size;
import Rectangle = Electron.Rectangle;
import NativeImage = Electron.NativeImage;
import LoadURLOptions = Electron.LoadURLOptions;
import Menu = Electron.Menu;
import ThumbarButton = Electron.ThumbarButton;
import {ElegularWindowEventManager} from "../../event/window-event/elegular-window/elegular-window-event-manager.class";
import {PersistenceManager} from "../../persistence/persistence-manager.class";
import {StringTooling} from "../../tooling/string-tooling.class";
import {ElegularWindowBase} from "../elegular-winodw-base.class";

export class FileElegularWindow extends ElegularWindowBase{
    constructor(angularWindowModuleConfig: ElegularWindowOptions) {
        super();
        (async () => {
            let windowName = angularWindowModuleConfig.windowName;
            let windowOptions = angularWindowModuleConfig.windowOptions;
            // 重设Window位置
            if (angularWindowModuleConfig.isStoreWindowStatus) {
                let windowStatus = await PersistenceManager.readStoredWindowStatusAsync(windowName);
                if (windowStatus) {
                    for (let propName in windowStatus) {
                        if (windowStatus.hasOwnProperty(propName)) {
                            let newPropName = StringTooling.stripStartingIsPropertyName(propName);
                            windowOptions[newPropName] = windowStatus[propName];
                        }
                    }
                }
            }

            let BrowserWindowConstructor = electron.BrowserWindow;
            this._browserWindow = new BrowserWindowConstructor(angularWindowModuleConfig.windowOptions);

            this.events.close.registerFirst(async () => {
                if (angularWindowModuleConfig.isStoreWindowStatus) {
                    let bounds = this.getBounds();
                    let windowStatus:WindowStatus = {
                        x: bounds.x,
                        y: bounds.y,
                        width: bounds.width,
                        height:bounds.height,
                        isFullScreen: this.isFullScreen(),
                        isMinimized: this.isMinimized(),
                        isMaximized:this.isMaximized()
                    };
                    await PersistenceManager.storeWindowStatus(windowName, windowStatus);
                }
            });

            // dirPath为本文件所在路径，不是工程目录
            let dirPath = FileElegularWindow.analyzeDirPath();
            this.browserWindow.loadURL(`file://${dirPath}/elegular-window.html`);

            this.browserWindow.webContents.on("did-finish-load", async () => {
                let nodeModulePaths = [];
                nodeModulePaths.push(FileElegularWindow.findInNodeModulesRelative(dirPath, "zone.js", "dist", "zone.js"));
                nodeModulePaths.push(FileElegularWindow.findInNodeModulesRelative(dirPath, "reflect-metadata", "Reflect.js"));
                let systemJsPath = FileElegularWindow.findInNodeModulesRelative(dirPath, "systemjs", "dist", "system.js");
                if (systemJsPath != null) {
                    nodeModulePaths.push(systemJsPath);
                }

                let angularModulePath = angularWindowModuleConfig.angularModulePath;
                if (!fs.existsSync(angularModulePath)) {
                    angularModulePath = path.join(process.cwd(), angularModulePath);
                }
                let relativePath = angularModulePath; //path.relative(dirPath, angularModulePath);
                relativePath = relativePath.replace(/\\/g, "/");

                let angularLoadContext: AngularLoadContext = new AngularLoadContext();
                angularLoadContext.nodeModulePaths = nodeModulePaths;
                angularLoadContext.angularModulePath = relativePath;
                angularLoadContext.elegularWindowOptions = angularWindowModuleConfig;
                angularLoadContext.windowId = this.id;
                this.browserWindow.webContents.send("angular-load", angularLoadContext);
            });

            if (angularWindowModuleConfig.isOpenDevTool) {
                this.browserWindow.webContents.openDevTools();
            }
            ElegularWindowManager.registerWindow(this);
        })();
    }

    /**
     * Analyze the dirPath to support cnpm.
     * This file may be under a folder like node_modules/.0.0.15@elegular/
     * It will be analyzed to node_modules/elegular/
     * @returns {string}
     */
    private static analyzeDirPath(): string {
        let dirPath = __dirname;
        let nodeModules = "node_modules";
        let index = dirPath.lastIndexOf(nodeModules);
        if (index != -1) {
            index = index + nodeModules.length + 1;
            let dirRelativePath = dirPath.substring(index);
            let prefixPath = dirPath.substring(0, index);
            let matcher = /^(\.\d+){3}@(?=elegular|electron-angular)/.exec(dirRelativePath);
            if (matcher) {
                let version = matcher[0];
                dirRelativePath = dirRelativePath.substring(version.length);
                dirPath = path.join(prefixPath, dirRelativePath);
            }
        }
        return dirPath;
    }

    public get events(): ElegularWindowEventManager {
        return new ElegularWindowEventManager(this);
    }

    /**
     *
     * @param dirPath The folder to start the searching. will return path relative to this path
     * @param pathNodes
     * @returns {undefined|string|any}
     */
    static findInNodeModulesRelative(dirPath, ...pathNodes) {
        let f = (innerPath) => {
            if (!innerPath) {
                return undefined;
            }
            let nodeModuleFolderName = "node_modules";
            let folderPath = path.join(innerPath, nodeModuleFolderName, ...pathNodes);
            if (fs.existsSync(folderPath)) {
                return path.relative(dirPath, folderPath);
            }
            else {
                return f(path.dirname(innerPath));
            }
        };
        return f(dirPath);
    }
}
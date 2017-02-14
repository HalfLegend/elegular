///<reference path="../../node_modules/reflect-metadata/typings.d.ts"/>

// import * as electron from "electron";
import * as _ from "lodash";
import IpcRendererEvent = Electron.IpcRendererEvent;
import {AngularLoadContext} from "./angular-load-context.class";
import Config = SystemJSLoader.Config;
import {ElegularWindowOptions} from "../angular-options";

/**
 * Loaded in a window. Will be run in a client.
 */
class ElegularWindowRenderer {
    _ipcRenderer: Electron.IpcRenderer;
    private _angularLoadContext: AngularLoadContext;

    constructor() {
        this._ipcRenderer = electron.ipcRenderer;

        // After the window is displayed
        this._ipcRenderer.once("angular-load", (event: IpcRendererEvent, angularLoadContext: AngularLoadContext) => {
            this._angularLoadContext = angularLoadContext;
            ElegularWindowRenderer.createAllScriptSync(...this._angularLoadContext.nodeModulePaths).then(async () => {
                let baseNode = window.document.createElement("base");
                baseNode.href = this._angularLoadContext.angularModulePath;
                window.document.head.appendChild(baseNode);

                let elegularWindowOptions : ElegularWindowOptions = angularLoadContext.elegularWindowOptions;
                this.initializeSystemJS(elegularWindowOptions.systemJsConfig);

                let moduleClass;
                let moduleDecorator;

                if (angularLoadContext.angularModulePath){
                    let moduleContainer = await this.loadFileAsync(angularLoadContext.angularModulePath);
                    for (let propName in moduleContainer) {
                        //noinspection JSUnfilteredForInLoop
                        let prop = moduleContainer[propName];

                        if (_.isFunction(prop)) {
                            let list: any[] = Reflect.getMetadata("annotations", prop);
                            if (moduleDecorator = _.find(list, value => {
                                    return value.constructor.name === "DecoratorFactory"
                                        && value.hasOwnProperty("bootstrap");
                                })) {
                                ElegularWindowRenderer._analyzeBootstrap(...moduleDecorator.bootstrap);
                                moduleClass = prop;
                                break;
                            }
                        }
                    }
                }

                if (moduleClass) {
                    let elegularModuleClass = (await this.loadFileAsync("../service/elegular.module.js")).ElegularModule;
                    if (moduleDecorator.imports == null) {
                        moduleDecorator.imports = [];
                    }
                    moduleDecorator.imports.push(elegularModuleClass);
                    if (moduleDecorator.providers == null) {
                        moduleDecorator.providers = [];
                    }
                    let elegularWindowRefConstructor = (await this.loadFileAsync("./../service/elegular-window-ref.service.js")).ElegularWindowRef;
                    moduleDecorator.providers.push({
                        provide: elegularWindowRefConstructor,
                        useValue: new elegularWindowRefConstructor(angularLoadContext.windowId)
                    });
                    if (elegularWindowOptions.isProductionMode){
                        let enableProdMode = (await this.loadFileAsync("@angular/core")).enableProdMode;
                        enableProdMode();
                    }
                    let angularPlatform = await this.loadFileAsync("@angular/platform-browser-dynamic");
                    angularPlatform.platformBrowserDynamic().bootstrapModule(moduleClass);
                }
                else {
                    console.error("Angular module not found(bootstrap property of NgModule must set)");
                }
            });
        })
    }

    private async loadFileAsync(moduleName: string): Promise<any> {
        if (this.isUseSystemJS()) {
            return SystemJS.import(moduleName);
        }
        else {
            return new Promise(resolve => {
                resolve(require(moduleName));
            });
        }
    }

    private isUseSystemJS(): boolean {
        let systemJsConfig = this._angularLoadContext.elegularWindowOptions.systemJsConfig;
        if (!systemJsConfig || systemJsConfig.isUseSystemJS !== false) {
            if (window.SystemJS) {
                return true;
            }
        }
        return false;
    }

    private initializeSystemJS(modularSystemJsConfig: Config) {
        if (this.isUseSystemJS()) {
            console.log("Using SystemJS.");
            SystemJS.config(this.combineSystemJsConfig(modularSystemJsConfig));
        }
        else {
            console.log("Using CommonJS.");
        }
    }

    static createAllScriptSync(...pathList: string[]): Promise<any> {
        let promiseList: Promise<void>[] = [];
        for (let path of pathList) {
            promiseList.push(ElegularWindowRenderer.createScript(path));
        }
        return Promise.all(promiseList);
    }

    static createScript(path: string): Promise<void> {
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", path);
        let promise: Promise<void> = new Promise<void>((resolve) => {
            script.onload = () => {
                resolve();
            };
        });
        let heads = document.getElementsByTagName("head");
        if (heads.length)
            heads[0].appendChild(script);
        else
            document.documentElement.appendChild(script);

        return promise;
    }

    private static _analyzeBootstrap(...bootstrapList): void {
        for (let b of bootstrapList) {
            if (_.isFunction(b)) {
                let annotations = Reflect.getMetadata("annotations", b);
                for (let annotation of annotations) {
                    if (annotation.constructor.name === "DecoratorFactory") {
                        annotation.selector = "elegular-window";
                    }
                }
            }
        }
    }

    private combineSystemJsConfig(modularSystemJsConfig: Config): Config {
        let config = this._defaultSystemJsConfig;
        if (modularSystemJsConfig && modularSystemJsConfig.map) {
            let modularMap = modularSystemJsConfig.map;
            for (let key in modularMap) {
                if (modularMap.hasOwnProperty(key)) {
                    config.map[key] = modularMap[key];
                }
            }
        }
        return config;
    }

    private _defaultSystemJsConfig: Config = {
        baseURL: '../../../',
        defaultJSExtensions: true,
        paths: {
            // paths serve as alias
            'npm:': '../../../'
        },
        // map tells the System loader where to look for things
        map: {
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            'elegular/client': 'npm:elegular/client.js',
            'electron': 'npm:elegular/src/client/electron-static.class.js',
            // other libraries
            'rxjs': 'npm:rxjs',
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            rxjs: {
                defaultExtension: 'js'
            }
        }
    };
}
// Call the constructor to activate the renderer.
new ElegularWindowRenderer();
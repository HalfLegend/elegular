# Elegular
>  **electron-angular** &nbsp; &nbsp;The easiest way to use Angular in Electron. 

The main purpose is to create a native angular app using electron with only a few steps.  
The window itself is created by Electron, while the content of the window can be written in Angular.  
The framework is written in Typescript, and can be compiled into es6.  

Angular means Angular2, not AngularJS. Source: https://github.com/angular/angular

Sample path:  https://github.com/HalfLegend/electron-angular-sample

### Quick Start

```
npm install --save elegular
```


Each window should be an angular module. And the framework need to load these modules.  

There are **only two steps** you need to do, before the window is shown.  

1. Configuring the path for the modules  
    Example:
    Create a file under folder *'app'*, named *'window-config.ts'*:  
    
    ``` typescript
    import {ElegularWindowConfig} from "elegular";
    let windowConfig: ElegularWindowConfig[] = [{
        windowId: "main",
        angularModulePath: __dirname + "/main-window/main-window.module.js",
        isMainWindow: true,
        isOpenDevTool: true,
        windowOptions: {
            width: 800,
            height: 800,
            frame: true,
            alwaysOnTop: false
        }
    }];
    export {windowConfig};
    ```
    `angularModulePath` is the file path for the angular module.  
    `isMainWindow` indicates the window will be shown immediately after the application runs.  
    The configuration is a list, so you may put **more than windows** here.  
    You don't need to put all the windows here. Just put those you need at initial.  
2. Registering the windows  
    In *main.ts*:
    
    ``` typescript
    import {ElegularApplication} from "elegular";
    import {windowConfig} from "./app/window-config";
    ElegularApplication.registerAngularWindowModuleConfig(...windowConfig);
    ElegularApplication.runApplication();
    ```
    
The application is started after you execute `ElegularApplication.runApplication()`, then the main windows will show.
The content of the window is written in Angular. You may find the reference for Angular at https://angular.io/

Following is a simple example:  
*app/main-window/main-window.module.ts*  
``` typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MainWindow} from "./main.window";
@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ MainWindow ],
    bootstrap:    [ MainWindow ]
})
export class MainWindowModule { }
```
*app/main-window/main.window.ts*:
``` typescript
import {Component} from '@angular/core';
import {ElegularWindowRef} from 'elegular/client';
@Component({
    template: `<div>
            Hello Elegular!
         </div>`
})
export class MainWindow {
    constructor(private _elegularWindowRef: ElegularWindowRef) {

    }
}
```
The `selector` property indication the component for the app is unnecessary here. 
The framework will add the default selector automatically.  




## 中文文档
Elegular是把Electron和Angular结合到一起的框架。其窗口是用Electron建立，窗口的内容完全使用Angular框架。  
其主要目的是快速地使用Angular开发本地应用，并且只需要几步就可以建立Angular窗口。  

此工程使用Typescript编写，并且可以编译为es6版本的javascript.  

样例： https://github.com/HalfLegend/electron-angular-sample

### 快速上手

```
npm install --save elegular
```
每一个窗口都是一个单独的Angular模块，框架要加载这个模块，就要配置模块的路径及窗口的参数。  
要建立窗口，有**两个步骤**：  

1. 配置Angular模块的路径及窗口的参数
    举例:
    在'app'目录下新建一个文件，名为'window-config.ts':  
    
    ``` typescript
    import {ElegularWindowConfig} from "elegular";
    let windowConfig: ElegularWindowConfig[] = [{
        windowId: "main",
        angularModulePath: __dirname + "/main-window/main-window.module.js",
        isMainWindow: true,
        isOpenDevTool: true,
        windowOptions: {
            width: 800,
            height: 800,
            frame: true,
            alwaysOnTop: false
        }
    }];
    export {windowConfig};
    ```
    `angularModulePath` 属性是Angular模块的路径。  
    `isMainWindow` 标识了此窗口是否在程序运行时自动创建。  
    这是一个列表，你可以同时配置**多个窗口**。  
    不一定要把所有窗口都提前注册好，把一开始要用到的窗口注册了就可以。  
2. 注册这个窗口配置  
    *main.ts* 文件:
    
    ``` typescript
    import {ElegularApplication} from "elegular";
    import {windowConfig} from "./app/window-config";
    ElegularApplication.registerAngularWindowModuleConfig(...windowConfig);
    ElegularApplication.runApplication();
    ```

当你执行了 `ElegularApplication.runApplication()` 程序就正式启动了，主窗口就会创建。  

所有这些窗口的内容都是用Angular编写的，你可以在https://angular.cn/ 找到教程  

下面是一个最简单的例子：  
*app/main-window/main-window.module.ts*  
``` typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MainWindow} from "./main.window";
@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ MainWindow ],
    bootstrap:    [ MainWindow ]
})
export class MainWindowModule { }
```
*app/main-window/main.window.ts:*  
``` typescript
import {Component} from '@angular/core';
import {ElegularWindowRef} from 'elegular/client';
@Component({
    template: `<div>
            Hello Elegular!
         </div>`
})
export class MainWindow {
    constructor(private _elegularWindowRef: ElegularWindowRef) {

    }
}
```
在这里`selector`属性并不是必须的。框架会自动添加默认的selector属性。
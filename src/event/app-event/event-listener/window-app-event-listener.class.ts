import * as electron from "electron";
import {ElegularAppEventListener} from "./app-event-listener.class";
import {ElegularWindowManager} from "../../../window/elegular-window-manager.class";

export class BrowserWindowElectronEventListener<F extends Function> extends ElegularAppEventListener<F>{
    protected callback(...args) {
        for (let index in args){
            if (args[index] instanceof electron.BrowserWindow){
                args[index] = ElegularWindowManager.getWindowByBrowserWindow(args[index]);
            }
        }
        super.callback(...args);
    }
}
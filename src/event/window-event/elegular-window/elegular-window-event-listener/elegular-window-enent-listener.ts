import {ElegularEventListener} from "../../../elegular-event-listener.class";
import {ElegularWindowEvent} from "../elegular-window-event.enum";
import BrowserWindow = Electron.BrowserWindow;
import {StringTooling} from "../../../../tooling/string-tooling.class";
import {ElegularWindow} from "../../../../window/elegular-window.class";

export interface IElegularWindowEventListenerConstructor<F extends Function> {
    new (event: ElegularWindowEvent, elegularWindow: ElegularWindow): ElegularWindowEventListener<F>;
}

export class ElegularWindowEventListener<F extends Function> extends ElegularEventListener<F> {
    constructor(event: ElegularWindowEvent, private _elegularWindow: ElegularWindow){
        super(event);
    }

    protected registerListener() {
        if (!this._functionList) {
            this._functionList = [];
             this._elegularWindow.browserWindow.on(StringTooling.camelToDash(ElegularWindowEvent[this._event]), (...args)=>{
                this.callback(...args);
            });
        }
    }

    protected removeListener() {
        if (!this._functionList) {
            this._functionList = null;
            this._elegularWindow.browserWindow.on(StringTooling.camelToDash(ElegularWindowEvent[this._event]), null);
        }
    }
}

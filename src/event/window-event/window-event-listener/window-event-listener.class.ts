import {ElegularEventListener} from "../../elegular-event-listener.class";
import {ElegularWindowEvents} from "../elegular-window-events.enum";
import BrowserWindow = Electron.BrowserWindow;
import {StringUtils} from "../../../utils/string-utils.class";
import WebContents = Electron.WebContents;

export interface IElegularWindowAppEventListener<F extends Function> {
    new (event: ElegularWindowEvents, webContents: WebContents): ElegularWindowAppEventListener<F>;
}

export class ElegularWindowAppEventListener<F extends Function> extends ElegularEventListener<F> {
    constructor(event: ElegularWindowEvents, private _webContents: WebContents){
        super(event);
    }

    protected registerListener() {
        if (!this._functionList) {
            this._functionList = [];
            this._webContents.on(StringUtils.camelToDash(ElegularWindowEvents[this._event]), (...args)=>{
                this.callback(...args);
            });
        }
    }

    protected removeListener() {
        if (!this._functionList) {
            this._functionList = null;
            this._webContents.on(StringUtils.camelToDash(ElegularWindowEvents[this._event]), null);
        }
    }
}

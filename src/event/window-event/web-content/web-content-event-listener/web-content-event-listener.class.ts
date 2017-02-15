import {ElegularEventListener} from "../../../elegular-event-listener.class";
import {WebContentEvent} from "../web-content-event.enum";
import BrowserWindow = Electron.BrowserWindow;
import {StringUtils} from "../../../../utils/string-utils.class";
import WebContents = Electron.WebContents;

export interface IWebContentEventListenerConstructor<F extends Function> {
    new (event: WebContentEvent, webContents: WebContents): WebContentEventListener<F>;
}

export class WebContentEventListener<F extends Function> extends ElegularEventListener<F> {
    constructor(event: WebContentEvent, private _webContents: WebContents){
        super(event);
    }

    protected registerListener() {
        if (!this._functionList) {
            this._functionList = [];
            this._webContents.on(StringUtils.camelToDash(WebContentEvent[this._event]), (...args)=>{
                this.callback(...args);
            });
        }
    }

    protected removeListener() {
        if (!this._functionList) {
            this._functionList = null;
            this._webContents.on(StringUtils.camelToDash(WebContentEvent[this._event]), null);
        }
    }
}

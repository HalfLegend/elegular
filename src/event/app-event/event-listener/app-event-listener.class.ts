import {ElegularEventListener} from "../../elegular-event-listener.class";
import {ElegularAppEvent} from "../elegular-app-event.enum";
import {StringUtils} from "../../../utils/string-utils.class";
import * as electron from "electron";

export interface IElegularAppEventListenerConstructor<F extends Function> {
    new (event: ElegularAppEvent): ElegularAppEventListener<F>;
}

export class ElegularAppEventListener<F extends Function> extends ElegularEventListener<F> {
    constructor(event: ElegularAppEvent){
        super(event);
    }

    protected registerListener() {
        if (!this._functionList) {
            this._functionList = [];
            electron.app.on(StringUtils.camelToDash(ElegularAppEvent[this._event]), (...args)=>{
                this.callback(...args);
            });
        }
    }

    protected removeListener() {
        if (!this._functionList) {
            this._functionList = null;
            electron.app.on(StringUtils.camelToDash(ElegularAppEvent[this._event]), null);
        }
    }
}

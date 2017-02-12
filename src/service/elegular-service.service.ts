import {Injectable} from "@angular/core";
import {ElegularWindowConfig, WindowId} from "../angular-window-module-config";
import {ElegularWindowRef} from "./elegular-window-ref.service";
import {WindowMessageDispatcherBase} from "./window-message-dispatcher-base.class";

@Injectable()
export class ElegularService extends WindowMessageDispatcherBase{
    constructor(){
        super(null);
    }

    public createWindow(configOrId: ElegularWindowConfig|WindowId): ElegularWindowRef {
        let id = this._internalFunctionSync("createWindow", configOrId);
        return new ElegularWindowRef(id);
    }

    public async createWindowAsync(configOrId: ElegularWindowConfig|WindowId): Promise<ElegularWindowRef>{
        let id: number= await this._internalFunctionAsync("createWindow", configOrId);
        return new ElegularWindowRef(id);
    }

    public createModal(){

    }
}
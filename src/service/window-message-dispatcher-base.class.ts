
import IpcRendererEvent = Electron.IpcRendererEvent;

declare type PromiseResolveFunctionType = (value?: any | PromiseLike<any>) => void;
export abstract class WindowMessageDispatcherBase {
    protected _ipcRenderer: Electron.IpcRenderer;
    private _asyncFunctionMessageMap : Map<string, Map<number, PromiseResolveFunctionType>> =
        new Map<string, Map<number, PromiseResolveFunctionType>>();
    constructor(protected _windowId: number){
        this._ipcRenderer = electron.ipcRenderer;
        this._ipcRenderer.on("##elegular-internal-window-function-async-reply", (event: IpcRendererEvent, [functionName, messageId, result])=>{
            let messageMap = this._asyncFunctionMessageMap.get(functionName);
            if (messageMap){
                let resolve: PromiseResolveFunctionType  = messageMap.get(messageId);
                if (resolve){
                    resolve(result);
                    messageMap.delete(messageId);
                }
                if (messageMap.size == 0)
                {
                    this._asyncFunctionMessageMap.delete(functionName);
                }
            }
        });
    }
    private _maxAsyncMessageId: number = 0;
    protected createCallbackPromise(functionName: string, messageId: number): Promise<any>{
        return new Promise<any>(resolve => {
            let messageMap = this._asyncFunctionMessageMap.get(functionName);
            if (!messageMap) {
                messageMap = new Map<number, PromiseResolveFunctionType>();
                this._asyncFunctionMessageMap.set(functionName, messageMap);
            }
            messageMap.set(messageId, resolve);
        });
    }

    protected _internalFunctionAsync(functionName: string, ...args: Array<any>): Promise<any> {
        let messageId = ++this._maxAsyncMessageId;
        this._ipcRenderer.send("##elegular-internal-window-function-async", this._windowId, functionName, messageId, ...args);
        return this.createCallbackPromise(functionName, messageId);
    }

    protected _internalFunctionSync(functionName: string,...args: Array<any>): any {
        return this._ipcRenderer.sendSync("##elegular-internal-window-function-sync", this._windowId, functionName, ...args);
    }
}
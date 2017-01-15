import * as _ from "lodash";

export abstract class ElegularEventListener<F extends Function>{
    protected _functionList: Array<F>;

    constructor(protected _event: number) {
    }

    protected callback(...args) {
        if (this._functionList) {
            for (let f of this._functionList) {
                f(...args);
            }
        }
    }
    public isRegistered(): boolean{
        return this._functionList != null;
    }

    public registerFirst(f: F): void {
        if (_.isFunction(f)) {
            this.registerListener();
            this._functionList.unshift(f);
        }
    }

    public registerLast(f: F): void {
        if (_.isFunction(f)) {
            this.registerListener();
            this._functionList.push(f);
        }
    }

    public clear(): void {
        if (this._functionList) {
            this._functionList = null;
            this.removeListener();
        }
    }

    protected abstract registerListener();

    protected abstract removeListener();
}
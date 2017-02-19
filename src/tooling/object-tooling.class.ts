export class ObjectTooling {
    public static mapToObject(map: Map<any, any>): any {
        let result = {};
        for (let [key, value] of map.entries()) {
            result[key] = value;
        }
        return result;
    }

    public static objectToMap(obj : any): Map<string, any> {
        let result = new Map<string, any>();
        for (let propName in obj) {
            if (obj.hasOwnProperty(propName)) {
                result.set(propName, obj[propName]);
            }
        }
        return result;
    }
}
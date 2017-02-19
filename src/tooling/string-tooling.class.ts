export class StringTooling {
    /**
     * camelCase to dash-case
     * @param str
     * @returns {string}
     */
    public static camelToDash(str: string): string {
        let strParts: string[] = [];
        let temp: string = "";
        for (let i = 0; i < str.length; i++) {
            let char = str.charAt(i);
            if (char == char.toUpperCase()) {
                if (temp) {
                    strParts.push(temp);
                }
                temp = char.toLowerCase();
            }
            else {
                temp += char;
            }
        }
        if (temp) {
            strParts.push(temp);
        }
        let result: string = "";
        for (let str of strParts) {
            if (str) {
                if (result) {
                    result += "-";
                }
                result += str;
            }
        }
        return result;
    }

    public static generateRandomString(): string {
        let date = new Date();
        let timeString: string = String(date.getTime()) + String(Math.floor(Math.random() * 1000));
        let result: string = "";

        for(let s of timeString)
        {
            let n = parseInt(s);
            result += String.fromCharCode(n + 97);
        }
        return result;
    }

    public static stripStartingIsPropertyName(propertyName: string): string {
        if (propertyName.length > 2) {
            let firstTwoWords = propertyName.substring(0, 2).toLowerCase();
            if (firstTwoWords == "is") {
                propertyName = propertyName.charAt(2).toLowerCase() + propertyName.substring(3, propertyName.length);
            }
        }
        return propertyName;
    }
}
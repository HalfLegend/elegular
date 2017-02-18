export class StringUtils{
    /**
     * camelCase to dash-case
     * @param str
     * @returns {string}
     */
    public static camelToDash(str: string): string{
        let strParts: string[] = [];
        let temp: string = "";
        for (let i = 0; i < str.length; i++){
            let char = str.charAt(i);
            if(char == char.toUpperCase()){
                if (temp){
                    strParts.push(temp);
                }
                temp = char.toLowerCase();
            }
            else {
                temp += char;
            }
        }
        if (temp){
            strParts.push(temp);
        }
        let result: string = "";
        for (let str of strParts){
            if(str){
                if (result){
                    result += "-";
                }
                result += str;
            }
        }
        return result;
    }
}
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {ElegularWindowOptions, WindowName} from "../../angular-options";

export class WindowServerManager{
    private static _registeredServerWindowMap: Map<WindowName, ElegularWindowOptions> = new Map<WindowName, ElegularWindowOptions>();
    public static registerServerWindow(elegularWindowOptions : ElegularWindowOptions){
        WindowServerManager._initialize();
        WindowServerManager._registeredServerWindowMap.set(elegularWindowOptions.windowName, elegularWindowOptions);
    }

    private static _isInitialized: boolean = false;
    private static _initialize(){
        if (!WindowServerManager._isInitialized)
        {
            http.createServer((request: IncomingMessage, response: ServerResponse)=>{
                console.log("IncomingMessage-------------\n");
                console.log(request.url);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end('Hello World\n');
            }).listen(8889, "localhost");
            WindowServerManager._isInitialized = true;
        }
    }
}
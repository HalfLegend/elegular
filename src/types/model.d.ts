import Rectangle = Electron.Rectangle;

type WindowStatus = Rectangle & {
    isFullScreen?: boolean;
    isMaximized?: boolean;
    isMinimized?: boolean;
};

declare namespace Electron {
    interface App {
        on(eventName: string, callback: Function);
    }
    interface BrowserWindow{
        on(eventName: string, callback: Function);
    }
    interface WebContents{
        on(eventName: string, callback: Function);
    }
}
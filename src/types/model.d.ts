import Rectangle = Electron.Rectangle;
type WindowStatus = Rectangle & {
    isFullScreen?: boolean;
    isMaximized?: boolean;
    isMinimized?: boolean;
};
import BrowserWindowOptions = Electron.BrowserWindowOptions;
import * as electron from "electron";
import BrowserWindow = Electron.BrowserWindow;
import * as fs from "fs";
import * as path from "path";
import {AngularLoadContext} from "./angular-load-context.class";
import {ElegularWindowConfig} from "../angular-window-module-config";
import {ElegularWindowManager} from "./elegular-window-manager.class";
import {ElegularWindowEventManager} from "../event/window-event/elegular-window-event-manager.class";
import Size = Electron.Size;
import Rectangle = Electron.Rectangle;
import NativeImage = Electron.NativeImage;
import LoadURLOptions = Electron.LoadURLOptions;
import Menu = Electron.Menu;
import ThumbarButton = Electron.ThumbarButton;
import * as Lazy from "lazy.js";
import {max} from "rxjs/operator/max";

export class ElegularWindow {
    public browserWindow: BrowserWindow;

    public get id(): number {
        return this.browserWindow.id;
    }

    constructor(angularWindowModuleConfig: ElegularWindowConfig) {
        let BrowserWindowConstructor = electron.BrowserWindow;
        this.browserWindow = new BrowserWindowConstructor(angularWindowModuleConfig.windowOptions);
        let dirPath = ElegularWindow.analyzeDirPath();

        this.browserWindow.loadURL(`file://${dirPath}/elegular-window.html`);

        this.browserWindow.webContents.on("did-finish-load", () => {
            let nodeModuleFolderPath = ElegularWindow.findNodeModuleFolder(dirPath);
            let relativePath = path.relative(dirPath, nodeModuleFolderPath);

            let nodeModulePaths = [];
            nodeModulePaths.push(path.join(relativePath, "zone.js", "dist", "zone.js"));
            nodeModulePaths.push(path.join(relativePath, "reflect-metadata", "Reflect.js"));
            if (angularWindowModuleConfig.isUseSystemJS) {

                nodeModulePaths.push(path.join(relativePath, "systemjs", "dist", "system.src.js"));
            }

            let modulePath = angularWindowModuleConfig.angularModulePath;
            if (!fs.existsSync(modulePath)) {
                modulePath = path.join(process.cwd(), modulePath);
            }
            relativePath = path.relative(dirPath, modulePath);

            let angularLoadContext: AngularLoadContext = new AngularLoadContext();
            angularLoadContext.nodeModulePaths = nodeModulePaths;
            angularLoadContext.angularModulePath = relativePath;
            angularLoadContext.elegularWindowConfig = angularWindowModuleConfig;
            angularLoadContext.windowId = this.id;
            this.browserWindow.webContents.send("angular-load", angularLoadContext);
        });

        if (angularWindowModuleConfig.isOpenDevTool) {
            this.browserWindow.webContents.openDevTools();
        }
        ElegularWindowManager.registerWindow(this);
    }

    private static analyzeDirPath(): string {
        let dirPath = __dirname;
        let nodeModules = "node_modules";
        let index = dirPath.lastIndexOf(nodeModules);
        if (index != -1) {
            index = index + nodeModules.length + 1;
            let dirRelativePath = dirPath.substring(index);
            let prefixPath = dirPath.substring(0, index);
            let matcher = /^(\.\d+){3}@(?=elegular|electron-angular)/.exec(dirRelativePath);
            if (matcher) {
                let version = matcher[0];
                dirRelativePath = dirRelativePath.substring(version.length);
                dirPath = path.join(prefixPath, dirRelativePath);
            }
        }
        return dirPath;
    }

    public get windowEventManager() {
        return new ElegularWindowEventManager(this.browserWindow.webContents);
    }

    private static findNodeModuleFolder(dirPath: string): string {
        let nodeModuleFolderName = "node_modules";
        let folderPath = path.join(dirPath, nodeModuleFolderName);
        if (fs.existsSync(folderPath)) {
            return folderPath;
        }
        else {
            return this.findNodeModuleFolder(path.dirname(dirPath));
        }
    }

    /**
     * Force closing the window, the unload and beforeunload event won't be emitted
     * for the web page, and close event would also not be emitted for this window,
     * but it would guarantee the closed event to be emitted.
     * You should only use this method when the renderer process (web page) has crashed.
     */
    public destroy(): void {
        this.browserWindow.destroy();
    }

    /**
     * Try to close the window, this has the same effect with user manually clicking
     * the close button of the window. The web page may cancel the close though,
     * see the close event.
     */

    public close(): void {
        this.browserWindow.close();
    }

    /**
     * Focus on the window.
     */
    public focus(): void {
        this.browserWindow.focus();
    }

    /**
     * Remove focus on the window.
     */
    public blur(): void {
        this.browserWindow.blur();
    }

    /**
     * @returns Whether the window is focused.
     */
    public isFocused(): boolean {
        return this.browserWindow.isFocused();
    }

    /**
     * @returns Whether the window is destroyed.
     */
    public isDestroyed(): boolean {
        return this.browserWindow.isDestroyed();
    }

    /**
     * Shows and gives focus to the window.
     */
    public show(): void {
        this.browserWindow.show();
    }

    /**
     * Shows the window but doesn't focus on it.
     */
    public showInactive(): void {
        this.browserWindow.showInactive();
    }

    /**
     * Hides the window.
     */
    public hide(): void {
        this.browserWindow.hide();
    }

    /**
     * @returns Whether the window is visible to the user.
     */
    public isVisible(): boolean {
        return this.browserWindow.isVisible();
    }

    /**
     * @returns Whether the window is a modal window.
     */
    public isModal(): boolean {
        return this.browserWindow.isModal();
    }

    /**
     * Maximizes the window.
     */
    public maximize(): void {
        this.browserWindow.maximize();
    }

    /**
     * Unmaximizes the window.
     */
    public unmaximize(): void {
        this.browserWindow.unmaximize();
    }

    /**
     * @returns Whether the window is maximized.
     */
    public isMaximized(): boolean {
        return this.browserWindow.isMaximized();
    }

    /**
     * Minimizes the window. On some platforms the minimized window will be
     * shown in the Dock.
     */
    public minimize(): void {
        this.browserWindow.minimize();
    }

    /**
     * Restores the window from minimized state to its previous state.
     */
    public restore(): void {
        this.browserWindow.restore();
    }

    /**
     * @returns Whether the window is minimized.
     */
    public isMinimized(): boolean {
        return this.browserWindow.isMaximized();
    }

    /**
     * Sets whether the window should be in fullscreen mode.
     */
    public setFullScreen(flag: boolean): void {
        this.browserWindow.setFullScreen(flag);
    }

    /**
     * @returns Whether the window is in fullscreen mode.
     */
    public isFullScreen(): boolean {
        return this.browserWindow.isFullScreen();
    }

    /**
     * This will have a window maintain an aspect ratio.
     * The extra size allows a developer to have space, specified in pixels,
     * not included within the aspect ratio calculations.
     * This API already takes into account the difference between a window’s size and its content size.
     *
     * Note: This API is available only on macOS.
     */
    public setAspectRatio(aspectRatio: number, extraSize?: Size): void {
        this.browserWindow.setAspectRatio(aspectRatio, extraSize);
    }

    /**
     * Resizes and moves the window to width, height, x, y.
     */
    public setBounds(options: Rectangle, animate?: boolean): void {
        this.browserWindow.setBounds(options, animate);
    }

    /**
     * @returns The window's width, height, x and y values.
     */
    public getBounds(): Rectangle {
        return this.browserWindow.getBounds();
    }

    /**
     * Resizes and moves the window's client area (e.g. the web page) to width, height, x, y.
     */
    public setContentBounds(options: Rectangle, animate?: boolean): void {
        this.browserWindow.setContentBounds(options, animate);
    }

    /**
     * @returns The window's client area (e.g. the web page) width, height, x and y values.
     */
    public getContentBounds(): Rectangle {
        return this.browserWindow.getContentBounds();
    }

    /**
     * Resizes the window to width and height.
     */
    public setSize(width: number, height: number, animate?: boolean): void {
        this.browserWindow.setSize(width, height, animate);
    }

    /**
     * @returns The window's width and height.
     */
    public getSize(): number[] {
        return this.browserWindow.getSize();
    }

    /**
     * Resizes the window's client area (e.g. the web page) to width and height.
     */
    public setContentSize(width: number, height: number, animate?: boolean): void {
        this.browserWindow.setContentSize(width, height, animate);
    }

    /**
     * @returns The window's client area's width and height.
     */
    public getContentSize(): number[] {
        return this.browserWindow.getContentSize();
    }

    /**
     * Sets the minimum size of window to width and height.
     */
    public setMinimumSize(width: number, height: number): void {
        this.browserWindow.setMinimumSize(width, height);
    }

    /**
     * @returns The window's minimum width and height.
     */
    public getMinimumSize(): number[] {
        return this.browserWindow.getMinimumSize();
    }

    /**
     * Sets the maximum size of window to width and height.
     */
    public setMaximumSize(width: number, height: number): void {
        this.browserWindow.setMaximumSize(width, height);
    }

    /**
     * @returns The window's maximum width and height.
     */
    public getMaximumSize(): number[] {
        return this.browserWindow.getMaximumSize();
    }

    /**
     * Sets whether the window can be manually resized by user.
     */
    public setResizable(resizable: boolean): void {
        this.browserWindow.setResizable(resizable);
    }

    /**
     * @returns Whether the window can be manually resized by user.
     */
    public isResizable(): boolean {
        return this.browserWindow.isResizable();
    }

    /**
     * Sets whether the window can be moved by user. On Linux does nothing.
     * Note: This API is available only on macOS and Windows.
     */
    public setMovable(movable: boolean): void {
        this.browserWindow.setMovable(movable);
    }

    /**
     * Note: This API is available only on macOS and Windows.
     * @returns Whether the window can be moved by user. On Linux always returns true.
     */
    public isMovable(): boolean {
        return this.browserWindow.isMovable();
    }

    /**
     * Sets whether the window can be manually minimized by user. On Linux does nothing.
     * Note: This API is available only on macOS and Windows.
     */
    public setMinimizable(minimizable: boolean): void {
        this.browserWindow.setMinimizable(minimizable);
    }

    /**
     * Note: This API is available only on macOS and Windows.
     * @returns Whether the window can be manually minimized by user. On Linux always returns true.
     */
    public isMinimizable(): boolean {
        return this.browserWindow.isMinimizable();
    }

    /**
     * Sets whether the window can be manually maximized by user. On Linux does nothing.
     * Note: This API is available only on macOS and Windows.
     */
    public setMaximizable(maximizable: boolean): void {
        this.browserWindow.setMaximizable(maximizable);
    }

    /**
     * Note: This API is available only on macOS and Windows.
     * @returns Whether the window can be manually maximized by user. On Linux always returns true.
     */
    public isMaximizable(): boolean {
        return this.browserWindow.isMaximizable();
    }

    /**
     * Sets whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.
     */
    public setFullScreenable(fullscreenable: boolean): void {
        this.setFullScreenable(fullscreenable);
    }

    /**
     * @returns Whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.
     */
    public isFullScreenable(): boolean {
        return this.browserWindow.isFullScreenable();
    }

    /**
     * Sets whether the window can be manually closed by user. On Linux does nothing.
     * Note: This API is available only on macOS and Windows.
     */
    public setClosable(closable: boolean): void {
        this.browserWindow.setClosable(closable);
    }

    /**
     * Note: This API is available only on macOS and Windows.
     * @returns Whether the window can be manually closed by user. On Linux always returns true.
     */
    public isClosable(): boolean {
        return this.browserWindow.isClosable();
    }

    /**
     * Sets whether the window should show always on top of other windows. After
     * setting this, the window is still a normal window, not a toolbox window
     * which can not be focused on.
     */
    public setAlwaysOnTop(flag: boolean): void {
        this.browserWindow.setAlwaysOnTop(flag);
    }

    /**
     * @returns Whether the window is always on top of other windows.
     */
    public isAlwaysOnTop(): boolean {
        return this.browserWindow.isAlwaysOnTop();
    }

    /**
     * Moves window to the center of the screen.
     */
    public center(): void {
        this.browserWindow.center();
    }

    /**
     * Moves window to x and y.
     */
    public setPosition(x: number, y: number, isAnimate: boolean): void {
        this.browserWindow.setPosition(x, y, isAnimate);
    }

    /**
     * @returns The window's current position.
     */
    public getPosition(): number[] {
        return this.browserWindow.getPosition();
    }

    /**
     * Changes the title of native window to title.
     */
    public setTitle(title: string): void {
        this.browserWindow.setTitle(title);
    }

    /**
     * Note: The title of web page can be different from the title of the native window.
     * @returns The title of the native window.
     */
    public getTitle(): string {
        return this.browserWindow.getTitle();
    }

    /**
     * Changes the attachment point for sheets on macOS.
     * Note: This API is available only on macOS.
     */
    public setSheetOffset(offsetY: number, offsetX?: number): void {
        this.browserWindow.setSheetOffset(offsetY, offsetX);
    }

    /**
     * Starts or stops flashing the window to attract user's attention.
     */
    public flashFrame(flag: boolean): void {
        this.browserWindow.flashFrame(flag);
    }

    /**
     * Makes the window do not show in Taskbar.
     */
    public setSkipTaskbar(skip: boolean): void {
        this.browserWindow.setSkipTaskbar(skip);
    }

    /**
     * Enters or leaves the kiosk mode.
     */
    public setKiosk(flag: boolean): void {
        this.browserWindow.setKiosk(flag);
    }

    /**
     * @returns Whether the window is in kiosk mode.
     */
    public isKiosk(): boolean {
        return this.browserWindow.isKiosk();
    }

    /**
     * The native type of the handle is HWND on Windows, NSView* on macOS,
     * and Window (unsigned long) on Linux.
     * @returns The platform-specific handle of the window as Buffer.
     */
    public getNativeWindowHandle(): Buffer {
        return this.browserWindow.getNativeWindowHandle();
    }

    /**
     * Hooks a windows message. The callback is called when the message is received in the WndProc.
     * Note: This API is available only on Windows.
     */
    public hookWindowMessage(message: number, callback: Function): void {
        this.browserWindow.hookWindowMessage(message, callback);
    }

    /**
     * @returns Whether the message is hooked.
     */
    public isWindowMessageHooked(message: number): boolean {
        return this.browserWindow.isWindowMessageHooked(message);
    }

    /**
     * Unhook the window message.
     */
    public unhookWindowMessage(message: number): void {
        this.browserWindow.unhookWindowMessage(message);
    }

    /**
     * Unhooks all of the window messages.
     */
    public unhookAllWindowMessages(): void {
        this.browserWindow.unhookAllWindowMessages();
    }

    /**
     * Sets the pathname of the file the window represents, and the icon of the
     * file will show in window's title bar.
     * Note: This API is available only on macOS.
     */
    public setRepresentedFilename(filename: string): void {
        this.browserWindow.setRepresentedFilename(filename);
    }

    /**
     * Note: This API is available only on macOS.
     * @returns The pathname of the file the window represents.
     */
    public getRepresentedFilename(): string {
        return this.browserWindow.getRepresentedFilename();
    }

    /**
     * Specifies whether the window’s document has been edited, and the icon in
     * title bar will become grey when set to true.
     * Note: This API is available only on macOS.
     */
    public setDocumentEdited(edited: boolean): void {
        this.browserWindow.setDocumentEdited(edited);
    }

    /**
     * Note: This API is available only on macOS.
     * @returns Whether the window's document has been edited.
     */
    public isDocumentEdited(): boolean {
        return this.browserWindow.isDocumentEdited();
    }

    public focusOnWebView(): void {
        this.browserWindow.focusOnWebView();
    }

    public blurWebView(): void {
        this.browserWindow.blurWebView();
    }

    /**
     * Captures the snapshot of page within rect, upon completion the callback
     * will be called. Omitting the rect would capture the whole visible page.
     * Note: Be sure to read documents on remote buffer in remote if you are going
     * to use this API in renderer process.
     * @param callback Supplies the image that stores data of the snapshot.
     * TODO; Deal with callback
     */
    public capturePage(callback: (image: NativeImage) => void, rect?: Rectangle): void {
        this.browserWindow.capturePage(callback);
    }

    /**
     * Same as webContents.loadURL(url).
     */
    public loadURL(url: string, options?: LoadURLOptions): void {
        this.browserWindow.loadURL(url, options);
    }

    /**
     * Same as webContents.reload.
     */
    public reload(): void {
        this.browserWindow.reload();
    }

    /**
     * Sets the menu as the window top menu.
     * Note: This API is not available on macOS.
     * TODO: AddMenu
     */
    public setMenu(menu: Menu): void {
        this.browserWindow.setMenu(menu);
    }

    /**
     * Sets the progress value in the progress bar.
     * On Linux platform, only supports Unity desktop environment, you need to
     * specify the *.desktop file name to desktopName field in package.json.
     * By default, it will assume app.getName().desktop.
     * @param progress Valid range is [0, 1.0]. If < 0, the progress bar is removed.
     * If greater than 0, it becomes indeterminate.
     * @param options
     */
    public setProgressBar(progress: number, options?: {
        /**
         * Mode for the progress bar.
         * Note: This is only implemented on Windows.
         */
        mode: 'none' | 'normal' | 'indeterminate' | 'error' | 'paused'
    }): void {
        this.browserWindow.setProgressBar(progress, options);
    }

    /**
     * Sets a 16px overlay onto the current Taskbar icon, usually used to convey
     * some sort of application status or to passively notify the user.
     * Note: This API is only available on Windows 7 or above.
     * @param overlay The icon to display on the bottom right corner of the Taskbar
     * icon. If this parameter is null, the overlay is cleared
     * @param description Provided to Accessibility screen readers.
     */
    public setOverlayIcon(overlay: NativeImage, description: string): void {
        this.browserWindow.setOverlayIcon(overlay, description);
    }

    /**
     * Sets whether the window should have a shadow. On Windows and Linux does nothing.
     * Note: This API is available only on macOS.
     */
    public setHasShadow(hasShadow: boolean): void {
        this.browserWindow.setHasShadow(hasShadow);
    }

    /**
     * Note: This API is available only on macOS.
     * @returns whether the window has a shadow. On Windows and Linux always returns true.
     */
    public hasShadow(): boolean {
        return this.browserWindow.hasShadow();
    }

    /**
     * Add a thumbnail toolbar with a specified set of buttons to the thumbnail image
     * of a window in a taskbar button layout.
     * @returns Whether the thumbnail has been added successfully.
     *
     * Note: This API is available only on Windows.
     */
    public setThumbarButtons(buttons: ThumbarButton[]): boolean {
        return this.browserWindow.setThumbarButtons(buttons);
    }

    /**
     * Sets the region of the window to show as the thumbnail image displayed when hovering
     * over the window in the taskbar. You can reset the thumbnail to be the entire window
     * by specifying an empty region: {x: 0, y: 0, width: 0, height: 0}.
     *
     * Note: This API is available only on Windows.
     */
    public setThumbnailClip(region: Rectangle): boolean {
        return this.browserWindow.setThumbnailClip(region);
    }

    /**
     * Sets the toolTip that is displayed when hovering over the window thumbnail in the taskbar.
     * Note: This API is available only on Windows.
     */
    public setThumbnailToolTip(toolTip: string): boolean {
        return this.browserWindow.setThumbnailToolTip(toolTip);
    }

    /**
     * Same as webContents.showDefinitionForSelection().
     * Note: This API is available only on macOS.
     */
    public showDefinitionForSelection(): void {
        this.browserWindow.showDefinitionForSelection();
    }

    /**
     * Changes window icon.
     * Note: This API is not available on macOS.
     * TODO: Add ElegularImage
     */
    public setIcon(icon: NativeImage): void {
        this.browserWindow.setIcon(icon);
    }

    /**
     * Sets whether the window menu bar should hide itself automatically. Once set
     * the menu bar will only show when users press the single Alt key.
     * If the menu bar is already visible, calling setAutoHideMenuBar(true) won't
     * hide it immediately.
     */
    public setAutoHideMenuBar(hide: boolean): void {
        this.browserWindow.setAutoHideMenuBar(hide);
    }

    /**
     * @returns Whether menu bar automatically hides itself.
     */
    public isMenuBarAutoHide(): boolean {
        return this.browserWindow.isMenuBarAutoHide();
    }

    /**
     * Sets whether the menu bar should be visible. If the menu bar is auto-hide,
     * users can still bring up the menu bar by pressing the single Alt key.
     */
    public setMenuBarVisibility(visibile: boolean): void {
        this.browserWindow.setMenuBarVisibility(visibile);
    }

    /**
     * @returns Whether the menu bar is visible.
     */
    public isMenuBarVisible(): boolean {
        return this.browserWindow.isMenuBarVisible();
    }

    /**
     * Sets whether the window should be visible on all workspaces.
     * Note: This API does nothing on Windows.
     */
    public setVisibleOnAllWorkspaces(visible: boolean): void {
        this.browserWindow.setVisibleOnAllWorkspaces(visible);
    }

    /**
     * Note: This API always returns false on Windows.
     * @returns Whether the window is visible on all workspaces.
     */
    public isVisibleOnAllWorkspaces(): boolean {
        return this.browserWindow.isVisibleOnAllWorkspaces();
    }

    /**
     * Makes the window ignore all mouse events.
     *
     * All mouse events happened in this window will be passed to the window below this window,
     * but if this window has focus, it will still receive keyboard events.
     */
    public setIgnoreMouseEvents(ignore: boolean): void {
        this.browserWindow.setIgnoreMouseEvents(ignore);
    }

    /**
     * Prevents the window contents from being captured by other apps.
     *
     * On macOS it sets the NSWindow's sharingType to NSWindowSharingNone.
     * On Windows it calls SetWindowDisplayAffinity with WDA_MONITOR.
     */
    public setContentProtection(enable: boolean): void {
        this.browserWindow.setContentProtection(enable);
    }

    /**
     * Changes whether the window can be focused.
     * Note: This API is available only on Windows.
     */
    public setFocusable(focusable: boolean): void {
        this.browserWindow.setFocusable(focusable);
    }

    /**
     * Sets parent as current window's parent window,
     * passing null will turn current window into a top-level window.
     * Note: This API is not available on Windows.
     */
    public setParentWindow(parent: BrowserWindow): void {
        this.browserWindow.setParentWindow(parent);
    }

    /**
     * @returns The parent window.
     */
    public getParentWindow(): BrowserWindow {
        return this.browserWindow.getParentWindow();
    }

    /**
     * @returns All child windows.
     */
    public getChildWindows(): BrowserWindow[] {
        return this.browserWindow.getChildWindows();
    }
}
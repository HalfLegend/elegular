export enum ElegularAppEvent{
    /**
     * Emitted when the application has finished basic startup.
     * On Windows and Linux, the will-finish-launching event
     * is the same as the ready event; on macOS, this event represents
     * the applicationWillFinishLaunching notification of NSApplication.
     * You would usually set up listeners for the open-file and open-url events here,
     * and start the crash reporter and auto updater.
     *
     * In most cases, you should just do everything in the ready event handler.
     */
    WillFinishLaunching,
        /**
         * Emitted when Electron has finished initialization.
         */
    Ready,
        /**
         * Emitted when all windows have been closed.
         *
         * If you do not subscribe to this event and all windows are closed,
         * the default behavior is to quit the app; however, if you subscribe,
         * you control whether the app quits or not.
         * If the user pressed Cmd + Q, or the developer called app.quit(),
         * Electron will first try to close all the windows and then emit the will-quit event,
         * and in this case the window-all-closed event would not be emitted.
         */
    WindowAllClosed,
        /**
         * Emitted before the application starts closing its windows.
         * Calling event.preventDefault() will prevent the default behaviour, which is terminating the application.
         */
    BeforeQuit,
        /**
         * Emitted when the application is quitting.
         */
    WillQuit,
        /**
         * Emitted when the application is quitting.
         */
    Quit,
        /**
         * Emitted when the user wants to open a URL with the application.
         * The URL scheme must be registered to be opened by your application.
         *
         * You should call event.preventDefault() if you want to handle this event.
         *
         * Note: This is only implemented on macOS.
         */
    OpenFile,
        /**
         * Emitted when the user wants to open a URL with the application.
         * The URL scheme must be registered to be opened by your application.
         *
         * You should call event.preventDefault() if you want to handle this event.
         *
         * Note: This is only implemented on macOS.
         */
    OpenUrl,
        /**
         * Emitted when the application is activated, which usually happens when clicks on the applications’s dock icon.
         * Note: This is only implemented on macOS.
         */
    Activate,
        /**
         * Emitted during Handoff when an activity from a different device wants to be resumed.
         * You should call event.preventDefault() if you want to handle this event.
         */
    ContinueActivity,
        /**
         * Emitted when a browserWindow gets blurred.
         */
    BrowserWindowBlur,
        /**
         * Emitted when a browserWindow gets focused.
         */
    BrowserWindowFocus,
        /**
         * Emitted when a new browserWindow is created.
         */
    BrowserWindowCreated,
        /**
         * Emitted when a new webContents is created.
         */
    WebContentsCreated,
        /**
         * Emitted when failed to verify the certificate for url, to trust the certificate
         * you should prevent the default behavior with event.preventDefault() and call callback(true).
         */
    CertificateError,
        /**
         * Emitted when a client certificate is requested.
         *
         * The url corresponds to the navigation entry requesting the client certificate
         * and callback needs to be called with an entry filtered from the list.
         * Using event.preventDefault() prevents the application from using the first certificate from the store.
         */
    SelectClientCertificate,
        /**
         * Emitted when webContents wants to do basic auth.
         *
         * The default behavior is to cancel all authentications, to override this
         * you should prevent the default behavior with event.preventDefault()
         * and call callback(username, password) with the credentials.
         */
    Login,
        /**
         * Emitted when the gpu process crashes.
         */
    GpuProcessCrashed,
        /**
         * Emitted when Chrome's accessibility support changes.
         *
         * Note: This API is only available on macOS and Windows.
         */
    AccessibilitySupportChanged
}
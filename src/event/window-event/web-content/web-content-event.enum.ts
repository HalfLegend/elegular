export enum WebContentEvent{
    /**
     * Emitted when the navigation is done, i.e. the spinner of the tab has stopped spinning,
     * and the onload event was dispatched.
     */
    DidFinishLoad,
        /**
         * This event is like did-finish-load but emitted when the load failed or was cancelled,
         * e.g. window.stop() is invoked.
         */
    DidFailLoad,
        /**
         * Emitted when a frame has done navigation.
         */
    DidFrameFinishLoad,
        /**
         * Corresponds to the points in time when the spinner of the tab started spinning.
         */
    DidStartLoading,
        /**
         * Corresponds to the points in time when the spinner of the tab stopped spinning.
         */
    DidStopLoading,
        /**
         * Emitted when details regarding a requested resource are available.
         * status indicates the socket connection to download the resource.
         */
    DidGetResponseDetails,
        /**
         * Emitted when a redirect is received while requesting a resource.
         */
    DidGetRedirectRequest,
        /**
         * Emitted when the document in the given frame is loaded.
         */
    DomReady,
        /**
         * Emitted when page receives favicon URLs.
         */
    PageFaviconUpdated,
        /**
         * Emitted when the page requests to open a new window for a url.
         * It could be requested by window.open or an external link like <a target='_blank'>.
         *
         * By default a new BrowserWindow will be created for the url.
         *
         * Calling event.preventDefault() will prevent creating new windows.
         */
    NewWindow,
        /**
         * Emitted when a user or the page wants to start navigation.
         * It can happen when the window.location object is changed or a user clicks a link in the page.
         *
         * This event will not emit when the navigation is started programmatically with APIs like
         * webContents.loadURL and webContents.back.
         *
         * It is also not emitted for in-page navigations, such as clicking anchor links
         * or updating the window.location.hash. Use did-navigate-in-page event for this purpose.
         *
         * Calling event.preventDefault() will prevent the navigation.
         */
    WillNavigate,
        /**
         * Emitted when a navigation is done.
         *
         * This event is not emitted for in-page navigations, such as clicking anchor links
         * or updating the window.location.hash. Use did-navigate-in-page event for this purpose.
         */
    DidNavigate,
        /**
         * Emitted when an in-page navigation happened.
         *
         * When in-page navigation happens, the page URL changes but does not cause
         * navigation outside of the page. Examples of this occurring are when anchor links
         * are clicked or when the DOM hashchange event is triggered.
         */
    DidNavigateInPage,
        /**
         * Emitted when the renderer process has crashed.
         */
    Crashed,
        /**
         * Emitted when a plugin process has crashed.
         */
    PluginCrashed,
        /**
         * Emitted when webContents is destroyed.
         */
    Destroyed,
        /**
         * Emitted when DevTools is opened.
         */
    DevtoolsOpened,
        /**
         * Emitted when DevTools is closed.
         */
    DevtoolsClosed,
        /**
         * Emitted when DevTools is focused / opened.
         */
    DevtoolsFocused,
        /**
         * Emitted when failed to verify the certificate for url.
         * The usage is the same with the "certificate-error" event of app.
         */
    CertificateError,
        /**
         * Emitted when a client certificate is requested.
         * The usage is the same with the "select-client-certificate" event of app.
         */
    SelectClientCertificate,
        /**
         * Emitted when webContents wants to do basic auth.
         * The usage is the same with the "login" event of app.
         */
    Login,
        /**
         * Emitted when a result is available for webContents.findInPage request.
         */
    FoundInPage,
        /**
         * Emitted when media starts playing.
         */
    MediaStartedPlaying,
        /**
         * Emitted when media is paused or done playing.
         */
    MediaPaused,
        /**
         * Emitted when a page’s theme color changes. This is usually due to encountering a meta tag:
         * <meta name='theme-color' content='#ff0000'>
         */
    DidChangeThemeColor,
        /**
         * Emitted when mouse moves over a link or the keyboard moves the focus to a link.
         */
    UpdateTargetUrl,
        /**
         * Emitted when the cursor’s type changes.
         * If the type parameter is custom, the image parameter will hold the custom cursor image
         * in a NativeImage, and scale, size and hotspot will hold additional information about the custom cursor.
         */
    CursorChanged,
        /**
         * Emitted when there is a new context menu that needs to be handled.
         */
    ContextMenu,
        /**
         * Emitted when bluetooth device needs to be selected on call to navigator.bluetooth.requestDevice.
         * To use navigator.bluetooth api webBluetooth should be enabled.
         * If event.preventDefault is not called, first available device will be selected.
         * callback should be called with deviceId to be selected,
         * passing empty string to callback will cancel the request.
         */
    SelectBluetoothDevice,
        /**
         * Emitted when a new frame is generated. Only the dirty area is passed in the buffer.
         */
    Paint
    // ElegularInternalWindowFunction
}
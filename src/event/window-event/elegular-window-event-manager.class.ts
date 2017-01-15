import {ElegularEventListener} from "../elegular-event-listener.class";
import {ElegularWindowEvents} from "./elegular-window-events.enum";
import {
    ElegularWindowAppEventListener,
    IElegularWindowAppEventListener
} from "./window-event-listener/window-event-listener.class";
import BrowserWindow = Electron.BrowserWindow;
import WebContents = Electron.WebContents;
export class ElegularWindowEventManager{
    constructor(private _webContents: WebContents){}

    private _eventListenerMap = new Map<ElegularWindowEvents, ElegularEventListener<Function>>();
    public getEventListener<F extends Function>(event: ElegularWindowEvents, constructor?: IElegularWindowAppEventListener<F>): ElegularEventListener<Function> {
        if (!constructor) {
            constructor = ElegularWindowAppEventListener;
        }
        let result = this._eventListenerMap.get(event);
        if (!result) {
            result = new constructor(event, this._webContents);
            this._eventListenerMap.set(event, result);
        }
        return result;
    }

    /**
     * Emitted when the navigation is done, i.e. the spinner of the tab has stopped spinning,
     * and the onload event was dispatched.
     */
    public get didFinishLoad(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidFinishLoad);
    }

    /**
     * This event is like did-finish-load but emitted when the load failed or was cancelled,
     * e.g. window.stop() is invoked.
     */
    public get didFailLoad(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidFailLoad);
    }
    /**
     * Emitted when a frame has done navigation.
     */
    public get didFrameFinishLoad(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidFrameFinishLoad);
    }

    /**
     * Corresponds to the points in time when the spinner of the tab started spinning.
     */
    public get didStartLoading(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidStartLoading);
    }

    /**
     * Corresponds to the points in time when the spinner of the tab stopped spinning.
     */
    public get didStopLoading(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidStopLoading);
    }

    /**
     * Emitted when details regarding a requested resource are available.
     * status indicates the socket connection to download the resource.
     */
    public get didGetResponseDetails(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidGetResponseDetails);
    }

    /**
     * Emitted when a redirect is received while requesting a resource.
     */
    public get didGetRedirectRequest(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidGetRedirectRequest);
    }

    /**
     * Emitted when the document in the given frame is loaded.
     */
    public get domReady(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DomReady);
    }

    /**
     * Emitted when page receives favicon URLs.
     */
    public get pageFaviconUpdated(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.PageFaviconUpdated);
    }

    /**
     * Emitted when the page requests to open a new window for a url.
     * It could be requested by window.open or an external link like <a target='_blank'>.
     *
     * By default a new BrowserWindow will be created for the url.
     *
     * Calling event.preventDefault() will prevent creating new windows.
     */
    public get newWindow(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.NewWindow);
    }

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
    public get willNavigate(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.WillNavigate);
    }

    /**
     * Emitted when a navigation is done.
     *
     * This event is not emitted for in-page navigations, such as clicking anchor links
     * or updating the window.location.hash. Use did-navigate-in-page event for this purpose.
     */
    public get didNavigate(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidNavigate);
    }

    /**
     * Emitted when an in-page navigation happened.
     *
     * When in-page navigation happens, the page URL changes but does not cause
     * navigation outside of the page. Examples of this occurring are when anchor links
     * are clicked or when the DOM hashchange event is triggered.
     */
    public get didNavigateInPage(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidNavigateInPage);
    }

    /**
     * Emitted when the renderer process has crashed.
     */
    public get crashed(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.Crashed);
    }

    /**
     * Emitted when a plugin process has crashed.
     */
    public get pluginCrashed(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.PluginCrashed);
    }

    /**
     * Emitted when webContents is destroyed.
     */
    public get destroyed(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.Destroyed);
    }

    /**
     * Emitted when DevTools is opened.
     */
    public get devtoolsOpened(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DevtoolsOpened);
    }

    /**
     * Emitted when DevTools is closed.
     */
    public get devtoolsClosed(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DevtoolsClosed);
    }

    /**
     * Emitted when DevTools is focused / opened.
     */
    public get devtoolsFocused(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DevtoolsFocused);
    }

    /**
     * Emitted when failed to verify the certificate for url.
     * The usage is the same with the "certificate-error" event of app.
     */
    public get certificateError(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.CertificateError);
    }

    /**
     * Emitted when a client certificate is requested.
     * The usage is the same with the "select-client-certificate" event of app.
     */
    public get selectClientCertificate(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.SelectClientCertificate);
    }

    /**
     * Emitted when webContents wants to do basic auth.
     * The usage is the same with the "login" event of app.
     */
    public get login(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.Login);
    }

    /**
     * Emitted when a result is available for webContents.findInPage request.
     */
    public get foundInPage(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.FoundInPage);
    }

    /**
     * Emitted when media starts playing.
     */
    public get mediaStartedPlaying(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.MediaStartedPlaying);
    }

    /**
     * Emitted when media is paused or done playing.
     */
    public get mediaPaused(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.MediaPaused);
    }

    /**
     * Emitted when a page’s theme color changes. This is usually due to encountering a meta tag:
     * <meta name='theme-color' content='#ff0000'>
     */
    public get didChangeThemeColor(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.DidChangeThemeColor);
    }

    /**
     * Emitted when mouse moves over a link or the keyboard moves the focus to a link.
     */
    public get updateTargetUrl(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.UpdateTargetUrl);
    }

    /**
     * Emitted when the cursor’s type changes.
     * If the type parameter is custom, the image parameter will hold the custom cursor image
     * in a NativeImage, and scale, size and hotspot will hold additional information about the custom cursor.
     */
    public get cursorChanged(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.CursorChanged);
    }

    /**
     * Emitted when there is a new context menu that needs to be handled.
     */
    public get contextMenu(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.ContextMenu);
    }

    /**
     * Emitted when bluetooth device needs to be selected on call to navigator.bluetooth.requestDevice.
     * To use navigator.bluetooth api webBluetooth should be enabled.
     * If event.preventDefault is not called, first available device will be selected.
     * callback should be called with deviceId to be selected,
     * passing empty string to callback will cancel the request.
     */
    public get selectBluetoothDevice(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.SelectBluetoothDevice);
    }

    /**
     * Emitted when a new frame is generated. Only the dirty area is passed in the buffer.
     */
    public get paint(): ElegularEventListener<Function> {
        return this.getEventListener(ElegularWindowEvents.Paint);
    }

    // public get elegularInternalWindowFunction(): ElegularEventListener<Function> {
    //     return this.getEventListener(ElegularWindowEvents.ElegularInternalWindowFunction);
    // }
}
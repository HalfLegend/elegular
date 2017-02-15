import {ElegularEventListener} from "../../elegular-event-listener.class";
import {WebContentEvent} from "./web-content-event.enum";
import {
    WebContentEventListener,
    IWebContentEventListenerConstructor
} from "./web-content-event-listener/web-content-event-listener.class";
import BrowserWindow = Electron.BrowserWindow;
import WebContents = Electron.WebContents;
export class WebContentEventManager{
    constructor(private _webContents: WebContents){}

    private _eventListenerMap = new Map<WebContentEvent, WebContentEventListener<Function>>();

    public getEventListener<F extends Function>(event: WebContentEvent, constructor?: IWebContentEventListenerConstructor<F>): WebContentEventListener<Function> {
        if (!constructor) {
            constructor = WebContentEventListener;
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
    public get didFinishLoad(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidFinishLoad);
    }

    /**
     * This event is like did-finish-load but emitted when the load failed or was cancelled,
     * e.g. window.stop() is invoked.
     */
    public get didFailLoad(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidFailLoad);
    }
    /**
     * Emitted when a frame has done navigation.
     */
    public get didFrameFinishLoad(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidFrameFinishLoad);
    }

    /**
     * Corresponds to the points in time when the spinner of the tab started spinning.
     */
    public get didStartLoading(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidStartLoading);
    }

    /**
     * Corresponds to the points in time when the spinner of the tab stopped spinning.
     */
    public get didStopLoading(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidStopLoading);
    }

    /**
     * Emitted when details regarding a requested resource are available.
     * status indicates the socket connection to download the resource.
     */
    public get didGetResponseDetails(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidGetResponseDetails);
    }

    /**
     * Emitted when a redirect is received while requesting a resource.
     */
    public get didGetRedirectRequest(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidGetRedirectRequest);
    }

    /**
     * Emitted when the document in the given frame is loaded.
     */
    public get domReady(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DomReady);
    }

    /**
     * Emitted when page receives favicon URLs.
     */
    public get pageFaviconUpdated(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.PageFaviconUpdated);
    }

    /**
     * Emitted when the page requests to open a new window for a url.
     * It could be requested by window.open or an external link like <a target='_blank'>.
     *
     * By default a new BrowserWindow will be created for the url.
     *
     * Calling event.preventDefault() will prevent creating new windows.
     */
    public get newWindow(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.NewWindow);
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
    public get willNavigate(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.WillNavigate);
    }

    /**
     * Emitted when a navigation is done.
     *
     * This event is not emitted for in-page navigations, such as clicking anchor links
     * or updating the window.location.hash. Use did-navigate-in-page event for this purpose.
     */
    public get didNavigate(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidNavigate);
    }

    /**
     * Emitted when an in-page navigation happened.
     *
     * When in-page navigation happens, the page URL changes but does not cause
     * navigation outside of the page. Examples of this occurring are when anchor links
     * are clicked or when the DOM hashchange event is triggered.
     */
    public get didNavigateInPage(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidNavigateInPage);
    }

    /**
     * Emitted when the renderer process has crashed.
     */
    public get crashed(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.Crashed);
    }

    /**
     * Emitted when a plugin process has crashed.
     */
    public get pluginCrashed(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.PluginCrashed);
    }

    /**
     * Emitted when webContents is destroyed.
     */
    public get destroyed(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.Destroyed);
    }

    /**
     * Emitted when DevTools is opened.
     */
    public get devtoolsOpened(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DevtoolsOpened);
    }

    /**
     * Emitted when DevTools is closed.
     */
    public get devtoolsClosed(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DevtoolsClosed);
    }

    /**
     * Emitted when DevTools is focused / opened.
     */
    public get devtoolsFocused(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DevtoolsFocused);
    }

    /**
     * Emitted when failed to verify the certificate for url.
     * The usage is the same with the "certificate-error" event of app.
     */
    public get certificateError(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.CertificateError);
    }

    /**
     * Emitted when a client certificate is requested.
     * The usage is the same with the "select-client-certificate" event of app.
     */
    public get selectClientCertificate(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.SelectClientCertificate);
    }

    /**
     * Emitted when webContents wants to do basic auth.
     * The usage is the same with the "login" event of app.
     */
    public get login(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.Login);
    }

    /**
     * Emitted when a result is available for webContents.findInPage request.
     */
    public get foundInPage(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.FoundInPage);
    }

    /**
     * Emitted when media starts playing.
     */
    public get mediaStartedPlaying(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.MediaStartedPlaying);
    }

    /**
     * Emitted when media is paused or done playing.
     */
    public get mediaPaused(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.MediaPaused);
    }

    /**
     * Emitted when a page’s theme color changes. This is usually due to encountering a meta tag:
     * <meta name='theme-color' content='#ff0000'>
     */
    public get didChangeThemeColor(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.DidChangeThemeColor);
    }

    /**
     * Emitted when mouse moves over a link or the keyboard moves the focus to a link.
     */
    public get updateTargetUrl(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.UpdateTargetUrl);
    }

    /**
     * Emitted when the cursor’s type changes.
     * If the type parameter is custom, the image parameter will hold the custom cursor image
     * in a NativeImage, and scale, size and hotspot will hold additional information about the custom cursor.
     */
    public get cursorChanged(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.CursorChanged);
    }

    /**
     * Emitted when there is a new context menu that needs to be handled.
     */
    public get contextMenu(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.ContextMenu);
    }

    /**
     * Emitted when bluetooth device needs to be selected on call to navigator.bluetooth.requestDevice.
     * To use navigator.bluetooth api webBluetooth should be enabled.
     * If event.preventDefault is not called, first available device will be selected.
     * callback should be called with deviceId to be selected,
     * passing empty string to callback will cancel the request.
     */
    public get selectBluetoothDevice(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.SelectBluetoothDevice);
    }

    /**
     * Emitted when a new frame is generated. Only the dirty area is passed in the buffer.
     */
    public get paint(): WebContentEventListener<Function> {
        return this.getEventListener(WebContentEvent.Paint);
    }

    // public get elegularInternalWindowFunction(): ElegularEventListener<Function> {
    //     return this.getEventListener(WebContentEvent.ElegularInternalWindowFunction);
    // }
}
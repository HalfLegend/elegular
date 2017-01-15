import {ElegularAppEvents} from "./elegular-app-events.enum";
import BrowserWindow = Electron.BrowserWindow;
import {BrowserWindowElectronEventListener} from "./event-listener/window-app-event-listener.class";
import WebContents = Electron.WebContents;
import Certificate = Electron.Certificate;
import {ElegularApplication} from "../../elegular-application.class";
import {ElegularWindowManager} from "../../window/elegular-window-manager.class";
import {ElegularEventListener} from "../elegular-event-listener.class";
import {
    ElegularAppEventListener,
    IElegularAppEventListenerConstructor
} from "./event-listener/app-event-listener.class";

export class ElegularAppEventManager {
    private static _eventListenerMap = new Map<ElegularAppEvents, ElegularEventListener<Function>>();

    public static get willFinishLaunching(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.WillFinishLaunching);
    }

    public static get ready(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.Ready);
    }

    public static get windowAllClosed(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.WindowAllClosed);
    }

    public static get beforeQuit(): ElegularEventListener<(event: Event) => void> {
        return <ElegularEventListener<(event: Event) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.BeforeQuit);
    }

    public static get willQuit(): ElegularEventListener<(event: Event) => void> {
        return <ElegularEventListener<(event: Event) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.WillQuit);
    }

    public static get quit(): ElegularEventListener<(event: Event, exitCode: number) => void> {
        return <ElegularEventListener<(event: Event, exitCode: number) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.WillQuit);
    }

    public static get openFile(): ElegularEventListener<(event: Event, url: string) => void> {
        return <ElegularEventListener<(event: Event, url: string) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.OpenFile);
    }

    public static get openUrl(): ElegularEventListener<(event: Event, url: string) => void> {
        return <ElegularEventListener<(event: Event, url: string) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.OpenUrl);
    }

    public static get activate(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.Activate);
    }

    public static get continueActivity(): ElegularEventListener<(event: Event, type: string, userInfo: Object) => void> {
        return <ElegularEventListener<(event: Event, type: string, userInfo: Object) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.ContinueActivity);
    }

    public static get browserWindowBlur(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.BrowserWindowBlur, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a browserWindow gets focused.
     * @see ElegularAppEvents.BrowserWindowFocus
     * @returns ElegularEventListener&lt;(event: Event, browserWindow: BrowserWindow) => void&gt;
     */
    public static get browserWindowFocus(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.BrowserWindowFocus, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a new browserWindow is created.
     */
    public static get browserWindowCreated(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.BrowserWindowCreated, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a new webContents is created.
     * TODO: WebContents
     */
    public static get webContentsCreated(): ElegularEventListener<(event: Event, webContents: WebContents) => void> {
        return <ElegularEventListener<(event: Event, webContents: WebContents) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.WebContentsCreated);
    }

    /**
     * Emitted when failed to verify the certificate for url, to trust the certificate
     * you should prevent the default behavior with event.preventDefault() and call callback(true).
     */
    public static get certificateError(): ElegularEventListener<(event: Event,
                                                                 webContents: WebContents,
                                                                 url: string,
                                                                 error: string,
                                                                 certificate: Certificate,
                                                                 callback: (trust: boolean) => void) => void> {
        return <ElegularEventListener<(event: Event,
                                       webContents: WebContents,
                                       url: string,
                                       error: string,
                                       certificate: Certificate,
                                       callback: (trust: boolean) => void) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvents.CertificateError);
    }

    /**
     * Emitted when a client certificate is requested.
     *
     * The url corresponds to the navigation entry requesting the client certificate
     * and callback needs to be called with an entry filtered from the list.
     * Using event.preventDefault() prevents the application from using the first certificate from the store.
     */
    public static get selectClientCertificate(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.SelectClientCertificate);
    }

    /**
     * Emitted when webContents wants to do basic auth.
     *
     * The default behavior is to cancel all authentications, to override this
     * you should prevent the default behavior with event.preventDefault()
     * and call callback(username, password) with the credentials.
     */
    public static get login(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.Login);
    }

    /**
     * Emitted when the gpu process crashes.
     */
    public static get gpuProcessCrashed(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.GpuProcessCrashed);
    }

    /**
     * Emitted when Chrome's accessibility support changes.
     *
     * Note: This API is only available on macOS and Windows.
     */
    public static get accessibilitySupportChanged(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvents.AccessibilitySupportChanged);
    }

    public static getEventListener<F extends Function>(event: ElegularAppEvents, constructor?: IElegularAppEventListenerConstructor<F>): ElegularEventListener<Function> {
        if (!constructor) {
            constructor = ElegularAppEventListener;
        }
        let result = ElegularAppEventManager._eventListenerMap.get(event);
        if (!result) {
            result = new constructor(event);
            ElegularAppEventManager._eventListenerMap.set(event, result);
        }
        return result;
    }

    private static defaultEventsRegistered: boolean;

    public static registerDefaultEvents() {
        if (!ElegularAppEventManager.defaultEventsRegistered) {
            ElegularAppEventManager.registerDefaultEvent(ElegularAppEventManager.ready, ElegularWindowManager.createMainWindow);
            ElegularAppEventManager.registerDefaultEvent(ElegularAppEventManager.windowAllClosed, ()=> {
                if (process.platform !== 'darwin') {
                    ElegularApplication.quit();
                }
            });
            ElegularAppEventManager.registerDefaultEvent(ElegularAppEventManager.activate, ElegularWindowManager.reCreateWindow);
        }
    }

    private static registerDefaultEvent<F extends Function>(listener: ElegularEventListener<F>, f: F): void {
        if (!listener.isRegistered()) {
            listener.registerFirst(f);
        }
    }
}
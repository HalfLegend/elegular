import {ElegularAppEvent} from "./elegular-app-event.enum";
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
import {PersistenceManager} from "../../persistence/persistence-manager.class";

export class ElegularAppEventManager {
    private static _eventListenerMap = new Map<ElegularAppEvent, ElegularAppEventListener<Function>>();

    public static get willFinishLaunching(): ElegularAppEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.WillFinishLaunching);
    }

    public static get ready(): ElegularAppEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.Ready);
    }

    public static get windowAllClosed(): ElegularAppEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.WindowAllClosed);
    }

    public static get beforeQuit(): ElegularAppEventListener<(event: Event) => void> {
        return <ElegularAppEventListener<(event: Event) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.BeforeQuit);
    }

    public static get willQuit(): ElegularAppEventListener<(event: Event) => void> {
        return <ElegularAppEventListener<(event: Event) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.WillQuit);
    }

    public static get quit(): ElegularAppEventListener<(event: Event, exitCode: number) => void> {
        return <ElegularAppEventListener<(event: Event, exitCode: number) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.WillQuit);
    }

    public static get openFile(): ElegularAppEventListener<(event: Event, url: string) => void> {
        return <ElegularAppEventListener<(event: Event, url: string) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.OpenFile);
    }

    public static get openUrl(): ElegularAppEventListener<(event: Event, url: string) => void> {
        return <ElegularAppEventListener<(event: Event, url: string) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.OpenUrl);
    }

    public static get activate(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.Activate);
    }

    public static get continueActivity(): ElegularAppEventListener<(event: Event, type: string, userInfo: Object) => void> {
        return <ElegularAppEventListener<(event: Event, type: string, userInfo: Object) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.ContinueActivity);
    }

    public static get browserWindowBlur(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.BrowserWindowBlur, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a browserWindow gets focused.
     * @see ElegularAppEvent.BrowserWindowFocus
     * @returns ElegularEventListener&lt;(event: Event, browserWindow: BrowserWindow) => void&gt;
     */
    public static get browserWindowFocus(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.BrowserWindowFocus, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a new browserWindow is created.
     */
    public static get browserWindowCreated(): ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void> {
        return <ElegularEventListener<(event: Event, browserWindow: BrowserWindow) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.BrowserWindowCreated, BrowserWindowElectronEventListener);
    }

    /**
     * Emitted when a new webContents is created.
     * TODO: WebContents
     */
    public static get webContentsCreated(): ElegularAppEventListener<(event: Event, webContents: WebContents) => void> {
        return <ElegularAppEventListener<(event: Event, webContents: WebContents) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.WebContentsCreated);
    }

    /**
     * Emitted when failed to verify the certificate for url, to trust the certificate
     * you should prevent the default behavior with event.preventDefault() and call callback(true).
     */
    public static get certificateError(): ElegularAppEventListener<(event: Event,
                                                                    webContents: WebContents,
                                                                    url: string,
                                                                    error: string,
                                                                    certificate: Certificate,
                                                                    callback: (trust: boolean) => void) => void> {
        return <ElegularAppEventListener<(event: Event,
                                          webContents: WebContents,
                                          url: string,
                                          error: string,
                                          certificate: Certificate,
                                          callback: (trust: boolean) => void) => void>>ElegularAppEventManager.getEventListener(ElegularAppEvent.CertificateError);
    }

    /**
     * Emitted when a client certificate is requested.
     *
     * The url corresponds to the navigation entry requesting the client certificate
     * and callback needs to be called with an entry filtered from the list.
     * Using event.preventDefault() prevents the application from using the first certificate from the store.
     */
    public static get selectClientCertificate(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.SelectClientCertificate);
    }

    /**
     * Emitted when webContents wants to do basic auth.
     *
     * The default behavior is to cancel all authentications, to override this
     * you should prevent the default behavior with event.preventDefault()
     * and call callback(username, password) with the credentials.
     */
    public static get login(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.Login);
    }

    /**
     * Emitted when the gpu process crashes.
     */
    public static get gpuProcessCrashed(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.GpuProcessCrashed);
    }

    /**
     * Emitted when Chrome's accessibility support changes.
     *
     * Note: This API is only available on macOS and Windows.
     */
    public static get accessibilitySupportChanged(): ElegularEventListener<Function> {
        return ElegularAppEventManager.getEventListener(ElegularAppEvent.AccessibilitySupportChanged);
    }

    public static getEventListener<F extends Function>(event: ElegularAppEvent, constructor?: IElegularAppEventListenerConstructor<F>): ElegularAppEventListener<F> {
        if (!constructor) {
            constructor = ElegularAppEventListener;
        }
        let result = ElegularAppEventManager._eventListenerMap.get(event);
        if (!result) {
            result = new constructor(event);
            ElegularAppEventManager._eventListenerMap.set(event, result);
        }
        return <ElegularAppEventListener<F>>result;
    }

    private static defaultEventsRegistered: boolean;

    public static registerDefaultEvents() {
        if (!ElegularAppEventManager.defaultEventsRegistered) {
            ElegularAppEventManager.registerDefaultEvent(ElegularAppEventManager.ready, ElegularWindowManager.createMainWindow);
            ElegularAppEventManager.registerDefaultEvent(ElegularAppEventManager.windowAllClosed, () => {
                PersistenceManager.storeWindowIdMap();
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
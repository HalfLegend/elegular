import {ElegularWindow} from "../../../window/elegular-window.class";
import {ElegularWindowEvent} from "./elegular-window-event.enum";
import {
    ElegularWindowEventListener,
    IElegularWindowEventListenerConstructor
} from "./elegular-window-event-listener/elegular-window-enent-listener";
import SwipeDirection = Electron.SwipeDirection;
export class ElegularWindowEventManager {
    constructor(private _elegularWindow: ElegularWindow) {
    }

    private _eventListenerMap = new Map<ElegularWindowEvent, ElegularWindowEventListener<Function>>();

    public getEventListener<F extends Function>(event: ElegularWindowEvent, constructor?: IElegularWindowEventListenerConstructor<F>): ElegularWindowEventListener<Function> {
        if (!constructor) {
            constructor = ElegularWindowEventListener;
        }
        let result = this._eventListenerMap.get(event);
        if (!result) {
            result = new constructor(event, this._elegularWindow);
            this._eventListenerMap.set(event, result);
        }
        return result;
    }

    /**
     * Emitted when the document changed its title,
     * calling event.preventDefault() would prevent the native window’s title to change.
     */
    public get pageTitleUpdated(): ElegularWindowEventListener<Function> {
        return this.getEventListener<(event: Event, title: string) => void>(ElegularWindowEvent.PageTitleUpdated);
    }

    /**
     * Emitted when the window is going to be closed. It's emitted before the before unload
     * and unload event of the DOM. Calling event.preventDefault() will cancel the close.
     */
    public get close(): ElegularWindowEventListener<Function> {
        return this.getEventListener<(event: Event) => void>(ElegularWindowEvent.Close);
    }

    /**
     * Emitted when the window is closed. After you have received this event
     * you should remove the reference to the window and avoid using it anymore.
     */
    public get closed(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Closed);
    }

    /**
     * Emitted when the web page becomes unresponsive.
     */
    public get unresponsive(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Unresponsive);
    }

    /**
     * Emitted when the unresponsive web page becomes responsive again.
     */
    public get responsive(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Responsive);
    }

    /**
     * Emitted when the window loses focus.
     */
    public get blur(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Blur);
    }

    /**
     * Emitted when the window gains focus.
     */
    public get focus(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Focus);
    }

    /**
     * Emitted when the window is shown.
     */
    public get show(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Show);
    }

    /**
     * Emitted when the window is hidden.
     */
    public get hide(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Hide);
    }

    /**
     * Emitted when the web page has been rendered and window can be displayed without visual flash.
     */
    public get readyToShow(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.ReadyToShow);
    }

    /**
     * Emitted when window is maximized.
     */
    public get maximize(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Maximize);
    }

    /**
     * Emitted when the window exits from maximized state.
     */
    public get unmaximize(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Unmaximize);
    }

    /**
     * Emitted when the window is minimized.
     */
    public get minimize(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Minimize);
    }

    /**
     * Emitted when the window is restored from minimized state.
     */
    public get restore(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Restore);
    }

    /**
     * Emitted when the window is getting resized.
     */
    public get resize(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Resize);
    }

    /**
     * Emitted when the window is getting moved to a new position.
     */
    public get move(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.Move);
    }

    /**
     * Emitted when the window enters full screen state.
     */
    public get enterFullScreen(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.EnterFullScreen);
    }

    /**
     * Emitted when the window leaves full screen state.
     */
    public get leaveFullScreen(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.LeaveFullScreen);
    }

    /**
     * Emitted when the window enters full screen state triggered by HTML API.
     */
    public get enterHtmlFullScreen(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.EnterHtmlFullScreen);
    }

    /**
     * Emitted when the window leaves full screen state triggered by HTML API.
     */
    public get leaveHtmlFullScreen(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.LeaveHtmlFullScreen);
    }

    /**
     * Emitted when an App Command is invoked. These are typically related
     * to keyboard media keys or browser commands, as well as the "Back" /
     * "Forward" buttons built into some mice on Windows.
     * Note: This is only implemented on Windows.
     */
    public get appCommand(): ElegularWindowEventListener<Function> {
        return this.getEventListener<(event: Event, command: string) => void>(ElegularWindowEvent.AppCommand);
    }

    /**
     * Emitted when scroll wheel event phase has begun.
     * Note: This is only implemented on macOS.
     */
    public get scrollTouchBegin(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.ScrollTouchBegin);
    }

    /**
     * Emitted when scroll wheel event phase has ended.
     * Note: This is only implemented on macOS.
     */
    public get scrollTouchEnd(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.ScrollTouchEnd);
    }

    /**
     * Emitted when scroll wheel event phase filed upon reaching the edge of element.
     * Note: This is only implemented on macOS.
     */
    public get scrollTouchEdge(): ElegularWindowEventListener<Function> {
        return this.getEventListener<Function>(ElegularWindowEvent.ScrollTouchEdge);
    }

    /**
     * Emitted on 3-finger swipe.
     * Note: This is only implemented on macOS.
     */
    public get swipe(): ElegularWindowEventListener<Function> {
        return this.getEventListener<(event: Event, direction: SwipeDirection) => void>(ElegularWindowEvent.Swipe);
    }
}
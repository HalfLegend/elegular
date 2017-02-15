export enum ElegularWindowEvent{
    /**
     * Emitted when the document changed its title,
     * calling event.preventDefault() would prevent the native window’s title to change.
     */
    PageTitleUpdated,
        /**
         * Emitted when the window is going to be closed. It’s emitted before the beforeunload
         * and unload event of the DOM. Calling event.preventDefault() will cancel the close.
         */
    Close,
        /**
         * Emitted when the window is closed. After you have received this event
         * you should remove the reference to the window and avoid using it anymore.
         */
    Closed,
        /**
         * Emitted when the web page becomes unresponsive.
         */
    Unresponsive,
        /**
         * Emitted when the unresponsive web page becomes responsive again.
         */
    Responsive,
        /**
         * Emitted when the window loses focus.
         */
    Blur,
        /**
         * Emitted when the window gains focus.
         */
    Focus,
        /**
         * Emitted when the window is shown.
         */
    Show,
        /**
         * Emitted when the window is hidden.
         */
    Hide,
        /**
         * Emitted when the web page has been rendered and window can be displayed without visual flash.
         */
    ReadyToShow,
        /**
         * Emitted when window is maximized.
         */
    Maximize,
        /**
         * Emitted when the window exits from maximized state.
         */
    Unmaximize,
        /**
         * Emitted when the window is minimized.
         */
    Minimize,
        /**
         * Emitted when the window is restored from minimized state.
         */
    Restore,
        /**
         * Emitted when the window is getting resized.
         */
    Resize,
        /**
         * Emitted when the window is getting moved to a new position.
         */
    Move,
        /**
         * Emitted when the window enters full screen state.
         */
    EnterFullScreen,
        /**
         * Emitted when the window leaves full screen state.
         */
    LeaveFullScreen,
        /**
         * Emitted when the window enters full screen state triggered by HTML API.
         */
    EnterHtmlFullScreen,
        /**
         * Emitted when the window leaves full screen state triggered by HTML API.
         */
    LeaveHtmlFullScreen,
        /**
         * Emitted when an App Command is invoked. These are typically related
         * to keyboard media keys or browser commands, as well as the "Back" /
         * "Forward" buttons built into some mice on Windows.
         * Note: This is only implemented on Windows.
         */
    AppCommand,
        /**
         * Emitted when scroll wheel event phase has begun.
         * Note: This is only implemented on macOS.
         */
    ScrollTouchBegin,
        /**
         * Emitted when scroll wheel event phase has ended.
         * Note: This is only implemented on macOS.
         */
    ScrollTouchEnd,
        /**
         * Emitted when scroll wheel event phase filed upon reaching the edge of element.
         * Note: This is only implemented on macOS.
         */
    ScrollTouchEdge,
        /**
         * Emitted on 3-finger swipe.
         * Note: This is only implemented on macOS.
         */
    Swipe
}
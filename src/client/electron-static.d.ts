// When using SystemJS, "import 'electron'" will not work
// "electron" must be defined as a global variable.
declare const electron: Electron.ElectronMainAndRenderer;
declare const remote:Electron.Remote;
declare const Menu:typeof Electron.Menu;
declare const MenuItem:typeof Electron.MenuItem;
import {ElegularWindowOptions} from "../angular-options";
export class AngularLoadContext {
    /**
     * Third party libraries in 'node_modules', which need to be loaded in <script> tag
     */
    nodeModulePaths: string[];
    /**
     * User defined angular module path {@link ElegularWindowOptions.angularModulePath}, after translated to relative path.
     */
    angularModulePath: string;
    windowId: number;
    elegularWindowOptions: ElegularWindowOptions;
}
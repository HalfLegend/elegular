import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ElegularService} from "./elegular-service.service";
import {ElegularWindowRef} from "./elegular-window-ref.service";
@NgModule({
    imports:[BrowserModule],
    providers:[
        ElegularService
    ]
})
export class ElegularModule{

}
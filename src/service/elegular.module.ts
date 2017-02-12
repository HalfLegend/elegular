import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ElegularService} from "./elegular-service.service";

@NgModule({
    imports:[BrowserModule],
    providers:[
        ElegularService
    ]
})
export class ElegularModule{
}
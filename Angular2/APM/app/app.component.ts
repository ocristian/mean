//Importing Component Decorator
import { Component } from '@angular/core';

//Component Decorator
@Component({
    selector: 'pm-app',
    template: `
        <div><h1>{{pageTitle}}</h1>
            <pm-products></pm-products>
        </div>          
    `
})
//Class definition
export class AppComponent {
    //Propertie name: Data type = default value
    pageTitle: string = 'PLA Product Management';
}
##Getting started with Angular 2

####runing the app
1. Open a command prompt in the project's root directory (APM)
2. Type: ```npm install ```
3. Type: ```npm start ```
    1. This launches the TypeScript compiler (tsc) to compile the application and wait for changes.
    2. It also starts the lite-server and launches the browser to run the application.  


###Angular 2

Components / Templates / Services

#####Angular is
    JS framework to build client-side apps

* Why?
  * Expressive HTML
  * Porwer full Data Bindig
  * Modular by Design
  * Built-in back-end integration

* 2
  * Build for speed
  * Modern
  * Simplified API
  * Enhances Productivity

####Anatomy

    App = Components

    Component = Template(View) + Class(Properties + Methods) + Metada 

####Modules
    * Organize apps
      * Root Angular Module + Componentes
      * Feature Angular Module + Componentes

####Prerequisities
    * Required
      * JS
      * HTML
      * CSS

    * Helpful
      * OO

####Sample App Architecture

    #####Welcome Component

    ####Product List Component
        Star Component

    ####Product Detail
        Reuse Star Component

    ####App Component
       Product Data    


####TypeScript (typescriptlang.org/playground)
    * Superset of JS
    * Transpiles to plain JS
    * Strongly typed
    * Class-based OO

####Angular Modules

    Code files that organize the app into cohesive blocks of functionality
    Organize, Modularize and Promote our app boundaries

    #####Root Angular Module
        Called App Module
        Any Component belongs fom only one component

    #####Feature Angular Module
        Group of Features

    #####Shared Module

####App Startup

    Index.html -> Systemjs.config.js -> main.ts -> app.module.ts -> app.component.ts -> index.html


####Components
    * Template 
      * View layout 
      * Created with HTML
      * Includes binding and directives

    * + Class (Properties + methods)
      * Code supporting the view
      * Created with TypeScript
      * Properties: data
      * Methods: logic

    * + Metadata
      * Extra data for Angular
      * Defined with a decorator

####Checklist
    * Class
      * clear name
      * export keyword
      * Data in properties

    * Metadata
      * Component decorator, prifix with @
      * selector: Component name in HTML
      * template: Views HTML
      * Import
        * where to find dependencies  













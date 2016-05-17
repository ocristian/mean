# Shapping up with Angulas.js

A client-side JavaScript Framewoek for adding interactivity to HTML
  
To create a dynamic website.
* helps you organize your JavaScript
* helps create responsive (as in fast) websites
* plays well with jQuery
* is easy to test

### Must know

HTML, CSS and JavaScript.

### Nice to know

Automated testing, BDD and TDD.

### Telling our HTML when to trigger our JavaScript

##### Directives

is a marker on a HTML tag that tells Angular to run or reference some JavaScript code.

<pre>
   (directive)      (js function)  
</pre>
```javascript
  ng-controller = "StoreController"
```

##### Modules

where we write pieces of our Angular application
makes our code more maintainable, testable and readable
where we define dependencies for our app
modules can use other modules

```javascript
  var app = angular.module('store', [ ]);
```
<pre>
                |             |      |
            angularJS         |      |
                          app name   |
                                dependencies
</pre>

##### Expressions

allow to insert dynamic values into the page
define a 2-way Data Binding... this means Expressions are re-evaluated when a property changes 

##### Controllers

working with data, controllers are where we define our app's behavior by defining functions and values.

```javascript
  (function(){
    var app = angular.module('store', []);

    app.controller('StoreController', function(){
    });

  })();
```

storing data inside the controller

```javascript
  (function(){
    var app = angular.module('store', []);

    app.controller('StoreController', function(){
      //setting a controller property
      this.product = gem;
    });

    var gem = {
      name: 'book',
      price: 20.90,
      description: '.....',
    } 

  })();
```

attaching the controller
<pre>
            directive     controller 
                |            name           alias 
                |              |              |
</pre>
```html
      <div ng-controller="StoreController as store" />
```

displayng our Product

```html
      <div ng-controller="StoreController as store">
        <h1> {{store.product.name}} </h1>
        <h2> ${{store.product.price}} </h2>
        <p> {{store.product.description}} </p>    
      </div>
```

understanding the Scope

```html
      <!-- The scope of the Controller is ONLY INSIDE of element -->
      <div ng-controller="StoreController as store">
        ...
      </div>
```

### Built-in Directives

#### ng-show
will only show the element if the value of the Exression is true

```html
   <button ng-show="store.product.canPurchase"> Add to Cart </button>
```

#### ng-hide

```html
   <div ng-hide="store.product.soldOut" />
```

#### ng-repeat

```html
   <div ng-repeat="product in store.products" />
```

### Filters

##### currency

```javascript
   {{ product.price | currency }}
```

##### date

```javascript
   {{ product.created_at | date:'MM/dd/yyyy @ h:mma' }}
```

##### uppercase & lowecase

```javascript
   {{ product.name | uppercase }}
```

##### limitTo

```javascript
   {{ store.products | limitTo: 10 }}
```

##### orderBy

by descending price: -price
by ascending price: price

```javascript
   {{ store.products | orderBy: '-price' }}
```

adding a image array to our product array

```javascript
  images:[
    {
      full: 'image-01.jpg',
      thumb: 'image-01-thumb.jpg'
    },
    {
      full: 'image-02.jpg',
      thumb: 'image-02-thumb.jpg'
    }
  ]
```

displaying the first image in a product

```html
  <img ng-src="{{product.images[0].full}}" />
```


### Tabs inside out

make the app more interactive

##### ng-click

```html
  <section>
    <ul class="nav nav-pills">
      <li> <a href ng-click="tab = 1">Description</a> </li>
      <li> <a href ng-click="tab = 2">Specification</a> </li>
      <li> <a href ng-click="tab = 3">Reviews</a> </li>
    </ul>
  </section>
```

##### ng-show

show the panel if tab is the right number

```html
  ng-show="tab === 1"
```

##### ng-init

setting the initial value for a tab

```html
  <section ng-init="tab = 1"></section>
```

##### ng-class

setting the active class

```html
  <li ng-class="{class_name:tab === 1 }">
```

#### Tab Controller

```javascript
  app.controller('TabController', function(){
    this.tab = 1;
    
    this.setTab = function(newTab){
      this.tab = newTab;
    }
    
    this.isSet = function(tab){
      return this.tab === tab;
    }

  });
```

```html
  <section ng-controller="TabController as tab">
    ...
    <li ng-class="{ active:tab.isSet(1) }">
      <a href ng-click="tab.setTab(1)">Description</a>
    </li>
```

#### Forms and models

```javascript
  reviews: [
    {
      stars: 5,
      body: "Its great",
      author: "test@test.com"
    }
    {
      stars: 3,
      body: "not bad",
      author: "test1@test.com"
    }
  ] 
```

##### ng-model

binds the form element values to the property

```html
  <!-- checkbox -->
  <input ng-model="review.terms" type="checkbox" /> I agree the terms 

  <!-- radio buttons -->
  <input ng-model="review.color" type="radio" value="blue" />Blue
  <input ng-model="review.color" type="radio" value="black" />Black
```

#### Accepting Submissions

```javascript
    app.controller('ReviewController', function(){
      this.review = {};

      //defining a function addReview in the controller
      this.addReview = function(product){
        product.reviews.push(this.review);
        this.review = {}; //Clear out the review, so the form will reset.
      };

    });
```

```html
  ng-controller="ReviewController as reviewCtrl"
```

##### ng-submit

allow us to call a function when the form is submitted

```html
  < ng-controller="ReviewController as reviewCtrl" ng-submit="reviewCtrl.addReview(product)" >
```

#### Validations

turns out Angular has some great client side validations we can use with our directives












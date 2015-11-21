# MongoDB Schema Design

## Overview of retail application

In this chapter you will set up the object schemas for your retail means stack application.

The final application will be structured something like this.
<pre>    
     [mobile]  <------>  (   ionic   ) ( angularJs ) <------>  [ pc ]

                                 \           /

                                 (    node    )
                                   
                                       |
                                       |

                                  ( MongoDB )
</pre>

You will have a Node.js server that stores data in MongoDB.
On top of that you will have two clients, an angular JS client that runs in a browser like Google Chrome, and a hybrid mobile app built using the ionic framework.

These clients will both interact with the server through an API.
In this chapter you will focus primarily on setting up the MongoDB portion of the stack.

You will learn about the Mongoose ODM, which will enable you to design MongoDB schemas, and you will learn about several MongoDB schema design patterns that will enable you to build an elegant and scalable application on top of MongoDB.

The application you will build will essentially be a simplified Amazon.
You'll have products organized by category.
You can then look at a single product, add the product to your cart, and then check out via fake payment.

Again, this application will have three views:
* category view that lists products that belong to a particular category
* the product view, which displays detailed information about a single product.
* the cart view, which shows the current items that the logged in user has added to their cart.

The cart will also enable the user to perform a sandbox mode payment to the [Stripe API](https://stripe.com).
Again, Stripe is a popular service for payment processing.

Your app will be structured as a single page app, which means that AngularJS and Ionic on the mobile side will be responsible for rendering HTML by themselves.
There will be no page reloads in this application.
AngularJS will be responsible for routing between the different views in your application.
The AngularJS client will communicate with the Node.js server using JavaScript Object Notation, or JSON, over HTTP.

The Node.js server will be primarily responsible for validating the client's data, authentication, and payment processing.

And MongoDB will be responsible for storing all of the application's data, like, say, what products are for sale, or what products are in a user's cart.

The Node.js server will serve as a validation and business logic layer on top of MongoDB.
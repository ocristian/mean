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

## Introduction to mongoose

<pre>
                                [ mongoose ]
                                     |
                                     |
                                  [ node ]      
                                     |
                                     |                                  
                                 [ mongoDB ] 
</pre>

[Mongoose](http://mongoosejs.com) is the most popular object document mapper, or ODM for short for MongoDB and node.js.

Mongoose provides features like schema validation, pseudo joins, and numerous other features on top of the MongoDB node.js driver.
These features are key for web development.

Mongoose's API consists of four primary data types.
<pre>
    [ SCHEMA ]
                \
                  \
                    [ MODEL ]   ---->   [ DOCUMENT ]
                  /
                /
    [CONNECTION]
</pre>

A schema is a set of rules that defines what fields a document may have and what properties the document must satisfy to be considered valid.

A connection is an object representing one or more sockets that are connected to the MongoDB server.

At a high level, a model is a combination of a schema and a connection.
A model is a wrapper around a single MongoDB collection and uses its associated schema to make sure documents inserted into the collection satisfy the schema's constraints.

Now a Mongoose document can be thought of as an instantiation of a model.
A document is a single object from a collection.
It has an associated model and a dot save function that you can use to persist that document to MongoDB.

Suppose you wanted your user documents to have three fields.
A name, an email address, and the number of times the user has logged in.
This is how you would express these requirements in Mongoose.
The username is a string and is required, email is of type string, also required, and must match this particular regular expression.
And the logged in count is a number that defaults to zero.
Also, the user's email has this lowercase property.
This tells Mongoose to convert the email string to lowercase before saving which enables emails to be case insensitive.

In order to use this schema, you first need to make Mongoose connect to MongoDB.
This `mongoose.connect` function is the most concise way to make Mongoose connect to this mongod server.
Once you have called connect, you can then use the `mongoose.model` function to create a user model from the schema and collection.
The user model has several nice properties.
For instance, you can use the user model to create a new user document with name John Smith and email john@smith.io, and then you can save the document.
The user model also has this handy dot find function which wraps the MongoDB node.js driver's find function.

Note that the callback to find takes an array of Mongoose documents.
Now once you run this script, you should see that Mongoose creates this new user, saves it to the database, and then successfully queries for the user document again and prints it to the screen.
And now once you run this script you see that Mongoose inserted the John Smith document for you as well as set the logged in count to zero by default.










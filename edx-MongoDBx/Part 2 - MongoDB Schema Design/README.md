# MongoDB Schema Design

[Overview of retail application](#overview-of-retail-application)
[Introduction to mongoose](#introduction-to-mongoose)
[Schema design principle: store what you query for](#schema-design-principle:-store-what-you-query-for)

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

## Schema design principle: store what you query for

MongoDB is schemaless.
You can store whatever documents you want in whatever collection.

However, just because you can store any document doesn't mean that you should.
In order to get good performance and developer productivity from MongoDB, you should think carefully about your schema design.

The first schema design principle you will learn about is the result of these three MongoDB characteristics.

MongoDB can update documents in place very quickly as long as the document size doesn't change too much, and MongoDB is optimized for fast queries on individual documents.

However, MongoDB has no notion of joins. There's no way to reliably merge data from different collections like you would with joins in SQL databases.

For instance, suppose you have a collection of users and a collection of reviews. Each review tracks which user posted it.

In order to get a user and their corresponding reviews, you would have to run two queries, one for the user and one for each of their reviews.
There's no way to do this with one query and MongoDB unless you change the schema.

Furthermore, there is no way to sort users by their average review score in MongoDB with this schema.
You would have to pre-compute the average review score and store in the User Documents if you want to sort by it.

In order to take advantage of MongoDB strengths, you should remember that your MongoDB schemas should closely match the data you want to display to the end user.
For instance, if you want to display the average review score for a user, you should track the average review score in the user document rather than re-computing it every time you load a user by loading each and every individual review.

A helpful mnemonic for remembering this principle is Store What You Query For.
This may seem counterintuitive if you are used to SQL databases, because this is definitely not their normal form.

However, storing exactly what you query for is easier to understand, reason about, and de-bug, because there's less data transformation between the client and the database.

It's also better for performance, because reading a single MongoDB document requires fewer different non-sequential hard drive reads than executing an SQL query with multiple joins.

In other words, MongoDB's lack of joins may seem intimidating to developers from a SQL background, however, to paraphrase Linux's original architect, Linus Torvalds, if you have an API endpoint with multiple joins, you're screwed anyway and should fix your API.

As you'll see when you design the API for your retail app, each API endpoint will be primarily responsible for loading data from a single collection.

## Schema design principle: principle of least cardinality

The other schema design principle you will learn about is known as the principle of least cardinality.

This principle provides you a guideline for how to resolve one to many and many to many relationships with MongoDB. 

MongoDB documents can contain arrays.
There's nothing to stop you from including every single review a user posts in the user document.

Depending on your use case, that may be a decent idea. 
But beware. Arrays that grow without bound are a very bad MongoDB anti-pattern.

If you can't limit the number of reviews a user can post, your document size will become massive.
This is bad for MongoDB performance.
This is bad because of MongoDB's 16 megabyte document size limit, and bad because it wastes network throughput.

As a web developer, you should defend your network throughput from unnecessary data because network throughput will most always be your scarcest resource.

The ideal schema design in the case of an on unbounded number of reviews would be for reviews to track which user posted them, rather than listing out the reviews in the user document.

This is an instance of the principle of least cardinality.
Tracking the user in the review document results in smaller array sizes than tracking the review documents in the user documents.
This is because in this schema a review is posted by exactly one user.
But a user can post an unlimited number of reviews.
This principle can also be applied to many to many relationships.

Suppose you were to design a MongoDB schema for a site like meetup.com, where users register for events with a capped number of attendees.

In SQL the schema design would be easy.
You would have a mapping table for users and events. This table would store rows that contain a user ID and an event ID.

In MongoDB the solution is not quite as cut and dry.
If you expect users to attend numerous events and events that have millions of attendees, a mapping collection analogous to an SQL mapping table would likely be the right choice.

However, if you assume that each event will only have at most a few hundred attendees, you can de-normalize this many to many relationship by keeping a list of IDs representing attendees in the event document itself.

This is because you assume that the number of attendees for any given event is never going to grow without bound and will be, at most, a couple hundred.

Go take the number 500, for argument's sake, as gospel.
The right MongoDB schema design always depends on the store what you query for principle.

But always remember, arrays that grow without bound are always a bad choice in MongoDB.

## MongoDB indexes

Indexes are a way to get consistent performance from your queries as your data grows.
Indexes are key to getting good performance from MongoDB.

Now, if you're familiar with indexes in SQL databases, MongoDB indexes are pretty similar.

Indexes are essentially a way for MongoDB to pre-compute the results of a query, like how the index of a book can tell you where to find a certain word without searching through the entire book.

So when there are no indexes and you run a query like this, searching for users with name John, MongoDB will do a collection scan to find documents that match the query.

That is, MongoDB will search every single document in the collection to find documents that match the query.
This is OK for small data sets, but collection scans become more and more expensive as your data grows.

Now, when you create an index by calling the create index function in the shell, MongoDB creates a data structure that maps the values of the name field to documents that have that value of the name field.

So now when you ask MongoDB for documents where name is equal to John, MongoDB doesn't need to search every single document, it just reads from the map.

Now, let's see how this works for a larger data set.
So, for instance, in this case we've inserted five million documents and then one document with name John.

Without an index, you'll notice that there's a slight delay in executing the query.
Now, naturally a delay in searching through five million documents is not very web scale, so let's create an index and see what happens.

So now we created an index on name, and let's re-run that query.
As you'll see, the query is pretty instantaneous.

MongoDB also has a notion of a multikey index.
A multikey index is an index that keeps track of values in an array.
Multikey indexes speed up queries that require scanning through arrays, like this names array.

A collection scan would have to scan through every single array in every single document.
Now, creating a multikey index is transparent.

All you have to do is create an index on the array field.
So when we execute this query searching for names, where names contains John, you'll notice that there's a bit of a delay in executing the query, because we haven't created an index on names yet.

Now creating a multikey index again is transparent all you do is just use the create index function and specify the field names, and now when you re-run the query, you notice you get back the result instantaneously.
Now, multikey indexes are powerful but, once again, be wary of arrays that grow without bound.

Large documents take up more bandwidth and multikey indexes on large arrays have some significant performance overhead on MongoDB 3.0's default storage engine and MMAPv1.

## Retail application schema: product

Now that you've learned some key MongoDB schema design principles, it's time to apply these principles and design a set of schemas for the retail MEAN stack
application.

Recall that there will be three schemas-- product, category, and user-- and these schemers will be written using Mongoose, the popular MongoDB ODM for Node.js.

The most basic schema, the one that we'll talk about first, is the product schema.

The general idea is this schema represents what you will display on an individual product view, so the product's name, a list of pictures, how much the product costs, and the category that the product belongs to.

Since you did specify an underscore ID field in this schema, Mongoose will implicitly add one for you.
The underscore ID field that Mongoose adds for you is just a standard MongoDB object ID.

The product schema utilizes a couple of basic Mongoose features that you learned about in the Introduction to Mongoose lesson.

First, this type property tells Mongoose what type to expect.
Mongoose will try to cast values to the specified type.

For instance, if you try to set the name field to the number two, Mongoose will convert two to a string for you.
Mongoose will refuse to save if there was an error casting a value.

For instance, if you set `price.amount`, which is expected to be a number to this particular string Mongoose will return an error when validating the document the required property our name price dot amount and currency means that Mongoose will not allow you to save a product that doesn't have a name, an amount, or a currency.

Fields are optional by default in Mongoose, so unless you specify required, Mongoose will allow you to save a product where `price.amount` was not set.

The enum property is available for string types.
It specifies that the only allowable values of `price.currency` are USD, EUR, and GBP, which are the ISO 4217 currency codes for the US dollar, the European Union dollar, and the British pound sterling respectively.

This match property for strings specifies that the string must match the given regular expression.
In this case, you want to specify that image URLs start with http:// as a rudimentary security measure.

The category field is somewhat mysterious right now.
It's abstracted out behind this require call, which you will learn about in the category schema lesson.

The category field though is important for the product schema because you'll want to query for products based on the category's properties.

This is an instance of store what you query for.
Category is a separate collection, but because you care about querying for products by category, you should inline category for optimal query performance, especially since there is a one-to-many relationship of categories
to products.

A product's category isn't going to change often. You will probably only change the product's category as part of an expensive database migration.

But you will Inquiry by category often, which is why inlining category is a good idea in this case and thus an instance of store what you query for.

## Retail application schema: category

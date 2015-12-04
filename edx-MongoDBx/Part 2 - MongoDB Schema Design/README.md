# MongoDB Schema Design

[Overview of retail application](#overview-of-retail-application)

[Introduction to mongoose](#introduction-to-mongoose)

[Schema design principle: store what you query for](#schema-design-principle-store-what-you-query-for)

[Schema design principle: principle of least cardinality](#schema-design-principle-principle-of-least-cardinality)

[MongoDB indexes](#mongodb-indexes)

[Retail application schema: product](#retail-application-schema-product)

[Retail application schema: category](#retail-application-schema-category)

[Retail application schema: user and cart](#retail-application-schema-user-and-cart)

[Advanced mongoose features: virtuals](#advanced-mongoose-features-virtuals)

[Advanced mongoose features: custom setters + sorting by currency](#advanced-mongoose-features-custom-setters--sorting-by-currency)


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


<pre>
                              ELECTRONICS
                             /            \  
                            /              \
                           /                \
                         PHONE            COMPUTER   
                        /     \           /       \
                       /       \         /         \
                    Android  iPhone    Apple       PC
                                         |         / \ 
                                         |        /   \
                                    Macbook Pro  Dell  HP
</pre>                

One way your retail application will enable users to discover new products is through a category hierarchy.

Your user will be able to query for a list of all products under the category phones, which will include results for both Android and iOS.

Your user will also be able to drill down into more specific categories like phones that run iOS or the more general category of electronics.

With this in mind, you need to design your category schema in order to be able to efficiently answer the question which products are in the electronics category, as well as the question which products are in the iOS category.

In addition, you want to be able to efficiently answer the question what categories is iOS a subcategory of in order to enable users to browse the category hierarchy.

For instance, if you're looking at the laptops category, but decide you need something with a bit more processing power you should be able to navigate up to the Computers category and look at the subcategories.

The most efficient way to do this is to store an array with all of the ancestor categories in each category document.

The ancestor categories are all the categories that are above the given category in this tree.

For instance, the iOS category's ancestors are electronics and phones.
So the document will have an array that contains electronics and phones.

Here's how this schema looks in Mongoose.

```java
    var categorySchema = {
        _id: { type: String },
        parent: {
            type: String,
            ref: 'Category'
        },
        ancestors: [{
            type: String,
            ref: 'Category'
        }]
    };
```
The underscore ID field will double as the category name.
For instance, books or electronics.
There is a parent field, which references the parent category.
And then there's also a list of the ancestor categories.

With multikey indexes, you now have an efficient way to answer questions like, what are all the subcategories of electronics, what are the child categories of phones, and what are the ancestry categories of Android.

To find all categories that are subcategories of electronics, you would search for documents where the ancestors array contains the string electronics.

As you can see, you get back phones, electronics,
and Android.

To find categories that are child categories of phones, you would search for documents where the parent field is equal to the string phones.

You need this separate field because MongoDB does not currently have a way to query for elements where the last element of the ancestor's array is equal to phones.

Finding the ancestor categories of Android is trivial.
The Android document has this data embedded so all you need to do is query for the document.

Recall that you also embedded this category schema in the product schema that you learned about in the product schema lesson.

Mongoose's support for embedding schemas and other schemas is somewhat limited, but you can reuse the schema by exporting a plain JavaScript object and then reusing it in the products schema.

In other words, in category.js, you export this category schema variable, which is a plain old JavaScript object in addition to this Mongoose schema, and then reuse it in the product scheme.

With this design, the good features of the category schema also apply to the product schema.

In particular, finding all products under the phones category is simple and efficient.

All you need to do is find products where category.acnestors contains phones,
and you get back the iPhone 6.

It's simple and efficient just like finding all subcategories of the phones category.

## Retail application schema: user and cart

The third and final schema that you will use in the retail application is the user schema.

```javascript
    module.exports = new mongoose.Schema({
      profile: {
        username: {
          type: String,
          required: true,
          lowercase: true
        },
        picture: {
          type: String,
          required: true,
          match: /^http:\/\//i
        }
      },
      data: {
        oauth: { type: String, required: true },
        cart: [{
          product: {
            type: mongoose.Schema.Types.ObjectId
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1
          }
        }]
      }
    });
```

This schema defines the data that you'll store about individual users.
The user document will contain the user's username, their profile picture, their Facebook oauth ID, and the list of products in their cart.

The Facebook oauth ID is the string that will serve as a unique identifier for this user's Facebook account.

This will allow your users to log in with Facebook.
User and product have a many-to-may relationship.

A product can be in many carts, and the user can have multiple products in their cart.

Users will typically have a small number of items in their car.

But hopefully, your retail site will have millions of users buying millions of products, so a single product may be in thousands of carts at the same time.

By the principle of least cardinality, as long as you assume that a user isn't likely to have more than 5 to 10 products in their cart, you can embed the list of product IDs in the cart sub documents.

The user schema is pretty simple, but it introduces one key concept about MongoDB access control.

In the product and category schemas, there was no sensitive information.
You don't want to hide a product's price from any user.
However, the user schema does have some sensitive information.

In particular, you'd want to hide the user's cart because you don't want users to be able to see what other users are about to buy.

You also want to hide the user's oauth ID, which will link the user's account to their Facebook profile.

Unlike SQL databases, MongDB doesn't have any built-in notion of access control.

That is there's no way to tell MongoDB that only this user has access to these fields in this collection.

However, the ability to nest documents in other documents provides your application an intuitive way to implement access control.

MongDB queries have a notion of a projection, which enables you to hide fields from the output of a query.

So when you do find one without any parameters, you get back the whole document.

But when you do findOne with no criteria, but a projection that says to exclude the data of sub document, you get back a document that excludes this data sub document.

Thus your application can use projections to make sure publicly facing code doesn't show a user's cart or oauth ID.

Conversely, there are some fields you want to prevent your user from editing.

For instance, you never want your user to mistakenly edit their oauth ID.
That could break their log-in functionality.

The preferred way to achieve this with the MEAN stack is also through sub-documents.

For instance, suppose you had a function called Modify User Profile.

Suppose this function, you only wanted to use it to modify the user's profile.

It should not touch the user's oauth ID or a cart.
You can achieve this by only assigning to the profile sub-document, as shown.

There is no way that the user can use this modify user profile function to modify the oauth ID or the cart.

However, if you were to add fields to the profile, say, a job title field, then this modify user profile function would have to change.


## Advanced mongoose features: virtuals

Mongoose has numerous handy features that make it an indispensable tool for web development to Node.js.

Virtuals are one such feature.
Virtuals are properties that are typically computed from other properties.
They are not persisted to the database, but they can be accessed just like any other property.

Displaying the price of a product is a good example of where virtuals shine.
Displaying a price as, say, 25 USD is not a very good choice for user experience.

25 preceded by a dollar sign is a more professional looking choice.

```javascript
    /*
     * Human-readable string form of price - "$25" rather
     * than "25 USD"
     */
    schema.virtual('displayPrice').get(function() {
        return currencySymbols[this.price.currency] + '' + this.price.amount;
    });
```
To declare a virtual you use this virtual function on your schema.

You can then declare a getter function that tells Mongoose how to compute this property.

In this case, the getter function converts the currency into a symbol
and then concatenates the numeric price.

You could achieve the same effect with a helper function.

However, virtuals have some nice properties that make them a more convenient choice than helper functions.

First of all, the display price virtual will be exposed as a plain old property on product documents.

There's no need for any actual function calls.

```javascript
    schema.set('toObject', { virtuals: true });
    schema.set('toJSON', { virtuals: true });
```
Secondly, notice these two object toObject and toJSON properties that you're setting on your schema.

The toObject and toJSON functions are Mongoose's methods for converting a Mongoose document into a plain old JavaScript object.

The difference between these two functions is that JavaScript's built in ``` JSON.stringify ```, function which converts a JavaScript object into JSON string, first looks for a toJSON function on the object and then uses that output.

Now, by default, toObject and toJSON do not include virtuals.

But if you set this virtual true property on toObject and toJSON, your schema will be configured to include virtuals in the toObject and toJSON outputs.

This means that calling ``` JSON.stringify ``` on a product document will produce string output that includes this display price virtual.

In addition, the JavaScript object returned by toObject will also include the display price property.

Let's see what the output of the ``` JSON.stringify ``` function looks like when you call it with the product object.

As you can see, the output includes this display price virtual.
This is very useful when you go through the rest API chapter because this will enable your rest API to send computed virtuals along with your documents to the angular JS client.

## Advanced mongoose features: custom setters + sorting by currency

Your product schema supports different currencies.
Products can list their price in either US dollars, euro dollars, or British pound sterling.

You may be wondering, how will you be able to ensure a consistent sort order when products have different currencies?
For instance, 95 euros would be less than $100 in March, 2015.

However, as the euro rebounded against the dollar, 95 euros would be more than 100 US dollars in May, 2015.

Your REST API will be able to account for these differences and ensure that products are sorted using a recent exchange rate.

How will the REST API do this?
By utilizing the store what you query form principle.

In order to ensure consistency when sorting by price, what you want is a numeric field that represents the price of the product in a fixed currency.

This ```approximatePriceUSD``` field will represent the product's price in US dollars.

With Mongoose and a set of exchange rates, you'll be able to keep the product's price in sync with the product's price in USD, which will enable you to sort by price effectively.

The Mongoose feature that will enable you to do this is custom setters.
With custom setters you can tell Mongoose to perform certain operations every time the value of a certain field is set.

In this case, every time somebody sets the price dot amount field, Mongoose executes this function.

```javascript
    set: function(v) {
      this.internal.approximatePriceUSD = v / (fx()[this.price.currency] || 1);
      return v;
```
In this case, this function updates the internal.approximatePriceUSD property to reflect the changes in the price dot amount.

The way your schema computes the ```internal.approximatePriceUSD``` field is by taking the provided price and dividing it by the exchange rate defined by this fx function.

```javascript
      set: function(v) {
        this.internal.approximatePriceUSD = this.price.amount / (fx()[v] || 1);
        return v;
      }
```
The custom setter for price stock currency works in a similar way, only it uses the newly set currency and the current value of price dot amount.

The exchange rate is pulled from this fx function.
And the fx function is required in from a file called fx.js.

Let's take a look at what fx.js looks like. 

```javascript
    module.exports = function() {
      return {
        USD: 1,
        EUR: 1.1,
        GBP: 1.5
      };
    };
```
As you can see, this fx file exports a function that returns some hard coded exchange rates that are reasonable approximations.

In the REST API chapter, you will make this dynamic.
But for this example, the hard coded rates are sufficient.

Now, that you've seen how the fx function works, let's see this custom setter in action.

```javascript
    var p = new Product({
      name: 'test',
      price: {
        amount: 5,
        currency: 'USD'
      },
      category: {
        name: 'test'
      }
    });

    console.log(p.internal.approximatePriceUSD); // 5

    p.price.amount = 88;
    console.log(p.internal.approximatePriceUSD); // 88

    p.price.currency = 'EUR';
    console.log(p.internal.approximatePriceUSD); // 80
    p.price.amount = 11;
    console.log(p.internal.approximatePriceUSD); // 10

```

In this example, you create a new product, much like in previous examples.
Then you can start manipulating the price in currency and see what happens to the ```internal.approximatePriceUSD``` field.

Initially, price dot amount is 5 and price dot currency is USD.
That means that ```internal.approximatePriceUSD``` is initially 5.

When you change price dot amount to 88, ```internal.approximatePriceUSD``` gets updated to 88 as well.

Now, when you do something tricky and change the currency to euros, ```internal.approximatePriceUSD``` gets updated to 80, which is 88 divided by 1.1, which is the exchange rate defined in fx.js.

After that, when you change the price dot amount to 11, ```internal.approximatePriceUSD``` becomes 10, which is 11 divided by 1.1.

The power of custom setters is that you don't have to do anything special in the code that uses the product schema.

You don't have to call any functions or even be aware of the fact that ```internal.approximatePriceUSD``` is changing.

The Mongoose schema abstracts away that layer of business logic.
So all you're doing is setting properties, and Mongoose takes care of the rest.



we restrict access to our API with what's known as an API key.
Sometimes we use both tokens and sometimes we use what's called JSON Web Tokens or JWT.

API key is a string value that we use for two purposes.

The first is as a unique identifier for your project, for your application, so that the server you're

making a request do from your application knows which application that request came from.

And the second purpose of API keys is to grant and restrict access to some API API keys are usually

used when the users of your API are developers trying to enable some functionality in their application

that makes use of the features that you've already exposed in your API.

JWT ~

JWT keys, are a type of access.

Token access tokens are much like API keys.

They uniquely identify a specific user of an application.

But more than that, they act as a set of credentials for that user to grant access to an API.

The JWT token is just the data in the JSON object encoded in base64, every JWT can be broken down into

three sections.

The header, the payload and the signature.

The header is set in this red JSON object over here.

Cookies ~
These are values that are usually set by the server, which are sent to the server. Any time your browser makes the request to that site

Cookies are a way of storing data in your browser that gets sent to the server whenever you make a request against it.

Both cookies and tokens sent in the authorization header provide two different ways of passing authentication

data to the server.

They're both often used to prove to the server who is browsing that site

Serializing means saving our user data to a cookie that's going to be passed around to our users

browser and deserializing means loading that user data from that cookie into a value that we can read inside of our express API

Sessions ~

Sessions are a way of storing data about the current active user.

This could be something like the name of a user or what page of a site they last visited.

sessions tend to be tied to a specific browser and the temporary state of the application on

that browser.

we use Sessions to store temporary user data as that user is using our application.

Sessions are most often used to store data about the current user who is logged in to our web application

in their browser.

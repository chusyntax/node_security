//HTTPS uses the SSL and TLS protocols to encrypt our HTTP connections.
// For our data to be encrypted, we need what's called a SSL or TLS certificate.
//This is a type of digital certificate that's used to verify the server's ownership prior to any encrypted data being sent.

const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session')
const {Strategy} = require('passport-google-oauth2')

require('dotenv').config();

const PORT = 3000;

const config = {
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET :process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS ={
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done){
    console.log('Google profile', profile);
    done(null, profile)
}


passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))


//Save session to cookie
passport.serializeUser((user, done)=>{
done(null, user.id)
})

//Read session from the cookie
passport.deserializeUser((id, done)=>{
    done(null,id)
})

const app = express();


app.use(helmet()); //We call helmet here so that all our functions that come after this pass through the Helmet.js middlewear 

//This is middleware, so we're going to add it right above the passport initialize call. Because the session needs to be set up before passport uses it, but we want helmet to check our headers before we do anything with the session.
app.use(cookieSession({
    name:'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]// Always a good idea to have two keys in case/need of key rotation. ALso not a good idea to hard code keyshere. use dotenv
}))

app.use(passport.initialize());

//Authenticates session being sent to our server
app.use(passport.session())

function checkLoggedIn(req,res,next){
    console.log("Current user is:", req.user)
    const isLoggedIn = req.isAuthenticated() &&  req.user;
    if(!isLoggedIn){
        return res.status(401).json({
            error:"You must log in!"
        });
    }
    next();
}

app.get('/auth/google',
passport.authenticate('google',{
    scope:['email'],
})
)


app.get('/auth/google/callback', 
passport.authenticate('google',{
    failureRedirect:'/failure',
    successRedirect:'/',
    session: true,
    
}),
(req, res)=>{
    console.log("Google called us back!")
}
);

app.get('/auth/logout', (req, res)=>{
    req.logout();
    return res.redirect('/');
});

//This is how we restrict access to our APIs and how we do authorisation in Node
app.get('/secret',checkLoggedIn, (req, res)=>{
    return res.send('Your personal secret value is 42!');
});

app.get('/failure',(req, res)=>{
    return res.send('Failed to log in!')
})

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


// what we do with HTTPS is we pass in this cert option, which is a string containing a path to that certificate, as well as this key, which contains a secret used when we encrypt our data.
https.createServer({
    key: fs.readFileSync('key.pem'),
    cert:fs.readFileSync('cert.pem'),
},app).listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`)
})


// When we have open SSL on our machines, we can go into our terminal. And generate a self-signed certificate by running the open SSL command and pass in R e q to request a new certificate. We use the Dash X five zero nine option to tell us that it's a self-signed certificate with a Dash new key that contains that secret used in our encryption. This is also known as the private key, which uses the RSA encryption format, where RSA is one of the strongest forms of encryption which much of today's technology relies on with RSA. We can specify the size of the key that is the amount of bits which the data in that key takes up. Generally, a larger key size means that our encryption is stronger, so we want really strong encryption here, which means we'll say 4000 and 96 bits is how large our key will be. This is a common value. We can specify the Dash No DNS option, which allows us to access this new private key without needing to assign a password to access it. Since we're just using this new self-signed certificate for development, a password is not necessary and it'll just add more typing work for us. So that's why we pass in Dash No DNS. And with those options set up, we can now say that the key should live in a file.
// So Dash key out the output of our key, we'll go into Key Dot p.m.. P.M. is a common format you'll see used for certificates, both for the private key as well as the actual certificates, which we create with just the dash out flag. And we specify the name of our certificate file, which can be something like Cert Dot p.m.. So now the result of this command will be two files. The private key and the certificate, this certificate, which is public and which our browser will check to check the ownership of our server. And last but not least, we specify how long the certificate is valid for. So in days, we'll say that for our purposes, 365 days is how long this self-signed cert will be valid for. After that, we need to generate a fresh one if we don't specify the number of days here. It's usually only 30 days.

//This key contains what appears to be 4000 and 96 bits that ensure that were the only ones encrypting data for this server, so ownership of the key means that we're allowed to encrypt data for the server identified by the Cert. And vice versa, the certificates actually allows you to decrypt data encrypted with this key. So that's what the browser would do. It decrypt the data sent from the server encrypted with the private key using the data contained in that certificate, which is why the browser requires access to this public certificate.This approach that I'm describing is what's known as public key cryptography.

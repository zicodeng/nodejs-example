// @ts-check
// Put interpreter into strict mode.
'use strict';

// Require the express and morgan packages.
const express = require('express');
const morgan = require('morgan');

// Create a new express application.
const app = express();

// Read ADDR Environment Variable.

const addr = process.env.ADDR || ':80';
// Split host and port using destructuring.
const [host, port] = addr.split(':');
const portNum = parseInt(port);

// Adding the Middleware.
// ORDER MATTERS!

// As opposed to middleware in Go,
// each of these middleware handler functions are being added
// to a "chain of functions" that are called during each request.
// When the first one finishes, it specifically tells Express to
// call the next function in the chain.
// If a handler function in the chain doesn't tell Express to
// call the next handler in the chain, the processing of the request ends.

// Global middleware that should be invoked on every request
// are added using app.use().

// Add JSON request body parsing middleware.
app.use(express.json());
// Add the request logging middleware.
app.use(morgan('dev'));

// Adding specific resource Handlers.

// req: an object containing information about the request
// res: an object that lets you send responses back to the client
// next: a function to call if you encounter an error,
// or if you want the remaining handler functions in the chain to be called.

// Handler for HTTP GET method.
app.get('/', (req, res, next) => {
    res.set('Content-Type', 'text/plain');
    res.send('Hello, Node.js!');
});

// Handler for *any* HTTP method.
app.use('/any', (req, res, next) => {
    // Req.method contains the actual request method.
    switch (req.method) {
    //...cases for different methods.
    }
});

// This handler responds JSON.
app.get('/person', (req, res, next) => {
    let person = {
        name: 'Zico Deng',
        age: 21
    };

    // Write those to the client, encoded in JSON.
    // Content-Type header application/json is automatically added.
    res.json(person);
});

// Receive resource path parameters.
app.get('/channels/:chanid', (req, res, next) => {
    // Actual channel ID value is in req.params.chanid
    res.set('Content-Type', 'text/plain');
    res.send(`Channel number: ${req.params.chanid}`);
});

// Error Handling.

// Error handler needs to be placed at the END.
// It will be called if any handler earlier in the chain throws
// an exception or passes an error to next().
app.use((err, req, res, next) => {
    // Write a stack trace to standard out,
    // which writes to the server's log.
    console.error(err.stack);

    // But only report the error message
    // to the client, with a 500 status code.
    res.set('Content-Type', 'text/plain');
    res.status(500).send(err.message);
});

// Start Listening for Requests.

// Start the server listening on host:port.
app.listen(portNum, host, () => {
    //callback is executed once server is listening
    console.log(`server is listening at http://${addr}...`);
});

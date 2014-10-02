// server.js
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    PORT  =  process.env.PORT || 12345;

// models
var bookmodel = require('./bookmodel');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


//=========================================================
// Router
//
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(req.body.name);
    next(); // make sure we go to the next routes and don't stop here
});

// default get
router.get('/', function (req, res) {
    res.json({message: 'Book API is running!'});
});

// API /api/bears 
router.route('/books')
    .post( bookmodel.addBook )
    .get( bookmodel.getAllBooks )
    ;
// API /api/bears/:id
router.route('/books/:id')
    .get( bookmodel.getBookById )
    .put( bookmodel.updateBook )
    .delete( bookmodel.deleteBookById )
    ;

//
//------------------------------------------------------->

// uri prefix
app.use('/api', router);

//
// STARTS
//
app.listen(PORT,  function()  {    
    console.log('Server Running at http://localhost:'  +  PORT);  
}); 
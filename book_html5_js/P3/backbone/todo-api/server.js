// server.js
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    PORT  =  process.env.PORT || 12345;

// database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tododb');


// models
var todos = require('./models/todo');


// use body-parser middleware
// body-parser@1.6.1 & express@4.8.1 상태에서 deprecated 에러
// app.use(bodyParser);//Now deprecated
// - body-parser deprecated bodyParser: use individual json/urlencoded middlewares
// 아래 같이 개별적으로 사용해야 한다.

// http://goo.gl/MLUs4K
//
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static( __dirname, 'html'));

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
    res.json({message: 'hooray! welcome to our api!'});
});

// API /api/todos 
router.route('/todos')
    .post( todos.addTodo )
    .get( todos.getAllTodos )
    ;
// API /api/todos/:id
router.route('/todos/:id')
    .get( todos.getTodoById )
    .put( todos.updateTodo )
    .delete( todos.deleteTodoById )
    ;

// Web router
// var appRouter = express.Router();
// appRouter.get("/", function(req, res) {
//    res.sendfile("todo-tutorial6.html");
// });
//
//------------------------------------------------------->


//=========================================================
// register our routes that prefixed with /api to app.
app.use('/api', router);
//app.use('/', appRouter);

//
// STARTS
//
app.listen(PORT,  function()  {    
    console.log('Server Running at http://localhost:'  +  PORT);  
}); 

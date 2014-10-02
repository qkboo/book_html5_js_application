var mongoose = require('mongoose');

//Schemas
var TodoSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});
// Models
var TodoModel = mongoose.model( 'Todo', TodoSchema);


exports.getAllTodos = function(req, res) {
    console.log( 'GET /api/todos' );

    return TodoModel.find( function( err, todos ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        }
        //return res.send( todos );
        return res.json( todos );
    });
};

// wines/:id -  GET / id로 선택된 wine 정보얻기 
exports.getTodoById = function(req, res) {
    return TodoModel.findById(req.params.id, function(err, todo) {
        if (err)
            res.send(err);
        //res.send(todo); 
        res.json(todo);
    });
};

// POST:insert
exports.addTodo = function(req, res) {

	console.log("add todo : " + req.body.title );

    var _todo = new TodoModel();
    _todo.title = req.body.title;
    return _todo.save( function( err ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        }
    	return res.json( _todo );
    });
};

// PUT / id의 정보 갱신
exports.updateTodo = function(req, res) {
    TodoModel.findById(req.params.id, function(err, todo) {

        if (err)
            return res.send(err);

        todo.title = req.body.title;

        todo.save(function(err) {
            if (err)
                return res.send(err);

            return res.json({ name: todo.title, message: 'Todo updated!' });
        });

    });
};

// DELETE
exports.deleteTodoById = function(req, res) {
	console.log("Deleting a todo :" + req.params.id);
	return TodoModel.remove( {_id: req.params.id}, function( err, todo ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        } else {
            return res.json( { message:"ID("+req.params.id+") Successfully deleted!"} );
        }
    });
};


//=================================================================
// pending open
var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log("Database opend!!!!");
    TodoModel.findOne({title: "재미있는 front-end 프로그래밍"}, function(err,obj) { 
     if(!obj) {
        (function() {
            var _todos = [
            {
                title: "재미있는 front-end 프로그래밍",
                completed: false,
            },
            {
                title: "BackboneJS에서 AngularJS까지",
                completed: false,
            }];
         
            TodoModel.create( _todos, function(err, a, b) {
                console.log(a.title + " inserted");
                console.log(b.title + " inserted");
            });

        })();
        console.log("============>   Default data set inserted. <===========");
     }
    });
});

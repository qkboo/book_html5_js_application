var mongoose = require('mongoose');


// connect to db
mongoose.connect('mongodb://localhost/book_database');

//Schemas
var keywords = new mongoose.Schema({
    keyword: String
});
var BookScheme = new mongoose.Schema({
    title: String,
    author: String,
    year: String,
    keywords: [keywords]
});

// Models
var BookModel = mongoose.model( 'Book', BookScheme);


exports.getAllBooks = function(req, res) {
    console.log( 'GET /api/books' );

    return BookModel.find( function( err, books ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        }
        return res.send( books );
    });
};

// wines/:id -  GET / id로 선택된 book 정보얻기 
exports.getBookById = function(req, res) {
    return BookModel.findById(req.params.id, function(err, book) {
        if (err)
            res.send(err);
        res.send(book); // res.json()
    });
};

// POST:insert
exports.addBook = function(req, res) {

	console.log("Adding a Book: " + req.body.title );

    var book = new BookModel();
    book.title = req.body.title;
    book.author = req.body.author;
    book.year = req.body.year;
    return book.save( function( err ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        }
    	return res.send( book);
    });
};

// PUT / id의 정보 갱신
exports.updateBook = function(req, res) {
// use our book model to find the book we want
    BookModel.findById(req.params.id, function(err, book) {

        if (err)
            return res.send(err);

        book.title = req.body.title;  // update 

        // save the book
        book.save(function(err) {
            if (err)
                return res.send(err);

            return res.json({ title: book.title, message: 'Book updated!' });
        });

    });
};

// DELETE
exports.deleteBookById = function(req, res) {
	console.log("Deleting a book:" + req.params.id);
	return BookModel.remove( {_id: req.params.id}, function( err, book ) {
        if( err ) {
            console.log( err );
            return res.send(err);
        } else {
            return res.json( {message:"ID("+req.params.id+") Successfully deleted!"} );
        }
    });
};


//=================================================================
// Sample data
var db = mongoose.connection;
db.once('open', function callback() {
    console.log("Database opend!!!!");
    BookModel.findOne({name: "게임회사 여직원"}, function(err,obj) { 
     if(!obj) {
         populateDB();
         console.log("============>   Default data set inserted!!!");
     }

    });
});


var populateDB = function() {
 
    var _books = [
    {
        title: "게임회사 여직원",
        year: "2014",
        country: "대한민국",
        author: "마시멜",
        description: "게임회사 여직원의 일상생활을 소재로 20-30대의 많은 공감을 이끌어낸 웹툰작가 마시멜의 신작이다. 대한민국의 직장인들, 그리고 게임을 좋아하는 사람들에게 많은 공감을 주는 에피소드들이 알차게 담겨 있다..."
    },
    {
        title: "SketchUp 2014 V-Ray & Layout Reality  ",
        year: "2014",
        author: "마시멜",
        country: "대한민국",
        description: "2014년 새롭게 출시된 SketchUp 2014의 활용에 중점을 두고 있다..."
    }];
 
    BookModel.create( _books, function(err, a, b) {
        console.log(a.title + " inserted");
        console.log(b.title + " inserted");
    });

};


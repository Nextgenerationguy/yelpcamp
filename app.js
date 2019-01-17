var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comments');
var User = require('./models/user.js');
var seedDB = require('./seeds');



mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", 'ejs');
app.use(express.static(__dirname + '/public'));
// PASSPORT CONFIGURATION
// ===========================================================================
app.use(require('express-session')({
    secret: 'I am the best human being',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
// ===========================================================================

seedDB();
// Schema Setup

// Campground.create({
//     name: 'Bir Biling', 
//     image:'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
// }, function(err, campgound){
//     if(err){
//         console.log(err);
//     } else {
//         console.log('Newly Created Camp Ground');
//         console.log(campgound);
//     }
// });

// var campgrounds = [
//     {name: 'Mount Abu', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Bir Biling', image:'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Kasauli', image:'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Manali', image:'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Mount Abu', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Bir Biling', image:'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Kasauli', image:'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Manali', image:'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Mount Abu', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Bir Biling', image:'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Kasauli', image:'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
//     {name: 'Manali', image:'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
// ]

app.get('/', function(req, res){
    res.render('landing');
});
// INDEX - show all the campgrounds
app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - add new campgrounds
app.post('/campgrounds', function(req, res){
    var name= req.body.name;
    var image= req.body.image;
    var description=req.body.description;
    var newCampGround= {name: name, image: image, description: description};
    Campground.create(newCampGround, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else{
            res.redirect('/campgrounds');
        }
    });
});

// NEW - Create new CampGrounds
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

// SHOW - Shows more information about one particular Campground
// Note: SHOW always comes after NEW
app.get('/campgrounds/:id', function(req, res){
    // Find the campground with Provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else{
            // Render Show Tempelate with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// ============================================
// COMMENTS ROUTES

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
    // find Campgrounds by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        } else{
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments',isLoggedIn, function(req, res){
    // Find Campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            // Create a new Comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                // Connect a new comment to Campground
                campground.comments.push(comment);
                campground.save();
                // Redirect to the Campground Show page
                res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
// ===============================================
// AUTH ROUTES
// ================================================

// Show register form
app.get('/register', function(req, res){
    res.render('register');
});

// Handle Sign up Logic
app.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        })
    });
});

// Show Login Form
app.get('/login', function(req, res){
    res.render('login');
});

// Handle Login Logic
app.post('/login',passport.authenticate('local', 
{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){});

// LogOut route
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});
// ================================================
// MIDDLEWARE
// =================================================
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}

// =================================================
app.listen(3000, function(){
    console.log('YelpCamp server has started');
});
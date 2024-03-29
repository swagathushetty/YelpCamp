var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require('mongoose');
var flash=require('connect-flash')
var passport=require('passport')
var LocalStratergy=require("passport-local")
var methodOverride=require('method-override')
var CampGround=require("./models/campground")
var Comment=require("./models/comment")
var User =require("./models/user")
var seedDB=require("./seeds")

var commentRoutes=require("./routes/comments")
var campgroundRoutes=require("./routes/campgrounds")
var indexRoutes=require('./routes/index')

mongoose.connect("mongodb+srv://swagath:1q2w3e4r@cluster0-pqkas.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true})); //dont worry simply memorise
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public")) 
app.use(methodOverride("_method"))
app.use(flash())

// seedDB(); //seed the DB

//Passport Config
app.use(require("express-session")({
	secret:"Once again Rusty wins cutest dog",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate())) //User.auth function comes from passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error")
	res.locals.success=req.flash("success")
	next();
})


app.use(indexRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("yelpcamp server has started");
});
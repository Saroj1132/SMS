var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash=require('connect-flash')
var toastr=require('express-toastr')
const session=require('express-session')
const mongoose=require('mongoose')
const key=require('./config/key')
var AdminIndex=require('./routes/Admin/Admin_index')
var TeacherIndex=require('./routes/Teacher/Teacher_index')
var StudentIndex=require('./routes/Student/Student_index')

var app = express();
mongoose.connect(key.url, (err, db)=>{
  console.log("Connectiong to db")
})

app.use(session({
  secret:'sessiondatata',
  saveUninitialized:true,
  resave:false
}))

app.use(toastr())
app.use(flash())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Admin', AdminIndex)
app.use('/Student', StudentIndex)
app.use('/Teacher', TeacherIndex)

app.listen(3000)

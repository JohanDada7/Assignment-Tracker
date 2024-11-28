const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const SESSION_SECRET = "6eb1cccc917abd353ec5db9b7090f972ec6aec1ff1a73aa95a0147e283baa556beac75e1b6e92d48f00a432b0389b97214156a2ab279c59faf5c5374cc83e361";
// Validate SESSION_SECRET
if (!SESSION_SECRET) {
  console.error('FATAL ERROR: SESSION_SECRET is not defined');
  process.exit(1);
}

// Session Configuration with more options
app.use(session({
  secret: process.env.SESSION_SECRET, // Required
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash Messages
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

// Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/', assignmentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : ''
  });
});

let mongoose = require('mongoose');
let DB = require('./db');
// point my mongoose to the URI
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'))
mongoDB.once('open',()=>{
  console.log('MongoDB Connected')
})
mongoose.connect(DB.URI,{useNewURIParser:true,
  useUnifiedTopology:true
})


// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

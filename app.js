require('dotenv').config()
const express = require('express');
// const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000
const connectDB = require('./db/connect');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();



// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://ahmedMakhlouf:ahmedMakhlouf@cluster0.stjwlfq.mongodb.net/node-tuts?retryWrites=true&w=majority';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//   .then((result) => console.log(`Connected to db... `))
//   .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)


// cookies
// app.get('/set-cookies', (req,res) => {
//   res.cookie('newUser',false)
//   res.cookie('isEmployee',true, {httpOnly: true})
//   res.send('You got the Cookies')
// })


// app.get('/read-cookies', (req,res) => {
//   const cookies = req.cookies;
//   // console.log(cookies.newUser);
//   res.json(cookies)
// })


const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server is listening on PORT ${PORT}...`)
    );
    await connectDB(process.env.MONGO_URI)
  } catch (error) {
    console.log(error);
  }
};

start();
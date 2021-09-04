// express and nodemailer dependency
const express = require('express');
const app = express();
const nodemailer = require("nodemailer")

// ejs setup view engine
app.set('view engine', "ejs")

// body parser
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// static folder
app.use(express.static(__dirname + '/public'));

// users mongoDB dependency
const mongoose = require('mongoose')
const User = require('./models/user')

// mongoDB connection
const dbURL = 'your-mongoDB-url'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(res=> app.listen(3000))
  .then(res => console.log('db connected'))
  .catch(err => console.error(err))

//manually adding user
app.get('/add-user', (req, res) => {
  const user = new User({
    name: 'FULL NAME',
    branch: 'IT',
    roll: '69',
    year: 'TE',
    email: 'email@gmail.com'
  })

  user.save()
    .then(result => {
      res.send(result)
    })
    .catch(err => console.error(err))
})

// all users
app.get('/all-users', (req, res) => {
  User.find().sort({ createdAt: 1 })
    .then(result => {
      res.render('all-users', { data: result })
      // res.send(result)
    })
    .catch(err => console.error(err))
})

// send mail 
const sendMail = data => {
  const output = `
<h3>YOUR response</h3>
<ul>  
  <li>Name: ${data.name}</li>
  <li>Roll No: ${data.roll}</li>
  <li>Email: ${data.email}</li>
  <li>Year: ${data.year}</li>
  <li>Branch: ${data.branch}</li>
</ul>
<h3>Message</h3>
`;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //for gmail
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'gmail-acc', // generated ethereal user
      pass: 'gmail-password'  // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  let mailOptions = {
    from: '"From Nodemailer ft. Kaartik" <gmail-acc>', // sender address
    to: data.email, // list of receivers
    subject: `Hey , ${data.name}`, // Subject line
    text: 'How you doin', // plain text body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log(info.response);
  });

}

// post method (form)
app.post('/users', (req, res) => {
  console.log(req.body);
  const user = new User(req.body)
  user.save()
    .then(result => {
      console.log('user added!');
      res.send(result)
    })
    .catch(err => console.error(err))
  sendMail(req.body)
})

// render html
app.get('/', (req, res) => {
  res.render('index');
})

app.listen(3000)
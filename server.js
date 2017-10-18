require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path')

const {PORT, DATABASE_URL} = require('./config');
const {userRouter} = require('./routes/userRouter');
const {appRouter} = require('./routes/appRouter');
const {authRouter, basicStrategy, jwtStrategy} = require('./routes/authRouter');
const {songRouter} = require('./routes/songRouter');
const {eventRouter} = require('./routes/eventRouter')

mongoose.Promise = global.Promise;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), {index: '_'}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(basicStrategy);
// passport.use(jwtStrategy);
app.use(morgan('common'));
app.set('view engine', 'ejs');


app.use(flash());
app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.get('/', (req, res) => {
	console.log('hitting slash')
	res.render('index')
})

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/app', appRouter);
app.use('/songkick', songRouter);
app.use('/myevents', eventRouter)


app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(PORT, () => {
				console.log(`Listening on port ${PORT}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports= {app, runServer, closeServer};
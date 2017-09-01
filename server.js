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

const {PORT, DATABASE_URL} = require('./config')
const {userRouter} = require('./routes/router')
const {appRouter} = require('./routes/appRouter')
const {authRouter, basicStrategy, jwtStrategy} = require('./auth/index');

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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);
app.use(express.static(__dirname + '/public'));
app.use(morgan('common'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
}))

app.use(flash());
app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.use('/api/users/', userRouter);
app.use('/api/auth/', authRouter);
app.use('/app/', appRouter);
app.use('/api/protected', appRouter)

app.get('/api/protected',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		return res.json({
			data: 'It worked'
		});
	})

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
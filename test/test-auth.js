global.DATABASE_URL = 'mongodb://localhost/concert-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../models/users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth Endpoints', function() {
	const username = 'exampleUser';
	const password = 'examplePass';

	before(function() {
		return runServer();
	});

	beforeEach(function() {
		return User.hashPassword(password).then(password =>

			User.create({
				username,
				password
			})
		);
	});

	afterEach(function() {
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('/api/auth/login', function() {
		it('should reject request with no credentials', function() {
			return chai.request(app)
			.post('/api/auth/login')
			.auth('wrongUsername', password)
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(401);
			});
		});
		it('should return a valid auth token', function() {
			return chai.request(app)
			.post('/api/users/login')
			.auth(username, password)
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.a('object');
				const token = res.body.authToken;
				expect(token).to.be.a('string');
				const payload = jwt.verify(token, JWT_SECRET, {
					algorithm: ["HS256"]
				});
				expect(payload.user).to.deep.equal({
					username
				});
			});
		});
	});

	describe('/api/auth/refresh', function() {
		it('should reject request with no credentials', function() {
			return chai.request(app)
			.post('/api/auth/refresh')
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(401);
			});
		});
		it('Should reject request with an invalid token', function() {
			const token = jwt.sign({
				username,
			}, 'wrongSecret', {
				algorithm: 'HS256',
				expiresIn: '7d'
			});

			return chai.request(app)
			.post('/api/auth/refresh')
			.set('Authorization', `Bearer ${token}`)
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(401);
			});
		});
		it('should reject request with expired token', function() {
			const token = jwt.sign({
				user: {
					username,
				},
				exp: Math.floor(Date.now() / 1000) - 10
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username
			});

			return chai.request(app)
			.post('/api/auth/refresh')
			.set('authorization', `Bearer ${token}`)
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(401);
			});
		});
		it('should return a valid auth token with a newer expiry date', function() {
			const token = jwt.sign({
				user: {
					username
				},
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username,
				expiresIn: '7d'
			});
			const decoded = jwt.decode(token);

			return chai.request(app)
			.post('/api/auth/refresh')
			.set('authorization', `Bearer ${token}`)
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.a('object');
				const token = res.body.authToken;
				expect(token).to.be.a('string');
				const payload = jwt.verify(token, JWT_SECRET, {
					algorithm: ["HS256"]
				});
				expect(payload.user).to.deep.equal({
					username
				});
				expect(payload.exp).to.be.at.least(decoded.exp);
			})
		})
	});
});

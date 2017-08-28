global.DATABASE_URL = 'mongodb://localhost/concert-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../models/users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoint', function() {
	const username = 'exampleUser';
	const password = 'examplePass';

	before(function() {
		return runServer();
	});

	beforeEach(function() {
		return User.hashPassword(password).then(password => 
			User.create({
				username,
				password,
			})
		);
	});

	afterEach(function() {
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('/api/protected', function() {
		it('Should reject request with no credentials', function() {
			return chai.request(app)
			.post('/api/protected')
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(404);
			});
		});

		it('should reject request with invalid token', function() {
			const token = jwt.sign({
				username
			}, 'wrongSecret', {
				algorithm: 'HS256',
				expiresIn: '7d'
			});

			return chai.request(app)
			.post('/api/protected')
			then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(404);
			});
		});
		it('should reject request with expired token', function() {
			const token = jwt.sign({
				user: {
					username
				},
				exp: Math.floor(Date.now() / 1000) - 10
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username
			});

			return chai.request(app)
			.post('/api/protected')
			.then(() => expect.fail(null, null, 'Request should not succeed'))
			.catch(err => {
				if (err instanceof chai.AssertionError) {
					throw err;
				}

				const res = err.response;
				expect(res).to.have.status(404);
			});
		});
		it('should send protected data', function() {
			const token = jwt.sign({
				user: {
					username
				}
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username,
				expiresIn: '7d'
			});

			return chai.request(app)
			.post('/api/protected')
			.set('authorization', `Bearer ${token}`)
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.equal('It worked')
			});
		});
	});
});
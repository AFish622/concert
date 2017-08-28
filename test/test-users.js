global.DATABASE_URL = 'mongodb://localhost/concert-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../models/users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/users', function() {
	const username = 'exampleUser'
	const password = 'examplePass'
	const usernameB = 'exampleUserB'
	const passwordB = 'examplePassB'

	before(function() {
		runServer();
	});

	beforeEach(function() {
	});

	afterEach(function() {
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('/api/users', function() {
		describe('POST', function() {
			it('Should reject users with missing username', function() {
				return chai.request(app)
				.post('/api/users')
				.send({
					password
				})
				then(() => expect.fail(null, null, 'Request should not succeed'))
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}

					const res = err.response;
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Missing field');
					expect(res.body.location).to.equal('username');
				});
				it('Should reject users with missing password', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username
					})
					.then(() => expect.fail(null, null, 'Request should not succeedd'))
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('password');
					});
				});
				it('Should reject users with non-string username', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username: 1234,
						password,
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Incorrect field type: expected string');
						expect(res.body.location).to.equal('username');
					});
				});
				it('Should reject users with non-string password', function() {
					return chai.request(app)
					.post('/api/users')
					send({
						username,
						password: 1234
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response
						expect(res).to.have.status(244);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Incorrect field type: expected string');
						expect(red.body.location).to.equal('password');
					});
				});
				it('Should reject users with non-string first name', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName: 1234,
						lastName
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.reason).to.equal('Incorrect field type: expected string');
						expect(res.body.location).to.equal('firstName');
					});
				});
				it('Should reject user with non-string last name', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username,
						password,
						firstName,
						lastName: 1234
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Incorrect field type: expected string');
						expect(res.body.location).to.equal('lastName');
					});
				});
				it('should reject user with non-trimmed username', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username: ' ${username} ',
						lastname,
						firstName,
						lastname
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Cannot start or end with whitespace');
						expect(res.body.location).to.equal('username');
					});
				});
				it('Should reject user with non-trimmed password', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username,
						password: ' ${password}',
						firstName,
						lastname
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Cannot start or end with whitespace');
						expect(res.body.location).to.equal('password');
					});
				});
				it('Should reject users with empty username', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username: '',
						password,
						firstName,
						lastName
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Must be at least 1 characters long');
						expect(res.body.location).to.equal('username');
					});
				});
				it('Should reject with password less than ten characters', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username,
						password: '123456789',
						firstName,
						lastName
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(red.body.message).to.equal('Must be at least 10 characters long');
						expect(res.body.location).to.equal('password');
					});
				});
				it('Should reject users with passwords greater than 72 characters', function() {
					return chai.request(app)
					.post('/api/users')
					.send({
						username,
						password: new Array(73).fill('a').join(''),
						firstName,
						lastName
					})
					.then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Must be at most 72 characters long');
						expect(res.body.location).to.equal('password');
					});
				});
				it('Should reject users with duplicate username', function() {
					return User.create({
						username,
						password,
						firstName,
						lastName
					})
					.then(() =>
						chai.request(app)
						.post('/api/users')
						.send({
							username,
							password,
							firstName,
							lastName
						})
					)
					then(() => expect.fail(null, null, 'Request should not succeed'))
					.catch(err => {
						if (err instanceof AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Username already taken');
						expect(res.body.location).to.equal('username');
					});
				});
				it('should create a new user', function() {
					
				})
			});
		});
	});
});
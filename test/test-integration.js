const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const should = chai.should();
chai.use(chaiHttp)

describe('App', function() {
	it('Should work', function() {
		return chai.request(app)
		res.should.have.status(200);
	})
})
const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js')

const app = server.app;
const should = chai.should();
chai.use(chaiHttp)

describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

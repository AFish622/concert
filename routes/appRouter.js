const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')

const {User} = require('../models/users');

const appRouter = express.Router();
const jsonParser = bodyParser.json();

appRouter.get('/', (req, res) => {
	res.render('index')
});

appRouter.get('/login', (req, res) => {
	res.render('login')
});

appRouter.get('/signup', (req, res) => {
	res.render('signup')
});

appRouter.get('/concert', (req, res) => {
	res.render('concert')
});

appRouter.get('/myEvents', (req, res) => {
	res.render('myEvents')
})


module.exports = {appRouter}









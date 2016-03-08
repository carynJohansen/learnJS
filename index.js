//environment
var express = require('express')
var app = express()
var stylus = require('stylus')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var fs = require('fs')
var jade = require('jade')
var globule = require('globule')
var util = require('util')

//var search = require('./scripts/main.js')

//Database connection
//var sqlite3 = require('sqlite3').verbose()
//var db = new sqlite3.Database('/Users/caryn/Dropbox/Project_RiceGeneticVariation/michael.db')

app.set('port', (process.env.PORT || 5000))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//console.log('hi')

//app.use(express.logger('dev'))
app.use(express.static(__dirname + '/styles'))

app.get('/', function (request, response) {
	//var gene = request.body.genesearch
	//console.log(gene)
    response.render('home', {
    	title:'Home'
    })
})

app.get('/genesearch', function (request, response) {
	//console.log(request.body.genesearch)
	response.render('anotherpage', {
		title: 'Second Page'
	})
})

var template = 'Node app is running at localhost: {port~number}'
var txt = template.replace('{port~number}', app.get('port'))

app.listen(app.get('port'), function() {
    console.log(txt)
})

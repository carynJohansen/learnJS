
/////////////////////////////
////    server side     ////
///////////////////////////

// Environment //

//dependencies
var express = require('express')
var app = express()
var http = require('http')
var path = require('path')
var request = require('request');
var bodyParser = require('body-parser')
var jade = require('jade')
var child = require('child_process')

//Database connection
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('/Users/caryn/Dropbox/Project_RiceGeneticVariation/michael.db')

//port
app.set('port', (process.env.PORT || 5000))

//set views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(express.logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));


// Methods //

app.get('/', function (request, response) {
    response.render('home', {
    	title:'Home'
    })
}) //close get /

app.get('/home', function (request, response) {
	response.render('home', {
		title: 'Gene Search Home'
	})
}) // close get home

app.get('/api/test', function(req, res) {
	var serverInput = req.query.serverInput;
	var output;
	console.log("this is the serverInput", serverInput)
	switch(serverInput) {
		case 'hello':
			output = 'hi';
			break;
		case 'goodbye':
			output = 'fine';
			break;
		default:
			output = 'sad';
	}
	res.json({
		hi: output,
		bee: 'knees'
	});
});

app.post('/genesearch', function (request, response) {
	console.log('you made it to genesearch!')
	response.render('genesearch', {
		title: 'Gene Search'
	})
})

app.get('/genesearch', function (request, response) {
	response.render('genesearch', {
		title: 'Gene Search'
	})
})

app.get('/searching', function (request, response) {
	console.log("this is in the server", geneval)

	function show() {
		console.log('this is in show()')
		var geneval = request.query.geneInput

		gene_vcf_search(geneval).then(function (geneJSON) {
			console.log(geneJSON)
			response.render('represent', { results : geneJSON })
		}) // close promise
	} //close show

	function gene_vcf_search (gene) {
		return new Promise( function (resolve, reject) {
			console.log(gene)
			var python = child.sparn('python', [__dirname + '/python/search_vcf.py', gene])
			var chunk = ''

			python.stdout.on('data', function (data) {
				chunk += data
				fulfill(chunk)
			}) //close stdout

			python.stderr.on('data', function (data) {
				console.log('python err: ' + data)
				response.end('python error in allele counts!' + data)
			}) //close stderr

		}) // close promise
	} // close gene_vcf_search

	show()
	
}) // close searching

app.post('/categorysearch', function (request, response) {
	response.render('catsearch')
})

app.get('/categorysearch', function (request, response) {
	response.render('catsearch')
})

// Listening //

var template = 'Node app is running at localhost: {port~number}'
var txt = template.replace('{port~number}', app.get('port'))

app.listen(app.get('port'), function() {
    console.log(txt)
})

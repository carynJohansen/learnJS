
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
	//response.send('oh hi')
	var geneval = request.query.geneInput //this is for the ajax .get
	console.log("this is in the server", geneval)

//	show_geneval = "<h2>"+geneval+"</h2>"
//	response.send(show_geneval)
	function show() {
		var geneval = request.query.geneInput
		console.log('geneval in show():', geneval)
		gene_vcf_search(geneval).then(function (geneJSON) {
			console.log("length of python result here is:", geneJSON.length)
			response.send(geneJSON)
		}) // close promise
	} //close show
	function gene_vcf_search (gene) {
		return new Promise( function (fulfill, reject) {
			console.log("you are in gene_vcf_search and this is the gene:", gene)
			var python = child.spawn('python', [__dirname + '/public/python/search_vcf.py', gene])
			var data = ''
			python.stdout.on('data', function (chunk) {
				data += chunk
			}) //close stdout
			python.stdout.on('end', function() {
				fulfill(data)
			})
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

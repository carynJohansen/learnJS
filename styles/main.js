var genesearch = document.getElementById("genesearch");
var buttonsearch = document.getElementById("buttonsearch");
var bygene = document.getElementById("bygene")
var bycat = document.getElementById("bycategories")

console.log(genesearch)
console.log(buttonsearch)
console.log(bygene)
console.log(bycat)
//console.log(genesearch.length)

//var input = genesearch.querySelectorAll("input");
//console.log(input)
//var button = genesearch.querySelectorAll("button")
//console.log(button)

genesearch.addEventListener("click", editItem)
genesearch.addEventListener("keypress", searchInputKey)
buttonsearch.addEventListener("click", searchInputClick)
//bygene.addEventListener("click", genesearch)
//bycat.addEventListener("click", catsearch)


function editItem() {
	//var input = this.querySelector("input")
	this.focus()
	console.log("focus occured!!!")
}

function searchInputKey() {
	if (event.which == 13) {
		var gene = this.value
		console.log(gene)
		queryDatabase.call(this.value)
	}
}

function searchInputClick() {
	var gene = genesearch.value
	console.log(gene)
	queryDatabase.call(this.value)
}

function queryDatabase() {
	console.log("gene has been queried! Truth is an inevitable trap.")
}

$( document ).ready(function () {
	$('#bygene').on('click', function() {
		$.ajax({
			url: '/genesearch'
		}).done(function(res) {
			console.log('you have done it!')
	})
	})
})

function catsearch() {
	window.location.href = '/categorysearch'
}

function gohome() {
	window.location.href = '/'
}

$(document).ready(function() {
	$('#test').on('click', function() {
		var input = $('#input-stuff').val();
		console.log('the input stuff is ', input);

		$.ajax({
			url: '/api/test',
			data: {
				serverInput: input
			}
		}).done(function(res) {
			console.log(res);
		});
	});
});
var genesearch = document.getElementById("genesearch");
var buttonsearch = document.getElementById("buttonsearch");
console.log("hi")
console.log(genesearch)
console.log(buttonsearch)
//console.log(genesearch.length)

//var input = genesearch.querySelectorAll("input");
//console.log(input)
//var button = genesearch.querySelectorAll("button")
//console.log(button)

genesearch.addEventListener("click", editItem)
genesearch.addEventListener("keypress", searchInputKey)
buttonsearch.addEventListener("click", searchInputClick)


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
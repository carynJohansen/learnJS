
/////////////////////////////
////    client side     ////
///////////////////////////


$(function () {
	$('#geneClick').on('click', function () {
		var in_gene = $('#geneIn').val()
		console.log('the gene you are searching for is:', in_gene)
		//var parameters = { search : in_gene }
		//console.log(in_gene)
		$.ajax({
			url: '/searching',
			data: {
				geneInput : in_gene
			},
			success: function(data) {
				$("#AJAXresults").html();
			}
		}); //close .ajax
//		$.get('searching', parameters, function (data) {
//			console.log(data)
//			$('#results').html(data);
//		})
	}) //close on click
}); //close initial function
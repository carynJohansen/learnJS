
/////////////////////////////
////    client side     ////
///////////////////////////


$(function () {
	$('#geneClick').on('click', function () {
		var in_gene = $('#geneIn').val()
		console.log('the gene you are searching for is:', in_gene)
		var parameters = { search : in_gene }
		//console.log(in_gene)
		$.ajax({
			url: '/searching',
			data: {
				geneInput : in_gene
			},
			
			success: function(data) {
				var dataParsed = JSON.parse(data)
				console.log(dataParsed)
				console.log("you're in data, and it should be json:", data)
				$(dataParsed).each(function (index, item) {
					console.log(item)
					var ouput = ''
					output += '<tr>'
					output += '<td>' + item.chromosome + '</td>'
					output += '<td>' + item.sample + '</td>'
					output += '<td>' + item.reference + '</td>'
					output += '<td>' + item.alternate + '</td>'
					output += '<td>' + item.position + '</td>'
					output += '<td>'+ item.SNPEFF_effect + '</td>'
					output += '</tr>'
					$('#output').append(output);
				})
				$("#AJAXresults").html(data);
			}
		}); //close .ajax
//		$.get('searching', parameters, function (data) {
//			console.log("this is the client side data")
//			console.log(data)
//			$('#AJAXresults').html(data);
//		}); //close get
	}) //close on click
}); //close initial function
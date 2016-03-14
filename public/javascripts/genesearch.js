
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
				//console.log(dataParsed)
				console.log("you're in client and length of data is:", data.length)
				var output = $('#VCFinfo')
				$(dataParsed).each(function (index, item) {
					console.log(item)
					var rw = '<tr>'
					rw += '<td>' + item.chromosome + '</td>'
					rw += '<td>' + item.sample + '</td>'
					rw += '<td>' + item.position + '</td>'
					rw += '<td>' + item.reference + '</td>'
					rw += '<td>' + item.alternate + '</td>'
					rw += '<td>' + item.genotype + '</td>'
					rw += '<td>'+ item.SNPEFF_effect + '</td>'
					rw += '</tr>'
					console.log(rw)
					output.append(rw);
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
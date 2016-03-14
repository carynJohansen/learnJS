
/////////////////////////////
////    client side     ////
///////////////////////////


$(function () {
	$('#geneClick').on('click', function () {
		$('#searchbox').hide()
		$('#searchresults').show()
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
				var positions = _.keys(_.countBy(dataParsed, function (x) { return x.position}))
				console.log(positions)
				$('#sort_category').on('change', function() {
					if (this.value == 'sample') {
						$('#sample').show()
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
						}) // close dataParsed.each function
					} // close if sample
					if (this.value == 'position') {
						$('#sample').hide()
//						var tablehead = '<table class="table"><thead class="thead-default"><tr><th>Chromosome</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead>'
//						$('#tabs1').append(tablehead)
						var counter = 0
						$(dataParsed).each(function (index, item) {
							counter = counter + 1
							console.log(item.position)
							var tabs = '<li><a href="#' + item.position + '-' + counter + '" data-toggle="tab">' + item.position + '</a></li>'
							console.log(tabs)
							$('#positionTab').append(tabs)
							var rw = '<div class="tab-pane" id="' + item.position + '-' + counter + '">' + item.sample + '</div>'
//							rw += '<td>' + item.chromosome + '</td>'
//							rw += '<td>' + item.sample + '</td>'
//							rw += '<td>' + item.position + '</td>'
//							rw += '<td>' + item.reference + '</td>'
//							rw += '<td>' + item.alternate + '</td>'
//							rw += '<td>' + item.genotype + '</td>'
//							rw += '<td>'+ item.SNPEFF_effect + '</td>'
//							rw += '</tr>'
							$('#tabContent').append(rw);
						}) //close dataParsed each
						$('#position').show()
					} //close if position
				})
				console.log("you're in client and length of data is:", data.length)
//				$("#AJAXresults").html(data);
			} //close success
		}); //close .ajax
	}) //close on click
}); //close initial function

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
							var rw = '<tr>'
							rw += '<td>' + item.chromosome + '</td>'
							rw += '<td>' + item.sample + '</td>'
							rw += '<td>' + item.position + '</td>'
							rw += '<td>' + item.reference + '</td>'
							rw += '<td>' + item.alternate + '</td>'
							rw += '<td>' + item.genotype + '</td>'
							rw += '<td>'+ item.SNPEFF_effect + '</td>'
							rw += '</tr>'
							output.append(rw);
						}) // close dataParsed.each function
					} // close if sample
					if (this.value == 'position') {
						$('#sample').hide()
//						var tablehead = '<table class="table"><thead class="thead-default"><tr><th>Chromosome</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead>'
//						$('#tabs1').append(tablehead)
						var counter = 0
						$(positions).each(function (index, item) {
							console.log(item)
							filteredJSON = dataParsed.filter(function (x) {
								return x.position = item;
							})
							//console.log(filteredJSON)
							var tabs = '<li><a href="#' + item +'" role="tab" data-toggle="tab">' + item + '</a></li>'
							$('#positionTab').append(tabs)
							console.log($('#positionTab'))
							var panel = '<div class="tab-pane" id="' + item + '">'
							$('#tabContent').append(panel)
							var tablehead = '<table class="table"><tr><th>Chromosome</th><th>Sample</th><th>Position' + item + '</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead><tbody id="tbody' + item +'">'
							$('#' + item).append(tablehead)
							$(filteredJSON).each(function (i, elem) {
								console.log(elem.position)
								var rw = '<tr>'
								rw += '<td>' + elem.chromosome + '</td>'
								rw += '<td>' + elem.sample + '</td>'
								rw += '<td>' + elem.position + '</td>'
								rw += '<td>' + elem.reference + '</td>'
								rw += '<td>' + elem.alternate + '</td>'
								rw += '<td>' + elem.genotype + '</td>'
								rw += '<td>'+ elem.SNPEFF_effect + '</td>'
								rw += '</tr>'
								$('#tbody' + item).append(rw)
							})
						}) //close dataParsed each
						$('#position').show()
					} //close if position
					if (this.value == 'SNPEFF_effect') {
						$('#SNPEFF_effect').show()
					}
				})
				console.log("you're in client and length of data is:", data.length)
//				$("#AJAXresults").html(data);
			} //close success
		}); //close .ajax
	}) //close on click
}); //close initial function
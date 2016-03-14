
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
				$('#sort_category').on('change', function() {
					if (this.value == 'sample') {
						$('#sample').show()
//						$('#myTab a').click(function (e) {
//							e.preventDefault()
//							$(this).tab('show')
//						}) // close tab click
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
//						$('#resultsSample').prepend('<div id="tabs1"><ul></ul></div>')
//						var tablehead = '<table class="table"><thead class="thead-default"><tr><th>Chromosome</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead>'
//						$('#tabs1').append(tablehead)
//						$(dataParsed).each(function (index, item) {
//							var tabs = '<li><a href="#tabs1-' + item.sample + '">' + item.sample + '</a></li>'
//							console.log(tabs)
//							$('#tabs1 ul').append(tabs)
//							var rw = ''
//							rw += '<td>' + item.chromosome + '</td>'
//							rw += '<td>' + item.sample + '</td>'
//							rw += '<td>' + item.position + '</td>'
//							rw += '<td>' + item.reference + '</td>'
//							rw += '<td>' + item.alternate + '</td>'
//							rw += '<td>' + item.genotype + '</td>'
//							rw += '<td>'+ item.SNPEFF_effect + '</td>'
//							rw += '</tr>'
//							$('#tabs1').append(rw);
//						}) //close dataParsed each
//						$('#sample').show()
					} 
					if (this.value == 'position') {
						$('#sample').hide()
						$('#position').show()
					}
				}) 
				
				//console.log(dataParsed)
				console.log("you're in client and length of data is:", data.length)
//				$("#AJAXresults").html(data);
			} //close success
		}); //close .ajax
	}) //close on click
}); //close initial function

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
				//console.log(data.data)
				//console.log(data.gene)
				var dataParsed = JSON.parse(data.data)
				//console.log("length of parsed JSON is", dataParsed.length)
				var positions = _.keys(_.countBy(dataParsed, function (x) { return x.position}))
				////console.log(positions)
				var samples = _.keys(_.countBy(dataParsed, function (x) { return x.sample}))
				////console.log(samples)
				var effects = _.keys(_.countBy(dataParsed, function (x) { return x.SNPEFF_effect}))
				////console.log(effects)
				$('#gene').append(data.gene)
				$('#sort_category').on('change', function() {
					if (this.value == 'sample') {
						$('#position').hide()
						$('#SNPEFF_effect').hide()
						if($('#sample').hasClass("loaded")) {
							$('#sample').toggle()
						} else {
							$(samples).each(function (index, item) {
								//console.log(item)
								filteredJSON = dataParsed.filter(function (x, i) {
									return x.sample == item
								})//close json filter
								var drops = '<li><a href="#' + item + '" data-toggle="tab">' + item + '</a></li>'
								$('#sampleTabs').append(drops)
								var panel = '<div class="tab-pane fade" id="' + item + '">'
								$('#sampleContent').append(panel)
								var tablehead = '<table class="table"><tr><th>Chromosome</th><th>Sample</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead><tbody id="tbody' + item +'">'
								$('#' + item).append(tablehead)
								$(filteredJSON).each(function (i, elem) {
									if( elem.genotype == '1/1' || elem.genotype == '0/1' || elem.genotype == '1/0') {
										var rw = '<tr class="has_alt">'
									} else {
										var rw = '<tr>'
									}
									rw += '<td>' + elem.chromosome + '</td>'
									rw += '<td>' + elem.sample + '</td>'
									rw += '<td>' + elem.position + '</td>'
									rw += '<td>' + elem.reference + '</td>'
									rw += '<td>' + elem.alternate + '</td>'
									rw += '<td>' + elem.genotype + '</td>'
									rw += '<td>'+ elem.SNPEFF_effect + '</td>'
									rw += '</tr>'
									$('#tbody'+item).append(rw);
								}) // close dataParsed.each function
							}) // close sample.each()
							$('.btn.btn-default').on('shown.bs.tab', 'a', function (e) {
	        					if (e.relatedTarget) {
	          					$(e.relatedTarget).removeClass('active');
	        					}
	      					}) //close remove dropdown active
							$('#sample').addClass("loaded").show()
						} // close else
					} // close if sample
					if (this.value == 'position') {
						$('#sample').hide()
						$('#SNPEFF_effect').hide()
						if($('#position').hasClass("loaded")) {
							$('#position').toggle()
						} else {
							$(positions).each(function (index, item) {
								//console.log("I am in position, here is item", item)
								var filteredJSON = dataParsed.filter(function (n, i) {
									return n.position == item;
								})
								//console.log("length of filtered JSON:", filteredJSON.length)
								var tabs = '<li><a href="#' + item +'" data-toggle="tab">' + item + '</a></li>'
								$('#positionTabs').append(tabs)
								////console.log($('#positionTab'))
								var panel = '<div class="tab-pane fade" id="' + item + '">'
								$('#positionContent').append(panel)
								var tablehead = '<table class="table"><tr><th>Chromosome</th><th>Sample</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead><tbody id="tbody' + item +'">'
								$('#' + item).append(tablehead)
								$(filteredJSON).each(function (i, elem) {
									////console.log("here is the length element of the filtered JSON:", elem.length)
									//$('#jsontest').append('<p>' + elem + '</p>')
									if( elem.genotype == '1/1' || elem.genotype == '0/1' || elem.genotype == '1/0') {
										var rw = '<tr class="has_alt">'
									} else {
										var rw = '<tr>'
									}
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
							$('#position').addClass("loaded").show()
						} // close else
					} //close if position
					if (this.value == 'SNPEFF_effect') {
						$('#sample').hide()
						$('#position').hide()
						if($('#SNPEFF_effect').hasClass("loaded")) {
							$('#SNPEFF_effect').toggle()
						} else {
							$(effects).each(function (index, item) {
								//console.log(item)
								var filteredJSON = dataParsed.filter(function (x, i) {
									return x.SNPEFF_effect == item;
								})
								var positions_f = _.keys(_.countBy(dataParsed, function (x) { return x.position}))
								//console.log("length of filtered JSON:", filteredJSON.length)
								var tabs = '<li><a href="#' + item +'" data-toggle="tab">' + item + '</a></li>'
								$('#effectTabs').append(tabs)
								////console.log($('#effectTab'))
								var panel = '<div class="tab-pane fade" id="' + item + '">'
								$('#effectContent').append(panel)
								var tablehead = '<table class="table"><tr><th>Chromosome</th><th>Sample</th><th>Position</th><th>Reference</th><th>Alt</th><th>Genotype</th><th>SNPEFF Effect</th></tr></thead><tbody id="tbody' + item +'">'
								$('#' + item).append(tablehead)
								$(filteredJSON).each(function (i, elem) {
									////console.log(elem)
									if( elem.genotype == '1/1' || elem.genotype == '0/1' || elem.genotype == '1/0') {
										var rw = '<tr class="has_alt">'
									} else {
										var rw = '<tr>'
									}
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
							$('#SNPEFF_effect').addClass("loaded").show()
						} // close else
					} //close if SNPEFF_effect
					if (this.value == 'test') {
						$('#sample').hide()
						$('#position').hide()
						$('#test').show()
					} //close test
				})
				//console.log("you're in client and length of data is:", data.length)
//				$("#AJAXresults").html(data);
			} //close success
		}); //close .ajax
	}) //close on click
}); //close initial function
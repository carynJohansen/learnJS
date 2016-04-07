
/////////////////////////////
////    client side     ////
///////////////////////////

$(function () {

	$('#geneSelectInput').on('change', function() {
		if (this.value == 'all_genes') {
			$('#specGeneInput').hide()
		} else if (this.value == 'specific_gene') {
			$('#specGeneInput').show()
		}
	}) //close select change
	
	$('#createQuery').on('click', function () {
		var select = $('#select').val()
		var category = $('#category').val()
		if ($('#geneSelectInput').val() == 'specific_gene') {
			var geneSelectInput = $('#specGeneInput').val()
		} else {
			var geneSelectInput = $('#geneSelectInput').val()
		}
		if (select == null || category == null ||  geneSelectInput == null) {
			alert("Please complete dropdown options.")
		} // close alert if
		if ($('#geneSelectInput').val() == 'specific_gene') {
			var querySTR = '{ "select" : "' + select + '", "geneSelectInput" : {"gene" : "' + geneSelectInput + '"}, "category" : "' + category + '"}'
		} else {
			var querySTR = '{ "select" : "' + select + '", "geneSelectInput" : "' + geneSelectInput + '", "category" : "' + category + '"}'
		}
		console.log(querySTR)
		//var queryJSON = JSON.parse(querySTR)
		//console.log(queryJSON)
		$.ajax({
			url : '/createquery',
			data : {
				inputJSON : querySTR
			},
			success: function(data) {
				console.log('ay!')
				console.log(data)
				$('#textQuery').val(data)
			} // close create Query success
		}) //close ajax
	}) //close click createQuery
	$('#queryClick').on('click', function () {
		var in_query = $('#textQuery').val()
		$.ajax({
			url: '/querying',
			data : {
				textQuery : in_query
			},
			success: function(data) {
				// parse data into a JSON
				var json = JSON.parse(data)
				// Get the filter values
				var snp_arr = []
				var lr_arr = []
				$('input[name="snpeff[]"]:checked').each(function() {
					snp_arr.push($(this).val())
				})
				$('input:checked[name="landrace[]"]').each( function () {
					lr_arr.push($(this).val());
				})
				console.log(snp_arr)
				console.log(lr_arr)
				$('#testresults').show()
				$('#cy').show()
				var nodeARR = []
				var edgeARR = []
				var table = ''
				$(json).each(function (index, item) {
					var reg_selected = false
					var tar_selected = false
					var reg_color = '#555'
					var tar_color = '#555'
					$(snp_arr).each(function (i, elem) {
						if ($.inArray(elem, item.regulator_info.snpeff_unique) >= 0 ) {
							reg_selected = true
							reg_color = '#1FC2DB'
						}
						if ($.inArray(elem, item.target_info.snpeff_unique) >= 0) {
							tar_selected = true
							tar_color = '#1FC2DB'
						} 
					})
					nodeARR.push({data : { id : item.netID_target, name : item.target, snpeff : item.target_info.snpeff_unique, selected : tar_selected, color : tar_color, positions : item.target_info.variant_positions, muts : item.target_info.provean_mutations }, group:"nodes",removed:false,selected:false,selectable:true,locked:false,grabbed:false,grabbable:true})
					nodeARR.push({data : { id : item.netID_regulator , name : item.regulator, snpeff : item.regulator_info.snpeff_unique, selected : tar_selected, color : reg_color, positions : item.regulator_info.variant_positions, muts : item.regulator_info.provean_mutations }, group:"nodes",removed:false,selected:false,selectable:true,locked:false,grabbed:false,grabbable:true})
					edgeARR.push({data : {source: item.netID_regulator , target: item.netID_target }, group:"edges",removed:false,selected:false,selectable:true,locked:false,grabbed:false,grabbable:true})
					table += '<tr><td>' + item.regulator + '</td><td>' + item.regulator_info.provean_mutations + '</td>' 
					if (typeof item.regulator_info.snpeff_unique == 'object') {
						table += '<td>' + item.regulator_info.snpeff_unique.join(", ") + '</td>'
					}
					else {
						table += '<td>' + item.regulator_info.snpeff_unique + '</td>'
					}
					table += '<td>' + item.target + '</td><td>' + item.target_info.provean_mutations + '</td>'
					if (typeof item.target_info.snpeff_unique == 'object') {
						table += '<td>' + item.target_info.snpeff_unique.join(", ") + '</td></tr>'
					}
					else {
						table += '<td>' + item.target_info.snpeff_unique + '</td></tr>'
					}
				}) // close each
				console.log(edgeARR)
				$('#netTable').html(table)
				$('#cy').cytoscape({
					layout: {
						name : 'cose-bilkent'
					},
					style: [
						{"selector":"core","style":{"selection-box-color":"#AAD8FF","selection-box-border-color":"#8BB0D0","selection-box-opacity":"0.5"}},
						{"selector":"node","style":{"content":"data(name)","font-size":"12px","text-valign":"center","text-halign":"center","text-outline-width":"2px","color":"#fff","background-color":"data(color)", "overlay-padding":"6px","z-index":"10"}},
						{"selector":"node:selected","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#77828C","text-outline-color":"#77828C"}},
						{"selector":"edge","style":{"curve-style":"haystack","haystack-radius":"0.5","opacity":"0.4","line-color":"#bbb","width":"mapData(weight, 0, 1, 1, 8)","overlay-padding":"3px"}},
						{"selector":"node.unhighlighted","style":{"opacity":"0.2"}},
						{"selector":"edge.unhighlighted","style":{"opacity":"0.05"}},
						{"selector":".highlighted","style":{"z-index":"999999"}},
						{"selector":"node.highlighted","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#394855","text-outline-color":"#394855","shadow-blur":"12px","shadow-color":"#000","shadow-opacity":"0.8","shadow-offset-x":"0px","shadow-offset-y":"4px"}},
						{"selector":"edge.filtered","style":{"opacity":"0"}}],
					elements: {
						nodes: nodeARR,
						edges : edgeARR
					},
					minZoom: 0.02,
					maxZoom: 5,
					ready: function(){
    					window.cy = this;
    					cy.elements().unselectify();
    
    					cy.on('tap', 'node', function(e){
      						var node = e.cyTarget; 
      						var neighborhood = node.neighborhood().add(node);
      
							cy.elements().addClass('faded');
							neighborhood.removeClass('faded');
						});
    
						cy.on('tap', function(e){
							if( e.cyTarget === cy ){
								cy.elements().removeClass('faded');
							}
						})
					} // close cytoscape ready function 
				})// close cytoscape
			} // close success
		}) // close ajax
	}) //close on click
}) // close initial function
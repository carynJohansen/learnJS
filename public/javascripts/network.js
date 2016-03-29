
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



				$('#queryClick').on('click', function () {
					var in_query = $('#textQuery').val()
					$.ajax({
						url: '/querying',
						data : {
							textQuery : in_query
						},
						success: function(data) {
							//$('#textQuery').val(data)
							//console.log(typeof data == 'string')
							var json = JSON.parse(data)
							console.log(json)
							$('#testresults').show()
							$('#cy').show()
							var nodeARR = []
							var edgeARR = []
							var table = ''
							$(json).each(function (index, item) {
								console.log(item)
								//var nodej = '{data : { id : ' + item.netID_regulator + ', name : ' + item.reg +'}}'
								nodeARR.push({data : { id : item.netID_regulator , name : item.regulator }})
								nodeARR.push({data : { id : item.netID_target, name : item.target }})
								edgeARR.push({data : {source: item.netID_regulator , target: item.netID_target }})
								table += '<tr><td>' + item.regulator + '</td><td>' + item.target + '</td><td>' + item.regulator_info.provean_mutations + '</td><td>'+ item.target_info.provean_mutations + '</td></tr>'
							}) // close each
							$('#netTable').html(table)
							$('#cy').cytoscape({
								layout: {
									name : 'cose-bilkent'
								},
								style: [{"selector":"core","style":{"selection-box-color":"#AAD8FF","selection-box-border-color":"#8BB0D0","selection-box-opacity":"0.5"}},{"selector":"node","style":{"width":"mapData(score, 0, 0.006769776522008331, 20, 60)","height":"mapData(score, 0, 0.006769776522008331, 20, 60)","content":"data(name)","font-size":"12px","text-valign":"center","text-halign":"center","background-color":"#555","text-outline-color":"#555","text-outline-width":"2px","color":"#fff","overlay-padding":"6px","z-index":"10"}},{"selector":"node[?attr]","style":{"shape":"rectangle","background-color":"#aaa","text-outline-color":"#aaa","width":"16px","height":"16px","font-size":"6px","z-index":"1"}},{"selector":"node[?query]","style":{"background-clip":"none","background-fit":"contain"}},{"selector":"node:selected","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#77828C","text-outline-color":"#77828C"}},{"selector":"edge","style":{"curve-style":"haystack","haystack-radius":"0.5","opacity":"0.4","line-color":"#bbb","width":"mapData(weight, 0, 1, 1, 8)","overlay-padding":"3px"}},{"selector":"node.unhighlighted","style":{"opacity":"0.2"}},{"selector":"edge.unhighlighted","style":{"opacity":"0.05"}},{"selector":".highlighted","style":{"z-index":"999999"}},{"selector":"node.highlighted","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#394855","text-outline-color":"#394855","shadow-blur":"12px","shadow-color":"#000","shadow-opacity":"0.8","shadow-offset-x":"0px","shadow-offset-y":"4px"}},{"selector":"edge.filtered","style":{"opacity":"0"}},{"selector":"edge[group=\"coexp\"]","style":{"line-color":"#d0b7d5"}},{"selector":"edge[group=\"coloc\"]","style":{"line-color":"#a0b3dc"}},{"selector":"edge[group=\"gi\"]","style":{"line-color":"#90e190"}},{"selector":"edge[group=\"path\"]","style":{"line-color":"#9bd8de"}},{"selector":"edge[group=\"pi\"]","style":{"line-color":"#eaa2a2"}},{"selector":"edge[group=\"predict\"]","style":{"line-color":"#f6c384"}},{"selector":"edge[group=\"spd\"]","style":{"line-color":"#dad4a2"}},{"selector":"edge[group=\"spd_attr\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"reg\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"reg_attr\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"user\"]","style":{"line-color":"#f0ec86"}}],
								elements: {
									nodes: nodeARR,
									edges : edgeARR
								},
								minZoom: 0.02,
								maxZoom: 1,
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
			} // close create Query success
		}) //close ajax
	}) //close click createQuery
}) // close initial function
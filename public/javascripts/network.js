
/////////////////////////////
////    client side     ////
///////////////////////////

$(function () {
//	$('#netIn').keyup( function () {
//		$('#textQuery').val($(this).val())
//	})
//	$('#select').on('change', function() {
//		if (this.value == 'all_genes') {
//			$('#specGeneInput').hide()
//			$('#specGeneClick').hide()
//			$('#textQuery').val("SELECT * ")
//		} else if (this.value == 'specific_gene') {
//			$('#specGeneInput').show()
//			$('#specGeneClick').show()
//			$('#specGeneClick').on('click', function () {
//				var specGene = $('#specGeneInput').val()
//				console.log("you've clicked!", specGene)
//				$('#textQuery').val(specGene)
//			})
//		}
//	}) //close select change

//	$('#netClick').on('click', function () {
//		console.log("you clicked!")
//		var in_net = $('#textQuery').val()
//		$.ajax({
//			url : '/networkVis',
//			data : {
//				netInput : in_net
//			},
//			success: function (data) {
//				console.log(data)
//				$('#networkResults').append(data)
//			} // close sucess
//		}); //clsoe .ajax
//	}) //close netClick function
	
	$('#createQuery').on('click', function () {
		var select = $('#select').val()
		if (select == null) {
			alert("Please choose a select option from the dropdown.")
		}
		var category = $('#category').val()
		if (category == null ) {
			alert("Please select a network category from the dropdown.")
		}
		var snp_arr = []
		var lr_arr = []
		$('input[name="snpeff[]"]:checked').each(function() {
			snp_arr.push($(this).val())
		})
		console.log(snp_arr)
		$('input:checked[name="landrace[]"]').each( function () {
			lr_arr.push($(this).val());
		})
		//var prov = $('input:checked[name="prov"]').val()
		//console.log(prov)

		var querySTR = '{'
			+ '"select" : "' + select + '",'
			+ '"category" : "' + category + '", "snpeff" : ['
		$(snp_arr).each(function (index, item) {
			if (index == 0) {
				querySTR = querySTR.concat('"' + item + '"')
			} else {
				querySTR = querySTR.concat(',"' + item + '"')
			}
		})
		querySTR = querySTR.concat('], "landrace" : [')
		$(lr_arr).each(function (index, item) {
			if (index == 0) {
				querySTR = querySTR.concat('"' + item + '"')
			} else {
				querySTR = querySTR.concat(',"' + item + '"')
			}
		})
		querySTR = querySTR.concat(']}')
		console.log(querySTR)
		var queryJSON = JSON.parse(querySTR)
		$.ajax({
			url : '/querying',
			data : {
				inputJSON : queryJSON
			},
			success: function(data) {
				console.log('ay!')
				$('#textQuery').val(data)
			}
		})
	})

	$('#queryClick').on('click', function () {
		var in_query = $('#textQuery').val()
		$.ajax({
			url: '/querying',
			data : {
				textQuery : in_query
			},
			success: function(data) {
				//var dataParsed = JSON.parse(data)
				//console.log(dataParsed)
				$('#testresults').show()
				$('#cy').show()
				var nodeARR = []
				var edgeARR = []
				$(data).each(function (index, item) {
					//var nodej = '{data : { id : ' + item.netID_regulator + ', name : ' + item.reg +'}}'
					nodeARR.push({data : { id : item.netID_regulator , name : item.reg }})
					nodeARR.push({data : { id : item.netID_target, name : item.target }})
					edgeARR.push({data : {source: item.netID_regulator , target: item.netID_target }})
					var row = '<tr><td>' + item.reg + '</td><td>' + item.target + '</td></tr>'
					$('#netTable').append(row)
				}) // close each
				$('#cy').cytoscape({
					layout: {
						name : 'circle'
					},
					style : [
						{
							selector : 'node',
							style : {
								'content': 'data(name)',
								'text-valign': 'center',
								'color': 'black',
								//'text-outline-width': 2,
								//'text-outline-color': '#888',
								'height' : 50,
								'width' : 50,
								'background-color' : '#e8e406'
							}
						},
						{
							selector : 'edge',
							style : {
								'curve-style' : 'haystack',
								'haystack-radius' : 0,
								'target-arrow-shape' : 'triangle',
								'width' : 10,
								'opacity': 1,
								'line-color' : '#EE9A00'
							}
						},
						{
							selector : ':selected',
							style : {
								'background-color': 'black',
								'line-color': 'black',
								'target-arrow-color': 'black',
								'source-arrow-color': 'black'
							}
						},
						{
							selector : '.faded',
							style : {
								'opacity' : 0.25,
								'text-opacity' : 0
							}
						}
					],
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
}) // close initial function
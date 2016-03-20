
/////////////////////////////
////    client side     ////
///////////////////////////

$(function () {
	$('#queryClick').on('click', function () {
		$.ajax({
			url: '/querying',
			success: function(data) {
				//var dataParsed = JSON.parse(data)
				//console.log(dataParsed)
				$('#testresults').show()
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
						name: 'circle'
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
								'width' : 5,
								'opacity': 0.5,
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
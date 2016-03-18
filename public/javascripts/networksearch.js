
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
				$(data).each(function (index, item) {
					var row = '<tr><td>' + item.reg + '</td><td>' + item.target + '</td></tr>'
					$('#netTable').append(row)
				}) // close each
			} // close success
		}) // close ajax
	}) //close on click
}) // close initial function
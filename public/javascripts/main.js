
/////////////////////////////
////    client side     ////
///////////////////////////

$(document).ready(function() {
	$('#test').on('click', function() {
		var input = $('#input-stuff').val();
		console.log('the input stuff is', input);

		$.ajax({
			url: '/api/test',
			data: {
				serverInput: input
			}
		}).done(function(x) {
			console.log('this is the .done()');
			console.log(x)
		});
	}); //close #test
});

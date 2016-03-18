
/////////////////////////////
////    client side     ////
///////////////////////////

$(function () {
	$('#netIn').keyup( function () {
		$('#textQuery').val($(this).val())
	})
	$('#select').on('change', function() {
		if (this.value == 'all_genes') {
			$('#textQuery').val("SELECT * ")
		} else if (this.value == 'specific_gene')
	})
	$('#netClick').on('click', function () {
		console.log("you clicked!")
		var in_net = $('#netIn').val()
		$.ajax({
			url : '/networkVis',
			data : {
				netInput : in_net
			},
			success: function (data) {
				console.log(data)
				$('#networkResults').append(data)

			} // close sucess
		}); //clsoe .ajax
	}) //close netClick function
}) // close initial function
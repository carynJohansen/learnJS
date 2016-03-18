
/////////////////////////////
////    client side     ////
///////////////////////////

$(function () {
	$('#netIn').keyup( function () {
		$('#textQuery').val($(this).val())
	})
	$('#select').on('change', function() {
		if (this.value == 'all_genes') {
			$('#specGeneInput').hide()
			$('#specGeneClick').hide()
			$('#textQuery').val("SELECT * ")
		} else if (this.value == 'specific_gene') {
			$('#specGeneInput').show()
			$('#specGeneClick').show()
			$('#specGeneClick').on('click', function () {
				var specGene = $('#specGeneInput').val()
				console.log("you've clicked!", specGene)
				$('#textQuery').val(specGene)
			})
		}

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
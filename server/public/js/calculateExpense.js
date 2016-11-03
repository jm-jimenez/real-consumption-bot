var rowCount = 0;

$(document).ready(function () {
	$("tr").on("click", function () {
		if ($(this).hasClass("success")){
			$(this).removeClass("success");
			rowCount--;
		}
		else {
			if (rowCount < 2){
				$(this).addClass("success");
				rowCount++;
			}
		}

		if(rowCount == 2){
			alert("FASCISMO DEL BUEENO");
			rowCount=0;
			$("tr").removeClass("success");
		}
	});

	$("tr").hover(function (){
		$(this).addClass("info");
	}, function (){
		$(this).removeClass("info");
	});

});

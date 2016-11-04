var rowCount = 0;

var refuelsIds = [];
var refuels = [];


function showTotalExpenses(){

	var euros = refuels[1].totalEuros - refuels[0].totalEuros + refuels[0].partialEuros;
	console.log(refuels);
	$("#modal-title").text("Total expenses");
	$("#modal-text").text("You have spent " + (Math.round(euros * 100) /100) + "€ in the selected range." ) ;
	$("#expensesPopup").modal('show');
	refuels = [];
}


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

			$("tr.success").each(function (index){
				refuels.push($(this).data());
			});

			showTotalExpenses();
			rowCount=0;
			$("tr").removeClass("success");
		}
	});

	$("tr").hover(function (){
		$(this).addClass("info");
	}, function (){
		$(this).removeClass("info");
	});

	$("#expensesPopup").click(function (){
		$("#expensesPopup").css({"display": "none"})
	});

});

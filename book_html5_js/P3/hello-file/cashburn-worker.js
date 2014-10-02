/*
 * http://www.codeproject.com/Tips/170907/Real-Time-Ticker-Showing-Your-Governments-Cash-Bur
 * 
 */
// capture the date parts we need for the calculation
var currentyear = new Date().getFullYear();
var startDateTicks = new Date(currentyear, 0, 1).getTime();

// replace this with your government's annual budget
var governmentBudget = 13265000000;

// figure out the per-second burn rate
var moneyMultiplier = (((governmentBudget / 365) / 24) / 60) / 60;


onmessage = function (oEvent) {
	  //postMessage("Hi " + oEvent.data);
	  updateBurnedMoneyTicker();
};

function updateBurnedMoneyTicker() {
	var curDateTicks = new Date().getTime();
	var totalVal = 0;
	// ticks are in milliseconds, compute by the second
	totalVal = (curDateTicks - startDateTicks);
	totalVal = totalVal / 1000;
	totalVal = totalVal * moneyMultiplier;
	
    postMessage(formatCurrency(totalVal));
}

/*
 *  this currency formatting function is 
 *  from http://javascript.internet.com
 */
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ','
				+ num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + '$' + num + '.' + cents);
} // end of code from http://javascript.internet.com


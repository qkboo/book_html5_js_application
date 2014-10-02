window.onload = function() {

	var contacts = JSON.parse(window.android.retrieveContacts());
//	console.log(JSON.stringify(contacts));
	for(var i = 0; i < contacts.length; i++) {
		var obj = contacts[i];
//		console.log( JSON.stringify(obj));
		appendAddress(obj ); // json object
	}
}

function getNetwork() {
	return window.android.getLocalIpAddress();    		
}

function showError(msg) {
	var output = $('#error');
	output.innerHTML = msg;
}

function putAndroid(obj) {
	window.android.passObject("pageItems", obj);
}


function appendAddress(contact) {
	
	var ul = $("#content");
	var first_name = contact.first_name;
	var phones = contact.phones;
	var emails = contact.emails;

	var li = makeChild( first_name, phones, emails);
	ul.appendChild(li);
}

// 주어진 모든 노드를 처리하는 메서드
function makeChild() {
	// console.log(arguments);
	var li = document.createElement("li");
	var label = document.createElement("label");

	label.innerHTML = arguments[0] + "," + arguments[1] + "<br/>"
	+ arguments[2];

	li.appendChild(label);
	return li;
}



/*
 * Like jQuery, Prototype 
 * shortening the "queryselector"
 * 
 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/QuerySelector
 * 
 */
function $ (selector, el) {
   if (!el) {el = document;}
   return el.querySelector(selector);
}
function $$ (selector, el) {
   if (!el) {el = document;}
   return el.querySelectorAll(selector);
   // Note: the returned object is a NodeList.
   // If you'd like to convert it to a Array for convenience, use this instead:
   // return Array.prototype.slice.call(el.querySelectorAll(selector));
}
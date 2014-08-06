function loaded()
{
	var lang = getParameterValue("lang");
	if (lang != "") String.locale = lang;

	alert(_("Localizing the document title..."));
	document.title = _(document.title);

	alert(_("Localizing other HTML tags..."));
	localizeHTMLTag("headertext");
	localizeHTMLTag("subtitletext");
	localizeHTMLTag("showinenglish");
	localizeHTMLTag("showingerman");

	//alert(_("Localizing done!"));
}


/* Some helper functions: */

var _ = function (string) {
	return string.toLocaleString();
};

function localizeHTMLTag(tagId)
{
	tag = document.getElementById(tagId);
	tag.innerHTML = _(tag.innerHTML);
}

function getParameterValue(parameter)
{
	parameter = parameter.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + parameter + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if(results == null)
		return "";
	else
		return results[1];
}
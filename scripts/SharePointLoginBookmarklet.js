// Displays Domain\Login name in IE for SharePoint 2013 Groups/Permissions pages
//

function copyInputText(e) {
	var copyText;
	if (e.target) {
		copyText = e.target;
	}
	else {
		copyText = e.srcElement;
	}
	if (copyText.select) {
		copyText.select();
		
	}
	if (document.execCommand) {
		document.execCommand("copy");
	}
	else {
		window.clipboardData.setData('Text', copyText.value);
	}
	e.preventDefault();
	e.stopPropagation();
}

function getUserById(id, div_index, success) {
	var context = new SP.ClientContext.get_current();
	var user = context.get_web().get_siteUsers().getById(id);
	context.load(user);
	context.executeQueryAsync(success.bind({div_index: div_index, user: user}), null);
}

var msAlt = document.querySelectorAll("tr.ms-alternating");
var vbIcon = document.querySelectorAll("td.ms-vb-icon");
var aLinks = document.querySelectorAll("a[href*='userdisp.aspx']");
var lookupLists = document.querySelectorAll("input[name='PrincipalId']");

if (document.querySelectorAll(".domainUserInput").length == 0) {
	for (var i = 0; i < msAlt.length; i++) {
		var key = msAlt[i].getAttribute("key");
		if (key) {
			key = key.substr(7);
			var keyDiv = document.createElement("input");
			keyDiv.className = "domainUserInput";
			keyDiv.value = key;
			if (msAlt[i].children[0] && msAlt[i].children[0].children[1]) {
				msAlt[i].children[0].children[1].appendChild(keyDiv);
			}
			if (keyDiv.addEventListener) {
				keyDiv.addEventListener("click", copyInputText);
			}
			else {
				keyDiv.attachEvent("onclick", copyInputText);
			}
		}
	}
	for (i = 0; i < vbIcon.length; i++) {
		if (vbIcon[i].children[0]) {
			var account = vbIcon[i].children[0].getAttribute("account");
			if (account) {
				account = account.substr(7);
				var accountDiv = document.createElement("input");
				accountDiv.className = "domainUserInput";
				accountDiv.value = account;
				vbIcon[i].appendChild(accountDiv);
				if (accountDiv.addEventListener) {
					accountDiv.addEventListener("click", copyInputText);
				}
				else {
					accountDiv.attachEvent("onclick", copyInputText);
				}
			}
		}
	}
	for (i = 0; i < aLinks.length; i++) {
		if(aLinks[i].innerHTML.indexOf("i:0#") >= 0) {
			var account = aLinks[i].innerHTML.substring(aLinks[i].innerHTML.indexOf("i:0#") + 7, aLinks[i].innerHTML.indexOf(")"));
			var accountDiv = document.createElement("input");
			accountDiv.className = "domainUserInput";
			accountDiv.value = account;
			aLinks[i].appendChild(accountDiv);
			if (accountDiv.addEventListener) {
				accountDiv.addEventListener("click", copyInputText);
			}
			else {
				accountDiv.attachEvent("onclick", copyInputText);
			}
		}
	}
	if (aLinks.length == 0) {
		for (i = 0; i < lookupLists.length; i++) {
			if(lookupLists[i].parentElement.parentElement.children[2].children[0].value == "user") {
				getUserById(lookupLists[i].value, i, function(){
					var account = this.user.get_loginName();
					account = account.substr(7);
					var accountDiv = document.createElement("input");
					accountDiv.className = "domainUserInput";
					accountDiv.value = account;
					lookupLists[this.div_index].parentElement.appendChild(accountDiv);
					if (accountDiv.addEventListener) {
						accountDiv.addEventListener("click", copyInputText);
					}
					else {
						accountDiv.attachEvent("onclick", copyInputText);
					}
				});
			}
		}
	}
}

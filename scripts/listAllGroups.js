function listAllGroups() {

    var clientContext = SP.ClientContext.get_current();
    var collGroup = clientContext.get_web().get_siteGroups();
    clientContext.load(collGroup);


    clientContext.executeQueryAsync(function(){
		var group_enum = collGroup.getEnumerator();
		var listString = "";
		var listStringAndOwner = "";
		var settingsListString = "";
		var listArray = [];
        while (group_enum.moveNext()) {
			listString += group_enum.get_current().get_title() + "\n";
			listStringAndOwner += group_enum.get_current().get_title() + " = " + group_enum.get_current().get_ownerTitle() + "\n";
			settingsListString += _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/editgrp.aspx?Group=" + encodeURI(group_enum.get_current().get_title()) + "\n";
			listArray[listArray.length] = group_enum.get_current().get_title() + "\n";
		}
		console.log(listString + "\n" + listStringAndOwner + "\n" + settingsListString);
	}, null);
}
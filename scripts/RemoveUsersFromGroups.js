function onSuccessFactory(usernames, groupName) {
	return function onSuccess(e, a) {
		console.log("Success removing '" + usernames + "' from '" + groupName + "'");
	}
}
function onFailFactory(usernames, groupName) {
	return function onFail(e, a) {
		console.log("Failure removing '" + usernames + "' from '" + groupName + "': " + a.get_message());
	}
}

function removeUsersToGroup (usernames, groupName) {
    //Get the web
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getByName(groupName);

    for (var i = usernames.length - 1; i >= 0; i--) {
        //Use 'ensureUser()' to get an SP_User object
        group.get_users().remove(web.ensureUser(usernames[i]));
    };

    group.update();

    //Load the group to the client context and execute
    clientContext.load(group);
    clientContext.executeQueryAsync(onSuccessFactory(usernames, groupName), onFailFactory(usernames, groupName));
}

function removeUsersToGroups(usernames, groupNames) {
	for (var i = groupNames.length - 1; i >= 0; i--) {
		removeUsersToGroup(usernames, groupNames[i]);
    };
}

var users = ["i:0#.w|DOMAIN\\username"];
var userGroups = ["Group Name"];

removeUsersToGroups(users, userGroups);
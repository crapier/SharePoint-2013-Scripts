function onSuccessFactory(usernames, groupName) {
	return function onSuccess(e, a) {
		console.log("Success adding '" + usernames + "' to '" + groupName + "'");
	}
}
function onFailFactory(usernames, groupName) {
	return function onFail(e, a) {
		console.log("Failure adding '" + usernames + "' to '" + groupName + "': " + a.get_message());
	}
}

function addUsersToGroup (usernames, groupName) {
    //Get the web
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getByName(groupName);

    for (var i = usernames.length - 1; i >= 0; i--) {
        //Use 'ensureUser()' to get an SP_User object
        group.get_users().addUser(web.ensureUser(usernames[i]));
    };

    group.update();

    //Load the group to the client context and execute
    clientContext.load(group);
    clientContext.executeQueryAsync(onSuccessFactory(usernames, groupName), onFailFactory(usernames, groupName));
}

function addUsersToGroups(usernames, groupNames) {
	for (var i = groupNames.length - 1; i >= 0; i--) {
		addUsersToGroup(usernames, groupNames[i]);
    };
}

var users = ["i:0#.w|DOMAIN\\username"];
var userGroups = ["Group Name"];

addUsersToGroups(users, userGroups);
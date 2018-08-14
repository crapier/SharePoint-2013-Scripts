
var sourceUser = 'i:0#.w|DOMAIN\\username';
var destinationUsers = ["i:0#.w|DOMAIN\\username"];
var userGroups = [];

function getUserGroups(loginName, Success,Error) {

   var context = new SP.ClientContext.get_current();
   var web = context.get_web();
   var allGroups = web.get_siteGroups();
   context.load(allGroups,'Include(Title,Users)');

   context.executeQueryAsync(
        function(sender, args) {
            var userGroups = findUserGroups(loginName,allGroups);         
            Success(userGroups);
        },
        Error
   );


    function findUserGroups(loginName,groups)
    {
         var userGroups = []; 
         var groupsEnumerator = groups.getEnumerator();
         while (groupsEnumerator.moveNext()) {
             var group = groupsEnumerator.get_current();
             if(isUserInGroup(loginName,group)){
                 userGroups.push(group);
             }
         }
         return userGroups;
     }

     function isUserInGroup(loginName,group)
     {
         var users = group.get_users();
         var userInGroup = false;
         var usersEnumerator = users.getEnumerator();
         while (usersEnumerator.moveNext()) {
             var user = usersEnumerator.get_current();
             if (user.get_loginName().toLowerCase() == loginName.toLowerCase()) {
                  userInGroup = true;
                  break;
             }
         }
         return userInGroup;
      }

}


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

getUserGroups(sourceUser,function (groups) {
	userGroups = groups;
	for(var i = 0; i < userGroups.length;i++) {
        userGroups[i] = userGroups[i].get_title();
    }
    console.log('User belongs to the following groups:');
	console.log(userGroups);
	addUsersToGroups(destinationUsers, userGroups);
},
function(sender,args){
    console.log('Error:' + args.get_message());
});
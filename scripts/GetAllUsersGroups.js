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

var userLogin = 'i:0#.w|DOMAIN\\username';
var userGroups = [];
getUserGroups(userLogin,function (groups) {
	userGroups = groups;
	for(var i = 0; i < userGroups.length;i++) {
        userGroups[i] = userGroups[i].get_title();
    }
    console.log('User belongs to the following groups:');
	console.log(userGroups);
},
function(sender,args){
    console.log('Error:' + args.get_message());
});
function getAllWebs(success,error)
{
   var ctx = SP.ClientContext.get_current();
   var web = ctx.get_site().get_rootWeb();
   var result = [];
   var level = 0;
   var getAllWebsInner = function(web,result,success,error) 
   {
      level++;
      var ctx = web.get_context();
      var webs = web.get_webs(); 
      ctx.load(webs,'Include(Title,Webs,Url)');
      ctx.executeQueryAsync(
        function(){
            for(var i = 0; i < webs.get_count();i++){
                var web = webs.getItemAtIndex(i);
                result.push(web);
                if(web.get_webs().get_count() > 0) {
                   getAllWebsInner(web,result,success,error);
                }   
            }
            level--;
            if (level == 0 && success)
              success(result);  
        },
        error);
   };

   getAllWebsInner(web,result,success,error);    
}

getAllWebs(
function(allwebs){
    for(var i = 0; i < allwebs.length;i++){
        console.log(allwebs[i].get_url());   
    }
},
function(sendera,args){
    console.log(args.get_message());
});
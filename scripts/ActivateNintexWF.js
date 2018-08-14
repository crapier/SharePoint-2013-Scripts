function activateFeature(rawGuid, site_url){
		//get contextr of newly created site
		var clientContext = new SP.ClientContext(site_url); 
		
		web = clientContext.get_web();

		//Activate Features
		ActivateWebFeature(web);
		function ActivateWebFeature(web){
			//trinedy branding feature GUID
			var guid = new SP.Guid('{'+rawGuid+'}');
			var featDefinition = web.get_features().add(guid, true, SP.FeatureDefinitionScope.farm);
		}
		clientContext.executeQueryAsync(function(){
			console.log(site_url + " - activated");
		}, function(){
			console.log(site_url + " - failed to activate");
		});
}

var subsites = [];

for (var i = 0; i < subsites.length; i++) {
	activateFeature("9bf7bf98-5660-498a-9399-bc656a61ed5d", subsites[i]);
}

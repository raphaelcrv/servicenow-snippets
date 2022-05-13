
```js

//calling script include from server
//calling functions using get 

//============== ============= ==============
//============== === HTML ==== ==============
//============== ============= ==============

<div>
  <!-- your widget template -->
  <div ng-if="!c.data.loading" class="tkt_container">
    <h2>
      Hello, {{c.data.usrName}}
    </h2>
    <p>
      {{c.data.message}}
    </p>
  </div>
</div>
//============== ============= ==============
//============== css style ==============
//============== ============= ==============
.tkt_container{

  h2{
    color: #293e40;
    font-size: 48px;
    font-family: arial;
    font-weight: 700;
    line-height: 59px;
    letter-spacing: 0em;
    text-align: left;
  }
  
  p{
    font-family: Gilroy-Regular, sans-serif;
    font-size: 17px;
    line-height: 1.5;
    margin: 32px 0px;
  }
}
//============== ============= ==============
//============== client script ==============
//============== ============= ==============

api.controller=function($window, $timeout) {
	/* widget controller */
	var c = this;
	//hide header from portal
	jQuery("body > div > header").hide()

	var ticket = {}
	c.data.loading = true
	c.data.message = ""

	
	c.server.get({
		val:'getTicketSysId'
	}).then(function(r){

		if(r.data.hasRole == true){
			try{
				ticket = JSON.parse(r.data.resData);

				if(!ticket.error && ticket.url){
					c.data.message = ticket.message;
					
					$timeout(function(){
						$window.location.href = ticket.url;	
					},3500)
					
				}else if(ticket.error){
					c.data.message = "ERROR: " + ticket.message + "/n \n Contact the support";
				}else{
					c.data.message = ticket.message;
				}

			}catch(e){
				c.data.message = "ERROR: " + e.toString();
			}
		}else{
			c.data.message = "User not allowed to use this application"
		}
		c.data.usrName = r.data.usrName;
		c.data.loading = false;
	});

};
//============== ============= ==============
//============== server script ==============
//============== ============= ==============

(function() {
	/* populate the 'data' object */
	/* e.g., data.table = $sp.getValue('table'); */

	if(input){

		var usrName = (gs.getUserDisplayName().split(" ")[0]);
		var itilSysID = "282bf1fac6112285017366cb5f867469"
		var sysclassname = options.sysclassname;
		var hasRole = false;

		//check if exists a specific role on options 
		//check if the current user has role
		//case option is empty check if the current user has itil role
		hasRole = options ? gs.hasRole(options.role_allowed) : gs.hasRole(itilSysID);

		if(hasRole == true){
			var mFunctions = {
				getTicketSysId : function(){
                    //calling script include from server widget;
					var taketicket = new takeATicketHelper();
					return taketicket.assignByHighestScore('incident').toString();
				}
			}

			var resData= mFunctions[input.val]();
			data.resData = resData;
		}

		data.usrName = usrName ? usrName : "Racker";
		data.hasRole = hasRole;
	}


})();
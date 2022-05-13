```js

var takeATicketHelper = Class.create();
takeATicketHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	/**************************************************************************
	Written By: Raphael Souza 
	Last Updated: 2022-03-05
	Description here
	**************************************************************************/
	assignByHighestScore : function(parmValue){
		//gs.addInfoMessage('script include triggered');
		//gs.addInfoMessage('parmValue=> '+parmValue);

		//parm false return blank 
		if(!parmValue){
			//gs.addInfoMessage("missing param");
			return this.getResponse(true, "Missing Function Parameter sysclassname", "");
		}else{
			//convert to string 
			parmValue = parmValue.toString().toLowerCase();	
		}

		//declare variables
		var valueData = '';
		var path = '';

		//generic switch get class name and path to ui page
		switch(parmValue){
			case "problem" :
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "case" :
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "change" :
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "change_request":
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "sc_req_item" :
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "sc_customerservice_case" : 
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				break;
			case "incident" : 
				//gs.addInfoMessage("Ticket Type => " +parmValue );
				valueData = parmValue;
				path = "incident.do?sys_id=";
				break;
		}


		//gs.addInfoMessage('valueData => ' + valueData);
		// Only continue if we have a value for valueData.
		if (valueData != '' && valueData != null && !valueData.nil()) {

			//gs.addInfoMessage("Get Records from taskSla");
			
			//add group filter and assign only if is member of the group

			//filter the hightest scored ticket to assign
			var query = 'stage=in_progress^task.active=true^task.assigned_toISEMPTY^u_ticket_scoreISNOTEMPTY^task.sys_class_name='+valueData;
			var ticketSysId = "";

			var slagr = new GlideRecord('task_sla');
			slagr.addEncodedQuery(query);
			slagr.setLimit("1");
			slagr.orderByDesc('u_ticket_score');
			slagr.query();
			while (slagr.next()) {
				if(slagr.task.number){
					//gs.addInfoMessage("TaskSla SysID" +" => "+ slagr.sys_id);
					//gs.addInfoMessage(valueData +" Number => "+ slagr.task.number);
					ticketSysId = slagr.task.toString();
					//gs.addInfoMessage("ticketSysId number => "+ ticketSysId);
				}
			}

			if(ticketSysId){
				//gs.addInfoMessage("assigne ticket => " + ticketSysId);
				
				var grTicket = new GlideRecord(valueData);
				grTicket.get(ticketSysId);
				//grTicket.setWorkflow(false);
				if(grTicket){
					//gs.addInfoMessage("Number to assign=> " + grTicket.number);
					//gs.addInfoMessage("Assigning to user id" + gs.getUserName());
					grTicket.assigned_to = gs.getUserID();
					grTicket.update();
					return this.getResponse(false, "The "+valueData+" number "+grTicket.number+" was assigned to you. Redirecting..", path + ticketSysId);
				}else{
					return this.getResponse(false, valueData + " Not Found", "");
				}
				
			}else{
				//gs.addInfoMessage("No Tickets To Assigne");
				return this.getResponse(false, "There is no "+valueData+" to assigne to you.", "");
				
			}

		}else{
			//gs.addInfoMessage("Invalid valueData");
			return this.getResponse(true, "Invalid valueData", "");
			
		}

	},
	getResponse : function(error, message, url){
		return JSON.stringify({
			error : error,
			message : message,
			url : url
		});
	},
	/**************************************************************************
		Written By: Raphael Souza
		Last Updated: 2022-03-05
		script to recalculates the ticket score called by a BR (RS Recalculate Ticket Score)
		PARAMS : Object 
		{
			sla_sysid : current.sys_id,
			u_support_tier : 1,
			priority : 1,
			impact : 1,
			sla_percentage: 1,
			sla_name : current.sla.name
		}
		**************************************************************************/
	recalculateScore : function(data){
		var totalScore = 0.75;

		var sla_sysid = data.sla_sysid;


		var support_tier = this.getWeightSupportTier(data.u_support_tier);
		var priority = this.getWeightPriority(data.priority);
		var impact = this.getWeightImpact(data.impact);
		var sla_percentage = data.sla_percentage;
		var sla_name_score = this.getWeightSlaName(data.sla_name);


		//test propouses
		//if(sla_sysid == "7bbe61c51b538d90d590fd951a4bcbc0"){

		//calculation to get score based on the weights
		totalScore = support_tier * priority * impact * sla_percentage * sla_name_score;

		var grTaskSla = new GlideRecord('task_sla');
		grTaskSla.get(sla_sysid);
		grTaskSla.u_ticket_score = totalScore*1000;
		grTaskSla.update();

		//}

	},
	/*Helper get weight for each field */
	getWeightSupportTier : function(value){
		/*	
			(sla task.u_support_tier WEIGHT)
			1 = 1.3
			2 = 1.25
			3 = 1.2
			4 = 1.15
			5 = 1.1
			6 = 1.05
			7 = 1
			*/
		var weight = 0.75;

		switch(String(value)){
			case "Tier 1" : 
				weight = 1.3;
				break;
			case "Tier 2" : 
				weight = 1.25;
				break;
			case "Tier 3" : 
				weight = 1.2;
				break;
			case "Tier 4" : 
				weight = 1.15;
				break;
			case "Tier 5" : 
				weight = 1.1;
				break;
			case "Tier 6" : 
				weight = 1.05;
				break;
			case "Tier 7" : 
				weight = 1;
				break;
		}

		return weight;
	},
	getWeightPriority : function(value){
		/*	
			(sla task.priority WEIGHT)
			1 = 1.5
			2 = 1.25
			3 = 1
			Anything else (default, in case of data error) = .75
			*/
		var weight = 0.75;

		switch(String(value)){
			case '1' : 
				weight = 1.5;
				break;
			case '2' : 
				weight = 1.25;
				break;
			case '3' : 
				weight = 1;
				break;
		}


		return weight;
	},
	getWeightImpact : function(value){
		/*	
			(sla task.impact WEIGHT)
			1 = 1.5
			2 = 1.25
			3 = 1
			Anything else (default, in case of data error) = .75
			*/
		var weight = 0.75;

		switch(String(value)){
			case '1' : 
				weight = 1.5;
				break;
			case '2' : 
				weight = 1.25;
				break;
			case '3' : 
				weight = 1;
				break;
		}

		return weight;
	},
	getWeightSlaName : function(value){
		/*	
			(sla sla.name [service level] WEIGHT)
			Intensive = 1.5
			Managed = 1.25
			Infrastructure = 1
			Runaway = 1
			Anything else (default, in case of data error) = .75
			*/

		var weight = 0;

		weight = value.includes("Intensive") ? 1.5 : weight;
		weight = value.includes("Managed") ? weight + 1.25 : weight;
		weight = value.includes("Infrastructure") ? weight + 1 : weight;
		weight = value.includes("Runaway") ? weight + 1 : weight;

		return weight == 0 ? 0.75 : weight ;
	},
	type: 'takeATicketHelper'
});
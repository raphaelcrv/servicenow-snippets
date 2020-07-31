var query = "update_set=6ce025f21b0a9c108cae67853a4bcb47^sys_created_on>javascript:gs.dateGenerate('2020-07-23','23:59:59')";
var updateSetSysId = "b24ffbd61b169810f7f10f60f54bcb6b";

var gr = new GlideRecord('sys_update_xml');
gr.addEncodedQuery(query);
gr.setValue('update_set', updateSetSysId);
gr.updateMultiple();
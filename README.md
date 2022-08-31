# ServiceNow & JS Snippets

## Table of Contents

Working in progress
- [Servicenow Product Documentation Translated to PT-BR](https://github.com/raphaelcrv/servicenow-snippets/wiki#documenta%C3%A7%C3%A3o-m%C3%B3dulo-it-service-management) by @raphaelcrv

Oficial Library Documentations
- [Angular.js](https://docs.angularjs.org/api/ng/directive/ngReadonly)
- [Moment.js](https://momentjs.com/)
- [Chart.js](https://www.chartjs.org/)

Examples:

- [Jelly](samples/jelly_code.md)
- [Widgets](samples/widget.md)
- [Script Includes](samples/script_include.md)
- [Calendar Events](samples/calendar_events.md)
- [Catalog Generator](samples/catalog_generator.md)


---

Oficial Documentation Reference

1. [Woring with GlideRecord](https://developer.servicenow.com/dev.do#!/reference/api/orlando/server_legacy/c_GlideRecordAPI)
2. [Glide User](https://developer.servicenow.com/dev.do#!/reference/api/orlando/server_legacy/GUserAPI)
3. [Working with GlideDateTime](https://docs.servicenow.com/bundle/jakarta-application-development/page/app-store/dev_portal/API_reference/glideDateTimeScoped/concept/c_GlideDateTimeScoped.html)
4. [JavaScript Snippets](docs/javascript.md)
5. [Array Utils](https://developer.servicenow.com/dev.do#!/reference/api/orlando/server_legacy/c_ArrayUtilAPI)
6. [HTML Snippets](docs/html_snippets.md)
7. [SASS Variables](docs/sass_variables.md)
8. [CSS](docs/css.md)
9. [Misc](docs/misc.md)
10. [Components](docs/components/components.md)
11. [Widget Generate Catalog](docs/widget_generate_catalog.md)
12. [Widget Generate Catalog](docs/widget_generate_catalog.md)

---
1. [GlideForm: The GlideForm API provides methods to customize forms. ](https://developer.servicenow.com/dev.do#!/reference/api/orlando/client/r_GlideFormAddDecoration_String_String_String_String)
1. [GlideModalV3: Provides methods for displaying a content overlay.](docs/widget_generate_catalog.md)
1. [GlideUser:The GlideUser API provides access to information about the current user and current user roles.](https://developer.servicenow.com/dev.do#!/reference/api/orlando/client/c_GlideUserAPI)
1. [Jelly Sample Code](https://gist.github.com/raphaelcrv/9bfab421af53a30b293169bad0d46557)


## Using `gs.nil()`
```js
if(gs.nil(gr.variableName)) {
  /*true condition*/
  }

if(valueData != '' && valueData != null && !valueData.nil(){
  /*true condition*/
  }
```
> `gs.nil()` will return true if a variable is empty

# GlideRecord

## `GlideRecord.get`

```js

//Using the new 
//initialize(): Creates an empty record suitable for population before an insert.
//newRecord(); Creates a GlideRecord, set the default values for the fields and assign a unique id to the record.

//initialize gives no value to opened_at
var inc = new GlideRecord('incident');
inc.initialize();
gs.print(inc.opened_at.getDisplayValue());
inc.name = 'New Incident';
inc.description = 'Incident description';
inc.insert();

//newREcord() gives value to opened_at
var inc = new GlideRecord('incident');
inc.newRecord();
gs.print(inc.opened_at.getDisplayValue());
inc.name = 'New Incident';
inc.description = 'Incident description';
inc.insert();


//Example get encoded query
var queryString = "priority=1^ORpriority=2"; //query
var gr = new GlideRecord('incident');
slagr.setLimit("1"); //setLimit
slagr.orderByDesc('u_ticket_score'); //orderBy
gr.addEncodedQuery(queryString);//EncodedQuery
gr.query();
while (gr.next()) {
  //This method fails if there is a field in the table called "next". If that is the case, use the method _next().
gs.addInfoMessage(gr.number);
gs.info(gr.getValue('number')); //Retrieves the string value of an underlying element in a field.
}

//exemple get sys_id
var sys_id = "99ebb4156fa831005be8883e6b3ee4b9";
var gr = new GlideRecord('incident');
if(gr.get(sys_id)){
gs.info(gr.number) // logs Incident Number
}

//exemple get param
var gr = new GlideRecord('incident');
if(gr.get('caller_id.name','Sylivia Wayland')){
gs.info(gr.number) // logs Incident Number
}

//example if ternary get function
function getRecord (sys_id, table) {
var gr = new GlideRecord(table);
return gr.get(sys_id); //return true or false
}


```
> gr.get return true if record founded or the value of record if founded

Keywords: `GlideRecord`, `get`
_______________________________________

## `GlideRecord.update`

```js 


//update one record
var gr = new GlideRecord('incident');
gr.addQuery('emailLIKE@domain');
gr.addEncodedQuery(queryString);//EncodedQuery
gr.setLimit(1);
gr.query();
while (gr.next()) {
  grInc.state = 2;
  gr.update();
}

//update updateMultiple
var gr = new GlideRecord('incident');
gr.addEncodedQuery("state=2");//EncodedQuery
gr.query();
while (gr.next()) {
  //grInc.setValue("state",2)//set value
  grInc.state = 2;
  gr.updateMultiple();
}

//exemple get sys_id
var sys_id = "99ebb4156fa831005be8883e6b3ee4b9";
var grInc = new GlideRecord('incident');
if(grInc.get(sys_id)){
  //grInc.setValue("state",2)//set value
  grInc.state = 2;
  grInc.update()
}

/updateMultiple() records
// update the state of all active incidents to 4 - "Awaiting User Info"
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.setValue('state',  4);
gr.updateMultiple();


```

> Notes on the snippet
Resume: that code update password of all users on the filter
Caution: User gr.setWorkflow = false for skipp workflow rules
tags: GlideREcord, Update

___________________________________

## Examples `gr.delete()`
```js
//Deletes multiple records according to the current "where" clause.
function nukeCart() {
var cart = getCart();
var id = cart.sys_id;
var kids = new GlideRecord('sc_cart_item');
kids.addQuery('cart', cart.sys_id);
kids.deleteMultiple();
}


//Delete single record
var gr = new GlideRecord('incident');
if (gr.get('99ebb4156fa831005be8883e6b3ee4b9'))
    gr.deleteRecord();
```

/

```
___________________________________

## Examples  `addJoinQuery` :
```js
//Find problems that have incidents associated where the incident caller_id field value matches that of the problem opened_by field.
var gr = new GlideRecord('problem'); 
gr.addJoinQuery('incident', 'opened_by', 'caller_id'); 
gr.query();,
while (gr.next()) {
  gs.info(gr.getValue('number'));
}

```
Keywords: `addJoinQuery`, `get`
____________________________________

## Examples `gr.getLastErrorMessage()`
```js
// Setup a data policy where short_description field in incident is mandatory
var gr = new GlideRecord('incident');
gr.insert(); // insert without data in mandatory field
var errormessage = gr.getLastErrorMessage(); 
gs.info(errormessage);
```

  Output:
  Data Policy Exception: Short description is mandatory
__________________________________________
## Examples `getLink(Boolean noStack)`
```js
gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addQuery("priority", 1);
gr.query();
gr.next()
gs.info(gs.getProperty('glide.servlet.uri') + gr.getLink(false));
```

  Output:
      <BaseURL>/incident.do?sys_id=9d385017c611228701d22104cc95c371&sysparm_stack=incident_list.do?sysparm_query=active=true

# Snippets Server

## Transform Map Demo Script

1. input value userID with blank spaces and missing char to fill with zero '123, 123, 21';
2. output convert to string splited by comma with UserSysID 'sysid1,sysid2,sysid3'

```js
// 
//convert to string-> suing split to transform in array
var s_ponto_focal = ((source.u_ponto_focal).toString()).split(",");
var b_ponto_focal = '';
var a_ponto_focal = '';
var maxChar = 9;

for (var i = 0; i < s_ponto_focal.length; i++) {

//remove blank spaces
s_ponto_focal[i] = s_ponto_focal[i].replace(' ','');

//get the missing zeros
  qtdChar = parseInt(maxChar) - parseInt((s_ponto_focal[i]).length);
  if (qtdChar > 0) {
    var z = 0;
    var zero = '';
  
    for (z = 0; z < qtdChar; z++) {
      zero += '0';
    }
//concat the missing zeros
    s_ponto_focal[i] = zero + s_ponto_focal[i];
  }
  
//query find sys_id -> concat to a_ponto_focal split by comma
  var user_table = new GlideRecord('sys_user');
  user_table.addQuery('active', 'true');
  user_table.addQuery('user_name', s_ponto_focal[i]);
  user_table.query();
  if (user_table.next()) {
    if (a_ponto_focal.length > 1) {
      a_ponto_focal += ',' + user_table.sys_id;
    }else{
      a_ponto_focal += user_table.sys_id;
    }

  }
}

//set target values 
target.vendor_manager = a_ponto_focal;
target.vendor = true;
target.vendor_type = "OutSourcing";
```

> Notes on the snippet

_________________________________________________
## Debug ScriptInclude Example:
```js
var MyUtil = Class.create();

MyUtil.prototype = {
  initialize: function(){
      this.debug       = gs.getProperty('debug.MyUtil') == 'true';
      this.debugPrefix = '>>>DEBUG: MyUtil: ';
  },

  myMethod : function(id) {

      // Some logic here
      this._debug('myMethod(): Sample debug output');
  },

  _debug : function(msg) {

      if (this.debug) {
          gs.debug(debugPrefix + msg);
      }
  },

  type : "MyUtil"
}
```
Keywords: `script include`, `sys_log`, `debug`

_________________________________________________
## Filtering choices lists (Use reference qualifier)

![alt text](https://i.imgur.com/gfBXiYs.png)

```js
javascript:"u_contractISNOTEMPTY^u_contract =" + current.variables.contract

current.variables.contract => get value the variable on the form
u_contractISNOTEMPTY^ => condition u_contract não deve estar vazio
```
>Keywords: `Use_reference_qualifier`, `filter_choice_list`

__________________________________
## Examples `etch a record with all fields from query object  `
fetch a record with all fields from query object at a time while retrieving the data from GlideRecord
```js
var grData = [];
var gr = new GlideRecord('incident');
gr.addEncodedQuery('state=2');
gr.query();
while (gr.next()) {
  var packageToSend = {}
  for (var property in gr) {
    try {
      packageToSend[property] = gr[property].getDisplayValue();
    }
    catch(err){}
  }
  grData.push(packageToSend)
}

grData.forEach(function(e,i){  
  //all fields from incident table are avaibale 
  gs.log(e.number);
  
});
```
Keywords: `GlideRecord`, `get`


# Working with Dates

## Get Days Ago
```js
_checkDaysAgo: function (date) {
  //take date to find today, yesterday, etc.
  var now = gs.now() + ' 12:00:00';
  date = date.substring(0, 10) + ' 12:00:00';

  var nowDT = new GlideDateTime();
  nowDT.setDisplayValue(now);
  var dateDT = new GlideDateTime();
  dateDT.setDisplayValue(date);
  var seconds = gs.dateDiff(dateDT.getDisplayValue(), nowDT.getDisplayValue(), true);

  var days = seconds / 60 / 60 / 24;

  return days;
}
```
> Notes on the snippet
____________________________________

[Working with dates - GlideDateTime:](https://developer.servicenow.com/dev.do#!/reference/api/orlando/server_legacy/c_GlideDateTimeAPI)

## Comparing if a Date is Less Than Current Date
```js
var date = new GlideDateTime(date_field);
var now = new GlideDateTime();
if(date <= now) {
  // date is in the past
}


var mClass = {
formatData : function(data){
  var dia  = data.split("/")[0];
  var mes  = data.split("/")[1];
  var ano  = data.split("/")[2];

  return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
  // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}

}

var gdt1 = new GlideDateTime(this.mClass.formatData("01/04/2020"));
var gdt2 = new GlideDateTime();

gs.log("GDT1 -> " + gdt1.getValue());
gs.log("GDT2 -> " + gdt2.getValue());

gs.log("GDT1("+gdt1.getValue()+") antes de GDT2 ("+ gdt2 +")?");

gs.info(gdt1.before(gdt2));  


Example 2




//604800000 


var today = new GlideDateTime();

var gr = new GlideRecord('u_eficiencia');
gr.addQuery('u_number=EFI0001193');
gr.setLimit(1);
gr.query();
while (gr.next()) {
gr.setWorkflow(false);

if(gr.getValue('u_last_update')){

}else{

  var sevenDays = new GlideDateTime(gr.getValue('sys_created_on'));
  sevenDays.add(604800000); //add 7days

  if(today.after(sevenDays)){
    gr.setValue('u_pontos_eficiencia',parseInt(gr.getValue('u_pontos_eficiencia')) + 1);
    
    gs.print(today.toString());
    gr.setValue('u_last_update',today.toString())
  }
    
}
gr.update();
}
```
> Notes on the snippet
___________________________________________________

## Scrapping content from internet
```js
var el = $(".xuxa tr")
arrDDD = []
for (var i = 0; i < el.length; i++){
  
  arrDDD.push({
  ddd : $(el[i]).children('td:eq(1)').html(),
  state : $(el[i]).children('td:eq(0)').html(),
  })
};
```
> Notes on the snippet

```js
if(gs.nil(gr.variableName)) { //is empety }
inc.autoSysFields(false);  // Do not update sys_updated_by, sys_updated_on, sys_mod_count, sys_created_by, and sys_created_on
inc.setWorkflow(false);    // Do not run any other business rules

current.setAbortAction(true); //Sets a flag to indicate if the next database action (insert, update, delete) is to be aborted. ref:[https://developer.servicenow.com/dev.do#!/reference/api/orlando/server_legacy/r_GlideRecord-setAbortAction_Boolean]
gr.setLimit(10); //To use the setLimit() method in a scoped application, use the corresponding scoped method: setLimit().

```

> GlideUpdateManager2 Push the update into the current update set
__________________________________________
## Recursive function
```js

//SAMPLE 1
//Query for the record
var rec = new GlideRecord('sys_portal');
rec.get('8a8df9f61be15d9088eceb17ec4bcb97');
//Push the record into the current update set  
var um = new GlideUpdateManager2();
um.saveRecord(rec);


//SAMPLE 2
var results = [];
var nestedCategories = ['898fc5a0db00d74074c99447db9619d8'];
getChildren(nestedCategories[0]);
searchItems();
return results;

function getChildren(sysID) {
  var gr = new GlideRecord('sc_category');
  gr.addQuery('parent', sysID);
  gr.addActiveQuery();
  gr.query();
  while(gr.next()) {
      var current = gr.sys_id.toString();
      nestedCategories.push(current);
      if(hasChildren(current)) {
          getChildren(current);
      }
  }
}

function hasChildren(sysID) {
  var gr = new GlideRecord('sc_category');
  gr.addQuery('parent', sysID);
  gr.addActiveQuery();
  gr.query();
  if(gr.next()) {
      return true;
  } else {
      return false;
  }
}
```

______________________________

## CatItem API
```js
var catalogItemJS = new sn_sc.CatItem(sc.getUniqueValue());
if (!catalogItemJS.canView())
  continue;
var catItemDetails = catalogItemJS.getItemSummary();
```

______________________________

## CatCategory API
```js
categoryJS = new sn_sc.CatCategory(data.category_id);
if (!categoryJS.canView()) {
  data.error = gs.getMessage("You do not have permission to see this category");
  return;
}
```

____________________________________

## CatalogSearch API
```js
var items = data.items = [];
var catalog = $sp.getValue('sc_catalog');
var sc = new sn_sc.CatalogSearch().search(catalog, data.category_id, '', false, options.depth_search);
sc.addQuery('sys_class_name', 'NOT IN', 'sc_cat_item_wizard');
if (data.keywords)
  sc.addQuery('123TEXTQUERY321', data.keywords);
sc.orderBy('order');
sc.orderBy('name');
sc.query();
```

____________________________________

# Template

### Description
```js
// code here 
console.log("hello world");

```

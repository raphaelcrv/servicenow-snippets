## QUERY

```jsx
/*get(Object name, Object value)
Returns the specified record in an instantiated GlideRecord object.
This method accepts either one or two parameters. If only a single parameter is passed in, the method assumes it is the sys_id of the desired record. If two parameters are passed in, the first is the name of the column within the instantiated GlideRecord to search. The second is the value to search for.

If multiple records are found, use next() to access the additional records. */

	var grIncident = new GlideRecord('incident');
	var returnValue = grIncident.get('99ebb4156fa831005be8883e6b3ee4b9');
	gs.info(returnValue); // logs true or false
	gs.info(grIncident.number); // logs Incident Number

// ================ ================ ================
// ================ ===== GET=======================
// ================ ================ ================

var queryString = "priority=1^state=1";  
var gr = new GlideRecord('incident');
gr.setLimit(10); //Sets the limit for number of records are fetched by the GlideRecord query.
gr.orderBy('short_description'); //Results are arranged in ascending order, see orderByDesc(String name) to arrange records in descending order.
gr.isEncodedQueryValid(queryString); //determine if a encoded query is valid, if the encoded query is not valid don't retrieve any records
//gr.addEncodedQuery(queryString);
gr.query();
gs.info("Records in table: " + gr.getRowCount()); //Retrieves the number of rows in the query result.
while (gr.next()){ //Moves to the next record in the GlideRecord object.
	gs.info(gr.getValue('caller')); //Retrieves the string value. Output: Sys_id
	gs.info(gr.getDisplayValue('caller')); //The display value for the current record. Output: Name
}

/*
isEncodedQueryValid determine if a encoded query is valid:
true: passed-in encoded query is valid
false: passed-in encoded query is not valid */
var gr = new GlideRecord('incident_sla');
var isValidQuery = gr.isEncodedQueryValid('inc_impact=1^taskslatable_active=true');
if (isValidQuery) {
       gr.addEncodedQuery('inc_impact=1^taskslatable_active=true');
       gr.query();
			.
			.
		}
```

## INSERT

```jsx
var gr = new GlideRecord('incident');
gr.initialize(); //Creates an empty record suitable for population before an insert.
gr.newRecord(); //Creates a new GlideRecord record, sets the default values for the fields, and assigns a unique ID to the record.

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
```

## DELETE

```jsx
var rec = new GlideRecord('incident');
rec.addQuery('active',false);
rec.query();
while (rec.next()) { 
	gs.print('Inactive incident ' + rec.number + ' deleted'); 
	rec.deleteRecord();
}

//Delete single record
var gr = new GlideRecord('incident');
if (gr.get('99ebb4156fa831005be8883e6b3ee4b9'))
    gr.deleteRecord();
```

## UPDATE

```jsx
//update single record
var gr = new GlideRecord('incident');
gr.get('99ebb4156fa831005be8883e6b3ee4b9');
gr.short_description='Update the short description';
gr.update();
gs.info(gr.getElement('short_description'));
```

```jsx
// update multiples records
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.setValue('state', 4);
gr.updateMultiple();
```

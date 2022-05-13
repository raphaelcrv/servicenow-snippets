# How to make attachment mandatory Plataform UI by Catalog Client Script

/*
Obs:.
Make sure that your untick the 'isolate script field. If it not available in the form go to form layout of the 
client script and add to client script form.
*/

![Image of Yaktocat](https://community.servicenow.com/e8db84bc1b230014fff162c4bd4bcb1a.iix)

```js
/*Add the Script*/
	function onSubmit() {
	
		var attachments = $j('#attachmentNumber_770cc7830a0a0b08005abd85abf0b547').html();

		if(!attachments || parseInt(attachments) <= 0){
			alert('Por gentileza, inclua o anexo preenchido antes de submeter.');
			return false;
		}
	}


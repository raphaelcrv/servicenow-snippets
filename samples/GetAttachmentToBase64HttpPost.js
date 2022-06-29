

  //get the sys_id of the e-mail
  //sys_email.sys_id

  //get the attachment from sys_attachment

  var b64attachment = "";
  var allAttachments = "";
  var attachmentData = "";

  var sa = new GlideRecord('sys_attachment');
  sa.addEncodedQuery('table_sys_idSTARTSWITH919a21b21b505590aadeff3ecc4bcb1f');
  sa.query();
  while(sa.next())
  {
  var attachmentIS = new GlideSysAttachmentInputStream(sa.sys_id);
  var byteArrayOS = new Packages.java.io.ByteArrayOutputStream();

  attachmentIS.writeTo(byteArrayOS);
  b64attachment = GlideBase64.encode(byteArrayOS.toByteArray());
  attachmentData = b64attachment;
  }

  gs.log(attachmentData);


  //POST to the service
  var request = new sn_ws.RESTMessageV2();
  request.setEndpoint('https://dev22614.service-now.com/api/now/table/u_cart_order');
  request.setHttpMethod('POST');

  //Eg. UserName="admin", Password="admin" for this code sample.
  var user = 'admin';
  var password = 'admin';

  request.setBasicAuth(user,password);
  request.setRequestHeader("Accept","application/json");
  request.setRequestHeader('Content-Type','application/json');
  request.setRequestBody('{"u_catalog_item":"Blackberry",' +
                          '"u_variables":"original^299-999-9991|' +
                          'replacement^Yes"}');
  var response = request.execute();
  gs.log(response.getBody());




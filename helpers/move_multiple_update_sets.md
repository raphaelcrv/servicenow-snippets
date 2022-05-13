# Helpers

## Change Multiple Update Set (Move)
```js
var currentUpdateSet = "9679e8561b32289016600d8ce54bcb3f";
var newUpdateSet = "22a9ba8b1bdbe890ef6a64afe54bcb6a";
var gr = new GlideRecord('sys_update_xml');
gr.addEncodedQuery("update_set="+currentUpdateSet+"^sys_created_onON2021-04-08@javascript:gs.dateGenerate('2021-04-08','start')@javascript:gs.dateGenerate('2021-04-08','end')");
gr.setValue('update_set',  newUpdateSet);
gr.updateMultiple();
```
> Notes on the snippet
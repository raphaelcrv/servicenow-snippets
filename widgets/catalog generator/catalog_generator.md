### Catalog Generator

```js
// html code
// your widget template
<div>   
  <h4>1. Upload excel</h4> 
  <small>Faça upload do arquivo excel contendo os dados do catalogo, para baixar o template clique aqui</small>
  <input type="file" id="file" ng-model="csvFile" onchange="angular.element(this).scope().ExcelImport(event)">
    
  <hr/>
  
  <div ng-show="loaded">
    <h4>2. Revisão:</h4>
    <small>Valide todos os itens de serviços disponiveis a serem criados</small>
    <div class="scroll-table">
      <table>
        <tr>
          <th>tipo</th>
          <th>categoria</th>
          <th>subcategoria</th>
          <th>item</th>
          <th>Sincronização</th>
        </tr>
        <tr ng-repeat='row in c.data.rowObj'>
          <td>{{row.tipo}}</td>
          <td>{{row.categoria}}</td>
          <td>{{row.subcategoria}}</td>
          <td>{{row.item}}</td>
          <td>Pendente</td>
        </tr>
      </table>
    </div>

    <hr/>
    <h4>3. Executar:</h4>
    <small>Ao clicar em executar o script vai criar o catalogo de serviços para o contrato informado</small>
    <button ng-click="create()" class="btn btn-primary ng-binding ng-scope">Criar Catalogo</button>  
    <br/>
    <br/>
    <button ng-click="clean()" class="btn btn-primary ng-binding ng-scope">Limpar Catalogo</button>  
    
  </div>

</div>

```

```js
// css code

h4{
	margin-bottom: 5px;
}

small{
 display: block;
 padding: 0 0 20px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}


.scroll-table{
  height: 224px;
  overflow-x: scroll;
  display: block;
  /* width: 100%; */
  overflow: auto;
}

```

```js
// client script code
function($scope) {
	/* widget controller */
	var c = this;
	$scope.loaded = false;

	$scope.ExcelImport = function(event) {

		var input = event.target;
		var reader = new FileReader();

		reader.onload = function() {

			var fileData = reader.result;
			var wb = XLSX.read(fileData, {
				type: 'binary'
			});

			wb.SheetNames.forEach(function(sheetName) {
				c.data.rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
				console.log(c.data.rowObj);
				$scope.loaded = true;
			});				
		};
		reader.readAsBinaryString(input.files[0]);
	}

	$scope.create = function(){
		c.data.createCatalog = true
		c.server.update().then(function(res){
			c.data.createCatalog = false;
			console.log(res);
		});	
	}
	
	$scope.clean = function(){
		c.data.cleanCatalog = true;
		c.server.update().then(function(res){
			c.data.cleanCatalog = false;
			console.log(res);
		});	
	}

}

```

```js
// server script code
(function() {
  /* populate the 'data' object */
  /* e.g., data.table = $sp.getValue('table'); */
	
	if(input.rowObj && input.rowObj[0].contract_id){
		
		var rowObj = input.rowObj;
		data.contract = input.rowObj[0].contract_id		
		
		var grContract = new GlideRecord('u_managed_services');
		if(grContract.get('number',data.contract)){
			data.contractSysId = grContract.getValue('sys_id')
		}else{
			return gs.addErrorMessage('Erro001: Verifique o numero do contrato na planilha do excel');
		}
		
		//create catalog
		if(input.createCatalog){
			gs.addInfoMessage('createCatalog')
			if(catalogIsEmpty()){
				createCatalog();
				gs.addInfoMessage('O catalogo do contrato '+ data.contract +' foi criado com sucesso!')
			}else{
				gs.addErrorMessage('ERRO002 : Não foi possivel gerar o catalogo, para gerar o catalogo não deve existir nenhum item cadastrado');
			}
			
		}

		//clean catalog 
		if(input.cleanCatalog == true){
			gs.addInfoMessage('cleanCatalog')

			deleteCatalog('u_types');
			deleteCatalog('u_categorys');
			deleteCatalog('u_subcategorys');
			deleteCatalog('u_service_item');
			
		}
	
	}
	
	function createCatalog(){
		data.tryAgain = false;
		data.tryAgainArr = []
				
		rowObj.forEach(function(el,i){
			
			var type = getTypeObj((el.tipo).toLowerCase());			
			//return sys_id if exists and false if not exists
			var typeExists = getSysId('u_types', 'u_contract='+data.contractSysId+'^u_type='+type.value)

			if(typeExists){
				type.sys_id = typeExists;
			}else{
				//gs.addInfoMessage('created -> ' + type.name);
				var insType = new GlideRecord('u_types');
				insType.initialize();
				insType.u_type = type.value;
				insType.u_contract = data.contractSysId; 
				insType.u_name = type.name
				//return sys_id
				type.sys_id = insType.insert();				
			}


			
			var category = getObj((el.categoria).toLowerCase());
			var categoryExists = getSysId('u_categorys','u_contract='+data.contractSysId+'^u_name='+category.name+'^u_type='+type.sys_id)
			
			if(categoryExists){
				category.sys_id = categoryExists;
			}else{
				//gs.addInfoMessage('created category -> ' + category.name);
				var insCat = new GlideRecord('u_categorys');
				insCat.initialize();
				insCat.u_type = type.sys_id;
				insCat.u_contract = data.contractSysId; 
				insCat.u_name = category.name
				//return sys_id
				category.sys_id = insCat.insert();	
			}
			
			
			var subCategory = getObj((el.subcategoria).toLowerCase());
			var subCategoryExists = getSysId('u_subcategorys','u_contract='+data.contractSysId+'^u_category='+category.sys_id+'^u_name='+subCategory.name)
			
			if(subCategoryExists){
				subCategory.sys_id = subCategoryExists;
			}else{
				//gs.addInfoMessage('created subCategory -> ' + subCategory.name);
				var insSubCat = new GlideRecord('u_subcategorys');
				insSubCat.initialize();
				insSubCat.u_contract = data.contractSysId; 
				insSubCat.u_category = category.sys_id
				insSubCat.u_name = subCategory.name
				//return sys_id
				subCategory.sys_id = insSubCat.insert();	
			}
			
			

			
			
			var item = getObj((el.item).toLowerCase());
			//var itemExists = getSysId('u_service_item','u_contract='+data.contractSysId+'^u_category='+category.sys_id+'^u_subcategory='+subCategory.sys_id+'^u_type='+type.sys_id+'^u_item='+item.name)
			
			if(subCategory.sys_id != false){
				
				//gs.addInfoMessage('created item -> ' + item.name);
				var insItem = new GlideRecord('u_service_item');
				insItem.initialize();
				insItem.u_contract = data.contractSysId; 
				insItem.u_type = type.sys_id
				insItem.u_category = category.sys_id
				insItem.u_subcategory = subCategory.sys_id
				insItem.u_item = item.name
				//return sys_id
				insItem.insert();	

			}else{
				data.tryAgain = true;
				data.tryAgainArr.push({
					'tipo': type.name,
					'categoria': category.name,
					'subcategoria': subCategory.name,
					'item': item.name,
					'contract_id': data.contract
				})
			}
			
			
			
		})
		
	}
	

	function getTypeObj(tipo){
		
		switch(tipo){
			case 'alerta' : tipo = {'name' : tipo,'value' : 0	}
			break;
			
			case 'incidente' : tipo = {'name' : tipo,'value' : 1	}
			break;
			
			case 'mudança' : tipo = {'name' : tipo,'value' : 2	}
			break;
				
			case 'problema' : tipo = {'name' : tipo,'value' : 3	}
			break;
				
			case 'requisição' : tipo = {'name' : tipo,'value' : 4	}
			break;
				
			case 'rotina' : tipo = {'name' : tipo,'value' : 5	}
			break;
				
			case 'sustentação' : tipo = {'name' : tipo,'value' : 6	}
			break;
		}

		return tipo;
	}
	
	function getObj(name){
		return {
			'sys_id' : false,
			'name' : name
		}
	}
	
	function getSysId(table, query){
		var sys_id = false;
		//verifica se ja existe o param para o contrato
		var grHasType = new GlideRecord(table);
		grHasType.addQuery(query);
		grHasType.query();
		
		var count = grHasType.getRowCount();
		//caso exista retorna o sys_id
		if (count > 0) {
			while(grHasType.next()){				
				sys_id =  grHasType.sys_id;
			}
		}
		return sys_id;
	}
	
	
	
	function deleteCatalog(table){
			var gr = new GlideRecord(table);
			gr.addQuery('u_contract',data.contractSysId);
			gr.query();
			var count = gr.getRowCount();
			if (count > 0) {
				while (gr.next()) {
					gr.setWorkflow(false)
					gr.deleteRecord();
				}
			}
	}
	
	function catalogIsEmpty(){
		//in case getRecords return true the catalog is not empety
		if(getRecordsFrom('u_types') || getRecordsFrom('u_categorys') || getRecordsFrom('u_subcategorys')){
			return false;
		}else{
			return true;
		}
	}	
	
	function getRecordsFrom(table){
		var gr = new GlideRecord(table);
		if(gr.get('u_contract',data.contractSysId)){
			return true;
		}else{
			return false;
		}
	}
	


})();

```

> Notes on the snippet

----
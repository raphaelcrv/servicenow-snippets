//Javscript Code Validations

//Check if has Property
var vehicle = {
    "year" : 2018,
    "make"  : "Toyota",
    "model" : "Sienna"
  };
  gs.info(vehicle.hasOwnProperty("year"));  // <== true
  gs.info(vehicle.hasOwnProperty("price")); // <== false
  
  //
  // Simple Objects
  //
  
  var box = {};
  box.height   = 20;
  box.width    = 10;
  box.length   = 10;
  box.material = "cardboard";
  box.open     = true;
  gs.info(box.material);
  
  //
  // Foreach
  //
  var list = [1, 3, 5];
  
  list.forEach(myFunction);
  
  function myFunction(item) {
    gs.info('myFunction item=' + item);
  }
  
  //
  //Array Util concat
  //
  
  var arrayUtil = new ArrayUtil();
  var a1 = new Array("a", "b", "c");
  var a2 = new Array("c", "d", "e");
   
  gs.print("concat a1, a2: " + arrayUtil.concat(a1, a2));
  
  
  //
  //Array Util contains
  //
  
  var arrayUtil = new ArrayUtil();
  var a1 = new Array("a", "b", "c");
   
  gs.print("Contains b: " + arrayUtil.contains(a1, "b"));
  gs.print("Contains x: " + arrayUtil.contains(a1, "x"));
  
  Output
  Contains b: true
  Contains x: false
  
  //
  //Array Util unique
  //Removes duplicate items from an array.
  
  
  var arrayUtil = new ArrayUtil();
  var a1 = new Array("a", "b", "c", "c", "b");
  gs.print(arrayUtil.unique(a1));
  
  //
  // Classes, Objects, and Prototypes
  //
  
  var person = Class.create();
  person.prototype = {
      initialize: function() {
        this.firstName = '';
        this.lastName  = '';
      },
  
      setFirstName : function(str) {
        this.firstName = str;
      },
  
      setLastName : function(str) {
        this.lastName = str;
      },
  
      getDisplayName : function() {
        return this.firstName + ' ' + this.lastName;
      },
  
      type: person
  };
  
  var me = new person();
  me.setFirstName('Chuck');
  me.setLastName('Tomasi')
  gs.info('me=' + me.firstName + ' ' + me.lastName); // Not advised
  var name = me.getDisplayName();
  gs.info(name);
  
  
  //
  // Inheritance
  //
  
  var vehicle = Class.create();
  vehicle.prototype = {
      initialize: function(year, make, model) {
        this.make = make;
        this.model = model;
        this.year = year;
      },
  
      register : function() {
        gs.info(this.getDisplayName() + ' registered!');
      },
  
      info : function() {
        gs.info('Vehicle info: TBD');
      },
  
      getDisplayName : function() {
  
        return this.year + ' ' + this.make + ' ' + this.model;
  
      },
  
      type: 'vehicle'
  };
  
  var v1 = new vehicle('2018', 'John Deere', 'Tractor');
  v1.register();
  v1.info();
  
  
  //
  // Exception code
  //
  
  try {
    for (var i = 0; i < 5; i++) {
      gs.info('i=' + i + ' answer=' + answer);
    }
  } catch (e) {
    gs.error('Uh-oh ' + e.message);
  } finally {
    gs.info('done');
  }
  
  
  //
  // self runing function
  //
  
  (function(){
  
  
  
  }());
  
  
  //
  // object Oriented methods
  // usefull on portal server side developments
  
  var vehicle = {
  
      "getName" : function(){
          return 'ford';
      },
          
      "alertName" : function(){
          return alert('name is:' + this.getName());
      }
  }
  
  
  vehicle["alertName"]();
  
  
  //
  // Nested Loops
  //
  //
  
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 3; j++) {
      gs.info('i=' + i + ' j=' + j);
    }
  }
  gs.info('Done i=' + i + ' j=' + j);
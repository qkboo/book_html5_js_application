var Hello = function(n) {
  var msg = 'Hello~~~!',
  name = n;
      
  this.getName = function() {
      return this.name;
  };
  this.getMessage = function() {
       return n + " " + msg;
  };
};

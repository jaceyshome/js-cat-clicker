function Scope(id){
  var scope = this;
  scope.__id = id;
  return scope;
}

Scope.prototype.extend = function(obj){
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};

Scope.prototype.getChildren = function(){

};
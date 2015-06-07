function Scope(id){
  var scope = this;
  scope.__id = id;
  scope.$$parent = null;
  scope.$$children = [];
  return scope;
}

Scope.prototype.extend = function(obj){
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};

Scope.prototype.init = function(){
  var scope = this;
  if(scope.template){
    scope.$$element.innerHTML = scope.template.replace(/{{(.*?)}}/g, function(match,p1){
      return scope[p1] != undefined ? scope[p1]:'';
    });
  }
};

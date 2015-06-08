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
      this[i] = this[i] || obj[i];
    }
  }
};

Scope.prototype.init = function(){
  var scope = this, keys=null, obj=null;
  if(scope.template){
    scope.$$element.innerHTML = scope.template.replace(/{{(.*?)}}/g, function(match,p1){
      keys = p1.split(".");
      obj = scope;
      for(var i = 0, len = keys.length; i<len; i++){
        obj = obj[keys[i]];
        if(obj == undefined){
          return '';
        }
      }
      return obj;
    });
  }

};

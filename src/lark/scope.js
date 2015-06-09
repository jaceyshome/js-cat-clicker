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

Scope.prototype.$apply = (lark.addService('$apply',['$digest',function($digest){
  return function(){
    $digest.loop();
  }
}]));

Scope.prototype.$watch = (lark.addService('$watch',['$digest',function($digest){
  return function(expression, fn){
    var scope = this;
    switch (typeof expression){
      case 'string':
        $digest.watch(
          function(){
            return scope.getExpressionValue(expression);
          },
          fn
        );
        break;
      case 'function':
        $digest.watch(
          expression.bind(scope),
          fn
        );
        break;
      default :
        return;
    }
    $digest.loop();
  }
}]));

Scope.prototype.getExpressionValue = function(expression){
  var keys = expression.split('.'), obj = this[keys[0]];
  for(var i= 1, len=keys.length; i<len; i++){
    if(obj != undefined){
      obj = obj[keys[i]]
    }else{
      return undefined;
    }
  }
  return obj;
};
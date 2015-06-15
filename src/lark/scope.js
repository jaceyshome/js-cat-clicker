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

Scope.prototype.$apply = (lark.addService('$apply',['$refresh',function($refresh){
  return $refresh.loop;
}]));

Scope.prototype.$watch = (lark.addService('$watch',['$refresh',function($refresh){
  return function(expression, fn){
    var scope = this;
    switch (typeof expression){
      case 'string':
        $refresh.watch(
          function(){
            return scope.$getExpressionValue(expression);
          },
          fn
        );
        break;
      case 'object':
        $refresh.watch(
          function(){
            return Array.prototype.map.call(expression, function(val){
              return scope.$getExpressionValue(val);
            });
          },
          fn
        );
        break;
      case 'function':
        $refresh.watch(
          expression.bind(scope),
          fn
        );
        break;
      default :
        return;
    }
    $refresh.loop();
  }
}]));

Scope.prototype.$getExpressionValue = function(expression){
  //TODO handle expression
  //conditions:
  //{{currentCat.name}}
  //{{1+2}}
  expression = expression.replace("{{",'').replace("}}",'');
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

Scope.prototype.$applyExpressionValue = function(expression,val){
  //TODO handle expression
  //conditions:
  //{{currentCat.name}}
  //{{1+2}}
  expression = expression.replace("{{",'').replace("}}",'');
  var keys = expression.split('.'), lastKey = keys.pop(), obj = this[keys[0]];
  for(var i= 1, len=keys.length; i<len; i++){
    if(obj != undefined){
      obj = obj[keys[i]]
    }else{
      return undefined;
    }
  }
  obj[lastKey] = val;
};
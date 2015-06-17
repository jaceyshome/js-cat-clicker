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

Scope.prototype.$apply = function(){
  lark.$refresh.loop();
};

Scope.prototype.$watch = function(expression, fn){
  var scope = this;
  switch (typeof expression){
    case 'string':
      lark.$refresh.watch(
        function(){
          return scope.$getExpValue(expression);
        },
        fn
      );
      break;
    case 'object':
      lark.$refresh.watch(
        function(){
          return Array.prototype.map.call(expression, function(val){
            return scope.$getExpValue(val);
          });
        },
        fn
      );
      break;
    case 'function':
      lark.$refresh.watch(
        expression.bind(scope),
        fn
      );
      break;
    default :
      return;
  }
  this.$apply();
};

Scope.prototype.$getExpValue = function(exp){
  return lark.$expression.$get(this,exp);
};

Scope.prototype.$setExpValue = function(exp,value){
  lark.$expression.$set(this,exp,value);
};


function Scope(id){
  var scope = this, _watchers=[];
  scope.__id = id;
  scope.$$parent = null;
  scope.$$children = [];
  Object.defineProperty(scope,'watchers',{
    get:function(){
      return _watchers;
    },
    set:function(val){
      _watchers.push(val);
    },
    configurable: false,
    enumerable: false
  });
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
      scope.watchers = {
        expression: function(){return scope.$getExpValue(expression);},
        fn: fn
      };
      break;
    case 'object':
      scope.watchers = {
        expression: function(){
            return Array.prototype.map.call(expression, function(val){
              return scope.$getExpValue(val);
            });
          },
        fn: fn
      };
      break;
    case 'function':
      scope.watchers = {
        expression: expression,
        fn: fn
      };
      break;
    default :
      return;
  }
  this.$apply();
};

Scope.prototype.$$execWatchers = function(){
  var watchers = this.watchers, watcher;
  if(watchers && watchers.length > 0){
    for(var i= 0, length = watchers.length; i<length; i++){
      watcher = watchers[i];
      switch (typeof(watcher.expression)){
        case 'function':
          var result = watcher.expression();
          watcher.fn(result);
          break;
        default:
          watcher.fn(watcher.expression);
          break;
      }
    }
  }
};

Scope.prototype.$getExpValue = function(exp){
  return lark.$expression.$get(this,exp);
};

Scope.prototype.$setExpValue = function(exp,value){
  lark.$expression.$set(this,exp,value);
};


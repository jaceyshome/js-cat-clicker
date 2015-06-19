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
      scope.watchers = (function(scope){
        var oldValue = null, newValue, firstRun = true;
        return function(){
          newValue = scope.$getExpValue(expression);
          if((oldValue !== newValue || firstRun == true) && typeof fn == "function"){
            firstRun = false;
            fn(newValue);
            oldValue = newValue;
          }
        };
      })(scope);
      break;
    case 'object':
      scope.watchers = (function(scope){
        var oldValues = null, newValues, firstRun = true;
        return function(){
          newValues = Array.prototype.map.call(expression, function(val){
            return scope.$getExpValue(val);
          });
          if((oldValues !== newValues || firstRun == true) && typeof fn == "function"){
            firstRun = false;
            fn(newValues);
            oldValues = newValues;
          }
        };
      })(scope);
      break;
    case 'function':
      scope.watchers = (function(scope){
        var oldValue = null, newValue, firstRun = true;
        return function(){
          newValue = expression.call(scope);
          if((oldValue !== newValue || firstRun == true) && typeof fn == "function"){
            firstRun = false;
            fn(newValue);
            oldValue = newValue;
          }
        };
      })(scope);
      break;
    default :
      return;
  }
  this.$apply();
};

Scope.prototype.$execWatchers = function(){
  var watchers = this.watchers, watcher;
  if(watchers && watchers.length > 0){
    for(var i= 0, length = watchers.length; i<length; i++){
      watcher = watchers[i];
      watcher();
    }
  }
};

Scope.prototype.$getExpValue = function(exp){
  return lark.$expression.$get(this,exp);
};

Scope.prototype.$setExpValue = function(exp,value){
  lark.$expression.$set(this,exp,value);
};


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
        var cachedValue = null, newValue, firstRun = true;
        return function(){
          newValue = scope.$getExpValue(expression);
          if((cachedValue != JSON.stringify(newValue) || firstRun == true) && typeof fn == "function"){
            firstRun = false;
            console.log();
            fn(newValue);
            cachedValue = JSON.stringify(newValue);
          }
        };
      })(scope);
      break;
    case 'object':
      scope.watchers = (function(scope){
        var cachedValue = null, newValue, firstRun = true;
        return function(){
          newValue = Array.prototype.map.call(expression, function(val){
            return scope.$getExpValue(val);
          });
          if((cachedValue != JSON.stringify(newValue)|| firstRun == true) && typeof fn == "function"){
            firstRun = false;
            fn(newValue);
            cachedValue = JSON.stringify(newValue);
          }
        };
      })(scope);
      break;
    case 'function':
      //Watcher function won't cache value, as it will give more controls to $scope itself
      scope.watchers = (function(scope){
        return function(){
          if(typeof fn == "function"){
            fn(expression.call(scope));
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
      (typeof watcher == 'function') && watcher();
    }
  }
};

Scope.prototype.$destroy = function(){
 //TODO deregister listeners
 delete this.watchers;
 this.$$children.forEach(function(child){
   child.$destroy();
 });
 this.$$parent.$removeChild(this);
};

Scope.prototype.$removeChild = function(childScope){
  this.$$children.splice(this.$$children.indexOf(childScope),1);
};

Scope.prototype.$addChild = function(childScope){
  if(typeof this.$$children == undefined){
    this.$$children = [];
  }
  this.$$children.push(childScope);
};

Scope.prototype.$getExpValue = function(exp){
  return lark.$expression.$get(this,exp);
};

Scope.prototype.$setExpValue = function(exp,value){
  lark.$expression.$set(this,exp,value);
};


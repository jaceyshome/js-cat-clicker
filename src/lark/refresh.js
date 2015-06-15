lark.addService('$refresh',[function(){
  var $refresh= {}, watchers = [];

  $refresh.watch = function(expression, fn){
    watchers.push({
      expression: expression,
      fn: fn
    })
  };

  $refresh.loop = function(){
    var watcher;
    for(var i= 0, length = watchers.length; i<length; i++){
      watcher = watchers[i];
      switch (typeof(watcher.expression)){
        case 'function':
          watcher.fn(watcher.expression());
          break;
        case 'string':
          watcher.fn(watcher.expression);
          break;
        default:
          watcher.fn(watcher.expression);
          break;
      }
    }
  };

  return $refresh;
}]);
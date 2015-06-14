lark.addComponent('jsRepeat',[function(){
  return function(){
    return {
      priority: 1000,
      link: (function($scope,$element,$attr){
        var expression = $element.getAttribute('js-repeat') || $element.getAttribute('data-js-repeat'), element, scope, scopeObj ,
          results = expression.match(/(\w+)\s+?[Ii][Nn]\s+?(\w+)/),
          match = results[0],
          targetKey = results[1],
          scopeObjKey = results[2];

        if(expression && $scope[targetKey] == undefined){
          scopeObj = $scope.$getExpressionValue(scopeObjKey);
          (typeof scopeObj != undefined) && Array.prototype.forEach.call(scopeObj, function(obj, index, array){
            if(index == 0){
              $scope[targetKey] = obj;
            }else{
              //create new scope and element
              scope = lark.createScope($scope.$$parent);
              scope.extend($scope);
              scope[targetKey] = obj;
              element = jQuery.clone($element);
              $element.parentElement.appendChild(element);
              lark.bindMatchedComponents(scope,element);
            }
          });
        }
      })
    }
  }
}]);


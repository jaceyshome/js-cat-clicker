lark.addComponent('jsClick',[function(){
  return function(){
    return {
      link: (function($scope,$element){
        var fnStr = $element.getAttribute('js-click') || $element.getAttribute('data-js-click'),
          fnName = fnStr.replace(/\(.*?\)/g, '');
        $element.addEventListener("click", function(){
          ($scope[fnName] != undefined) && $scope[fnName]();
          $scope.$apply();
        }, false);
      })
    }
  }
}]);


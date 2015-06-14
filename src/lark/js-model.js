lark.addComponent('jsModel',[function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var expression = $element.getAttribute('js-model') || $element.getAttribute('data-js-model');
        if(expression){
          $element.value = $scope.$getExpressionValue(expression);
        }

        $scope.$watch(expression,function(val){
          $element.value = val;
        });

        $element.addEventListener("keyup",function(e){
          $scope.$applyExpressionValue(expression, e.target.value);
          $scope.$apply();
        });

      })
    }
  }
}]);


lark.addComponent('jsIf',[function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var expression = $element.getAttribute('js-if') || $element.getAttribute('data-js-if');
        var $parentNode = $element.parentNode;
        $scope.$watch(expression,function(val){
          if(val){
            if(!$element.parentNode){
              $parentNode.appendChild($element);
            }
          }else{
            $parentNode.removeChild($element);
          }
        });
      })
    }
  }
}]);


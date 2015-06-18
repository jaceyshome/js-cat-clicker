lark.addComponent('jsSrc',[function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var oldValue = null;
        $scope.$watch(
          function(){
            return $element.getAttribute('js-src') || $element.getAttribute('data-js-src');
          },
          function(newValue){
            if(oldValue != newValue){
              $element.setAttribute('src',newValue);
              oldValue = newValue;
            }
          }
        );
      })
    }
  }
}]);


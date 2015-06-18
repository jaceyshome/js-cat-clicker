lark.addComponent('jsSrc',[function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var oldValue = null;
        $scope.$watch(
          function(){
            return $element.getAttribute('js-src') || $element.getAttribute('data-js-src');
          },
          function(val){
            $element.setAttribute('src',val);
          }
        );
      })
    }
  }
}]);


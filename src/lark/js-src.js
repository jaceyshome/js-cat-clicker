lark.addComponent('jsSrc',[function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        $scope.$watch(
          function(){
            return $element.getAttribute('js-src') || $element.getAttribute('data-js-src');
          },
          function(val){
            if(val){
              $element.setAttribute('src',val);
            }
        });
      })
    }
  }
}]);


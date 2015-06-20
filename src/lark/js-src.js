lark.addComponent('jsSrc',[function(){
  return function(){
    return {
      link: (function($scope,$element){
        var oldValue = null;
        //TODO update the function watchers
        $scope.$watch(
          function(){
            return $element.getAttribute('js-src') || $element.getAttribute('data-js-src');
          },
          (function(){
            var oldValue = null;
            return function(newVal){
              if(oldValue != newVal){
                $element.setAttribute('src',newVal);
                oldValue = newVal;
              }
            }
          })()
        );
      })
    }
  }
}]);


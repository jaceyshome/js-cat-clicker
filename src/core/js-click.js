myApp.addComponent('jsClick',(function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var fnStr = $element.getAttribute('js-click') || $element.getAttribute('data-js-click'),
          fnName = fnStr.replace(/\(.*?\)/g, '');
        if($scope.$$parent[fnName]){
          $element.addEventListener("click", $scope.$$parent[fnName], false);
        }

      })
    }
  }
})());


(function(){
  ('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ')).forEach(function(eventName){
    var marker = 'js',
      componentName = marker+eventName.charAt(0).toUpperCase() + eventName.slice(1),
      attrName = marker+'-'+eventName;
    lark.addComponent(componentName,[function(){
      return function(){
        return {
          link: (function($scope,$element){
            var fnStr = $element.getAttribute(attrName) || $element.getAttribute('data-'+attrName),
              fnName = fnStr.replace(/\(.*?\)/g, '');
            $element.addEventListener(eventName, function(){
              ($scope[fnName] != undefined) && $scope[fnName]();
              $scope.$apply();
            }, false);
          })
        }
      }
    }]);
  });
})();


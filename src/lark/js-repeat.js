lark.addComponent('jsRepeat',[function(){
  return function(){
    return {
      priority: 1000,
      link: (function($scope,$element,$attr){
        var expression = $element.getAttribute('js-repeat') || $element.getAttribute('data-js-repeat'), results, match, targetObjKey, parentObjKey, childElement, scope,
          firstChild = true, totalChildren = 0,
          startMarker = "jsRepeat: {{match}} start",
          endMarker = "jsRepeat: {{match}} end"
          ;
        if(expression){
          results = expression.match(/(\w+)\s+?[Ii][Nn]\s+?(\w+)/);
          match = results[0];
          targetObjKey = results[1];
          parentObjKey = results[2];
          if(typeof $scope.$$parent[parentObjKey] != undefined && $scope[targetObjKey] == undefined){
            for(var key in $scope.$$parent[parentObjKey]){
              if($scope.$$parent[parentObjKey].hasOwnProperty(key)){
                if(firstChild == true){
                  setFirstChild($scope.$$parent[parentObjKey][key], targetObjKey);
                  firstChild = false;
                }else{
                  childElement = $element.cloneNode(true);
                  $scope.$$parent.$$element.appendChild(childElement);
                  scope = lark.createScope($scope.$$parent,childElement);
                  scope[targetObjKey] = $scope.$$parent[parentObjKey][key];
                  lark.bindComponentsToScope(scope, childElement);
                  addCommentBeforeChild(endMarker, childElement);
                  addCommentBeforeChild(startMarker, childElement);
                }
              }
            }
            childElement = null;
            $scope.$$parent.$$element.appendChild(
              document.createComment(endMarker.replace(/{{match}}/, match))
            );
          }
        }

        function setFirstChild(object, key){
          $scope[key] = object;
          addCommentBeforeChild(startMarker, $scope.$$parent.$$element.firstChild);
        }

        function addCommentBeforeChild(marker, childNode){
          $scope.$$parent.$$element.insertBefore(
            document.createComment(marker.replace(/{{match}}/, match)),
            childNode
          );
        }


      })
    }
  }
}]);


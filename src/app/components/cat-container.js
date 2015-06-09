lark.addComponent('catContainer',['catService',function(catService){
  return function(){
    return {
      scope: {},
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{currentCat.src}}" alt="cat image"/></a><div class="messageContainer">{{currentCat.counter}}</div>',
      link: (function($scope,$element,$attr){

        $scope.currentCat = catService.currentCat;

        $scope.clickImage = function(e){
          console.log("click me", $scope.currentCat);
          $scope.currentCat && updateCounter();
        };

        function updateCounter(){
          $scope.currentCat.counter += 1;
          console.log("counter", $scope.currentCat.counter);
        }
      })
    }
  }
}]);


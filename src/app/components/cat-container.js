lark.addComponent('catContainer',['catService',function(catService){
  return function(){
    return {
      scope: {},
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{currentCat.image}}" alt="cat image"/></a>',
      link: (function($scope,$element,$attr){

        $scope.currentCat = catService.currentCat;

        $scope.clickImage = function(e){
          $scope.currentCat && updateCounter();
        };

        function updateCounter(){
          $scope.currentCat.counter += 1;
        }
      })
    }
  }
}]);


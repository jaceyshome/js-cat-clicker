lark.addComponent('catAvatar',['catService',function(catService){
  return function(){
    return {
      scope: {
        cat: "="
      },
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{cat.src}}" alt="cat image"/><span>{{cat.name}}</span></a>',
      link: (function($scope,$element,$attr){
        $scope.clickImage = function(e){
          catService.currentCat = $scope.cat;
          $scope.$apply();
        };
      })
    }
  }
}]);


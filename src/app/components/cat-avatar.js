lark.addComponent('catAvatar',[function(){
  return function(){
    return {
      scope: {
        imageSrc: "="
      },
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{imageSrc}}" alt="cat image"/></a>',
      link: (function($scope,$element,$attr){

        $scope.clickImage = function(e){

        };
      })
    }
  }
}]);


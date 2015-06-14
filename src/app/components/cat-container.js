lark.addComponent('catContainer',['catService',function(catService){
  return function(){
    return {
      scope: {},
      template:
        'click {{catService.currentCat.name}} <a href="javascript:void(0);" data-js-click="clickImage()">' +
          '<img data-js-src="{{catService.currentCat.src}}" alt="cat image for {{catService.currentCant.name}}"/>' +
          '<span>{{catService.currentCat.name}} has been clicked by {{catService.currentCat.counter}} times</span>' +
        '</a>',
//        '<div class="messageContainer">counter: {{catService.currentCat.counter}}</div>',
      link: (function($scope,$element,$attr){
        $scope.catService = catService;
        $scope.clickImage = function(e){
          catService.currentCat && (catService.currentCat.counter += 1);
        };
      })
    }
  }
}]);


lark.addComponent('catList',['catService', function(catService){
  return function(){
    return {
      scope: {
        imageSrc: "="
      },
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{imageSrc}}" alt="cat image"/></a><p class="messageHolder"></p>',
      link: (function($scope,$element,$attr){
        console.log("catService", catService);

      })
    }
  }
}]);


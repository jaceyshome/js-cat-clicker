lark.addComponent('catContainer',[function(){
  return function(){
    return {
      scope: {
        imageSrc: "="
      },
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{imageSrc}}" alt="cat image"/></a><p class="messageHolder"></p>',
      link: (function($scope,$element,$attr){
        var counter = 0, $messageHolder;

        function init(){
          getMessageElement();
          updateMessage();
        }

        function getMessageElement(){
          $messageHolder = $element.children[1];
        }

        function updateMessage(){
          $messageHolder.innerHTML = "<span>"+counter+"</span>";
        }

        $scope.clickImage = function(e){
          counter += 1;
          updateMessage();
        };

        init();

      })
    }
  }
}]);


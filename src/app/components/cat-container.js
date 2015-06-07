lark.addComponent('catContainer',(function(){
  return function(){
    return {
      scope: {
        imageSrc: "="
      },
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img data-js-src="{{imageSrc}}" alt="cat image"/></a><p class="message">{{counter}}</p>',
      link: (function($scope,$element,$attr){
        var counter = 0, $messageContainer;

        function init(){
          getMessageElement();
          updateMessage();
        }

        function getMessageElement(){
          for(var i = 0, length = $element.children.length; i<length; i++){
            if($element.children[i].className == 'message'){
              $messageContainer = $element.children[i];
            }
          }
        }

        function updateMessage(){
          $messageContainer.innerHTML = "<span>"+counter+"</span>";
        }

        $scope.clickImage = function(e){
          counter += 1;
          updateMessage();
        };

        init();

      })
    }
  }
})());


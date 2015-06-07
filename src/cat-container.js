myApp.addComponent('catContainer',(function(){
  return function(){
    return {
      template: '<a href="javascript:void(0);" data-js-click="clickImage()"><img src="assets/images/cat.jpg" alt="cat image"/></a><p class="message"></p>',
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


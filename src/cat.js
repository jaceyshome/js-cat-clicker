myApp.addComponent('catContainer',(function(){
  return function(){
    return {
      template: '<a href="javascript:void(0);"><img src="assets/images/cat.jpg" alt="cat image"/></a><p class="message"></p>',
      link: (function($scope,$element,$attr){
        var counter = 0, $messageContainer;

        function init(){
          $scope.addEventListener('click',clickImage);
          getMessageElement();
          updateMessage();
        }

        function getMessageElement(){
          for(var i = 0, length = $scope.children.length; i<length; i++){
            if($scope.children[i].className == 'message'){
              $messageContainer = $scope.children[i];
            }
          }
        }

        function updateMessage(){
          $messageContainer.innerHTML = "<span>"+counter+"</span>";
        }

        function clickImage(e){
          counter += 1;
          updateMessage();
        }

        init();

      })
    }
  }
})());


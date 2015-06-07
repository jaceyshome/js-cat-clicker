myApp.addComponent('catContainer',(function(){
  return function(){
    return {
      template: '<a href="javascript:void(0);" onclick="clickImage()"><img src="assets/images/cat.jpg" alt="cat image"/></a><p class="message">{{counter}}</p>',
      link: (function($scope,$element,$attr){
        $scope.counter = 0;
        $scope.clickImage = function(){
          $scope.counter += 1;
        }
      })
    }
  }
})());


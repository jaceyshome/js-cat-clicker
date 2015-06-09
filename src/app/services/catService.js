lark.addService('catService',[function(){
  var service = {};

  service.cats = [
    {
      src: "assets/images/cat.jpg",
      counter: 5
    },
    {
      src: "assets/images/cat2.jpg",
      counter: 5
    },
    {
      src: "assets/images/cat-vet.jpg",
      counter: 5
    }
  ];

  service.currentCat = null;

  return service;
}]);
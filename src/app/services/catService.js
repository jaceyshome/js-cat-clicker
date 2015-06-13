lark.addService('catService',[function(){
  var service = {};

  service.cats = [
    {
      name: "lonely cat",
      src: "assets/images/cat.jpg",
      counter: 0
    },
    {
      name: 'cute cat',
      src: "assets/images/cat2.jpg",
      counter: 1
    },
    {
      name: 'max',
      src: "assets/images/cat-vet.jpg",
      counter: 2
    },
    {
      name: 'solider',
      src: "assets/images/cat3.jpg",
      counter: 3
    },
    {
      name: 'angel',
      src: "assets/images/cat4.jpg",
      counter: 4
    }
  ];

  service.currentCat = service.cats[0];

  return service;
}]);
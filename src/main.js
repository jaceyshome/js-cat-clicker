
var myApp = (function(){
  var myApp = {}, entityTotal = 0,
    $mainContainer = document.getElementById("mainContainer"),
    $mainChildren = $mainContainer.children,
    components = [];

  function generateUID(){
    var id = "_" + entityTotal;
    entityTotal += 1;
    return id;
  }

  myApp.addComponent = function(name,fn){
    components.push({
      name: name,
      attr: name.replace(/([A-Z])/g, "-$1").toLowerCase(),
      fn: fn
    });
  };

  myApp.run = function(){
    console.log(components);
    setup();
  };

  function setup(){
    for(var index = 0, length=$mainChildren.length; index<length; index++){
      for(var comIndex = 0, comLength=components.length; comIndex<comLength; comIndex++){
        if($mainChildren[index].hasAttribute(components[comIndex].attr) ||
          $mainChildren[index].hasAttribute("data-"+components[comIndex].attr)){
          setupComponent($mainChildren[index], components[comIndex]);
        }
      }
    }
  }

  function setupComponent(element, component){
    var inner = component.fn();
    inner.link(element);
    element.innerHTML = inner.template;
  }

  return myApp;

})();


document.addEventListener("DOMContentLoaded", function(){
  myApp.run();
});
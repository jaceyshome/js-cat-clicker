
var myApp = (function(){
  var myApp = {}, entityTotal = 0,
    $mainContainer = document.getElementById("mainContainer"), appScope = {},
    components = [], services = [];

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
    loopElements(appScope, $mainContainer.children);
  };

  function loopElements(parentScope, elements){
    for(var index = 0, length=elements.length; index<length; index++){
      createElementScope(parentScope, elements[index]);
    }
  }

  function createElementScope(parentScope, element){
    var _scope = createScope(parentScope, element);
    for(var i = 0, comLength=components.length; i<comLength; i++){
      if(element.hasAttribute(components[i].attr) ||
        element.hasAttribute("data-"+components[i].attr)){
        loadScope(_scope, element, components[i]);
        if(element.children && element.children.length > 0){
          loopElements(_scope,element.children);
        }
      }
    }
  }

  function createScope(parentScope, element){
    var _scope =  {
      __id: generateUID()
    };
    element.__scope = _scope;
    _scope.$$parent = parentScope;
    return _scope;
  }

  function loadScope(scope,element, component){
    var inner = component.fn();
    if(inner.template){
      element.innerHTML = inner.template;
    }
    inner.link(scope,element);
    return scope;
  }

  return myApp;

})();


document.addEventListener("DOMContentLoaded", function(){
  myApp.run();
});
var lark = (function(){
  var lark = {}, entityTotal = 0,
    $mainContainer = null, appScope = null,
    components = [], services = {};

  lark.addApp = function(elementId){
    $mainContainer = document.getElementById(elementId);
    appScope = new Scope(generateUID());
  };

  lark.addComponent = function(name,args){
    var _fn = args.pop(),
      _argServices = getServicesFromNames(args);
    components.push({
      name: name,
      attr: name.replace(/([A-Z])/g, "-$1").toLowerCase(),
      fn: _fn.apply(this, _argServices)
    });
  };

  lark.addService = function(name, args){
    var _fn = args.pop(),
      _argServices = getServicesFromNames(args);
    services[name] = Service.call(_fn.apply(this,_argServices), generateUID());
  };

  lark.run = function(){
    loopElements(appScope, $mainContainer.children);
  };

  lark.bindComponentsToScope = bindComponentsToScope;
  lark.createScope = createScope;

  function generateUID(){
    var id = "_" + entityTotal;
    entityTotal += 1;
    return id;
  }

  function getServicesFromNames(objNames){
    var _objects = [];
    if(!objNames){
      return [];
    }
    for(var i= 0,length=objNames.length;i<length;i++){
      _objects.push(services[objNames[i]]);
    }
    return _objects;
  }

  function loopElements(parentScope, elements){
    for(var index = 0, length=elements.length; index<length; index++){
      bindComponentsToScope(createScope(parentScope, elements[index]), elements[index]);
    }
  }

  function bindComponentsToScope(scope, element){
    for(var i = 0, comLength=components.length; i<comLength; i++){
      if(element.hasAttribute(components[i].attr) ||
        element.hasAttribute("data-"+components[i].attr)){
        bindComponentToScope(scope, components[i]);
        if(element.children && element.children.length > 0){
          loopElements(scope,element.children);
        }
      }
    }
  }

  function createScope(parentScope, element){
    var _scope =  new Scope(generateUID());
    _scope.$$parent = parentScope;
    _scope.$$element = element;
    parentScope.$$children.push(_scope);
    return _scope;
  }

  function bindComponentToScope(scope,component){
    var inner = component.fn(),innerScope = {}, attr=null;
    if(inner.scope){
      for(var key in inner.scope){
        attr = key.replace(/([A-Z])/g, "-$1");
        if(inner.scope.hasOwnProperty(key)){
          innerScope[key] = scope.$$element.getAttribute(attr) || scope.$$element.getAttribute("data-"+attr);
        }
      }
      scope.extend(innerScope);
    }
    if(inner.template){
      scope.template = inner.template;
    }
    scope.init();
    inner.link(scope,scope.$$element);
    return scope;
  }

  return lark;

})();


document.addEventListener("DOMContentLoaded", function(){
  lark.run();
});
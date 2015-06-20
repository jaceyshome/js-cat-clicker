var lark = (function(){
  var lark = {}, entityTotal = 0,
    $mainContainer = null, _rootScope = null,
    components = [], services = {};

  Object.defineProperty(lark,"$rootScope", {
    get:function(){
      return _rootScope;
    }
  });

  lark.addApp = function(elementId){
    $mainContainer = document.getElementById(elementId);
    _rootScope = new Scope(generateUID());
  };

  lark.addComponent = function(name,args){
    var _fn = args.pop(),
      _argServices = getServicesFromNames(args);
    components.push({
      name: name,
      attr: name.replace(/([A-Z])/g, "-$1").toLowerCase(),
      fn: _fn.apply(this, _argServices)
    });
//    TODO sort components
//    components.sort(function(a,b){
//      if(a.fn().priority > b.fn().priority){
//        return 1;
//      }
//      if(a.fn().priority < b.fn().priority){
//        return -1;
//      }
//      return 0;
//    });
//    console.log(components);
  };

  lark.addService = function(name, args){
    var _fn = args.pop(),
      _argServices = getServicesFromNames(args);
    services[name] = Service.call(_fn.apply(this,_argServices), generateUID());
    return services[name];
  };

  lark.run = function(){
    setPublicServers();
    loopElements(createScope(_rootScope,$mainContainer), $mainContainer.children);
  };

  lark.bindMatchedComponents = bindMatchedComponents;
  lark.createScope = createScope;
  lark.generateUID = generateUID;

  function setPublicServers(){
    lark.$refresh = services["$refresh"];
    lark.$cache = services["$cache"];
    lark.$expression = services["$expression"];
  }

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

  function loopElements(scope, elements){
    for(var index = 0, length=elements.length; index<length; index++){
      bindMatchedComponents(scope, elements[index]);
    }
  }

  function bindMatchedComponents(scope, element){
    for(var i = 0, comLength=components.length; i<comLength; i++){
      if(element.hasAttribute(components[i].attr) ||
        element.hasAttribute("data-"+components[i].attr)){
        //returning scope will be a child
        scope = bindComponent(scope, element, components[i]);
      }
    }
    addWatchersToElement(scope, element);
    loopElements(scope, element.children);
  }

  function createScope(parentScope){
    var _scope =  new Scope(generateUID());
    _scope.$$parent = parentScope;
    parentScope.$addChild(_scope);
    return _scope;
  }

  function bindComponent(scope, element, component){
    var _component = component.fn(), _scope = {}, attr=null, parentScope = scope;
    //Create a new scope if the scope is isolated, otherwise different elements share the same scope
    if(_component.scope){
      scope = createScope(scope);
      for(var key in _component.scope){
        if(_component.scope.hasOwnProperty(key)){
          attr = key.replace(/([A-Z])/g, "-$1");
          //get object from parent scope
          _scope[key] = parentScope.$getExpValue(element.getAttribute(attr) || element.getAttribute("data-"+attr));
        }
      }
      scope.extend(_scope);
    }
    if(_component.template){
      element.innerHTML = _component.template;
    }
    _component.link(scope,element);
    return scope;
  }

  function addWatchersToElement(scope, element){
    element.hasAttributes() && Array.prototype.forEach.call(element.attributes,function(attr){
      watchElementAttribute(scope, element, attr);
    });
    element.childNodes && Array.prototype.forEach.call(element.childNodes, function(node){
      //only care about text node
      if(node.nodeType == 3){
        //it is text node, need to wrap with span
        watchChildNode(scope,element,node);
      }
    });
  }

  function watchChildNode(scope, element, node){
    var results = node.textContent.match(/{{\s*?(.+?)\s*?}}/ig);
    if(results != null){
      scope.$watch(results, (function(element, node){
        var oldVals, originalTextContent = node.textContent, element = element;
        return function(newVals){
          var newTextContent = originalTextContent;
          if(newVals != oldVals){
            newVals.forEach(function(newVal){
              newTextContent = newTextContent.replace(/({{\s*?.+?\s*?}})/i, newVal != undefined? newVal : '');
            });
            node.textContent = newTextContent;
            oldVals = newVals;
          }
        };
      })(element,node));
    }
  }

  function watchElementAttribute(scope, element, attr){
    var results = attr.value.match(/{{\s*?(.+?)\s*?}}/ig), oldVal;
    if(results != null){
      scope.$watch(results, (function(attr){
        var oldVals, originalValue = attr.value;
        return function(newVals){
          var newValue = originalValue;
          if(newVals != oldVals){
            newVals.forEach(function(newVal){
              newValue = newValue.replace(/({{\s*?.+?\s*?}})/i, newVal != undefined? newVal : '');
            });
            attr.value = newValue;
            oldVals = newVals;
          }
        };
      })(attr));
    }
  }

  return lark;

})();


document.addEventListener("DOMContentLoaded", function(){
  lark.run();
});
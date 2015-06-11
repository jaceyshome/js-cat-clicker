var lark = (function(){
  var lark = {}, entityTotal = 0,
    $mainContainer = null, rootScope = null,
    components = [], services = {};

  lark.addApp = function(elementId){
    $mainContainer = document.getElementById(elementId);
    rootScope = new Scope(generateUID());
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
    return services[name];
  };

  lark.run = function(){
    loopElements(rootScope, $mainContainer.children);
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
        if(inner.scope.hasOwnProperty(key)){
          attr = key.replace(/([A-Z])/g, "-$1");
          innerScope[key] = scope.$$element.getAttribute(attr) || scope.$$element.getAttribute("data-"+attr);
        }
      }
      scope.extend(innerScope);
    }
    if(inner.template){
      scope.template = inner.template;
    }
    bindScopeModelToTemplate(scope);
    inner.link(scope,scope.$$element);
    return scope;
  }

  function bindScopeModelToTemplate(scope){
    if(scope.template){
      scope.$$element.innerHTML = scope.template;
      scope.template += scope.template;
      loopElementChildren(scope, scope.$$element.children);
    }
  }

  function loopElementChildren(scope, children){
    if(children.length == 0){
      return false;
    }
    Array.prototype.forEach.call(children,function(child){
      child.hasAttributes() && Array.prototype.forEach.call(child.attributes,function(attr){
        bindAttrToScope(scope, child, attr);
      });
      bindTextNodesToScope(scope, child);
      loopElementChildren(scope, child.children);
    });
    return true;
  }

  function bindTextNodesToScope(scope,element){
    Array.prototype.forEach.call(element.childNodes, function(childNode, index){
      var results = childNode.textContent.match(/{{\s*?(.+?)\s*?}}/ig);
      if(results != null){
        scope.$watch(results, (function(element){
          var oldVals, originalTextContent = element.textContent;
          return function(newVals){
            var newTextContent = originalTextContent;
            if(newVals != oldVals){
              newVals.forEach(function(newVal){
                newTextContent = newTextContent.replace(/({{\s*?.+?\s*?}})/i, newVal != undefined? newVal : '');
              });
              element.textContent = newTextContent;
              oldVals = newVals;
            }
          };
        })(childNode));
      }
    });
  }

  function bindAttrToScope(scope, element, attr){
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
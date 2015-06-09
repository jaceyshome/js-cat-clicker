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
    var keys=null, obj=null;
    if(scope.template){
      scope.$$element.innerHTML = scope.template;
      scope.template += scope.template;
      loopElementChildren(scope, scope.$$element.children);
//        if(scope.$$element.children[childIndex].hasAttribute()){
//
//        }

//      scope.template.replace(/\s+?([\w-]+)="\s*?{{(.+?)}}\s*?"/ig, function(match, attr, expression){
//        scope.$watch(
//          function(){
//
//          }, function(){
//
//          }
//        );
//
//        console.log(scope.$$element.querySelectorAll("["+p1+"="+p2+"]"));
//        console.log(p1);
//        console.log(p2);
//      });
//

//      scope.$$element.innerHTML = scope.template.replace(/{{(.*?)}}/g, function(match,p1){
//        keys = p1.split(".");
//        obj = scope;
//        for(var i = 0, len = keys.length; i<len; i++){
//          obj = obj[keys[i]];
//          if(obj == undefined){
//            return '';
//          }
//        }
//        return obj;
//      });

    }
  }

  function loopElementChildren(scope, children){
    if(children.length == 0){
      return;
    }
    Array.prototype.forEach.call(children,function(child,index,children){
      loopElementChildren(scope, child.children);
      child.hasAttributes() && Array.prototype.forEach.call(child.attributes,function(attr, index, attributes){
        var results = attr.value.match(/{{\s*?(.+?)\s*?}}/i);
        (results != undefined) && bindData(scope,results[1], child, attr);
      });
    });
  }

  function bindData(scope, expression, element, attr){
    var oldVal = scope.getExpressionValue(expression);
    attr.value = oldVal || '';
    scope.$watch(expression, function(val){
      if(val != oldVal){
        attr.value = val;
        oldVal = val;
      }
    })
  }

  return lark;

})();


document.addEventListener("DOMContentLoaded", function(){
  lark.run();
});
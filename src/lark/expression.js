lark.addService('$expression',["$cache",function($cache){
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    rePropName = /([^.\d]{1}[^.]+\(.*\))|[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var reEscapeChar = /\\(\\)?/g;
  var service = {}, cache = {};


  /*
  * Get the value from object property paths
  * Support:
  * {{cats[0].fn('name',obj.key)}}
  * {{cat.key.name}}
  */
  service.$get = function(obj, exp){
    var defaultValue = '';
    exp = exp.replace(/{{|}}/g,'');
    if(obj == null){
      return;
    }
    var result = cache[exp];
    if(result == undefined){
      result = toPath(exp);
    }
    if(result == undefined){
      return defaultValue;
    }
    cache[exp] = result;
    return getValue(obj,result);
  };


  function get(object, path) {
    var defaultValue = '';
    var result = object == null ? undefined : baseGet(object, toPath(path));
    return result === undefined ? defaultValue : result;
  }

  function set(object, path, value) {
    if (object == null) {
      return object;
    }
    var pathKey = (path + '');
    path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

    var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

    while (nested != null && ++index < length) {
      var key = path[index];
      if (isObject(nested)) {
        if (index == lastIndex) {
          nested[key] = value;
        } else if (nested[key] == null) {
          nested[key] = isIndex(path[index + 1]) ? [] : {};
        }
      }
      nested = nested[key];
    }
    return object;
  }

  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  function isKey(value, object) {
    var type = typeof value;
    if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
      return true;
    }
    if (Object.prototype.toString.call( value ) === '[object Array]') {
      return false;
    }
    var result = !reIsDeepProp.test(value);
    return result || (object != null && value in toObject(object));
  }

  function toPath(value) {
    var result = [];
    //TODO: need to add extra code if the value can be an array.
    value.replace(rePropName, function(match, fn, number, quote, string) {

      console.log("match: ", match);
      console.log("fn: ", fn);
      console.log("path: ", quote);
      console.log("number: ", number);
      console.log("string: ", string);
      result.push(quote ? string.replace(reEscapeChar, '$1') : (handleFnPath(fn) || number || match));
    });
    return result;
  }

  function handleFnPath(match){
    var result = match;
    if(match){
      match.replace(/(.*)\((.*?)\)/ig, function(match, fnName, fnArguments){
        console.log(fnName);
        console.log(fnArguments);
        if(fnName){
          result = (function(){
            return function(master, self){
              var paths = (fnArguments.split(",")).map(function(arg){return toPath(arg)});
              if(typeof self[fnName] == "function"){
                var isArgs = true,args = paths.map(function(path){return getValue(master,path,isArgs)});
                return self[fnName].apply(self, args);
              }
            }
          })();
        }
      })
    }
    return result;
  }

  function getValue(object, path, isFnArgs) {
    var master = object, pathKey = (path+''), result, index = 0, length = path.length;
    if (object == null) {
      return;
    }
    if (pathKey !== undefined && pathKey in toObject(object)) {
      path = [pathKey];
    }
    while (object != null && index < length) {
      console.log(path[index]);
      if(typeof path[index] == "function"){
        object = path[index](master, object);
        console.log("function call result", object);
      }else{
        if(object.hasOwnProperty(path[index])){
          object = object[path[index]];
        }else{
          if(isFnArgs){
            //If object doesn't has this key, return the key if it is function args
            return path[index];
          }else{
            object = null;
          }
        }
      }
      index = index + 1;
    }
    return (index && index == length) ? object : undefined;
  }

  function toObject(value) {
    return isObject(value) ? value : Object(value);
  }

  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }
  return service;

}]);
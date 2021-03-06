lark.addService('$expression',["$cache",function($cache){
  /*
   * Thanks for lodash: https://lodash.com/
   * cache is to save return path array from calling toPath function
   *
   */
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
   * Doesn't support {{2+2=4}}
   */
  service.$get = function(obj, exp){
    if(exp == null){
      return;
    }
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
    return getValue(obj,toPath(exp));
  };


  service.$set = function(object, exp, value) {
    if (object == null) {
      return object;
    }
    var path = cache[exp], pathKey = (path + '');
    if(path == undefined){
      path = toPath(exp);
    }
    if(path == undefined){
      return '';
    }
    cache[exp] = path;
    path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : path;

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
  };

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
      result.push(quote ? string.replace(reEscapeChar, '$1') : (handleFnPath(fn) || number || match));
    });
    return result;
  }

  function handleFnPath(match){
    var result = match;
    if(match){
      match.replace(/(.*)\((.*?)\)/ig, function(match, fnName, fnArguments){
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
      if(typeof path[index] == "function"){
        object = path[index](master, object);
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
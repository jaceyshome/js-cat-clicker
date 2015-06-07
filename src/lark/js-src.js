lark.addComponent('jsSrc',(function(){
  return function(){
    return {
      link: (function($scope,$element,$attr){
        var src = $element.getAttribute('js-src') || $element.getAttribute('data-js-src');

      })
    }
  }
})());


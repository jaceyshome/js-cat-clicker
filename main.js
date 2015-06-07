var myApp = (function(){
  var myApp = {}, btnCatImage = document.getElementById("btnCatImage"),
    messageContainer = document.getElementById("messageContainer"),
    counter = 0;

  function init(){
    btnCatImage.addEventListener("click", onClickBtnCatImage);
    updateMessage();
  }

  function onClickBtnCatImage(e){
    counter += 1;
    updateMessage();
  }

  function updateMessage(){
    messageContainer.innerHTML= "<span>"+counter+"</span>";
  }

  init();

  return myApp;

})();


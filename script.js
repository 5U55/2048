var classWords = [
  { key: "two", value: 2 },
  { key: "four", value: 4 },
  { key: "eight", value: 8 },
  { key: "sixteen", value: 16 },
  { key: "thto", value: 32 },
  { key: "sixtyfor", value: 64 },
  { key: "oteght", value: 128 },
  { key: "tfsix", value: 256 }, 
  { key: "fivtwelve", value: 512 },
  { key: "ttwentyf", value: 1024 },
  { key: "twentfortyat", value: 2048 },
  { key: "4096", value: 4096 },
  { key: "8192", value: 8192 }

];


(function (window, document) {

    'use strict';

    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function (event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    var xDown = null;
    var yDown = null;
    var xDiff = null;
    var yDiff = null;
    var timeDown = null;
    var startEl = null;

    function handleTouchEnd(e) {

        if (startEl !== e.target) return;

        var swipeThreshold = parseInt(getNearestAttribute(startEl, 'data-swipe-threshold', '20'), 10); 
        var swipeTimeout = parseInt(getNearestAttribute(startEl, 'data-swipe-timeout', '500'), 10);  
        var timeDiff = Date.now() - timeDown;
        var eventType = '';
        var changedTouches = e.changedTouches || e.touches || [];

        if (Math.abs(xDiff) > Math.abs(yDiff)) { 
            if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (xDiff > 0) {
                    eventType = 'swiped-left';
                }
                else {
                    eventType = 'swiped-right';
                }
            }
        }
        else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
            if (yDiff > 0) {
                eventType = 'swiped-up';
            }
            else {
                eventType = 'swiped-down';
            }
        }

        if (eventType !== '') {

            var eventData = {
                dir: eventType.replace(/swiped-/, ''),
                xStart: parseInt(xDown, 10),
                xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
                yStart: parseInt(yDown, 10),
                yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10)
            };

            startEl.dispatchEvent(new CustomEvent('swiped', { bubbles: true, cancelable: true, detail: eventData }));


            startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true, detail: eventData }));
        }


        xDown = null;
        yDown = null;
        timeDown = null;
    }

    function handleTouchStart(e) {

        if (e.target.getAttribute('data-swipe-ignore') === 'true') return;

        startEl = e.target;

        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        yDown = e.touches[0].clientY;
        xDiff = 0;
        yDiff = 0;
    }

    function handleTouchMove(e) {

        if (!xDown || !yDown) return;

        var xUp = e.touches[0].clientX;
        var yUp = e.touches[0].clientY;

        xDiff = xDown - xUp;
        yDiff = yDown - yUp;
    }

    function getNearestAttribute(el, attributeName, defaultValue) {

        while (el && el !== document.documentElement) {

            var attributeValue = el.getAttribute(attributeName);

            if (attributeValue) {
                return attributeValue;
            }

            el = el.parentNode;
        }

        return defaultValue;
    }

}(window, document));

function addNew() {
    var randRow = Math.floor(Math.random()*4)
    var randCol = Math.floor(Math.random()*16)
    if (document.getElementsByClassName("box")[randCol].classList.contains("block")) {
        if(document.getElementsByClassName("block").length != document.getElementsByClassName("box").length){
           addNew();
        }       
  } else {
     document.getElementsByClassName("box")[randCol].classList.add("block")
     document.getElementsByClassName("box")[randCol].classList.add("two")
    document.getElementsByClassName("box")[randCol].innerHTML == "2"
    }
}


function rename(){
  var score = 0;
    for(var i=0; i<document.getElementsByClassName("box").length; i++){
      document.getElementsByClassName("box")[i].innerHTML = "0"
      for(var j = 0; j<classWords.length; j++){
        if(document.getElementsByClassName("box")[i].classList.contains(classWords[j]['key'])){
          document.getElementsByClassName("box")[i].innerHTML = classWords[j]['value'];
          score = score + classWords[j]['value'];
          break;
        }
      }
    }
  $("#score").html(score);
}

function buildBoard() {
    for (var i = 0; i < 4; i++) {
        var newrow = document.createElement("div");
        newrow.className = "row"
        $("body").append(newrow);
    }
    for (var i = 0; i < 4; i++) {
        var newdiv = document.createElement("span");
        newdiv.className = "box"
        newdiv.innerHTML = "0";
        $(".row").append(newdiv);
    }
  addNew();
  addNew();
  rename();
}

function left() {
    for(var i=0;i<document.getElementsByClassName("row").length;i++){
          var list = [];
          for(var j=0;j<document.getElementsByClassName("row")[i].childElementCount;j++){
              if(document.getElementsByClassName("row")[i].childNodes[j].classList.contains("block")){
                  list.push(document.getElementsByClassName("row")[i].childNodes[j].classList.toString())    
                document.getElementsByClassName("row")[i].childNodes[j].className = "box";
              }
            }
          for(var j=0;j<list.length;j++){
            document.getElementsByClassName("row")[i].childNodes[j].className = list[j];
            if(list[j+1] != undefined){
              if(list[j] == list[j+1]){
                list.splice(j, 1);
                for(var k=0; k<classWords.length; k++){
                  if(list[j].includes(classWords[k]['key'].toString())){
                    console.log(k)
                    document.getElementsByClassName("row")[i].childNodes[j].classList.remove(classWords[k]['key']);
                  document.getElementsByClassName("row")[i].childNodes[j].classList.add(classWords[k+1]['key']);
                    break;
                  }
                }
                console.log(list)
              }
            }
          }
        }
        addNew();
      rename()
}

//left
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
      left();
       }
});

document.addEventListener('swiped-left', function(e) {
    left();
});

function right(){
  for(var i=0;i<document.getElementsByClassName("row").length;i++){
          var list = [];
          for(var j=document.getElementsByClassName("row")[i].childElementCount-1;j>=0;j--){
              if(document.getElementsByClassName("row")[i].childNodes[j].classList.contains("block")){
                  list.push(document.getElementsByClassName("row")[i].childNodes[j].classList.toString())    
                document.getElementsByClassName("row")[i].childNodes[j].className = "box";
              }
            }
          for(var j=0;j<list.length;j++){
            document.getElementsByClassName("row")[i].childNodes[document.getElementsByClassName("row")[i].childElementCount-j-1].className = list[j];
            if(list[j+1] != undefined){
              if(list[j] == list[j+1]){
                list.splice(j, 1);
                for(var k=0; k<classWords.length; k++){
                  if(list[j].includes(classWords[k]['key'].toString())){
                    console.log(classWords[k]['key'], classWords[k+1]['key'])
                   document.getElementsByClassName("row")[i].childNodes[3-j].classList.remove(classWords[k]['key']);
                  document.getElementsByClassName("row")[i].childNodes[3-j].classList.add(classWords[k+1]['key']);
                    break;
                  }
                }
                console.log(list)
              }
            }
          }
        }
        addNew();
      rename()
}

//right
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 39) {
        right();
       }
});

document.addEventListener('swiped-right', function(e) {
    right();
});

function up() {
  for(var i=0;i<4;i++){
          var list = [];
          for(var j=0;j<4;j++){
              if(document.getElementsByClassName("row")[j].childNodes[i].classList.contains("block")){
                  list.push(document.getElementsByClassName("row")[j].childNodes[i].classList.toString())    
                document.getElementsByClassName("row")[j].childNodes[i].className = "box";
              }
            }
          for(var j=0;j<list.length;j++){
            document.getElementsByClassName("row")[j].childNodes[i].className = list[j];
            if(list[j+1] != undefined){
              if(list[j] == list[j+1]){
                list.splice(j, 1);
                for(var k=0; k<classWords.length; k++){
                  if(list[j].includes(classWords[k]['key'].toString())){
                    console.log("mixed"+classWords[k]['key'])
                  document.getElementsByClassName("row")[j].childNodes[i].classList.remove(classWords[k]['key']);
                  document.getElementsByClassName("row")[j].childNodes[i].classList.add(classWords[k+1]['key']);
                    break;
                  }
                }
                console.log(list)
              }
            }
          }
        }
        addNew();
      rename()
}

//up
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 38) {
        up();
       }
});

document.addEventListener('swiped-up', function(e) {
    up();
});

function down(){
          for(var i=0;i<4;i++){
          var list = [];
          for(var j=3;j>=0;j--){
              if(document.getElementsByClassName("row")[j].childNodes[i].classList.contains("block")){
                console.log(i)
                  list.push(document.getElementsByClassName("row")[j].childNodes[i].classList.toString())    
                document.getElementsByClassName("row")[j].childNodes[i].className = "box";
              }
            }
          console.log(list)
          for(var j=0;j<list.length;j++){
            document.getElementsByClassName("row")[3-j].childNodes[i].className = list[j];
            if(list[j+1] != undefined){
              if(list[j] == list[j+1]){
                list.splice(j, 1);
                for(var k=0; k<classWords.length; k++){
                  if(list[j].includes(classWords[k]['key'].toString())){
                    console.log("mixed"+classWords[k]['key'])
                  document.getElementsByClassName("row")[3-j].childNodes[i].classList.remove(classWords[k]['key']);
                  document.getElementsByClassName("row")[3-j].childNodes[i].classList.add(classWords[k+1]['key']);
                
                    break;
                  }
                }
                console.log(list)
              }
            }
          }
        }
        addNew();

      rename()
}

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 40) {
      down()
       }
});

document.addEventListener('swiped-down', function(e) {
    down();
});

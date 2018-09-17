startGameInstance = function (settings){
    this._settings = {
        selector:''
    };
    this.node = null,
    
    // this._settings = $.extend(true, {}, this._settings, settings);
    
    this._init();
};

startGameInstanceProto = startGameInstance.prototype;

startGameInstanceProto._init = function(){
    //Инициализация области игры
    document.getElementById("start").addEventListener("click", this._startButtonClick.bind(this));
    //Выбор фотки
    document.addEventListener("change", this._showPrevImage.bind(this));
    //Рисуем блоки для игры
    document.addEventListener("click", this._createPazzleArea.bind(this));
    // var selector =  $(this._settings.node);
    // $(selector).click(this._onToggleClick.bind(this));
    // $(document).click(this._onItemClick.bind(this));
};    

startGameInstanceProto._onToggleClick = function(event){
    event.stopPropagation();
    ajax.loadToNode(this.tabSelector, this.loadContentByAjax, function(){
        $(this.tabSelector).fadeToggle(300);
    }.bind(this), true);
}; 

//Плавное затухание кнопки "Начать игру"
startGameInstanceProto._startButtonClick = function(el){
    var opacity = 1;
    var time = 800;
    var timer = setInterval( function() {
      opacity -= 50 / time;
      if( opacity <= 0 ){
        clearInterval(timer);
        opacity = 0;
        el.target.style.display = "none";
        el.target.style.visibility = "hidden";
        this._createGameArea();
      }
      el.target.style.opacity = opacity;
      el.target.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }.bind(this), 50 );
};

//Создаем новые блоки для игры
startGameInstanceProto._createGameArea = function(){
    var element = document.getElementById("pazl");
    for(var i = 0; i < 3; i ++) {
        var div = document.createElement("div");
        div.setAttribute("id", "pazleBlock-"+ i);
        div.className = "pazleBlock";
        element.appendChild(div);
        if(i == 0){
            var lab = document.createElement("label");
            lab.setAttribute("id", "labelBlock");
            lab.setAttribute("for", "uploadFile");
            var text = document.createTextNode("Загрузить фото");
            lab.appendChild(text);
            var but = document.createElement("input");
            var butFile = document.getElementById("pazleBlock-"+ i);
            but.setAttribute("type", "file");
            but.setAttribute("id", "uploadFile");
            but.className = "uploadFile";
            lab.appendChild(but);
            butFile.appendChild(lab);
            var uploadImage = document.createElement("img");
            uploadImage.setAttribute("id", "output");
            uploadImage.setAttribute("alt", "image");
            div.appendChild(uploadImage);
        }
        if(i == 1){
            div.className = "customizeBlock pazleBlock";
        }
        if(i == 2){
            div.className = "findPuzleContainer pazleBlock";
        }
    }
};

//Отображение превью фотки
startGameInstanceProto._showPrevImage = function(el){
    if(el.target && el.target.id == 'uploadFile'){
        var lab = document.getElementById("labelBlock");
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(el.target.files[0]);
        output.classList.add("output");
        var bBlock = document.getElementById('pazleBlock-0');
        bBlock.classList.add("baseImageContainer");
        document.getElementById('labelBlock').innerHTML= "Изменить фотографию"; 
        var but = document.createElement("input");
        var butFile = document.getElementById("pazleBlock-0");
        but.setAttribute("type", "file");
        but.setAttribute("id", "uploadFile");
        but.className = "uploadFile";
        lab.appendChild(but);
        butFile.appendChild(lab);
        var startGameButton = document.createElement("div");
        startGameButton.setAttribute("id", "startGame");
        var startGameButtonText = document.createElement("div");
        var textStartButton = document.createTextNode("Старт");
        startGameButtonText.classList.add("pulseText");
        startGameButton.appendChild(startGameButtonText);
        startGameButtonText.appendChild(textStartButton);
        butFile.appendChild(startGameButton);
    }
};
startGameInstanceProto._rundomSort = function(arr){
    var el = arr.length, variable, index;
    while (el > 0) {
        index = Math.floor(Math.random() * el);
        el--;
        variable = arr[el];
        arr[el] = arr[index];
        arr[index] = variable;
    }
    return arr;
}

startGameInstanceProto._createPazzleArea = function(el){
    if(el.target && (el.target.id == 'startGame' || el.target.className == 'pulseText')){
        var hideBlock = document.getElementById("pazleBlock-0");
        hideBlock.classList.add('hide');
        var custBl = document.getElementsByClassName('customizeBlock')[0];
        var findPuzleContainer = document.getElementsByClassName('findPuzleContainer')[0];
        var i = 1;
        
        var settingBlock = setInterval(function(){
            if(i > 16){
                clearInterval(settingBlock);
                var putBGImage = document.getElementById('output').src;
                var moveArray = [];
                var y = 0;
                var step = 0;
                for (var f = 0; f < 4; f++) {
                    var x = 0;
                    for (var j = 0; j < 4; j++) {
                        var pazlMoveBlock = document.createElement("div");
                        pazlMoveBlock.dataset.movePazleId = j + 1 + step;
                        pazlMoveBlock.style.backgroundImage = "url('"+ putBGImage +"')";
                        pazlMoveBlock.classList.add('move-puzle');
                        pazlMoveBlock.setAttribute('id', 'move-puzle-'+ j + step);
                        pazlMoveBlock.innerHTML = j + 1 + step;
                        pazlMoveBlock.style.backgroundPositionY = y +'px';
                        if (j % 4 == 0){
                            x = 0;
                            pazlMoveBlock.style.backgroundPositionX = x +'px';
                            moveArray.push(pazlMoveBlock);
                        }
                        else{
                            x+= -112.5;
                            pazlMoveBlock.style.backgroundPositionX = x +'px';
                            moveArray.push(pazlMoveBlock);
                        }
                    }
                    y+= -112.5;
                    step+=4
                }
                var targetArr = this._rundomSort(moveArray);
                for (var f = 0; f < targetArr.length; f++) {
                    console.log(targetArr[f]);
                    targetArr[f].setAttribute('draggable', true);
                    targetArr[f].setAttribute('ondragstart', 'drag(event)');
                    findPuzleContainer.appendChild(targetArr[f]);
                }
document.getElementById('pazleBlock-1').setAttribute('ondrop', 'drop(event)');
document.getElementById('pazleBlock-1').setAttribute('ondragover', 'allowDrop(event)');
document.getElementById('pazleBlock-2').setAttribute('ondrop', 'drop(event)');
document.getElementById('pazleBlock-2').setAttribute('ondragover', 'allowDrop(event)');
                // var doubles = this._rundomSort(moveArray).map(function(i, t) {
                //     console.log(i, t);
                //     });
                // console.log(doubles);
                

                // for(var z = 0; z < 16; z++){
                //     var res = '';
                //     console.log(moveArray);
                //     console.log(res = moveArray[Math.floor(Math.random()*moveArray.length)]);
                //     console.log(res.dataset.movePazleId);
                //     console.log(delete moveArray[res.dataset.movePazleId - 1]);
                //     rundomArr.push(res.dataset.movePazleId);
                // }
                // console.log('итог'+ rundomArr);
            }
            else{
                var pazlBlock = document.createElement("div");
                pazlBlock.dataset.findPazleId = i;
                pazlBlock.classList.add('find-pazle');
                custBl.appendChild(pazlBlock);
                pazlBlock.innerHTML = i;
                i++;
                setTimeout(function(){
                    pazlBlock.style.opacity = 1;
                }, 25)
            }
        }.bind(this), 25);
        
    }
}

startGameInstanceProto = null;
document.addEventListener('DOMContentLoaded', function(){ 
    // var image = 'http://img1.uaua.info/uploads/17/05/39/17053948-be2b-40ed-81ef-effb8a02f45c_610x375_fit.png';
  });

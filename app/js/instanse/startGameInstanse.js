var _timer = null;
startGameInstance = function (_settings){
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
    
    _timer = new Timer(1000, function(){
        document.getElementById('timer').innerHTML = this.count;
      }).run();
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
            div.className = "customizeBlock  pazleBlock";
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
                        var allStep = j + 1 + step;
                        pazlMoveBlock.dataset.movePazleId = allStep;
                        pazlMoveBlock.style.backgroundImage = "url('"+ putBGImage +"')";
                        pazlMoveBlock.classList.add('move-puzle');
                        pazlMoveBlock.setAttribute('id', 'move-puzle-'+ allStep);
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
                    targetArr[f].setAttribute('draggable', true);
                    findPuzleContainer.appendChild(targetArr[f]);
                }
                var draggable = new DragNSort({
                  container: document.querySelector('#pazleBlock-2'),
                  targetcontainer: document.querySelector('#pazleBlock-1'),
                  itemClass: 'move-puzle',
                  dragStartClass: 'drag-start',
                  dragEnterClass: 'drag-enter'
                });
                draggable.init();
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

DragNSort = function (config) {
    this.$activeItem = null;
    this.$putAreaItem = null;
    this.$container = config.container;
    this.$targetcontainer = config.targetcontainer;
    this.$targetitems = this.$targetcontainer.childNodes;
    this.$items = this.$container.querySelectorAll('.' + config.itemClass);
    this.dragStartClass = config.dragStartClass;
    this.dragEnterClass = config.dragEnterClass;
  }
  DragNSortProto = DragNSort.prototype;
  DragNSortProto.removeClasses = function () {
      [].forEach.call(this.$items, function ($item) {
          $item.classList.remove(this.dragStartClass, this.dragEnterClass);
    }.bind(this));
  };
  
  DragNSortProto.on = function (elements, eventType, handler) {
      [].forEach.call(elements, function (element) {
      element.addEventListener(eventType, handler.bind(element, this), false);
    }.bind(this));
  };
  
  DragNSortProto.onDragStart = function (_this, event) {
    _this.$activeItem = this;
    var setDataObj = new Object();
    setDataObj.dataMovePazzleId = this.dataset.movePazleId;
    setDataObj.id = this.id;
    setDataObj.backgroundPosition = this.style.backgroundPosition;

    this.classList.add(_this.dragStartClass);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain',JSON.stringify(setDataObj));
  };
  
  DragNSortProto.onDragEnd = function (_this, event) {
        _this.$activeItem = this;
      this.classList;
      this.classList.remove(_this.dragStartClass);
  };
  
  DragNSortProto.onDragEnter = function (_this) {
      this.classList.add(_this.dragEnterClass);
  };
  
  DragNSortProto.onDragLeave = function (_this) {
      this.classList.remove(_this.dragEnterClass);
  };
  
  DragNSortProto.onDragOver = function (_this, event) {
    if (event.preventDefault) {
    event.preventDefault();
    }
  
    event.dataTransfer.dropEffect = 'move';
    return false;
  };
  
  DragNSortProto.onDrop = function (_this, event) {
      if (event.stopPropagation) {
      event.stopPropagation();
    }
    _this.$putAreaItem = this;
    console.log(_this.$putAreaItem);
    console.log(_this.$putAreaItem.dataset.findPazleId);
    console.log(_this.$activeItem.dataset.movePazleId);
    
    console.log(_this);
    console.log(event);
    if(_this.$putAreaItem.parentNode.id == _this.$targetcontainer.id){
        if(_this.$putAreaItem.dataset.findPazleId !== _this.$activeItem.dataset.movePazleId)    return false;
        _this.$putAreaItem.id = _this.$activeItem.id;
        _this.$putAreaItem.dataset.movePazleId = _this.$activeItem.dataset.movePazleId;
        _this.$putAreaItem.style.backgroundPosition = _this.$activeItem.style.backgroundPosition;
        _this.$putAreaItem.style.backgroundImage = _this.$activeItem.style.backgroundImage;
        _this.$activeItem.classList.add('accept');
        _this.$activeItem.removeAttribute('draggable');
        var count = 0;
        for(var x = 0; x < _this.$container.childNodes.length; x++){
            if(_this.$container.childNodes[x].classList.contains('accept') == true){
                count++;
            }
        }
        if(count == _this.$container.childNodes.length){
            while (_this.$container.childNodes.length > 1) {
                _this.$container.removeChild(_this.$container.lastChild);
            }
            while (_this.$container.childNodes.length > 1) {
                _this.$container.removeChild(_this.$container.lastChild);
            }
            _this.$container.childNodes[0].classList.add('fullEnd');
            // _this.$targetcontainer.childNodes[0].classList.add('fullEnd');
            console.log(_this.$targetcontainer.childNodes.length);
            for (var x=0; x < _this.$targetcontainer.childNodes.length; x++) {
                console.log("x: "+x);
                console.log(" _this.$targetcontainer.childNodes[x]: "+ _this.$targetcontainer.childNodes[x]);
                console.log(" _this.$targetcontainer: "+ _this.$targetcontainer);
                _this.$targetcontainer.childNodes[x].classList.add('clear');
                _this.$targetcontainer.childNodes[x].innerHTML = '';
            }
            _timer.stop();
            console.log(_timer);
        }
    }
    else{
        if (_this.$activeItem !== this) {
        
            _this.$activeItem.id = this.id;
            _this.$activeItem.dataset.movePazleId = this.dataset.movePazleId;
            _this.$activeItem.style.backgroundPosition = this.style.backgroundPosition;
            var parseData = JSON.parse(event.dataTransfer.getData('text/plain'))
            this.id = parseData.id;
            this.dataset.movePazleId = parseData.dataMovePazzleId;
            this.style.backgroundPosition = parseData.backgroundPosition;
            
          }
    }
    _this.removeClasses();
  
    return false;
  };
  
  DragNSortProto.bind = function () {
      this.on(this.$items, 'dragstart', this.onDragStart);
      this.on(this.$items, 'dragend', this.onDragEnd);
      this.on(this.$items, 'dragover', this.onDragOver);
      this.on(this.$items, 'dragenter', this.onDragEnter);
      this.on(this.$items, 'dragleave', this.onDragLeave);
      this.on(this.$items, 'drop', this.onDrop);

      this.on(this.$targetitems, 'dragover', this.onDragOver);
      this.on(this.$targetitems, 'drop', this.onDrop);
  };
  
  DragNSortProto.init = function () {
      this.bind();
  };
  
  // Instantiate
  function Timer(delay, callbacks){
    if (Object.prototype.toString.call(callbacks) === "[object Function]") {
      callbacks = [callbacks];
    }
    this.callbacks = callbacks;
    var that = this;
    var id = setInterval(function tick(){
      if (!that.running) return;
      for (var i=0; i<that.callbacks.length; i++) {
        that.callbacks[i].call(that);
      }
      that.count++;
    }, delay);
    Object.defineProperty(this, 'id', {
        get: function() {
          return id;
        }
      });
    Object.defineProperty(this, 'delay', {
        get: function() {
            return delay;
        }
    });
  }
  Timer.prototype.running = false;
  Timer.prototype.count = 0;
  
  Timer.prototype.run = function run(){
    this.running = true;
    return this;
  };
  Timer.prototype.stop = function stop(){
    clearInterval(this.id);
    this.stopped = true;
    return this;
  };
  
  

startGameInstanceProto = null;
document.addEventListener('DOMContentLoaded', function(){ 
    // var image = 'http://img1.uaua.info/uploads/17/05/39/17053948-be2b-40ed-81ef-effb8a02f45c_610x375_fit.png';
  });

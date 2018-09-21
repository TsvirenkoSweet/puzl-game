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
  dragNSortProto = DragNSort.prototype;

  dragNSortProto._init = function () {
        this.bind();
    };
   
  dragNSortProto.bind = function () {
    this._on(this.$items, 'dragstart', this._onDragStart);
    this._on(this.$items, 'dragend', this._onDragEnd);
    this._on(this.$items, 'dragover', this._onDragOver);
    this._on(this.$items, 'dragenter', this._onDragEnter);
    this._on(this.$items, 'dragleave', this._onDragLeave);
    this._on(this.$items, 'drop', this._onDrop);
    //==//
    this._on(this.$targetitems, 'dragover', this._onDragOver);
    this._on(this.$targetitems, 'drop', this._onDrop);
    //==//
};

  dragNSortProto._on = function (elements, eventType, handler) {
    [].forEach.call(elements, function (element) {
        element.addEventListener(eventType, handler.bind(element, this), false);
     }.bind(this));
  };

  dragNSortProto._onDragStart = function (_this, event) {
    _this.$activeItem = this;
    var setDataObj = new Object();
    setDataObj.dataMovePazzleId = this.dataset.movePazleId;
    setDataObj.id = this.id;
    setDataObj.backgroundPosition = this.style.backgroundPosition;

    this.classList.add(_this.dragStartClass);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain',JSON.stringify(setDataObj));
  };

  dragNSortProto._onDragEnd = function (_this, event) {
    _this.$activeItem = this;
    this.classList;
    this.classList.remove(_this.dragStartClass);
  };

  dragNSortProto._onDragOver = function (_this, event) {
    if (event.preventDefault) {
    event.preventDefault();
    }
    event.dataTransfer.dropEffect = 'move';
    return false;
  };

  dragNSortProto._onDragEnter = function (_this) {
    this.classList.add(_this.dragEnterClass);
  };

  dragNSortProto._onDragLeave = function (_this) {
    this.classList.remove(_this.dragEnterClass);
  };

  dragNSortProto._onDrop = function (_this, event) {
    if (event.stopPropagation) {
    event.stopPropagation();
    }
    _this.$putAreaItem = this;
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
            for (var x=0; x < _this.$targetcontainer.childNodes.length; x++) {
                _this.$targetcontainer.childNodes[x].classList.add('clear');
                _this.$targetcontainer.childNodes[x].innerHTML = '';
            }
            _timer.stop();
            document.getElementById('timer').classList.add('active');
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
    _this._removeClasses();
    return false;
  };


  dragNSortProto._removeClasses = function () {
      [].forEach.call(this.$items, function ($item) {
          $item.classList.remove(this.dragStartClass, this.dragEnterClass);
    }.bind(this));
  };
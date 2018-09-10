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
    for(var i = 0; i < 3; i += 1) {
        var div = document.createElement("div");
        div.setAttribute("id", "pazleBlock-"+ i);
        div.className = "pazleBlock";
        element.appendChild(div);
        if(i == 0){
            var lab = document.createElement("label");
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
    }
    
    //Выбор фотки
    document.getElementById("uploadFile").addEventListener("change", this._showPrevImage.bind(this));
};

//Отображение превью фотки
startGameInstanceProto._showPrevImage = function(el){
    console.log('log');
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(el.target.files[0]);
};

startGameInstanceProto = null;
document.addEventListener('DOMContentLoaded', function(){ 
    // var image = 'http://img1.uaua.info/uploads/17/05/39/17053948-be2b-40ed-81ef-effb8a02f45c_610x375_fit.png';
  });

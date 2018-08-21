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
    var selector =  $(this._settings.node);
    $(selector).click(this._onToggleClick.bind(this));
    $(document).click(this._onItemClick.bind(this));
};    

startGameInstanceProto._onToggleClick = function(event){
    event.stopPropagation();
    ajax.loadToNode(this.tabSelector, this.loadContentByAjax, function(){
        $(this.tabSelector).fadeToggle(300);
    }.bind(this), true);
}; 
startGameInstanceProto._onItemClick = function(){
    $(this.tabSelector).fadeOut(300);
};


startGameInstanceProto = null;
Timer = function (delay, callbacks){
    if (Object.prototype.toString.call(callbacks) === "[object Function]") {
      callbacks = [callbacks];
    }
    this.callbacks = callbacks;
    var _this = this;
    var id = setInterval(function tick(){
      if (!_this.running) return;
      for (var i=0; i<_this.callbacks.length; i++) {
        _this.callbacks[i].call(_this);
      }
      _this.count++;
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
  timerProto = Timer.prototype;
  timerProto.running = false;
  timerProto.count = 0;
  
  timerProto.run = function run(){
    this.running = true;
    return this;
  };
  timerProto.stop = function stop(){
    clearInterval(this.id);
    this.stopped = true;
    return this;
  };
// timer.js - простой таймер с обратным отсчетом и событиями
(function(){
  function Timer(){ this._t = null; this.remaining = 0; this.running=false; this.onTick = null; this.onEnd = null; }
  Timer.prototype.start = function(seconds){
    this.stop();
    this.remaining = Math.max(0, Math.floor(seconds));
    this.running = true;
    const self = this;
    this._t = setInterval(()=>{
      self.remaining--;
      if (typeof self.onTick === 'function') self.onTick(self.remaining);
      if (self.remaining <= 0){ self.stop(); if (typeof self.onEnd==='function') self.onEnd(); }
    }, 1000);
  };
  Timer.prototype.stop = function(){ if (this._t) clearInterval(this._t); this._t=null; this.running=false; };
  Timer.prototype.pause = function(){ this.stop(); };
  window.WorkoutTimer = Timer;
})();

// charts.js - рисуем простые графики на canvas (без сторонних библиотек)
(function(){
  function drawLine(canvas, points){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width, h = canvas.height, pad=30;
    const max = Math.max(...points.map(p=>p.value),1);
    ctx.beginPath();
    points.forEach((p,i)=>{
      const x = pad + i*( (w-2*pad)/(points.length-1||1) );
      const y = h - pad - (p.value/max)*(h-2*pad);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      ctx.fillStyle='black'; ctx.fillText(p.label, x-10, h-pad+15);
    });
    ctx.strokeStyle = '#1976d2'; ctx.lineWidth=2; ctx.stroke();
  }
  function drawBar(canvas, items){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width, h = canvas.height, pad=30;
    const max = Math.max(...items.map(i=>i.value),1);
    const bw = (w-2*pad)/items.length;
    items.forEach((it,i)=>{
      const x = pad + i*bw;
      const barH = (it.value/max)*(h-2*pad);
      ctx.fillStyle='#4caf50';
      ctx.fillRect(x+5, h-pad-barH, bw-10, barH);
      ctx.fillStyle='black'; ctx.fillText(it.label, x+5, h-pad+14);
    });
  }
  window.SimpleCharts = { drawLine, drawBar };
})();

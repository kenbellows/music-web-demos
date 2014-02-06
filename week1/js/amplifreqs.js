function AmpliFreqs() {
    waves = [
        new SineWave("lowfreq",  1, 30),
        new SineWave("highfreq", 4, 30),

        new SineWave("lowamp",   2, 15),
        new SineWave("highamp",  2, 45)
    ];
    
    (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        
        waves.forEach(function(w){
            w.update();
            w.draw(); 
        });
    })();
}

function SineWave(canvasId, f, a) {
    var canvas      = document.getElementById(canvasId),
        ctx         = canvas.getContext('2d'),
        amplitude   = a,
        frequency   = f,
        wavelength  = 2*Math.PI*frequency,
        xRange      = 100,
        xStart      = 25,
        xSpeed      = 1,
        yCenter     = canvas.height/2,
        x           = 0,
        y           = yCenter,
        phase       = 0;
    utils.initCanvas(ctx);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    
    this.update = function() {
        phase = phase - Math.PI*2/xRange*frequency;
    };
    this.draw = function() {
        ctx.clear();
        
        x = xStart;
        y = yCenter - amplitude * Math.sin(wavelength*x/xRange + phase);
        ctx.beginPath();
        ctx.moveTo(x,y);
        while (x<canvas.width) {
            x += xSpeed;
            y = yCenter - amplitude * Math.sin(wavelength*x/xRange + phase);
            ctx.lineTo(x,y);
        }
        ctx.stroke();
    };
    
}

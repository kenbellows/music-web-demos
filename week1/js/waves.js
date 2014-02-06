function Transverse() {
    var canvas  = document.getElementById("transverse"),
        ctx     = canvas.getContext('2d'),
        xSpeed  = 3,
        yMid    = canvas.height/2,
        xRange  = 200,
        yRange  = canvas.height/2-40,
        x       = 0,
        y       = yMid;
    utils.initCanvas(ctx);
    
    function update() {
        x += xSpeed;
        if (x > canvas.width+40)
            x = -20;
        y = yMid - yRange*Math.sin(2*Math.PI*x/xRange);
    }
    
    (function drawFrame() {
        window.requestAnimationFrame(drawFrame, canvas);
        ctx.clear();
        
        update();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333";
        ctx.strokeCircle(x,y,20);
    })();    
}

function Longitudinal() {
    var canvas      = document.getElementById("longitudinal"),
        ctx         = canvas.getContext('2d'),
        xSpeed      = 1,
        amplitude   = 2,
        timeDamper  = 150,
        yMid        = canvas.height/2,
        x           = 0,
        y           = yMid,
        r           = 10;
    
    ctx.strokeStyle = "#333";
    ctx.lineWidth   = 3;
    utils.initCanvas(ctx);
    
    function update(t) {
        t /= timeDamper
        x += xSpeed;
        xSpeed = amplitude*1.475 + amplitude*Math.sin(t);
        
        if (x > canvas.width+r*2) x = -(r*2);
    }
        
    function draw(){
        ctx.clear();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333";
        ctx.strokeCircle(x,y,20);
    }   
    
    (function drawFrame(t) {
        window.requestAnimationFrame(drawFrame, canvas);
        
        update(t || 0);
        draw();
    })();    
}
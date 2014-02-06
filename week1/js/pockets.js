function Pockets() {
    var canvas      = document.getElementById('pockets'),
        ctx         = canvas.getContext('2d'),
        xStart      = 25,
        xSpeed      = 3,
        yCenter     = canvas.height/2,
        centerGap   = 50,
        amplitude   = 25,
        wavelength  = 55,
        phase       = 0,
        x           = 0,
        y           = 0,
        r           = 10;
    ctx.lineWidth   = 2;
    ctx.strokeStyle = "#555";
    utils.initCanvas(ctx);
    
    function update() {
        phase = phase - (Math.PI*2)/wavelength/xSpeed;
    }
    function draw() {
        // Top wave
        x = xStart;
        y = yCenter - centerGap/2 - amplitude*Math.sin(Math.PI*2*x/wavelength + phase);
        ctx.beginPath();
        ctx.moveTo(x,y);
        while (x<canvas.width) {
            x += xSpeed;
            y = yCenter - centerGap - amplitude*Math.sin(Math.PI*2*x/wavelength + phase);
            ctx.lineTo(x,y);
        }
        ctx.stroke();
        
        // Bottom wave
        x = xStart;
        y = yCenter + centerGap/2 + amplitude*Math.sin(Math.PI*2*x/wavelength + phase);
        ctx.beginPath();
        ctx.moveTo(x,y);
        while (x<canvas.width) {
            x += xSpeed;
            y = yCenter + centerGap + amplitude*Math.sin(Math.PI*2*x/wavelength + phase);
            ctx.lineTo(x,y);
        }
        ctx.stroke();
        
        // Boombox
        var bezPointX = wavelength*1.5 + xStart*Math.sin(phase+Math.PI*0.625); // try commenting out PI*2 from the sine
        ctx.beginPath();
        ctx.moveTo(xStart, yCenter-centerGap-amplitude*3);
        ctx.lineTo(xStart+wavelength*.75, yCenter-centerGap-amplitude*3);
        ctx.quadraticCurveTo(bezPointX, yCenter, xStart+wavelength*.75, yCenter+centerGap+amplitude*3);
        ctx.lineTo(xStart, yCenter+centerGap+amplitude*3);
        ctx.lineTo(xStart, yCenter-centerGap-amplitude*3);
        ctx.stroke();
        ctx.fill();
    }
    (function drawFrame() {
        window.requestAnimationFrame(drawFrame, canvas);
        ctx.clear();
        
        update();
        draw();
    })();
}
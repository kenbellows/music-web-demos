function Demo() {
    var canvas        = document.getElementById("democanvas"),
        ctx           = canvas.getContext('2d'),
        centerY       = canvas.height/2,
        padding       = 20,
        frequency     = 440,
        amplitude     = 50,
        handleRadius  = 50,
        scale         = 8,
        xspeed        = 3,
        mouse         = utils.captureMouse(canvas);
    
    utils.initCanvas(ctx);
    ctx.lineWidth = 1;
    ctx.fillStyle = "#CCC";
    ctx.font = "18px 'Lucida Handwriting'";
    ctx.translate(padding, 0);
    
    var amplitudeHandle = {
        x : function() {
          return (canvas.width/scale/(frequency/1000))*1.25;
        },
        y : function() {
          return centerY - amplitude*10/scale * Math.sin(2*Math.PI * frequency/1000 *(this.x()/(canvas.width/scale)));
        },
        drag: function() {
          var amp = Math.round((centerY - mouse.y) * scale / 10);
          if (Math.abs(amp)<101) amplitude = amp;
          updateSound();
        }
    },
    frequencyHandle = {
        x : function() {
          return canvas.width/scale/(frequency/1000) * 1.5;
        },
        y : function() {
          return centerY;
        },
        drag : function() {
          frequency = (1.5*canvas.width)/(scale*(mouse.x-padding)) * 1000;
          updateSound();
        }
    };
    
    
    var drag, dragFct;
    canvas.addEventListener("mousedown", function() {
        var dx, dy;
        
        // frequency handle?
        dx = mouse.x - (frequencyHandle.x()+padding);
        dy = mouse.y - frequencyHandle.y();
        if (Math.sqrt(dx*dx + dy*dy) < handleRadius/scale) {
            console.log("freq drag");
            drag = true;
            dragFct = frequencyHandle.drag;
            return;
        }
        // amplitude handle?
        dx = mouse.x - (amplitudeHandle.x()+padding);
        dy = mouse.y - amplitudeHandle.y();
        if (Math.sqrt(dx*dx + dy*dy) < handleRadius/scale) {
            drag = true;
            dragFct = amplitudeHandle.drag;
            return;
        }
        drag = false;
    });
    canvas.addEventListener("mousemove", function() {
      if (drag) dragFct();
    });
    canvas.addEventListener("mouseup", function() {
      drag = false;
    });
    
    
    function drawWave() {
      xpos = 0;
      ypos = centerY;
      ctx.beginPath();
      ctx.moveTo(xpos, ypos);
      while (xpos <= canvas.width-padding*2) {
          xpos += xspeed;
          ypos = centerY
               - amplitude*10/scale             // amplitude scaled to match "zoom" level
               * Math.sin(                      // sin(2PI * f * t)
                   2*Math.PI
                 * frequency/1000               // convert from Hz to kHz
                 * (xpos/(canvas.width/scale))  // scale x variable to represent timestep within the scaled region
               )
           ;
           ctx.lineTo(xpos, ypos);
        }
        ctx.stroke();
    }
    
    function drawHandles() {
        // x-axis: frequency
        ctx.fillCircle(frequencyHandle.x(), frequencyHandle.y(), handleRadius/scale);
        ctx.strokeCircle(frequencyHandle.x(), frequencyHandle.y(), handleRadius/scale);
        
        // y-axis: amplitude
        ctx.fillCircle(amplitudeHandle.x(), amplitudeHandle.y(), handleRadius/scale);
        ctx.strokeCircle(amplitudeHandle.x(), amplitudeHandle.y(), handleRadius/scale);
    }
    
    function drawScale() {
        ctx.save();
        
        ctx.strokeStyle = "#777";
        ctx.fillStyle = "#777";
        
        ctx.strokeRect(0, centerY, canvas.width-padding*2, 0);
        ctx.fillText("0ms", -30/scale, centerY-(200/scale));
        
        for (var i=1; i<scale+1; i++) {
            ctx.strokeRect(canvas.width*i/scale, centerY-(175/scale), 0, 350/scale);
            var text = i.toString() + "ms";
            ctx.fillText(text, (canvas.width*i-ctx.measureText(text).width*3)/scale, centerY-(200/scale));
        }
      
        ctx.restore();
    }
    
    function drawHUD() {
        document.getElementById("frequencyVal").innerHTML = Math.round(frequency).toString();
        document.getElementById("amplitudeVal").innerHTML = Math.abs(Math.round(amplitude)).toString();
        
        document.getElementById("pitchVal").innerHTML = pitch(frequency).note;
    }
    
    function pitch(f) {
        var pitches = "A#BC#D#EF#G#",
            p = 69 + 12*(Math.log(f/440)/Math.log(2)),
            pindex = Math.round(p-69)%12;
        if (pindex < 0) pindex += 12;
        
        var note = pitches[pindex];
        if (note == "#") 
            note = pitches[
                    (pindex-1) < 0
                    ?    12+(pindex-1)
                    :    (pindex-1)
                   ]+"#/"+pitches[(pindex+1)%12]+"b";
        return {ordinal: p, note: note};
    }
    
    
    var audioCtx,
        osc,
        gain,
        soundOn,
        initOscillator,
        updateSound;
    try {
        var webkit = false;
        try {
            audioCtx = new window.AudioContext();
        }
        catch (e) {
            audioCtx = new window.webkitAudioContext(),
            webkit = true;
        }
            
        initOscillator = function() {
            osc = audioCtx.createOscillator();
            gain = webkit ? audioCtx.createGainNode() : audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = osc.SINE;
        }
        initOscillator();
        
        updateSound = function() {
            //osc.stop();
            //initOscillator();
            osc.frequency.value = frequency;
            gain.gain.value = Math.abs(amplitude/10);
            //if (soundOn) osc.start();
        }
        startSound = function() {
            osc.start(0);
            soundOn = true;
        };
        stopSound = function() {
            osc.stop(0);
            soundOn = false;
            initOscillator();
        };
    
    }
    catch (err) {
        console.log(err);
        console.log("Audio not supported!");
    }
    // Loop
    (function drawFrame() {
        window.requestAnimationFrame(drawFrame, canvas);
        ctx.clear();
        
        drawScale();
        drawWave();
        drawHandles();
        drawHUD();
    })();
}
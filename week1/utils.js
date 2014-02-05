// Utils.js

var utils = {
    initCanvas : function(ctx) {
        ctx.clear = function() {
            this.clearRect(0,0,this.canvas.width,this.canvas.height);
        };
        ctx.strokeCircle = function(x,y,r) {
            this.beginPath();
            this.arc(x,y,r,0,2*Math.PI,false);
            this.stroke();
        };
        ctx.fillCircle = function(x,y,r) {
            this.beginPath();
            this.arc(x,y,r,0,2*Math.PI,false);
            this.fill();
        };
    },
    
    captureMouse : function(el) {
        var mouse = {x:0, y:0};
        
        el.addEventListener("mousemove", function(e) {
            var x, y;
            if (e.pageX || e.pageY) {
                x = e.pageX;
                y = e.pageY;
            }
            else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= el.offsetLeft;
            y -= el.offsetTop;
            
            mouse.x = x;
            mouse.y = y;
        });
        
        return mouse;
    }
};


// Normalize requestAnimationFrame
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
        window.webkitRequestAnimationFrame
     || window.mozRequestAnimationFrame
     || window.oRequestAnimationFrame
     || msRequestAnimationFrame
     || function (callback) {
        return window.setTimeout(callback, 1000/60);   
     }
    );
}
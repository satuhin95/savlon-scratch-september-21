
    var bg = document.getElementById("bg");

    var text1 = document.getElementsByClassName('text1')

    var brushSize = 50;
    var w = 300;
    var h = 250;

    var innerSize = 0.99;

    var gridArray = [];
    var gridHits = {
        cur: 0,
        total: 1,
        needed: 0.60
    }

    var image = new Image();
    var canvas = document.getElementById("ctx");
    var ctx = canvas.getContext("2d");

    var mouseStatus = 'none';
    var mouseStatus2 = 'none';
    var mousePos = {x:0, y:0};
    var cursorAnimInt;

    function init(){
        animate();
        var scale = 2;

        ctx.drawImage(image, -((1-1)*w/2), -(1-1)*h/2, w*1, h*1);
        ctx.globalCompositeOperation='destination-out';

        setGrid();
        showOver();
        var revealCont = document.getElementById("bg1");
        revealCont.style.backgroundImage = "url('"+rSrc+"')";
        revealCont.style.backgroundSize = "100% 100%";
        revealCont.style.backgroundRepeat = 'no-repeat';
    }

    function setGrid(){
        var w = canvas.offsetWidth;
        var h = canvas.offsetHeight;
        var b = brushSize;

        var c = Math.round( w / b );
        var r = Math.round( h / b );

        var wS = (w-(c-1)*b)/2 + 0;
        var hS = (h-(r-1)*b)/2 + 0;

        for(var i=0; i<c; i++){
            gridArray.push([]);
            for(var j=0; j<r; j++){
                var pos = {
                    x: wS + b*i,
                    y: hS + b*j,
                    hit: false
                }
                gridArray[i].push(pos);
            }
        }
        gridHits.total = c*r;
    }

    function showOver(){
        
            addEvents();
    }

    var inverseLoop = false;


    function animate(time) {
        requestAnimFrame(animate);
        TWEEN.update(time);
      }

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback,element){
                  window.setTimeout(callback, 1000 / 60);
              };
    })();

    function otherVal(val){
        if(val){
            return false;
        } else {
            return true;
        }
    }

    function endErase(){
        changeOpacity(canvas, 0 , 1020, 0)
        var steps = Math.floor(canvas.offsetHeight / brushSize)*2 + 5;
        var curStep = 1;
        var side = "right";

        ctx.beginPath();
        ctx.lineWidth = brushSize*2;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);

        hideOverEl();

        var eraseInt = setInterval(
            function(){
                var x, y;
                switch(side){
                    case "left":
                        y = 0;
                        x = brushSize*curStep;
                        side = "right";
                        break;
                    case "right":
                        x = 0;
                        y = brushSize*curStep;
                        side = "left";
                        break;
                }

                ctx.lineTo(x, y);
                ctx.stroke();

                if(curStep == steps){
                    clearInterval(eraseInt);
                }
                curStep++;
            }, 30
        );
    }

    function clickPos(x, y){
        ctx.fillRect(x-2,y-2,5,5);
    }

    /* 
        E V E N T S
    */

    var ctxArea = document.getElementById("ctx");

    function addEvents(){
        ctxArea.addEventListener("mousedown", mouseDown);
        ctxArea.addEventListener("mouseup", mouseUp);
        ctxArea.addEventListener('mousemove', mouseMove);

        ctxArea.addEventListener('touchstart', touchDown);
        ctxArea.addEventListener("touchend", touchUp);
        ctxArea.addEventListener("touchmove", touchMove);
    }

    var lastPoint = {x:-1, y:-1};
    var firstPoint = true;

    function showLine(x, y){
        if(lastPoint.x != -1){
            ctx.beginPath();
            ctx.lineWidth = brushSize*2;
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function showPoint(x, y){
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.arc(x, y, brushSize, 0, 2*Math.PI);
        ctx.fill();

        for(var i=0;i<gridArray.length; i++){
            for(var j=0;j<gridArray[i].length; j++){
                var x = gridArray[i][j].x;
                var y = gridArray[i][j].y;
                if((!gridArray[i][j].hit) && (ctx.isPointInPath(x, y))) {
                    gridArray[i][j].hit = true;
                    gridHits.cur++;
                    if((gridHits.cur > gridHits.total*gridHits.needed) && (!revealed)){
                        revealBehind();
                        revealed = true;
                    }
                }        
            }
        }
    }

    var ft = false;

    function hideOver(){     
        if(!ft){
            document.querySelector(".drag").style.display="none";
            setTimeout(endScratchIfInactive, 2e3);
            ft = true;
        }
    }

    function endScratchIfInactive(){
        if(!revealed){
            revealBehind();
            revealed = true;
        }            
    }

    function hideOverEl(){
        // document.querySelector('.wipemessage').style.display="none";
        var lead_box= document.querySelector('.lead_box');
        var val2 = { val: 1 };
        var val1 = 0;
        
        var tween = new TWEEN.Tween(val2)
        .to({val: val1 }, 500)
        .onUpdate(function(){
            lead_box.style.display = 'block';
            // text1.classList = 'fadeOut'
            // lead_box.querySelector(".ParallaxLogo").classList="ParallaxLogo fadeInDown";
            // document.querySelector(".sanitizer").classList="sanitizer fadeOut";
            // lead_box.querySelector(".flyingBG").classList="flyingBG fadeInUp";
        })
        .start()
        .onComplete(function() {
            // lead_box.querySelector(".ParallaxLogo").classList="ParallaxLogo flyingMove";
            // lead_box.querySelector(".flyingBG").classList="flyingBG";
                document.querySelector(".text1").classList=" fadeOut";
                $('.text2').removeClass('hidden').addClass('fadeInUp')
                $('.text3').removeClass('hidden').addClass('fadeInUp')
           // setTimeout(function() {
                // $('.cleanhand').removeClass('hidden').addClass('fadeInUp')
                setTimeout(function(){
                    $('.slide1').addClass('hidden')
                    $('.slide2').addClass('hidden')
                    $('.slide3').removeClass('hidden')
                },2000)
           // }, 1000);
            
        })


        var val2b = { val: 1 };
        var val1b = 0;
        var elb = document.getElementById("endAnimCont");
        var tween = new TWEEN.Tween(val2)
        .to({val: val1b }, 1100)
        // clean hand 
        // .onUpdate(function(){
        //     var s = 0.85 + 0.15 * (1-this.val);
        //     moveVerScaleEl(elb, 0, s);
        // })
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onComplete(function() {
        })

    }

    function changeOpacity(el, val, dur, delay){
        var val1, val2;
        if (val == 0){
            val2 = { val: 1 };
            val1 = 0;
        } else { 
            val2 = { val: 0 };
            val1 = 1;
        }

        var tween = new TWEEN.Tween(val2)
        .to({val: val1 }, dur)
        //.easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(function(){
          // el.style.opacity = this.val;
          // var overEl = document.getElementById("darkOver");
          // overEl.style.opacity = this.val*0.5;
        })
        .delay(delay)
        .start()
        .onComplete(function() {
        })
    }


    function moveEl(el, side, dist, dur, delay, ease){
        var moveDist;
        switch(side){
            case "right":
                moveDist = dist;
                break;
            case "left":
                moveDist = -dist;
                break;
        }

        moveHor(el, dist);

        var val2 = { val: 1 };
        var val1 = 0;
        var tween = new TWEEN.Tween(val2)
        .to({val: val1 }, dur)
        .easing(ease)
        .onUpdate(function(){
            var val = this.val * moveDist;
            moveHor(el, val);
            el.style.opacity = 1-this.val;
        })
        .delay(delay)
        .start()
        .onComplete(function() {
        })
    }

    function moveHor(el, val){
        el.style.msTransform = "translate("+val+"px, 0px)";
        el.style.webkitTransform = "translate("+val+"px, 0px)";
        el.style.transform = "translate("+val+"px, 0px)";
    }

    function moveVer(el, val){
        el.style.msTransform = "translate(0px, "+val+"px)";
        el.style.webkitTransform = "translate(0px, "+val+"px)";
        el.style.transform = "translate(0px, "+val+"px)";
    }

    var ftEvent = false;
    function mouseDown(e){
        if(!ftEvent){
            ftEvent = true;
        }
        scratching = true;
        mouseStatus = 'down';
        firstPoint = false;

        hideOver();
        x = e.offsetX;
        y = e.offsetY;
        showPoint(x, y);
    }
    function mouseUp(e){
        scratching = false;
        firstPoint = true;
        mouseStatus = 'none';
        lastPoint.x = -1;
    }
    function mouseMove(e){
        x = e.offsetX;
        y = e.offsetY;
        mousePos.x = x;
        mousePos.y = y;

        if (mouseStatus == 'down'){
            showPoint(x, y);
            showLine(x, y);
            lastPoint.x = x;
            lastPoint.y = y;
        }
    }

    var ftTouch = false;

    function touchDown(e){
        if(!ftEvent){
            ftEvent = true;
        }
        ftTouch = true;
        scratching = true;
        mouseStatus = 'down';
        document.documentElement.style.overflow = 'hidden';
        e.preventDefault();
        firstPoint = false;

        hideOver();


        x = e.offsetX * 2;
        y = e.offsetY * 2;
        showPoint(x, y);
    }

    function touchUp(e){
        scratching = false;
        mouseStatus = 'none';
        document.documentElement.style.overflow = 'auto';
        e.preventDefault();
        lastPoint.x = -1;
    }

    function touchMove(e){
        mouseStatus2 = 'move';

        element = document.getElementById("ctx");
        var rect = element.getBoundingClientRect();

        var touch = e.touches[0];
        var x = touch.clientX - rect.left;
        var y = touch.clientY - rect.top;

        x = x  * 2;
        y = y  * 2;

        mousePos.x = x;
        mousePos.y = y;

        if (mouseStatus == 'down'){
            showPoint(x, y);
            showLine(x, y);
            lastPoint.x = x;
            lastPoint.y = y;
        }

        e.preventDefault();
    }

    var scratching = false;
    var scrCur = 0;
    var scrNeed = 1500;
    var revealed = false;

    function activateControls(){
    }

    function outBack(n, s){
      return --n * n * ((s + 1) * n + s) + 1;
    };

    function moveVerScaleEl(el, y, scale){
        el.style.msTransform = "scale("+scale+") translate(0px, "+y+"px)";
        el.style.webkitTransform = "scale("+scale+") translate(0px, "+y+"px)";
        el.style.transform = "scale("+scale+") translate(0px, "+y+"px)";
    }

    function revealBehind(){
        ctxArea.removeEventListener("mousedown", mouseDown);
        ctxArea.removeEventListener("mouseup", mouseUp);
        ctxArea.removeEventListener('mousemove', mouseMove);
        ctxArea.removeEventListener('touchstart', touchDown);
        ctxArea.removeEventListener("touchend", touchUp);
        ctxArea.removeEventListener("touchmove", touchMove);

        setTimeout(endErase, 50);
        var val = 1;
        var valDec = 0.02; 


        var val2 = { val: 0 };
        var tween = new TWEEN.Tween(val2)
        .to({val: 1 }, 900)
        .onUpdate(function(){
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay(500)
        .start()
        .onComplete(function() {
        })
    }

    image.onload = function() {
        countLoad();
    };
    image.src = 'img/germs.png';
    image.style.width = '100%';
    image.style.height = '100%';













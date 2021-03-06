var canvas = document.getElementById("backgroundCanvas");
var ctx = canvas.getContext("2d");

var aWrapper = document.getElementById("aWrapper");

var canvasPotato = document.getElementById("potatoCanvas");
var ctxP = canvasPotato.getContext("2d");

var canvasMel = document.getElementById("melcontour");
var ctxM = canvasMel.getContext("2d");

var canvasText = document.getElementById("serviceCanvas");
var ctxT = canvasText.getContext("2d");

var BAT = 12;

var clearWp=0;
var clearHp=0;

var myHue = [0, 15, 45, 135, 180, 240, 300, 330];

var hueCtrl = numPreset + pol -1;
var tog = null;


document.body.style.zoom = 0.9;

var iStep = van - BAT; // da -12 a +12
var nStep = 25;
var verticalStep = - (iStep +1 ) / nStep;
var p_r;
//Trasparenza iniziale
canvas.style.opacity = 0;
canvas.style.transition = "opacity 2s";

//changing the Pixel Ratio will make the canvas blurry in some devices, yeee
//with this section you force the 1:1 pixel ratio
function setCanvasScalingFactor() {
   return window.devicePixelRatio || 1;
}

function resizeCanvas() {
    //Gets the devicePixelRatio
    var pixelRatio = setCanvasScalingFactor();

    //The viewport is in portrait mode, so var width should be based off viewport WIDTH
    if (window.innerHeight > window.innerWidth) {
        //Makes the canvas 100% of the viewport width
        var width = Math.round(1.0 * window.innerWidth);
    }
  //The viewport is in landscape mode, so var width should be based off viewport HEIGHT
    else {
        //Makes the canvas 100% of the viewport height
         var width = Math.round(1.5 * window.innerHeight);
    }

    //Simple scaling factor for a smaller canvas
    width = 0.6*width;
    //This is done in order to maintain the 1:1 aspect ratio, adjust as needed
    var height =0.5*width;


    //This will be used to downscale the canvas element when devicePixelRatio > 1
    aWrapper.style.width = width + "px";
    aWrapper.style.height = height + "px";

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvasText.width = width * pixelRatio;
    canvasText.height = height * pixelRatio;

    canvasPotato.width = width * pixelRatio;
    canvasPotato.height = height * pixelRatio;

    canvasMel.width = width * pixelRatio;
    canvasMel.height = height * pixelRatio;

    clearWp=canvasPotato.width;
    clearHp=canvasPotato.height;

    p_r = pixelRatio;
}

resizeCanvas();

//New Origin Point
x0=Math.round(0.2*canvas.width) +0.5;
y0=Math.round(0.5*canvas.height) +0.5;
var radius = 17 + pol;

var idCan;

var start = document.getElementById("aWrapper");
var start2 = document.getElementById("startButton");
var reset = document.getElementById("resetButton");

start.onclick = startCanvas;
start2.onclick = startCanvas;
reset.onclick = resetCanvas;

var xp=0;
var yp=0;

//----------------------------Initial text

ctxT.font = (25*p_r).toString() +"px Helvetica";
ctxT.fillStyle = "white";
ctxT.textAlign = "center";
ctxT.fillText("Click here to start the visualization", canvasText.width/2, canvasText.height/2);

//----------------------------BACKGROUND
var img = new Image();
img.src = 'img/stars.png';

var CanvasW = canvas.width;
var CanvasH = canvas.height;

var speed = 10;

var scale = Math.min(canvas.width/1920, canvas.height/1080); ;
var y = 0;

var dx = 0.75;
var imgW;
var imgH;
var x = 0;
var clearX;
var clearY;

function startCanvas() {
    imgW = img.width * scale;
    imgH = img.height * scale;
    if (imgW > CanvasW) {
      x = CanvasW - imgW; }
    if (imgW > CanvasW) { clearX = imgW; }
    else { clearX = CanvasW; }
    if (imgH > CanvasH) { clearY = imgH; }
    else { clearY = CanvasH; }
    //DISEGNA CERCHIO
    drawPotato();

    start = 0;
    start2 = 0;
    dissolvenzaCanvas();
    return idCan = setInterval(draw, speed);
}

//------------------DISEGNA SFONDO

  function draw() {
      ctx.clearRect(0, 0, clearX, clearY);
      //DISEGNA SFONDO
      if (imgW <= CanvasW) { //QUI NON ENTRA
          if (x > CanvasW) { x = -imgW + x; }
          if (x > 0) {
            ctx.drawImage(img, -imgW + x, y, imgW, imgH); }

          if (x - imgW > 0) {
            ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH); }

      }

      //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      else {
          if (x > (CanvasW)) { x = CanvasW - imgW; }
          if (x > (CanvasW-imgW)) {
            ctx.drawImage(img, x - imgW + 1, y, imgW, imgH); }
      }
      ctx.drawImage(img, x, y,imgW, imgH);

      x += dx;

  }



//---------------------------------------
var motionTrailLength = 700;
var positions_x = [];
var positions_y = [];
var positions_col = [];
var positions_rad = [];
var positions_on = [];

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var currValue = startValue;
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(currValue + (step * i));
  }
  return arr;
}

positions_x  = makeArr(xp, canvasMel.width , motionTrailLength);

function drawPotato() {
  radius = 17 + pol;
  iStep = van - BAT; // da -12 a +12
  verticalStep = - (iStep +1 ) / nStep;
 tog = noteIsOnSCALES();

  yp =  clearHp * verticalStep; //scaling factor

  ctxP.clear(true);
  ctxM.clear(true);

  ctxP.translate(x0,y0);
  ctxM.translate(x0,y0);

  ctxP.beginPath(); //This line is important

  ctxP.arc(xp, yp, radius, 0 , 2 * Math.PI);

//draws the melodic contour
  for (var i = 0; i < positions_x.length; i++) {
    ctxM.beginPath();
    ctxM.arc(positions_x[i], positions_y[i], 0.15*positions_rad[i], 0 , 2 * Math.PI);

    if (positions_on[i]) {
    ctxM.fillStyle = 'hsl(' + myHue[positions_col[i]] + ',90%, 20%)'
  } else {
    ctxM.fillStyle = 'hsl(' + myHue[positions_col[i]] + ',0%, 0%)'
  }

  if (positions_on[i]) { //fill only if true
    ctxM.fill();
}
  }

  storeLastPosition(yp,hueCtrl,radius, tog);
  hueCtrl = numPreset + pol -1;
  ctxP.fillStyle = 'hsl(' + myHue[hueCtrl] + ',60%, 80%)' //mdc[pol-1]

  ctxP.fill();

  ctxP.translate(-x0,-y0);
  ctxM.translate(-x0,-y0);

  requestAnimationFrame(drawPotato);
}

function storeLastPosition(yPos, polly,raggio, nios) {
  // push an item
  positions_y.unshift(yPos);
  positions_col.unshift(polly);
  positions_rad.unshift(raggio);
  positions_on.unshift(nios);

  //get rid of first item

  if (positions_y.length > motionTrailLength) {
    positions_y.pop();
    positions_col.pop();
    positions_rad.pop();
    positions_on.pop();
  }
}

//END -----


function dissolvenzaCanvas() {
    canvas.style.opacity = 1;
    canvasPotato.style.opacity = 1;
    canvasMel.style.opacity = 0.65;
    canvasText.style.opacity = 0; //Has to disappear

}

function resetCanvas(){
  clearInterval(idCan);
  canvas.style.opacity = 0;
  canvasPotato.style.opacity = 0;
  canvasMel.style.opacity = 0;
  canvasText.style.opacity = 1; //Has to appear

  start = document.getElementById("aWrapper");
  start2 = document.getElementById("startButton");

}

CanvasRenderingContext2D.prototype.clear =
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }
};

//return true if current note belong to the current scale
function noteIsOnSCALES(){
  if(currentScale.has(findNote(currentNote))){
    return true;}
}

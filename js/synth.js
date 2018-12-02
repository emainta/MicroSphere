var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength); 

var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var canvasFrequency = document.querySelector("#canvasFrequency");
var ctxF = canvasFrequency.getContext("2d");

function drawSamples(phase){
   analyser.getByteTimeDomainData(dataArray);
   ctx.clearRect(0,0,canvas.width,canvas.height) ;
   ctx.beginPath();
   for(var i=0; i<canvas.width; i++){
    ctx.lineTo(i,dataArray[i]);
    var gradient=ctx.createLinearGradient(0,0,180,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    ctx.fillStyle= gradient;
    ctx.strokeStyle= gradient;
  }
  ctx.stroke();
  requestAnimationFrame(drawSamples);
}
 
  
function drawSamplesFrequency(phase){
 analyser.getByteFrequencyData(dataArray);
 ctxF.clearRect(0,0,canvasFrequency.width,canvasFrequency.height) ;
 ctxF.beginPath();
 var x=0;
 
 for(var i=0; i<canvasFrequency.width; i++){
 ctxF.fillRect(i, canvasFrequency.height-dataArray[i],1, canvasFrequency.height);
   //i*10 è la distanza tra una riga e l'altra, 2 è la larghezza della riga in pixel
// Create gradient
var gradient=ctxF.createLinearGradient(0,0,canvasFrequency.width,0);
gradient.addColorStop("0","magenta");
gradient.addColorStop("0.5","blue");
gradient.addColorStop("1.0","red");
ctxF.strokeStyle=gradient; 
ctxF.fillStyle= gradient;
 }
  ctxF.stroke();
  requestAnimationFrame(drawSamplesFrequency);
 }

drawSamplesFrequency(); 

drawSamples();
var ph=0;  
  
function animate(){
  drawSine(ph);
  ph+=1;
}
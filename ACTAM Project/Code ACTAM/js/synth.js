//<<<<<<<<<<<< INIZIO CODICE CONTROLLER >>>>>>>>>>>>>>>>

//variable
var SCALES;
//variabili per acquisire e memorizzare gli accordi
//Valore attualmente suonata in valore midi
var currentMidiNote;

var rootChar = ['C', ' C#', 'D', 'D#' , 'E' , 'F' , 'F#' , 'G' , 'G#' , 'A' , 'A#' , 'B'];

//Inializza tutti i valori
function initialValues(){

  SCALES = new Map();

  //SCALES dei modi maggiori
  var dor = new Set([ 0, 2, 3, 5, 7, 9, 10 ]);
  var pentaMinor = new Set([0,4,6,8,10,-1,-1]);
  var pentaMajor = new Set([0,2,4,7,9,-1,-1]);


  SCALES.set('DOR',dor);
  SCALES.set('pMaj',pentaMajor);
  SCALES.set('pMin',pentaMinor);

  currentScale = new Set();
  mdc[0] = "pMin";
  mdc[1] ="pMaj";
  mdc[2] ="DOR";
  scaleToPlay[0] = pentaMinor;
  scaleToPlay[1] = pentaMajor;
  scaleToPlay[2] = dor;
  currentNote = 0; //nessuna nota suonata ancora
  currentMode = 'WAIT';
}

initialValues();


//return true if current note belong to the current scale
function noteIsOnSCALES(){
  if(currentScale.has(findNote(currentNote))){
    return true;}
}

//Play a note if it's on scale
function playIfyouCan(){
  if(noteIsOnSCALES()){
    currentMidiNote = currentNote + 36;//midi
    noteOn(currentMidiNote)}
}

//turn on led
function turnOnLed(){
  var myVar;
  function ghandi(){document.querySelector("#led").classList.remove("led_on")};
  myVar = setTimeout(ghandi, 900);
  document.querySelector("#led").classList.add("led_on");
}

//trova l'ottava della nota
function findOctave(note){
  octave=0;
  if(note<12){octave=0};
  if(note>=12 && note<24){octave=1};
  if(note>=24 &&note<36){octave=2};
  if(note>=36 &&note<48){octave=3};
  if(note>=48 &&note<60){octave=4};
  if(note>=60 &&note<72){octave=5};
  if(note>=72 &&note<84){octave=6};
  if(note>=84 &&note<96){octave=7};
  if(note>=96){octave=8};
  return octave;
}

//ritorna la nota con valori tra 0 e 12
function findNote(note){
  var octave = findOctave(note);
  var module12Note = note-octave*12;
  return module12Note;
}


//<<<<<<<<<<< FINE CODICE CONRTOLLER >>>>>>>>>>>>>


//<<<<<<<<<<<  CODICE SYNTH >>>>>>>>>>>>>

//Create an audio context
var c = new AudioContext();

//All the oscillators active now
var activeOscillators = new Array();

//Initial Parameters
var filterGain = 100;
var currentModFrequency;  // to modulate the carrier oscillator
var currentOsc1Detune = 0;

var filterCutOff = 800;
var filterQ = 10;
var filterEnvelope= 56;

var envAttack = 6;
var envDecay = 15;
var envSustain = 50;
var envRelease= 5;

var filterEnvAtt =7;
var filterEnvD = 7;
var filterEnvSus = 5;
var filterEnvR = 7;

var valueRev=0;
var dryWetRev = 0;
var currentDist = 0;

var currentDelay = 0.0;
var currentGainDelay = 5;
var distCurve = 0;

// global gain for the effectChain
var effectChain;
var distortion;
var distortionGain;
var masterGain;
var revWetGain;
var revDryGain;
var convolver;
var compressor;
var delay;
var gainDelay;
var preDelayGain;
var impulseBuffer;

//not present in the graphic interface
var analyser = c.createAnalyser();
analyser.ffsize=1024;

initAudio();

//keyboard
var allKeys = document.getElementsByTagName("li");

//to select waveform
var wavePicker = document.querySelector("select[name='waveform']");
var modwavePicker = document.querySelector("select[name='modwaveform']");
var filterPicker = document.querySelector("select[name='filterType']");


//When playing a note
function noteOn( note) {
	if (activeOscillators[note] == null) {
		 activeOscillators[note] = new playNote(note);}

  //Code to show what note is playng on keyboard
  var key = note-36;
  if( key == 0 || key == 2 || key == 4 || key == 5 || key == 7 || key == 9 || key == 11 || key == 12 || key == 14 || key == 16 || key == 17 || key == 19 || key == 21 || key == 23|| key == 25){
    allKeys.item(key).classList.add("whiteActive");}
  else{
    allKeys.item(key).classList.add("blackActive");}
}

//when stopping a note
function noteOff( note ) {
	if (activeOscillators[note] != null) {
		//stoppa la nota e cancella la posizione sull'array
		stopNote(note);
		activeOscillators[note] = null;
    //serve solo per visualizzare i tasti suonati sulla midi keyboard
   var key = note-36;
   if( key == 0 || key == 2 || key == 4 || key == 5 || key == 7 || key == 9 || key == 11 || key == 12 || key == 14 || key == 16 || key == 17 || key == 19 || key == 21 || key == 23|| key == 25){
     allKeys.item(key).classList.remove("whiteActive")}
   else{ allKeys.item(key).classList.remove("blackActive")}}
}


//change MIDI in frequency
function frequencyFromMIDI( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

//choose the type of wave
function chooseOscillatorType(){
  return wavePicker.options[wavePicker.selectedIndex].value;
}
function chooseModType(){
   return modwavePicker.options[modwavePicker.selectedIndex].value;
}
function createPeriodicWave(){
  var sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  var cosineTerms = new Float32Array(sineTerms.length);
  var customWaveform = c.createPeriodicWave(cosineTerms, sineTerms);
  return customWaveform;
}


//PlayNote creates a carrier oscillator, a modulator, a filter and a gain to control ADSR
function playNote(note, v){

   //carrier
   this.oscillator1 = c.createOscillator();
   this.oscillator1.frequency.value = frequencyFromMIDI( note );

  //type of wave
  let type = chooseOscillatorType();
  if (type == "custom") {
    this.oscillator1.setPeriodicWave(createPeriodicWave());}
  else this.oscillator1.type = type;
  //carrier's gain
   this.osc1Gain = c.createGain();
 	 this.osc1Gain.gain.value = 1;
	 this.oscillator1.connect( this.osc1Gain);


  // modulator
	this.modOsc = c.createOscillator();
	this.modOsc.type = chooseModType();
  //num/den chenge the frequency modulation
  currentModFrequency = this.oscillator1.frequency.value - this.oscillator1.frequency.value*num / den;
	this.modOsc.frequency.value = currentModFrequency ;
  //connect modulator to the carrier's frequency
	this.modOsc1Gain = c.createGain();
	this.modOsc.connect( this.modOsc1Gain );
	this.modOsc1Gain.gain.value = 5;
	this.modOsc1Gain.connect( this.oscillator1.frequency );

  //filter
	this.filter = c.createBiquadFilter(); // se metto l'high pass devo abbassare il modfilter gain
	this.filter.type = chooseFilterType();
	this.filter.Q.value = filterQ; // da 0 a 20
	this.filter.frequency.value = filterCutOff;  // da 50 a 1000
	this.osc1Gain.connect( this.filter );

	//connect the modulator to the filter
	this.modFilterGain = c.createGain();
  this.modOsc.connect( this.modFilterGain );
  this.modFilterGain.gain.value =filterGain*24; // mettere una variabile da regolare per il mix del filtro 2 da 100 a 300
	this.modFilterGain.connect( this.filter.detune );	// vibrato

	// envelope for ADSR control
	this.envelope = c.createGain();
	this.filter.connect( this.envelope );
	this.envelope.connect(effectChain);

	// set up the volume and filter envelopes
	var now = c.currentTime;
	var envAttackEnd = now + (envAttack/20.0);

	this.envelope.gain.value = 0.0;
	this.envelope.gain.setValueAtTime( 0.0, now );
	this.envelope.gain.linearRampToValueAtTime( 1.0, envAttackEnd );
	this.envelope.gain.setTargetAtTime( (envSustain/100.0), envAttackEnd, (envDecay/100.0)+0.001 );

	var filterAttackLevel = filterEnvelope*72;
	var filterSustainLevel = filterAttackLevel* filterEnvSus / 100.0;
	var filterAttackEnd = (filterEnvAtt/20.0);
  if (!filterAttackEnd)
        filterAttackEnd=0.05;
	this.filter.detune.setValueAtTime( 0, now );
	this.filter.detune.linearRampToValueAtTime( filterAttackLevel, now+filterAttackEnd );
	this.filter.detune.setTargetAtTime( filterSustainLevel, now+filterAttackEnd, (filterEnvD/100.0) );
   // fa un attacco carino
	this.oscillator1.start(0);
	this.modOsc.start(0);
}

//stopNote
function stopNote(note){
  var now =  c.currentTime;
	var release = now + (envRelease/10.0);
  activeOscillators[note].envelope.gain.cancelScheduledValues(now);
  activeOscillators[note].envelope.gain.setValueAtTime( activeOscillators[note].envelope.gain.value, now );
  activeOscillators[note].envelope.gain.setTargetAtTime(0.0, now, (envRelease/100));
  activeOscillators[note].filter.detune.cancelScheduledValues(now);
  activeOscillators[note].filter.detune.setTargetAtTime( 0, now, (filterEnvR/100.0) );
  activeOscillators[note].filter.Q.cancelScheduledValues(now);
  activeOscillators[note].filter.Q.setTargetAtTime( 0, now, (filterEnvR/100.0) );
  activeOscillators[note].oscillator1.stop(release);
}



//Distortion
function makeDistortionCurve(value) {
  var k = typeof value === 'number' ? value : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  distCurve= curve;
  return curve;
}

//Mix reverb
var mixRev = function( value ) {
	var gain1 = Math.cos(value * 0.5*Math.PI);
	var gain2 = Math.cos((1.0-value) * 0.5*Math.PI);
	revDryGain.gain.value = gain1;
	revWetGain.gain.value = gain2;
}

function changeValue(valueR){
  if(valueR<0){valueR=0;}
  dryWetRev = parseFloat(valueR) / 100.0;
	mixRev(dryWetRev);
}


//effect changed from html
document.querySelector("#masterGain").oninput = function(){
  masterGain.gain.value = this.value;
}

document.querySelector("#timeDelay").oninput = function(){
  delay.delayTime.value = this.value;
}

document.querySelector("#gDelay").oninput = function(){
  gainDelay.gain.value = this.value;
}

document.querySelector("#distortionCurve").oninput = function(){
    var value = parseInt(this.value) * 5;
    distortion.curve = makeDistortionCurve(value);
}

function oversample(type){
  distortion.oversample = type;
}

//filter's Q VALUE
playNote.prototype.setFilterQ = function( value ) {
	this.filter.Q.value = value;
}

document.querySelector("#qFactor").oninput = function(){
   filterQ = this.value;
	  for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setFilterQ(filterQ);
      }
    }
 }

//filter's volume
playNote.prototype.setFilterGain = function( value ) {
	this.modFilterGain.gain.value = value;
}

document.querySelector("#filterGain").oninput = function(){
   //filterGain = this.value;
	  for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setFilterGain( filterGain );
      }
    }
 }


//filter's cutoff
playNote.prototype.setFilterCutoff = function( value ) {
	this.filter.frequency.value = value;
}
document.querySelector("#cutOffFilter").oninput = function(){
  filterCutOff = this.value ;
  for (var i=0; i<255; i++) {
	if (activeOscillators[i] != null) {
		  activeOscillators[i].setFilterCutoff(filterCutOff);
      }
    }
}

//TIPO FILTRO
function chooseFilterType(){
  return filterPicker.options[filterPicker.selectedIndex].value;
}

//DETUNE OSCILLATOR
playNote.prototype.setDetune = function( value ) {
	this.oscillator1.detune.value = value;
}
document.querySelector("#detune").oninput = function(){
    detune= this.value;
    for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setDetune( detune );
      }
   }
}


//MODULATOR FREQUENCY
playNote.prototype.setModFreq = function( value ) {
	this.modOsc.frequency.value = value;
}

document.querySelector("#freqMod").oninput = function(){
    currentModFrequency= this.value;
    for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setModFreq( currentModFrequency );
      }
   }
}



// crea effectChain, delay, distortion, convolver, masterGain, compressor
function initAudio() {

  //gain to connect effect to the envelope gain
	effectChain = c.createGain();

  //distortion
	distortion =  c.createWaveShaper();
  distortion.curve = makeDistortionCurve(0);
  distortion.oversample = "none";

  //delay
  delay = c.createDelay();
  gainDelay = c.createGain();
  delay.delayTime.value= 0.0;
  gainDelay.gain.value = 0.0;

  //Convolver for concert hall reverb
  convolver = c.createConvolver();
  revWetGain = c.createGain();
	revDryGain = c.createGain();
  revWetGain.gain.value = 0.0;
  revDryGain.gain.value = 1.57;

  getImpulse('https://dl.dropboxusercontent.com/s/5lk5wxavxfoev0x/02-6%20Hall%201-00.wav?dl=0');

  //master gain
  masterGain = c.createGain();
  masterGain.gain.setValueAtTime(1, c.currentTime);

  //compressor
  compressor = c.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-40, c.currentTime);
  compressor.knee.setValueAtTime(40, c.currentTime);
  compressor.ratio.setValueAtTime(12, c.currentTime);
  compressor.attack.setValueAtTime(0, c.currentTime);
  compressor.release.setValueAtTime(0.25, c.currentTime);

  //connection
  effectChain.connect(distortion);
  distortion.connect(delay);
  delay.connect(gainDelay);
  gainDelay.connect(delay);
  delay.connect( convolver );
  delay.connect( revDryGain );
  convolver.connect(revWetGain);
  revWetGain.connect( masterGain);
  revDryGain.connect( masterGain);
  masterGain.connect( compressor );
  compressor.connect(analyser);
  compressor.connect(	c .destination );
}

//impulse response
function getImpulse(impulseUrl) {
  ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open('GET', impulseUrl, true);
  ajaxRequest.responseType = 'arraybuffer';

  ajaxRequest.onload = function() {
    var impulseData = ajaxRequest.response;

    c.decodeAudioData(impulseData, function(buffer) {
        myImpulseBuffer = buffer;
        convolver.buffer = myImpulseBuffer;
        convolver.loop = true;
	      convolver.normalize = true;
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  ajaxRequest.send();
}


//TO PLAY FROM COMPUTER KEYBOARD
document.onkeypress = function (keyPressed){
  switch(keyPressed.key){
     case "a":
        if(!keyPressed.repeat){
          allKeys.item(0).classList.toggle("whiteActive");
          noteOn(48,127);
        }
        break;
     case "w":
      if(!keyPressed.repeat){
          allKeys.item(1).classList.toggle("blackActive");
          noteOn(49,127);
         }
        break;
      case "s":
        if(!keyPressed.repeat){
          allKeys.item(2).classList.toggle("whiteActive");
          noteOn(50,127);
        }
        break;
     case "e":
        if(!keyPressed.repeat){
          allKeys.item(3).classList.toggle("blackActive");
          noteOn(51,127);
         }
        break;
      case "d":
        if(!keyPressed.repeat){
          allKeys.item(4).classList.toggle("whiteActive");
          noteOn(52,127);
        }
        break;
     case "f":
        if(!keyPressed.repeat){
          allKeys.item(5).classList.toggle("whiteActive");
          noteOn(53,127);
        }
        break;
      case "t":
        if(!keyPressed.repeat){
          allKeys.item(6).classList.toggle("blackActive");
         noteOn(54,127);
        }
        break;
     case "g":
        if(!keyPressed.repeat){
          allKeys.item(7).classList.toggle("whiteActive");
          noteOn(55,127);
        }
        break;
     case "y":
        if(!keyPressed.repeat){
          allKeys.item(8).classList.toggle("blackActive");
          noteOn(56,127);
        }
        break;
     case "h":
        if(!keyPressed.repeat){
          allKeys.item(9).classList.toggle("whiteActive");
          noteOn(57,127);
        }
        break;
     case "u":
        if(!keyPressed.repeat){
          allKeys.item(10).classList.toggle("blackActive");
         noteOn(58,127);
        }
        break;
     case "j":
        if(!keyPressed.repeat){
          allKeys.item(11).classList.toggle("whiteActive");
          noteOn(59,127);
        }
        break;
     case "k":
        if(!keyPressed.repeat){
          allKeys.item(12).classList.toggle("whiteActive");
         noteOn(60,127);
        }
        break;
     case "o":
        if(!keyPressed.repeat){
          allKeys.item(13).classList.toggle("blackActive");
          noteOn(61,127);
          break;
        }
     case "l":
        if(!keyPressed.repeat){
          allKeys.item(14).classList.toggle("whiteActive");
          noteOn(62,127);
          break;
        }
  }
}
document.onkeyup = function (keyPressed){
  switch(keyPressed.key){
     case "a":
        if(!keyPressed.repeat){
          allKeys.item(0).classList.toggle("whiteActive");
          noteOff(48);
        }
        break;
     case "w":
      if(!keyPressed.repeat){
          allKeys.item(1).classList.toggle("blackActive");
          noteOff(49);
         }
        break;
      case "s":
        if(!keyPressed.repeat){
          allKeys.item(2).classList.toggle("whiteActive");
          noteOff(50);
        }
        break;
     case "e":
        if(!keyPressed.repeat){
          allKeys.item(3).classList.toggle("blackActive");
          noteOff(51);
         }
        break;
      case "d":
        if(!keyPressed.repeat){
          allKeys.item(4).classList.toggle("whiteActive");
          noteOff(52);
        }
        break;
     case "f":
        if(!keyPressed.repeat){
          allKeys.item(5).classList.toggle("whiteActive");
          noteOff(53);
        }
        break;
      case "t":
        if(!keyPressed.repeat){
          allKeys.item(6).classList.toggle("blackActive");
         noteOff(54);
        }
        break;
     case "g":
        if(!keyPressed.repeat){
          allKeys.item(7).classList.toggle("whiteActive");
          noteOff(55);
        }
        break;
     case "y":
        if(!keyPressed.repeat){
          allKeys.item(8).classList.toggle("blackActive");
          noteOff(56);
        }
        break;
     case "h":
        if(!keyPressed.repeat){
          allKeys.item(9).classList.toggle("whiteActive");
          noteOff(57);
        }
        break;
     case "u":
        if(!keyPressed.repeat){
          allKeys.item(10).classList.toggle("blackActive");
         noteOff(58);
        }
        break;
     case "j":
        if(!keyPressed.repeat){
          allKeys.item(11).classList.toggle("whiteActive");
          noteOff(59);
        }
        break;
     case "k":
        if(!keyPressed.repeat){
          allKeys.item(12).classList.toggle("whiteActive");
         noteOff(60);
        }
        break;
     case "o":
        if(!keyPressed.repeat){
          allKeys.item(13).classList.toggle("blackActive");
          noteOff(61);
          break;
        }
     case "l":
        if(!keyPressed.repeat){
          allKeys.item(14).classList.toggle("whiteActive");
          noteOff(62);
          break;
        }
  }
}

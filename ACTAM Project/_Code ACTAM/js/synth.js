//<<<<<<<<<<<< INIZIO CODICE CONTROLLER >>>>>>>>>>>>>>>>
//variabili

//le SCALES che vengono valutate per esserre proposte
var SCALES;
//variabili per acquisire e memorizzare gli accordi
var currentAcquiredNotes;
//Valore attualmente suonata in valore midi
var currentMidiNote;

var timer;

var rootChar = ['C', ' C#', 'D', 'D#' , 'E' , 'F' , 'F#' , 'G' , 'G#' , 'A' , 'A#' , 'B'];

var CHORDS;
//Inializza tutti i valori
function initialValues(){

  SCALES = new Map();
  CHORDS = new Map();
  currentAcquiredNotes = new Set();

  //SCALES dei modi maggiori
  var lyd = new Set([ 0, 2, 4, 6, 7, 9, 11 ]);
  var ion = new Set([ 0, 2, 4, 5, 7, 9, 11 ]);
  var mix = new Set([ 0, 2, 4, 5, 7, 9, 10 ]);
  var dor = new Set([ 0, 2, 3, 5, 7, 9, 10 ]);
  var aol = new Set([ 0, 2, 3, 5, 7, 8, 10 ]);
  var phr = new Set([ 0, 1, 3, 5, 7, 8, 10 ]);
  var loc = new Set([ 0, 1, 3, 5, 6, 8, 10 ]);
  var pentaMinor = new Set([0,4,6,8,10]);
  var pentaMajor = new Set([0,2,4,7,9]);

  SCALES.set('LYD',lyd);
  SCALES.set('ION',ion);
  SCALES.set('MIX',mix);
  SCALES.set('DOR',dor);
  SCALES.set('AOL',aol);
  SCALES.set('PHR',phr);
  SCALES.set('LOC',loc);
  SCALES.set('pMaj',pentaMajor);
  SCALES.set('pMin',pentaMinor);

  //maschere accordi
  major7th= new Set([ 0, 4, 7, 11]); // major7th
  minor7th=new Set([0, 3, 7, 10]);
  dominant7th = new Set([0,4,7,10]);
  minor7thDim = new Set([0,3,6,10]);

  CHORDS.set('MAJOR7th',major7th);
  CHORDS.set('MINOR7th',minor7th);
  CHORDS.set('DOMINANT',dominant7th);
  CHORDS.set('MINORDIMINISHED',minor7thDim);

  mdc = new Array(7).fill(0);
  mdcPIANO = new Array(3).fill("null", "null", "null");
  rootOfCurrentChord = 0;
  currentChord = "Suona";
  scaleToPlay = new Array(6).fill(lyd,ion,mix,dor,aol,phr,loc);
  currentScale = new Set();
  transalteAllSCALES();
  currentNote = 0; //nessuna nota suonata ancora
  currentMode = 'WAIT';
  currentGrade = 0;
}

initialValues();


//questa funzione viene  chiamata da microbit quando si deve suonare una nota!
//se currentNote appartiene a currentSCALES ritorna true
function noteIsOnSCALES(){
  if(currentScale.has(findNote(currentNote))){
    return true;}
}

//suona la nota se noteIsOnSCALES
function playIfyouCan(){
  if(noteIsOnSCALES()){
    currentMidiNote = rootOfCurrentChord+ currentNote + 36;//midi
    noteOn(currentMidiNote)}
}

//accende il led
function turnOnLed(){
  var myVar;
  function ghandi(){document.querySelector("#led").classList.remove("led_on")};
  myVar = setTimeout(ghandi, 900);
  document.querySelector("#led").classList.add("led_on");
}


//controlla se il pianista sta suonando un accordo ammissibile dall'applicazione
function checkSeventhChord(acquiredSetOfNotesSCALES){
  var newSCALES = new Array();

  for(let i of acquiredSetOfNotesSCALES){
      i = i - rootOfCurrentChord ; //dovrebbe traslare le note dell'accordo facendole partire tutte da zero.
      if(i<0) i = i+12;
      if (i>=12) i = i-12;
      newSCALES.push(i);
  }
  //verifica che esiste almeno una maschera uguale all'accordo ricevuto da midi
  var found = false;
  for (const [c, chord] of CHORDS){
    if(!found){
      var comNotes = new Set(newSCALES.filter(x => chord.has(x)));
      if(comNotes.size==4){ // se voglio che funzioni con accordi estesi devo mettere maggiore di 3
        for( let i of comNotes ){
          currentChord = c;
          console.log("trovato accordo: " + c)}
          found = true;} // trova uno tra i possibili modi
        }
      }
  if(!found){ console.log("FALSO "); return false}
  return true;
}

//sono messi in ordine di brightness
function transalteAllSCALES(){
  scaleToPlay[0] = setTonality(SCALES.get("DOR"), rootOfCurrentChord);
  scaleToPlay[1] = setTonality(SCALES.get("pMaj"), rootOfCurrentChord);
  scaleToPlay[2] = setTonality(SCALES.get("pMin") , rootOfCurrentChord);
  /*SCALESToPlay[3] = setTonality(SCALES.get("DOR"), rootOfCurrentChord);
  SCALESToPlay[4] = setTonality(SCALES.get("AOL"), rootOfCurrentChord);
  SCALESToPlay[5] = setTonality(SCALES.get("PHR"), rootOfCurrentChord);
  SCALESToPlay[6] = setTonality(SCALES.get("LOC"), rootOfCurrentChord);*/
  mdc[0]= "DOR";
  mdc[1]= "PMAJ";
  mdc[2]= "PMIN";
/*  mdc[3]= "DOR";
  mdc[4]= "AOL";
  mdc[5]= "PHR";
  mdc[6]= "LOC";*/
}


//questa funzione raccoglie tutte le note midi proveniente dall'accordo
function acquireNote(note){
  currentAcquiredNotes.add(note);
  if(currentAcquiredNotes.size>3){
    var acquiredSetOfNotes = new Array();
    currentAcquiredNotes.forEach(function(n){acquiredSetOfNotes.push(findNote(n))});// faccio il modulo
    if(acquiredSetOfNotes.length > 3){ // devono essere 4 note diverse, se preme c3 e c4 è come se avesse premuto una nota.
      findLowestNote();
      document.querySelector('.root').innerHTML = rootChar[rootOfCurrentChord];
      transalteAllSCALES(rootOfCurrentChord);
      if(checkSeventhChord(acquiredSetOfNotes)){
        //trovato l'accordo procede
      if(timer!=null){clearTimeout(timer)}; //cancella il timeout prima di farlo ripartire
      compareSCALES(acquiredSetOfNotes);}//devo fare ritornare qualcosa a compare SCALES??
      else{
        //document.getElementById("md").innerHTML = "NOT VALID";
        console.log("Non hai suonato un accordo valido! Suona un'accordo di settima! Puoi suonare un MAJOR7th, un MINOR7th, un DOMINANT o un MINOR DIMINISHED7th");}
    }
  }
}

//prende la nota più bassa dell'accordo e la fa diventare ROOT
//LA rootOfCurrentChord HA VA DA 0 A 12
function findLowestNote(){
  var lowest = 0;
  let n = false;
  //trova la più bassa del set
  currentAcquiredNotes.forEach(function(note){
    if(n){
      note<lowest
      ? lowest=note : lowest=lowest}
    else{
      lowest = note; n = true;}
    })
  //svuota il set
  currentAcquiredNotes.clear();

  //setta la rootOfCurrentChord solo la prima volta
  lowest = findNote(lowest); //trova il modulo
  rootOfCurrentChord = lowest;}


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

//trasla tutte le note di SCALES partendo da root
function setTonality(SCALES,root){
    var newSCALES = new Set();
    for(let i of SCALES){
          i = i + root;
          if(i<0){newNote = i+12;}
          if (i>=12) {i= i-12}
          newSCALES.add(i);
          }
  return newSCALES;
}


//trova il modo suonato dall'accordo sulla midi keyboard, trovato il modo fa partire il timer
function compareSCALES(acquiredSetOfNotesSCALES){

  var found = false;
  var setSCALES;
//  findGradeRelativeToRoot();

  for (const [mode, SCALES] of SCALES){

    setSCALES= setTonality(SCALES, rootOfCurrentChord);

    if(found == false){
      var comNotes = new Set(acquiredSetOfNotesSCALES.filter(x => setSCALES .has(x)));
      //la scala più chiara sta sulla poszione 1, su 0 la più scura
      if(comNotes.size>3){
          if (mode == 'ION' || mode == 'LYD'){
            found = true;
            mdcPIANO[0] = "LYD";
            mdcPIANO[1] = "ION"
            mdcPIANO[2] = " "}

          else if(mode == 'DOR' || mode == 'AOL' ||  mode == 'PHR'){
            found = true;
            mdcPIANO[0] = "DOR";
            mdcPIANO[1] = "AOL";
            mdcPIANO[2] = "PHR"}

          else if (mode == 'MIX'){
            found = true;
            mdcPIANO[0] = mode;
            mdcPIANO[1] = " "
            mdcPIANO[2] = " "}

          else if (mode == 'LOC'){
            found = true;
            mdcPIANO[0] = mode;
            mdcPIANO[1] = " ";
            mdcPIANO[2] = " ";}

         }//if cm notes
     }//found = false
   }//chiude il for
   if(found){
     showTimer(); // mostra a video il timer e verifica i risultati dopo 20 sec
   }
   else{
     console.log("non ho trovato il modo dell'accordo");
   }
}

function showTimer(){
  var timeleft = 10;
  timer= setInterval(function(){
    document.getElementById("time").innerHTML = timeleft;
    timeleft -= 1;
  if(timeleft <= 0){
    twentySeconds();
    clearInterval(timer);
    document.getElementById("time").innerHTML = "Finished"
    }
  }, 1000);
}

function twentySeconds(){
  var foundMode = false;

  switch (currentChord){
    case "MAJOR7th":
      console.log("la variabile polso : " + pol )
      if(pol == 1 || pol == 2 ){
        foundMode = true;
        console.log("if trovato : "  + currentChord + "io sono found " + foundMode); }
        break;
    case "MINOR7th":
      if(pol ==4 || pol == 5 || pol == 6){
        foundMode = true; }
        break;
    case "DOMINANT":
      if(pol == 3){
       foundMode = true;}
       break;
    case "MINORDIMINISHED":
      if ( pol == 7){
        foundMode = true;}
        break;
    }
    if(foundMode==true){
      console.log("trovato : "  + currentChord);
      //document.getElementById("md").innerHTML = pol + " ° " + currentMode;
      document.getElementById("mdcPIANO").innerHTML = "RIGHT: "+ mdcPIANO}
    else{
      document.getElementById("mdcPIANO").innerHTML = "WRONG"
    }
}

// MIDI ACCESS
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}
function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    console.log(message);
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
              acquireNote(note);
            //  oscillatorStart(note);}
          }
            break;
      }
  }

function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
    }



//<<<<<<<<<<< FINE CODICE CONRTOLLER >>>>>>>>>>>>>


//<<<<<<<<<<<  CODICE SYNTH >>>>>>>>>>>>>


var c = new AudioContext();

//All the oscillators active now
var activeOscillators = new Array();

var filterGain = 100;
var currentModFrequency;  // fa vibrare l'oscillatore, capire come si puo automatizzare la frazione
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

var analyser = c.createAnalyser();
analyser.ffsize=1024;

initAudio();

//tutti i tasti
var allKeys = document.getElementsByTagName("li");
var wavePicker = document.querySelector("select[name='waveform']");
var modwavePicker = document.querySelector("select[name='modwaveform']");
var filterPicker = document.querySelector("select[name='filterType']");


//When playing a note
function noteOn( note) {
	if (activeOscillators[note] == null) {
		 activeOscillators[note] = new playNote(note);}
  //serve solo per visualizzare i tasti suonati sulla midi keyboard
  var key = note-36;
  if( key == 0 || key == 2 || key == 4 || key == 5 || key == 7 || key == 9 || key == 11 || key == 12 || key == 14 || key == 16 || key == 17 || key == 19 || key == 21 || key == 23|| key == 25){
  allKeys.item(key).classList.add("whiteActive");}
  else{
  allKeys.item(key).classList.add("blackActive");}
	}

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


//FUNZIONE PRINCIPALE_: crea gli oscillatori, i modulatori, i filtri e li collega
function playNote(note, v){

   //creo un primo oscillatore e gli do parametri freq e gain iniziale
   this.oscillator1 = c.createOscillator();
   this.oscillator1.frequency.value = frequencyFromMIDI( note );

  //tipo di wave
  let type = chooseOscillatorType();
  if (type == "custom") {
    this.oscillator1.setPeriodicWave(createPeriodicWave());}
   else this.oscillator1.type = type;
  //gain a cui collego l'oscillatore
   this.osc1Gain = c.createGain();
 	 this.osc1Gain.gain.value = 1;
	 this.oscillator1.connect( this.osc1Gain);


  // creo un secondo oscillatore, in funzione di modulatore, a cui do una frequenza iniziale
	this.modOsc = c.createOscillator();
	this.modOsc.type = chooseModType();
  currentModFrequency = this.oscillator1.frequency.value - this.oscillator1.frequency.value*41 / 60;
	this.modOsc.frequency.value = currentModFrequency ;
  //collego il modulatore a un gain e collego il modulatore al primo oscillatore così che varia il suo gain in base alla frequenza
	this.modOsc1Gain = c.createGain();
	this.modOsc.connect( this.modOsc1Gain );
	this.modOsc1Gain.gain.value = 5;
	this.modOsc1Gain.connect( this.oscillator1.frequency );

	this.filter = c.createBiquadFilter(); // se metto l'high pass devo abbassare il modfilter gain
	this.filter.type = chooseFilterType();
	this.filter.Q.value = filterQ; // da 0 a 20
	this.filter.frequency.value = filterCutOff;  // da 50 a 1000
	this.osc1Gain.connect( this.filter );

	// per collegare il modulatore al filtro creo un altro gain , gli collego il modulatore e lo collego a entrmbi i filtri
	this.modFilterGain = c.createGain();
  this.modOsc.connect( this.modFilterGain );
  this.modFilterGain.gain.value =filterGain*24; // mettere una variabile da regolare per il mix del filtro 2 da 100 a 300
	this.modFilterGain.connect( this.filter.detune );	// vibrato

	// crepo l'envelope dell'attacco all'oscillatore
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

	var filterAttackLevel = filterEnvelope*72;  // Range: 0-7200: 6-octave range
	var filterSustainLevel = filterAttackLevel* filterEnvSus / 100.0; // range: 0-7200
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



//CONTROLLI EFFETTI
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

//funzione che cambia i valori del riverbero sui gain
var mixRev = function( value ) {
	var gain1 = Math.cos(value * 0.5*Math.PI);
	var gain2 = Math.cos((1.0-value) * 0.5*Math.PI);
	revDryGain.gain.value = gain1;
	revWetGain.gain.value = gain2;
}

//chiamato ogni volta che viene modificato il riverbero
function changeValue(valueR){
  if(valueR<0){valueR=0;}
  dryWetRev = parseFloat(valueR) / 100.0;
	mixRev(dryWetRev);
}

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



//set filters Q VALUE
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

//VOLUME FILTRO
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


//CUTOFF FILTRO
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

	// set up the master effects chain for all voices to connect to.
	effectChain = c.createGain();
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


  masterGain = c.createGain();
  masterGain.gain.setValueAtTime(1, c.currentTime);
  compressor = c.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-40, c.currentTime);
  compressor.knee.setValueAtTime(40, c.currentTime);
  compressor.ratio.setValueAtTime(12, c.currentTime);
  compressor.attack.setValueAtTime(0, c.currentTime);
  compressor.release.setValueAtTime(0.25, c.currentTime);

  //connessioni
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


//PLAY FROM COMPUTER KEYBOARD
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

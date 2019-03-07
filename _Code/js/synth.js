//<<<<<<<<<<<< INIZIO CODICE CONTROLLER >>>>>>>>>>>>>>>>
//variabili

//La nota più bassa registrata dall'accordo, va da 0 a 12
var rootNote;
//la scala scelta dall'inclinazione del polso tra quelle suggerite dall'applicazione
var currentScale;
//le scale che vengono valutate per esserre proposte
var MAJORMODESCALE;
//variabili per acquisire e memorizzare gli accordi
var currentAcquiredNotes;
//Tiene conto di quante acquisizioni di note ho fatto
var numberOfRec;
//Valore attualmente suonata in valore midi
var currentMidiNote;
// va a uno dopo che è stato preso il prima accordo
var flagFirstChord = 0 ;
//grado dell'accordo suonato dopo il primo
var gradeOfOtherChords = 0;

var rootChar = ['C', ' C#', 'D', 'D#' , 'E' , 'F' , 'F#' , 'G' , 'G#' , 'A' , 'A#' , 'B'];

var CHORDS;
//Inializza tutti i valori
function initialValues(){

  MAJORMODESCALE = new Map();
  MODEINORDER = new Map();
  CHORDS = new Map();
  currentScale = new Set();
  scaleToPlay = new Array();
  currentAcquiredNotes = new Set();

  //scale dei modi maggiori
  var lyd = new Set([ 0, 2, 4, 6, 7, 9, 11 ]);
  var ion = new Set([ 0, 2, 4, 5, 7, 9, 11 ]);
  var mix = new Set([ 0, 2, 4, 5, 7, 9, 10 ]);
  var dor = new Set([ 0, 2, 3, 5, 7, 9, 10 ]);
  var aol = new Set([ 0, 2, 3, 5, 7, 8, 10 ]);
  var phr = new Set([ 0, 1, 3, 5, 7, 8, 10 ]);
  var loc = new Set([ 0, 1, 3, 5, 6, 8, 10 ]);

  MAJORMODESCALE.set('LYD',lyd);
  MAJORMODESCALE.set('ION',ion);
  MAJORMODESCALE.set('MIX',mix);
  MAJORMODESCALE.set('DOR',dor);
  MAJORMODESCALE.set('AOL',aol);
  MAJORMODESCALE.set('PHR',phr);
  MAJORMODESCALE.set('LOC',loc);

// non è più l'ordine  di MODEINORDER ma dei modi maggiori sulla scala.
  MODEINORDER.set(3,'LYD');
  MODEINORDER.set(0,'ION');
  MODEINORDER.set(4,'MIX');
  MODEINORDER.set(1,'DOR');
  MODEINORDER.set(5,'AOL');
  MODEINORDER.set(2,'PHR');
  MODEINORDER.set(6,'LOC');

  //maschere accordi
  major7th= new Set([ 0, 4, 7, 11]); // major7th
  minor7th=new Set([0, 3, 7, 10]);
  dominant7th = new Set([0,4,7,10]);
  minor7thDim = new Set([0,3,6,10]);

  CHORDS.set('MAJOR7th',major7th);
  CHORDS.set('MINOR7th',minor7th);
  CHORDS.set('DOMINANT',dominant7th);
  CHORDS.set('MINORDIMINISHED',minor7thDim);


  numberOfRec = 0;
  currentRec = 0;
  scaleToPlay = ion;
  currentScale = ion;
  rootNote = 0; //Corrisponde a un do
  currentNote = 0; //nessuna nota suonata ancora
  mdc[3] = -1;
  currentMode[0] = 'WAIT';
  currentMode[1] = 'WAIT';
  currentMode[2] = 'MUTE';
}

initialValues();


//questa funzione viene  chiamata da microbit quando si deve suonare una nota!
//se currentNote appartiene a currentScale ritorna true
function noteIsOnScale(){
  if(currentScale.has(findNote(currentNote))){
    return true;}}

//suona la nota se noteIsOnScale
function playIfyouCan(){
  if(noteIsOnScale()){
    currentMidiNote = rootNote+ currentNote + 36;//midi
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
function checkSeventhChord(acquiredSetOfNotesScale){
  var newScale = new Array();
  let root;

  if(flagFirstChord == 0) root = rootNote;
  else root = gradeOfOtherChords;


  for(let i of acquiredSetOfNotesScale){
      i = i - root ; //dovrebbe traslare le note facendole partire tutte da zero.
      if(i<0) i = i+12;
      if (i>=12) i = i-12;
      newScale.push(i);
  }
  var found = false;
  for (const [c, chord] of CHORDS){
    if(!found){
      var comNotes = new Set(newScale.filter(x => chord.has(x)));
    /*  for( let i of comNotes ){
        console.log("valori in comune con il modo: "+ " " + c  + " " + i )}*/
      if(comNotes.size>3){
        found = true;
        }
      }
    }
  if(!found){ console.log("FALSO "); return false}
  return true;
}

//questa funzione raccoglie tutte le note midi proveniente dall'accordo
function acquireNote(note){
  currentAcquiredNotes.add(note);
  if(currentAcquiredNotes.size>3){
    var acquiredSetOfNotes = new Array();
    currentAcquiredNotes.forEach(function(n){acquiredSetOfNotes.push(findNote(n))});// faccio il modulo
    if(acquiredSetOfNotes.length > 3){ // devono essere 4 note diverse, se preme c3 e c4 è come se avesse premuto una nota.
      findrootNote();
      if(checkSeventhChord(acquiredSetOfNotes)){
        compareScale(acquiredSetOfNotes)}//devo fare ritornare qualcosa a compare scale??
      else{
      document.getElementById("md").innerHTML = "NOT VALID";
      console.log("Non hai suonato un accordo valido! Suona un'accordo di settima! Puoi suonare un MAJOR7th, un MINOR7th, un DOMINANT o un MINOR DIMINISHED7th");
      }
    }
  }
}


//prende la nota più bassa dell'accordo e la fa diventare ROOT
//LA rootNote HA VA DA 0 A 12
function findrootNote(){
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

  //setta la rootNote solo la prima volta
  lowest = findNote(lowest); //trova il modulo
  if(flagFirstChord==0){
    rootNote = lowest;
    document.querySelector('.root').innerHTML = rootChar[rootNote];
    console.log("LA ROOTNOTE è " + rootNote)}
  // trova il grado del nuovo accordo relativo a rootNote
  else {gradeOfOtherChords = lowest;}

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

//trasla tutte le note di scale partendo da root
function setTonality(scale,root){
    var newScale = new Set();
  /*  for( let i of scale ){
      console.log("Scala corrente: " + i )}*/
    for(let i of scale){
          i = i + root;
          if(i<0){newNote = i+12;}
          if (i>=12) {i= i-12}
          newScale.add(i);
          }
/*  for( let i of newScale ){
      console.log("Scala dopo set scale: " + i )}*/
   return newScale;
}

//dopo che aggiorno root in compareScale, trovo il vero valore del grado di gradeOfOtherChords da restituire a video
function findGradeRelativeToRoot(){
  let tmp;
  tmp = gradeOfOtherChords - rootNote;
  console.log("gradeOfOtherChords : " + gradeOfOtherChords);
  console.log("tmp : " + tmp);
  if(gradeOfOtherChords<rootNote){
     gradeOfOtherChords = tmp + 12;
    }
  gradeOfOtherChords = Math.ceil(tmp/2) + 1 ;
  console.log("gradeOfOtherChords effettivo rispetto alla ROOT : " + gradeOfOtherChords);
}

//alla fine avrò le scale compatibili su scaletoplay
//viene chiamata da setRec()per trovare la migliore scala per quella rec di note
function compareScale(acquiredSetOfNotesScale){

  var found = false;
  var modeScales = '1st CHORD'; // MI SERVE SOLO PER TENERE TRACCIA DEL MODO, POI è INUTILE
  var setScale = new Set();
  let root = 0;

  if(flagFirstChord == 0) root = rootNote;
  else {root = gradeOfOtherChords; findGradeRelativeToRoot();}


  for (const [mode, scale] of MAJORMODESCALE){
    if(found == false){
      var comNotes = new Set(acquiredSetOfNotesScale.filter(x => setScale .has(x)));
      //la scala più chiara sta sulla poszione 1, su 0 la più scura
      if(comNotes.size>3){

          if (mode == 'ION' || mode == 'LYD'){
            if(flagFirstChord==0){
              setTonality(MAJORMODESCALE.get("ION"), rootNote);
            }
             modeScales = 'ION';
            }
          else if(mode == 'DOR' || mode == 'AOL' ||  mode == 'PHR'){
            if(flagFirstChord==0){
              setTonality(MAJORMODESCALE.get("DOR"), rootNote);
            }
             modeScales = 'DOR';
            }
          else if (mode == 'MIX'){
            if(flagFirstChord==0){
              setTonality(MAJORMODESCALE.get("MIX"), rootNote);
            }
             modeScales = mode;
             }
          else if (mode == 'LOC'){
            if(flagFirstChord==0){
              setTonality(MAJORMODESCALE.get("LOC"), rootNote);
            }
             modeScales = mode;
           }

           found = true;
           console.log('Mode found ' +  modeScales)
         }
     }
   }

   if (flagFirstChord==0){
     // la scala su microbit viene settata qua solo per il primo accordo
      flagFirstChord=1;
      currentMode = modeScales;
      currentGrade = rootNote ;
      console.log("Hai suonato il modo  : " + modeScales );
    }
    else{
      currentMode = MODEINORDER.get(gradeOfOtherChords-1); //modo relativo alla rootNote
      console.log(" New current mode : " + currentMode + " on the grade " + gradeOfOtherChords);
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


//Funzione per il reset della rootNote
document.getElementById('tonalRef').onclick = resetTonRef;

function resetTonRef(e) {
  document.querySelector('.root').innerHTML = "♫♫";
    flagFirstChord = 0;
    gradeOfOtherChords=0;
    rootNote=0;
}


//<<<<<<<<<<< FINE CODICE CONRTOLLER >>>>>>>>>>>>>


//<<<<<<<<<<<  CODICE SYNTH >>>>>>>>>>>>>


var c = new AudioContext();

//All the oscillators active now
var activeOscillators = new Array();

var filterGain = 100;
var currentModFrequency;  // fa vibrare l'oscillatore, capire come si puo automatizzare la frazione
var currentOsc1Detune = 0;

var filterCutOff = 700;
var filterQ = 15;
var filterEnvelope= 56;

var envAttack = 2;
var envDecay = 15;
var envSustain = 70;
var envRelease= 10;

var filterEnvAtt = 5;
var filterEnvD = 6;
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
//var filterPicker = document.querySelector("select[name='filterType']");


//When playing a note
function noteOn( note, velocity ) {
	if (activeOscillators[note] == null) {
		 activeOscillators[note] = new playNote(note, velocity/127.0);}
  console.log("STO SUONANDO LA NOTA :" + note);
  var key = note-36;
  if( key == 0 || key == 2 || key == 4 || key == 5 || key == 7 || key == 9 || key == 11 || key == 12 || key == 14 || key == 16 || key == 17 || key == 19 || key == 21 || key == 23|| key == 25){
  allKeys.item(key).classList.add("whiteActive");}
  else{
  allKeys.item(key).classList.add("blackActive");}
	}

function noteOff( note ) {
	if (activeOscillators[note] != null) {
		// Shut off the note playing and clear it
		stopNote(note);
		activeOscillators[note] = null;
   var key = note-36;
   if( key == 0 || key == 2 || key == 4 || key == 5 || key == 7 || key == 9 || key == 11 || key == 12 || key == 14 || key == 16 || key == 17 || key == 19 || key == 21 || key == 23|| key == 25){
    allKeys.item(key).classList.remove("whiteActive")}
    else{ allKeys.item(key).classList.remove("blackActive")}}
}

function filterFrequencyFromCutoff( pitch, cutoff ) {
    var nyquist = 0.5 * c.sampleRate;
    var filterFrequency = Math.pow(2, (9 * cutoff) - 1) * pitch;
    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
	return filterFrequency;
}

//change MIDI in frequency
function frequencyFromNoteNumber( note ) {
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
   this.oscillator1.frequency.value = frequencyFromNoteNumber( note );

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
  currentModFrequency = this.oscillator1.frequency.value - 2*Math.pow(this.oscillator1.frequency.value, 1/12) // (this.oscillator1.frequency.value*29 / 30); //vibrato
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
	this.modFilterGain.connect( this.filter.detune );	// filter vibrato

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
				filterAttackEnd=0.05; // tweak to get target decay to work properly
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
  var initFilter = filterFrequencyFromCutoff( this.originalFrequency, filterCutOff/100 * (1.0-(filterEnvelope/100.0)) );
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



//set filters Q value
playNote.prototype.setFilterQ = function( value ) {
	this.filter.Q.value = value;
}
//document.querySelector("#qFactor").oninput = function(){
  //  filterQ = this.value;
function setQ(){
  if (pol == 1){
    filterQ = 8;
  }
  else filterQ = 20;
	  for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setFilterQ(filterQ);
      }
    }
 }

//volume del filtro
playNote.prototype.setFilterGain = function( value ) {
	this.modFilterGain.gain.value = value;
}
//document.querySelector("#filterGain").oninput = function(){
   //filterGain = this.value;
function changeFilterGain(){
   if (pol == 1){
    filterGain = 120;
   }
   else filterGain = 120 ;
	  for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setFilterGain( filterGain );
      }
    }
 }

//valore del cutoff
playNote.prototype.setFilterCutoff = function( value ) {
	this.filter.frequency.value = value;
}
//document.querySelector("#cutOffFilter").oninput = function(){
  //  filterCutOff = this.value ;
function changeFilterCutOff(){
  if (pol == 1){
    filterCutOff = 900;
  }
  else filterCutOff = 700;
    for (var i=0; i<255; i++) {
		if (activeOscillators[i] != null) {
			activeOscillators[i].setFilterCutoff(filterCutOff);
      }
    }
  }

//cambia il filtro in base al polso
function chooseFilterType(){
  if(pol ==2) return "highpass";
  return "lowpass";
  //return filterPicker.options[filterPicker.selectedIndex].value;
}

  //detune oscillator
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

//set modulator frequency
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
  compressor.threshold.setValueAtTime(-30, c.currentTime);
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

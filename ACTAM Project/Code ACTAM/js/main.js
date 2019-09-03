var pol = 2; //posizione del polso
var van = 0; //valore nota
var con; //contour melodico

//Ultima nota suonata: HA VALORI DA 0 A 20 per il momento
var currentNote;
//Le tre scale che si possono suoanre
var scaleToPlay = new Array(3);
//scala suonata da microbit
var currentScale;

//All the oscillators active now
var activeOscillators = new Array();

//modifica seconodo oscillatore
var num = 41;
var den = 60;

//Numero Preset
var numPreset = 1;

var acX = 0; //note
var acY = 0; // polso
var acZ = 0;

var mdc = new Array(3); // i sette modi preimpostati
var currentMode ; //modo attualmente suoanto da microbit

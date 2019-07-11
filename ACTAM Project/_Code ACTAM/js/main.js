var pol = 2; //posizione del polso
var van = 0; //valore nota
var con; //contour melodico

//Ultima nota suonata: HA VALORI DA 0 A 20 per il momento
var currentNote;
//Le tre scale che si possono suoanre
var scaleToPlay;
//grado dell'accordo suonato
var rootOfCurrentChord;
//scala suonata da microbit
var currentScale;
//accordo suonato dal piano
var currentChord;

//modifica seconodo oscillatore
var num = 41;
var den = 60;

//Numero Preset
var numPreset = 1;

var acX = 0; //note
var acY = 0; // polso
var acZ = 0;

var mdc; // i sette modi preimpostati
var mdcPIANO;// modo suonato dal piano
var currentMode ; //modo attualmente suoanto da microbit

var pol = 2; //posizione del polso
var van = 0; //valore nota
var con; //contour melodico

//Ultima nota suonata: HA VALORI DA 0 A 20 per il momento
var currentNote;

var acX = 0; //note
var acY = 0; // polso
var acZ = 0;
var mdc = new Array(4).fill(0);

//valori che vengono modificati in automatico
var envAttack;
var filterEnvAtt;
var envDecay;
var filterEnvD;
var envSustain;
var filterEnvSus;

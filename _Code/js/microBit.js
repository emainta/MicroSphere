//Variable
var microBit;
var ACCEL_SRV = 'e95d0753-251d-470a-a062-fa1922dfa9a8'
var ACCEL_DATA = 'e95dca4b-251d-470a-a062-fa1922dfa9a8'
var ACCEL_PERIOD = 'e95dfb24-251d-470a-a062-fa1922dfa9a8'
var BTN_SRV = 'e95d9882-251d-470a-a062-fa1922dfa9a8'
var BTN_A_STATE = 'e95dda90-251d-470a-a062-fa1922dfa9a8'
var BTN_B_STATE = 'e95dda91-251d-470a-a062-fa1922dfa9a8'
var IO_PIN_SRV = 'e95d127b-251d-470a-a062-fa1922dfa9a8'
var IO_PIN_DATA = 'e95d8d00-251d-470a-a062-fa1922dfa9a8'
var IO_AD_CONFIG = 'e95d5899-251d-470a-a062-fa1922dfa9a8'
var IO_PIN_CONFIG = 'e95db9fe-251d-470a-a062-fa1922dfa9a8'
var IO_PIN_PWM = 'e95dd822-251d-470a-a062-fa1922dfa9a8'

//var pol = 1; //posizione del polso
//var van = 0; //valore nota
//var con; //contour melodico
var ctr = 0; //un semplice counter
var SAF = 9;



class uBit {

  constructor() {
    this.accelerometer = {
      x: 0,
      y: 0,
      z: 0
    };

    this.buttonA = 0;
    this.buttonACallBack=function(){};

    this.buttonB = 0;
    this.buttonBCallBack=function(){};

    this.connected = false;

    this.onConnectCallback=function(){};
    this.onDisconnectCallback=function(){};

    this.onBLENotifyCallback=function(){};

    this.characteristic = {
      IO_PIN_DATA: {},
      IO_AD_CONFIG: {},
      IO_PIN_CONFIG: {},
      IO_PIN_PWM: {},
    }
  }

//SERIE DI FUNZIONI
  getAccelerometer() {
      return this.accelerometer;
  }

  getButtonA() {
    return this.buttonA;//QUI NO
  }

  setButtonACallback(callbackFunction){//QUI NO
    this.buttonACallBack=callbackFunction;
  }

  getButtonB() {
    return this.buttonB;
  }

  setButtonBCallback(callbackFunction){
    this.buttonBCallBack=callbackFunction;
  }

  onConnect(callbackFunction){
    this.onConnectCallback=callbackFunction;

  }

  onDisconnect(callbackFunction){
    this.onDisconnectCallback=callbackFunction;
  }

  onBleNotify(callbackFunction){
  this.onBLENotifyCallback=callbackFunction;
}


 onButtonA(){//QUI NO
    this.buttonACallBack();
 }

  onButtonB(){
    this.buttonBCallBack();
  }

  writePin(pin) {
    //qui dovrebbe funzionare ma bisogna fare qualcosa tipo
    //this.characteristic.IO_PIN_DATA.writeValue(data);
  }

  readPin(pin) {

  }


  characteristic_updated(event) {

    this.onBLENotifyCallback();

    if (event.target.uuid == BTN_A_STATE) {
      console.log("BTN_A_STATE"+ event.target.value.getInt8());
      this.buttonA = event.target.value.getInt8();
      if (this.buttonA){
        this.onButtonA();
      }
    }
   if (event.target.uuid == BTN_B_STATE) {
      console.log("BTN_B_STATE" + event.target.value.getInt8());
      this.buttonB = event.target.value.getInt8();
      if (this.buttonB){
        this.onButtonB();
      }
    }

    //ACCELEROMETER CHARACTERISTIC
    if (event.target.uuid == ACCEL_DATA) {
      this.accelerometer.x = event.target.value.getInt16(0, true);
      this.accelerometer.y = event.target.value.getInt16(2, true);
      this.accelerometer.z = event.target.value.getInt16(4, true);
    }
  }

  searchDevice() {
    filters: []
    var options = {};
    /*options.acceptAllDevices = true;
    options.optionalServices = [ACCEL_SRV];
    options.service = [BTN_SRV];
    options.service = [BTN_A_STATE];
    options.service= [BTN_B_STATE];*/
    options.acceptAllDevices = true;
    options.optionalServices = [ACCEL_SRV, IO_PIN_SRV];

    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));

    navigator.bluetooth.requestDevice(options)
    .then(device => {
      console.log('> Name:             ' + device.name);
      console.log('> Id:               ' + device.id);
      device.addEventListener('gattserverdisconnected', this.onDisconnectCallback);
      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();

    })
    .then(server => {
      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      this.onConnectCallback();
      console.log('Getting Services...');
      return server.getPrimaryServices();
    })
    .then(services => {
      console.log('Getting Characteristics...');
      let queue = Promise.resolve();
      services.forEach(service => {
        queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
          console.log('> Service: ' + service.uuid);
          characteristics.forEach(characteristic => {
            console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
              getSupportedProperties(characteristic));

              //devo storare tutte le caratteristiche che voglio scrivere per accederci dopo
              switch (characteristic.uuid) {
                case IO_PIN_DATA:
                  this.characteristic.IO_PIN_DATA = characteristic;
                  console.log(' dimmi che entri: ' + characteristic.IO_PIN_DATA )
                  break;

                case IO_AD_CONFIG:
                  this.characteristic.IO_AD_CONFIG = characteristic;
                  break;

                case IO_PIN_CONFIG:
                  this.characteristic.IO_PIN_CONFIG = characteristic;
                  break;

                case IO_PIN_PWM:
                  this.characteristic.IO_PIN_PWM = characteristic;
                  break;

                }

            if (getSupportedProperties(characteristic).includes('NOTIFY')) {
              characteristic.startNotifications().catch(err => console.log('startNotifications', err));
              characteristic.addEventListener('characteristicvaluechanged',
                this.characteristic_updated.bind(this));
            }
          });
        }));
      });
      return queue;
    }
  )
    .catch(error => {
      console.log('Argh! ' + error);
    });
  }

}

/* Utils */

function isWebBluetoothEnabled() {
  if (navigator.bluetooth) {
    return true;
  } else {
    ChromeSamples.setStatus('Web Bluetooth API is not available.\n' +
      'Please make sure the "Experimental Web Platform features" flag is enabled.');
    return false;
  }
}

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

microBit=new uBit();

microBit.onConnect(function(){
  console.log("connected");
  microBit.setButtonACallback(function(){
    console.log("buttonA pressed");
  });

  microBit.setButtonBCallback(function(){
    console.log("buttonB pressed");
  });
});

microBit.onDisconnect(function(){
  console.log("disconnected");
  //document.getElementById("connected").innerHTML="false";
});

function searchDevice(){
  microBit.searchDevice();
};


microBit.onBleNotify(function(){

  acX = microBit.getAccelerometer().x;
  acY = microBit.getAccelerometer().y;
  acZ = microBit.getAccelerometer().z;

  if( acZ<0 && acY<=1024 && acY>330 ){
     pol = 1;
     envAttack = 2;
     envDecay = 10;
     envSustain = 10;
     envRelease= 5;
     scaleToPlay[0]!=null ?
        currentScale = scaleToPlay[0] :changed = false}
//posizione 1 ho la scala più chiara
  if( acZ<0 && acY<=330 && acY>=-360){
     pol = 2;
     envAttack = 3;
     envDecay = 1;
     envSustain = 0;
     envRelease= 15;
     scaleToPlay[1]!=null ?
          currentScale = scaleToPlay[1]: changed = false}


  if( acZ<0 && acY<-360 && acY>=-1024){
     pol = 3;
    currentScale = new Set([0,0,0,0,0,0,0]);}

//c3 a E4
     if( acZ<0 && acX>=-1024 && acX<-931-SAF ){
         van = 0;
         con = van - ctr;
         ctr = van;}
    else if( acZ<0 && acX>=-931+SAF && acX<-846-SAF ){
         van = 1;
         con = van - ctr;
         ctr = van;}
    else if( acZ<0 && acX>=-846+SAF && acX<-761-SAF ){
         van = 2;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-761+SAF && acX<-676-SAF ){
         van = 3;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-676+SAF && acX<-591-SAF ){
         van = 4;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-591+SAF && acX<-506-SAF ){
         van = 5;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-506+SAF && acX<-421-SAF ){
         van = 6;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-421+SAF && acX<-336-SAF ){
         van = 7;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-336+SAF && acX<-251-SAF ){
         van = 8;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-251+SAF && acX<-166-SAF ){
         van = 9;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=-81+SAF && acX<4-SAF){
         van = 10;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=4+SAF && acX<89-SAF ){
         van = 11;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=89+SAF && acX<174-SAF ){
         van = 12;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=174+SAF && acX<259-SAF ){
         van = 13;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=259+SAF && acX<344-SAF){
         van = 14;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=344+SAF && acX<429-SAF ){
         van = 15;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=429+SAF && acX<514-SAF){
         van = 16;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=514+SAF && acX<599-SAF ){
         van = 17;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=599+SAF && acX<684-SAF ){
         van = 18;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=684+SAF && acX<769-SAF ){
         van = 19;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=769+SAF && acX<854-SAF ){
         van = 20;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=854+SAF && acX<939-SAF ){
         van = 21;
         con = van - ctr;
         ctr = van;}
     else if( acZ<0 && acX>=939+SAF && acX<1024-SAF ){
         van = 22;
         con = van - ctr;
         ctr = van;}

    van!=currentNote ? (noteOff(currentMidiNote), currentNote = van, playIfyouCan())
                     :changed = false;
  //  changeFilterGain();
    changeFilterCutOff();
  //  setQ();
  //  chooseFilterType();
    valueRev= 50/1024*acY;
    changeValue(valueRev);
})

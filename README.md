# MICROSPHERE
> MICROSPHERE is a Bluetooth synth toy, designed to familiarize with diatonic harmony.

##### ADVANCED CODING TOOLS AND METHODOLOGIES PROJECT
*A.A. 2018-2019*
- Brundo Nicoletta
- Gino Jacopo
- Intagliata Emanuele


### Index
1.	Concept
2.	How to use MICROSPHERE
3.	How MICROSPHERE works

![Screen Img](https://raw.githubusercontent.com/emainta/MicroSphere/master/Other%20Stuff/Pictures%20readme/screen_app.png)

## Concept
A fundamental need for a musician is in fact to learn how to express himself and how to transmit to an audience what he’s feeling. Emotions related to scales and how notes sound “one after another” is a key skill to achieve. MICROSPHERE is a toy that works on this aspect.
Microsphere playable scales are the **C dorian**, **C pentatonic major** and the **C pentatonic minor**. This choice follows from the fun and the “ready-to-use” expressivity of those two simple scales. Due to their huge popularity in pop music their sound is easy recognizable also by non-musician.


##### VIDEO: Demo & Tutorial [Ita]
[![Click to watch the DEMO](https://i.ytimg.com/vi/4pv89lmkq-o/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLB9voE0U2mEKiQ99f76RcLtM1u6vg)](https://youtu.be/4pv89lmkq-o)
Click to watch the DEMO.

## How to use MICROSPHERE

Inside the sphere there is a box to keep in the correct position the microprocessor. Micro:bit has to be put inside it.
The file [index.html](MicroSphere/ACTAM_Project/Code_ACTAM/index.html) must be opened with **Google Chrome** browser. Google’s browser is the only one supporting experimental browser features, needed for BLE connection. Clicking on the `Full screen` button will open the interface completely. *Micro:bit* has to be powered up. Clicking on `Search device` button will open a window for the manual search of the microprocessor, no pairing required. Clicking on the `Start Canvas` button will start the visualization of the melodic contour. At this point the setup is ready.

### The SPHERE

The usable range of the instrument is the upper part of an hemisphere. The sphere has to be used following the verso of the *golden arrow* drawn on it. There is no other indication for the comfortable use of the instrument. Typically is used having the arrow towards the torso to follow the normal keyboard displacement of pitches: having the low ones on the left and the high ones on the right. Tilting the sphere forward and backward will change the playable scale, the central one is the C pentatonic major. The other two are the C pentatonic minor and the C dorian. The changes can be followed on the interface in the `Scales` box. Tilting the sphere left and right will change the pitch of the notes, following the selected scales. The playing notes can be followed on the keyboard on the bottom left of the interface. Once the connection is established the first sounds of the instrument are by default from the first preset (“1” button). Sounds can be changed via presets with the 1, 2, 3 and 4 buttons and modified manually via the synthesizer parameter panel.

![Sphere1](https://raw.githubusercontent.com/emainta/MicroSphere/master/Other%20Stuff/Pictures%20readme/sphere1.jpg)

![Internal](https://raw.githubusercontent.com/emainta/MicroSphere/master/Other%20Stuff/Pictures%20readme/internal_sphere.jpg)

### Interface   
The interface was entirely developed in HTML, CSS and JS.
It can be divided in two main parts:
- The top part, where we have a wide screen where the melodic contour is visualized;
- The bottom part with all the controls


The melodic contour is visualized as a glowing *sphere* traveling in the outer space. The sphere's dimension varies according to the wrist position. The sphere's position depends on note’s keyboard position. Higher notes will have higher positions on the screen. Sphere color depends on selected scale and on the selected preset.
The bottom part we have all the controls for the app. On the bottom-left part we have the general controls; in particular we have the visualization controls.
From the left we have:
-	`Search device` button: BLE connection routine begins;
-	`Fullscreen` button: visualization page goes full screen;
-	`Start Canvas` button: melodic contour visualization begins. You can start the visualization also by clicking on the wide screen.
-	`Reset Canvas` button: resets melodic contour visualization and tonal reference.


Next we have a box `Scales` that shows the scaled that is played, based on the wrist position. Then we have a box for the preset sounds of the synth. To choose one of the preset sounds you can click on one of the four buttons.
Below there is a two octaves keyboard which displays which notes are played.
On the bottom-right part we have the control panel of the synthesizer.

## How MICROSPHERE works

### Environment

Languages used for coding are: **javascript**, **css** and **html**.
**Google Chrome** is needed to launch the program. Google’s browser is in fact the only one supporting experimental browser features, needed for BLE connection. Firmware in *Micro:bit* was produced by **bittysoftware**.

Reference to the [bittysoftware](https://drive.google.com/uc?id=0B2Ud_NaMFsQSdm1BMVMtN3F4a3c&export=download) page.

### BLE Connection Routine
The code for the routine is an adapted version of the Bluetooth Low Energy connection routine with no pairing required from this code. Based on client (PC)/ server (MB) model the PC asks for Micro:bit’s services data. A BLE antenna is already implemented in Micro:bit. The firmware activates the needed antenna services at the switch on of the microprocessor. The code triggers through the `search device` button the search for available BLE devices with a window.

### Code division - Code Main Schema
> [main.js](ACTAM_Project/Code_ACTAM/js/main.js )

Global values are initialized. Micro:bit’s services are initialized in [microBit.js](ACTAM_Project/Code_ACTAM/js/microbit.js ).

>[microBit.js](ACTAM_Project/Code_ACTAM/js/microbit.js )

The code for the Bluetooth Low Energy connection routine is an adapted version of the BLE connection routine/no pairing required from this code. Based on client (PC)/ server (MB) model the PC asks for Micro:bit’s services data. A BLE antenna is already implemented in Micro:bit. The firmware activates the needed antenna services at the switch on of the microprocessor. The code triggers through the “search device” button the manual search for available BLE devices with a window.

Accelerometer values are mapped via a chain of if on the 3 Micro:bit’s axis creating an upside hemisphere range for a convenient use of the application. The z axis is perpendicular to the microprocessor. It is negative in the same verso of the gravity vector. The x axis describes the left-right tilting. The y axis describes the forward-backward tilting. The z axis has only two values: if zero or negative the application will not work, creating the lower boundary in corrispondence to the maximum circumference of the hemisphere. If it is positive other axis are evaluated. The y axis is used to change the sound of the synthetiser and the usable scale. The x axis is used to play the notes of the selected scale.


Sound presets are initialized here to be used in [synth.js](ACTAM_Project/Code_ACTAM/js/synth.js ) .

>[synth.js](ACTAM_Project/Code_ACTAM/js/synth.js )

Creates the audio context and the synthetiser parameters as in the synthesiser paragraph. It defines the scales and checks Micro:bit’s accelerometer position for the synth to play the correct notes. The code creates the oscillators for the synth and the block scheme to implement it virtually. The order of the called functions starts from `playIfYouCan` function. The code creates the sound presets for the synth and give the possibility to modify them via interface defined in [index.html](MicroSphere/ACTAM_Project/Code_ACTAM/index.html).

>[script.js](ACTAM_Project/Code_ACTAM/js/script.js ) |
>[vis.js](ACTAM_Project/Code_ACTAM/js/vis.js )

Interface behaves related to and modifying the synthetiser and scales as in Interface paragraph. The same paragraph describes [index.html](MicroSphere/ACTAM_Project/Code_ACTAM/index.html)  too.

### WAPI Synthesizer

The synthesizer is based on FM synthesis. It is composed of a *principal core* where the sound is originated and a group of effects connected to it. The effects parameters can be modified via the interface.      
The core is composed of:  
- an oscillator that reproduces the frequency of the selected note;
- a second oscillator, connected to the first one, with a modulating task, its equation is `fMod = fOsc-fOsc*41/60` (numerator and denominator are chosen freely according to personal taste);
- a filter;
- a gain to control the whole envelope.

Every oscillator has its own gain to control its volume and to connect the first oscillator to the filter and the modulator to the first oscillator frequency. It is possible to choose the waveform for every oscillator from: sine, triangle, square, sawtooth waveforms.

The filter parameters are the q-value and its frequency. Its nature can be chosen from: highpass. Lowpass, notch. The modulator is connected to the filter via another gain which value its 24 times the one from the filter gain. It controls the filter detune to create a vibrato effect. The core closes with a gain called “envelope” (connected to the filter) that creates different sounds varying the attack, decay, sustain and release time of the filter and of the two oscillators. The sound generated by this first core is connected to a chain of effects through the “effect chain” gain which connects the “envelope” gain successively to: a distortion , a delay, a reverberator, a compressor, the final master.

It is possible to choose the distortion intensity on the synth and to choose the “oversampling” mode to add further distortion to the sound. It possible to choose the delay time and its intensity through the delay gain and to create an “ambient” effect through the reverberator composed of two gains: “dry” and “wet”. Through the compressor it is possible to control the “knee”, “attack”, “release” and “ratio” parameters of the output sound.


### Melodic Contour Visualization

The interface behavior is controlled by the two JS files [script.js](ACTAM_Project/Code_ACTAM/js/script.js ) and [vis.js](ACTAM_Project/Code_ACTAM/js/vis.js ).

In [script.js](ACTAM_Project/Code_ACTAM/js/script.js) variables useful for the visualization are defined. They are present also the functions `openFullscreen` and `closeFullscreen` that manages the full screen feature.

In [vis.js](ACTAM_Project/Code_ACTAM/js/vis.js ) is managed the melodic contour visualization.
The widescreen is composed by the superposition of *four* 2D Canvas:
1. The first Canvas is a **background Canvas**. It consists in a *space environment* surrounded by stars. The `draw` function is in charge of drawing the actual background. It consists in a sliding and looping [image](MicroSphere/ACTAM_Project/Code_ACTAM/img/stars.png).

2. The second canvas is in charge of drawing the **glowing sphere**.
The sphere's dimension varies according to the wrist position, which is given by the global variable `pol`. The sphere's position depends on note’s keyboard position, which is given by the global variable `van`. Its position follows the chromatic scale, even if certain notes are not played by the synthesizer. Higher notes will have higher positions on the screen. Sphere's color depends on selected scale and on the selected preset.
Colors are given in the *hsl* representation. While *saturation* and *lightness* are fixed, *hue* is the value that changes according to the wrist position. The hue values are stored in the array `myHue`.

3. The third canvas is in charge of drawing the **melodic contour**. The aesthetic behavior is similar to the previous canvas.
The trail is drawn like a series of closely spaced little spheres. Their positions, their color and their radius are stored in three sliding arrays: `positions_y`, `positions_col`, `positions_rad`. The function `storeLastPosition` is in charge of *pushing in* the last position/color/radius at the beginning of the arrays using the method `unshift`. In the same function we use the method `pop` to get the last item at the end of the arrays.

4. The last canvas is a service canvas. It is in charge of showing the initial text *Click here to start the visualization*.

In [vis.js](ACTAM_Project/Code_ACTAM/js/vis.js ) are also managed the animations of all of the canvas, like *fading in* and *fading out*.

###### The "Resize Canvas" function
It turns out that changing the *Pixel Ratio* will make the canvas *blurry* in some devices.
In [vis.js](ACTAM_Project/Code_ACTAM/js/vis.js ) is present a section where we make the all the canvas responsive, forcing the **1:1** pixel ratio.
This section is a modified version of [this code](https://stackoverflow.com/questions/42588501/how-do-i-fix-blurry-shape-edges-in-html5-canvas).

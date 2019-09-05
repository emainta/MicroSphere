# MICROSPHERE
> MICROSPHERE is a Bluetooth synth toy, designed to familiarize with diatonic harmony.

#### Index
1.	Concept
2.	How to use MICROSPHERE
3.	How MICROSPHERE works

[IMMAGINE]

## Concept
A fundamental need for a musician is to learn how to express himself and how to transmit to an audience what he’s feeling. There are several key skills to achieve and MICROSPHERE works on one of them:

<p align="center" style="font-weigth:bold;">
GET USED TO HOW SCALES (AND NOTES) SOUND ON DIFFERENT CHORDS.
</p>

Microsphere playable scales are the **C dorian**, **C pentatonic major** and the **C pentatonic minor**. This choice follows from the fun and the “ready-to-use” expressivity of those two simple scales. Due to their huge popularity in pop music their sound is easy recognizable also by non-musician.
A fundamental need for a musician is in fact to learn how to express himself and how to transmit to an audience what he’s feeling. Emotions related to scales and how notes sound “one after another” is a key skill to achieve. MICROSPHERE is a toy that works on this aspect.

<iframe width="560" height="315"
src="https://youtu.be/ZzDKcSeILFQ"
frameborder="0"
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

## How to use MICROSPHERE

The file [index.html](/ACTAM Project/Code ACTAM/index.html) must be opened with **Google Chrome** browser. Google’s browser is the only one supporting experimental browser features, needed for BLE connection. Clicking on the `Full screen` button will open the interface completely. *Micro:bit* has to be powered up. Clicking on `Search device` button will open a window for the manual search of the microprocessor, no pairing required. Clicking on the `Start Canvas` button will start the visualization of the melodic contour. At this point the setup is ready.

### The SPHERE
The usable range of the instrument is the upper part of an hemisphere. The sphere has to be used following the verso of the *golden arrow* drawn on it. There is no other indication for the comfortable use of the instrument. Typically is used having the arrow towards the torso to follow the normal keyboard displacement of pitches: having the low ones on the left and the high ones on the right. Tilting the sphere forward and backward will change the playable scale, the central one is the C pentatonic major. The other two are the C pentatonic minor and the C dorian. The changes can be followed on the interface in the `Scales` box. Tilting the sphere left and right will change the pitch of the notes, following the selected scales. The playing notes can be followed on the keyboard on the bottom left of the interface. Once the connection is established the first sounds of the instrument are by default from the first preset (“1” button). Sounds can be changed via presets with the 1, 2, 3 and 4 buttons and modified manually via the synthesizer parameter panel.


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
The code for the routine is an adapted version of the Bluetooth Low Energy connection routine with no pairing required from this code. Based on client (PC)/ server (MB) model the PC asks for Micro:bit’s services data. A BLE antenna is already implemented in Micro:bit. The firmware activates the needed antenna services at the switch on of the microprocessor. The code triggers through the “search device” button the search for available BLE devices with a window.

### Code division - Code Main Schema
1.[main.js](ACTAM Project/Code ACTAM/js/main.js )
Global values are initialized. Micro:bit’s services are initialized in [microBit.js].
II.	[microBit.js]                                                                                                                                                            The code for the Bluetooth Low Energy connection routine is an adapted version of the BLE connection routine/no pairing required from this code. Based on client (PC)/ server (MB) model the PC asks for Micro:bit’s services data. A BLE antenna is already implemented in Micro:bit. The firmware activates the needed antenna services at the switch on of the microprocessor. The code triggers through the “search device” button the manual search for available BLE devices with a window.
III.	[microBit.js]                                                                                                                                                Accelerometer values are mapped via a chain of if on the 3 Micro:bit’s axis creating an upside hemisphere range for a convenient use of the application. The z axis is perpendicular to the microprocessor. It is negative in the same verso of the gravity vector. The x axis describes the left-right tilting. The y axis describes the forward-backward tilting. The z axis has only two values: if zero or negative the application will not work, creating the lower boundary in corrispondence to the maximum circumference of the hemisphere. If it is positive other axis are evaluated. The y axis is used to change the sound of the synthetiser and the usable scale. The x axis is used to play the notes of the selected scale.
IV.	[microBit.js]                                                                                                                                                     Sound presets are initialized here to be used in [synth.js].
V.	[synth.js]                                                                                                                                                       Creates the audio context and the synthetiser parameters as in the synthetiser paragraph. It defines the scales and checks Micro:bit’s accelerometer position for the synth to play the correct notes. The code creates the oscillators for the synth and the block scheme to implement it virtually. The order of the called functions starts from playIfYouCan function. The code creates the sound presets for the synth and give the possibility to modify them via interface defined in [index.html].
VI.	[script.js][vis.js]                                                                                                                                              Interface behaves related to and modifying the synthetiser and scales as in Interface paragraph. The same paragraph describes [index.html] too.


### WAPI Synthesizer
[Nico]

### Melodic Contour Visualization
Come funziona la visualizzazione, fullscreen
Come funziona il widescreen
Resize canvas
animazioni

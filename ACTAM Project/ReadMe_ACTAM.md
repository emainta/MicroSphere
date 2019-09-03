# MICROSPHERE
> MICROSPHERE is a Bluetooth synth toy, designed to familiarize with diatonic harmony.

### Index
1.	Concept
2.	How to use MICROSPHERE
3.	How MICROSPHERE works

## Concept
A fundamental need for a musician is to learn how to express himself and how to transmit to an audience what he’s feeling. There are several key skills to achieve and MICROSPHERE works on one of them:

:---:
: **GET USED TO HOW SCALES (AND NOTES) SOUND ON DIFFERENT CHORDS.** :

Microsphere playable scales are the **C dorian** and the **C pentatonic minor**. This choice follows from the fun and the “ready-to-use” expressivity of those two simple scales. Due to their huge popularity in pop music their sound is easy recognizable also by non-musician. 
A fundamental need for a musician is in fact to learn how to express himself and how to transmit to an audience what he’s feeling. Emotions related to scales and how notes sound “one after another” is a key skill to achieve. MICROSPHERE is a toy that works on this aspect.

## How to use MICROSPHERE

[Jacopo]

### Interface   
The page can be divided in two parts. In the top part we have a wide screen where the melodic contour is visualized. 
The melodic contour is visualized as a glowing sphere traveling in the outer space. The sphere dimension varies according to the wrist position. The sphere position depends on note’s keyboard position. Higher notes will have higher positions on the screen. Sphere color depends on selected scale and on the selected preset.
The bottom part we have all the controls for the app. On the bottom-left part we have the general controls; in particular we have the visualization controls.
From the left we have:
•	the MIDI IN led: LED is ON if MIDI notes are received from keyboard;
•	«Search device» button: BLE connection routine begins;
•	«Fullscreen» button: visualization page goes full screen;
•	«Start» button: melodic contour visualization begins. You can start the visualization also by clicking on the wide screen.
•	«Reset» button: resets melodic contour visualization and tonal reference.
Next we have a box that shows the scaled that is played, based on the wrist position. Then we have a box for the preset sounds of the synth. To choose one of the preset sounds you can click on one of the four buttons. 
Below there is a two octaves keyboard which displays which notes are played.
On the bottom-right part we have the control panel of the synthesizer.

##How MICROSPHERE works

###Environment

Languages used for coding are: **javascript**, **css** and **html**. 
**Google Chrome** is needed to launch the program. Google’s browser is in fact the only one supporting experimental browser features, needed for BLE connection. Firmware in *Micro:bit* was produced by **bittysoftware**.

Reference to the [bittysoftware](https://drive.google.com/uc?id=0B2Ud_NaMFsQSdm1BMVMtN3F4a3c&export=download) page.

### BLE Connection Routine
The code for the routine is an adapted version of the Bluetooth Low Energy connection routine with no pairing required from this code. Based on client (PC)/ server (MB) model the PC asks for Micro:bit’s services data. A BLE antenna is already implemented in Micro:bit. The firmware activates the needed antenna services at the switch on of the microprocessor. The code triggers through the “search device” button the search for available BLE devices with a window.

###Code division
[da sistemare]
1.	BLE connection routine;
2.	Accelerometer values are mapped on the 3 Micro:bit’s axis. (z>0 is needed for the application to work)
3.	Scales are associated to Micro:bit’s accelerometer values;
4.	Mapped accelerometer values trigger WAPI synthesizer;
5.	Interface behaves related to and modifying the synthesizer and scales (as in the Interface paragraph) 

###WAPI Synthesizer
[Nico]

###Melodic Contour Visualization
Come funziona la visualizzazione, fullscreen
Come funziona il widescreen
Resize canvas
animazioni

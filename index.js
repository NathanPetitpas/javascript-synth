//Next Steps:
// Style Inputs

//-----------------Establish Variables and Arrays-------------------------------

// Establish Div and Key Arrays
var keyDivs = document.getElementsByClassName("piano-key");
var keyDivsText = [];
const keys = ["Q", "2", "W", "3", "E", "R", "5", "T", "6", "Y", "7", "U", "I", "9", "O", "0", "P"];

// Establish Audio Context Oscillators Array
const audioContext = new AudioContext();
var fundamentalOscillators = [];
var ot1Oscillators = [];
var ot2Oscillators = [];
var ot3Oscillators = [];

// Fill keyDivsText array with inner text from keyDivs
for (let i=0; i<keyDivs.length; i++) {
    keyDivsText.push(keyDivs[i].innerText);
};

//----------------------Synth Settings-----------------------------------

//  oscillators(wave type) -> mastergain(gainSlider) -> compressor -> destination


// Establish Compressor
var compressor = new DynamicsCompressorNode(audioContext);

//Establish Gain Nodes
const fundgainSlider = document.querySelector("#gain-slider");
const fundgainText = document.querySelector("#gain-text");
var fundgainSetting = 0.5;
const fundgainNode = audioContext.createGain();
fundgainNode.gain.setValueAtTime(fundgainSetting, audioContext.currentTime);

const ot1gainSlider = document.querySelector("#ot1-gain-slider");
const ot1gainText = document.querySelector("#ot1-gain-text");
var ot1gainSetting = 0.5;
const ot1gainNode = audioContext.createGain();
ot1gainNode.gain.setValueAtTime(ot1gainSetting, audioContext.currentTime);

const ot2gainSlider = document.querySelector("#ot2-gain-slider");
const ot2gainText = document.querySelector("#ot2-gain-text");
var ot2gainSetting = 0.5;
const ot2gainNode = audioContext.createGain();
ot2gainNode.gain.setValueAtTime(ot2gainSetting, audioContext.currentTime);

const ot3gainSlider = document.querySelector("#ot3-gain-slider");
const ot3gainText = document.querySelector("#ot3-gain-text");
var ot3gainSetting = 0.5;
const ot3gainNode = audioContext.createGain();
ot3gainNode.gain.setValueAtTime(ot3gainSetting, audioContext.currentTime);

const mastergainSlider = document.querySelector("#master-gain-slider");
const mastergainText = document.querySelector("#master-gain-text");
var mastergainSetting = 0.5;
const mastergainNode = audioContext.createGain();
mastergainNode.gain.setValueAtTime(mastergainSetting, audioContext.currentTime);


// Frequency and Wave Type
var baseFrequency = 256; // Sets bottom note to C
var fundamentalType = "sine";
var ot1Type = "sine";
var ot2Type = "sine";
var ot3Type = "sine";
var waveSelection = document.getElementsByName("wave-type");
var ot1Selection = document.getElementsByName("ot1-type");
var ot2Selection = document.getElementsByName("ot2-type");
var ot3Selection = document.getElementsByName("ot3-type");


//Octave Keys
var octave = 0;
var octaveText = document.getElementsByClassName("octave-text")[1];
const octaveDown = document.getElementsByClassName("octave-down")[0];
const octaveUp = document.getElementsByClassName("octave-up")[0];

function setBaseFrequency() {
    baseFrequency = 256 * Math.pow(2, octave);
    for (let i=0; i<fundamentalOscillators.length; i++) {
        fundamentalOscillators[i].frequency.value = baseFrequency;
        ot1Oscillators[i].frequency.value = baseFrequency*1.5;
        ot2Oscillators[i].frequency.value = baseFrequency*2;
        ot3Oscillators[i].frequency.value = baseFrequency*2.5;
    }
};

octaveDown.addEventListener("click", function(){
    if (octave > -2) {
        octave--;
        octaveText.innerText = octave;
        setBaseFrequency();
    }
});

octaveUp.addEventListener("click", function(){
    if (octave < 2) {
        octave++;
        octaveText.innerText = octave;
        setBaseFrequency();
    }
});


// Connect Elements
fundgainNode.connect(mastergainNode);
ot1gainNode.connect(mastergainNode);
ot2gainNode.connect(mastergainNode);
ot3gainNode.connect(mastergainNode);
mastergainNode.connect(compressor).connect(audioContext.destination);


//---------------------Toggle Settings---------------------------------------

const settingsToggle = document.getElementById("settings-toggle");
const settingsControlPanel = document.getElementById("settings-controls-panel");
const infoToggle = document.getElementById("info-toggle");
const infoControlPanel = document.getElementById("info-box");

const toggles = [settingsToggle, infoToggle];
const hiddenPanels = [settingsControlPanel, infoControlPanel];

for (let i=0; i<toggles.length; i++){
    toggles[i].addEventListener("click", function() {
        if (hiddenPanels[i].classList.contains("grid-container")) {
            hiddenPanels[i].classList.add("hidden");
            hiddenPanels[i].classList.remove("grid-container");
            toggles[i].innerText = "Show +";
        } else if (hiddenPanels[i].classList.contains("hidden")) {
            hiddenPanels[i].classList.add("grid-container");
            hiddenPanels[i].classList.remove("hidden");
            toggles[i].innerText = "Hide -";
        };
    });
};



//-----------------Create Necessary Oscillators-------------------------------

// Make one oscillator
function createSingleOscillator(i, r) { //i = position to insert oscillator, r = how many elements to delete to insert oscillator
    var detune = 100 * i;
    fundamentalOscillators.splice(i, r, (this["fundamental"+i] = audioContext.createOscillator()));
    fundamentalOscillators[i].frequency.value = baseFrequency;
    fundamentalOscillators[i].detune.value = detune;
    fundamentalOscillators[i].type = fundamentalType;
    fundamentalOscillators[i].playing = false; // Creates .playing attribute and sets it to false.
    fundamentalOscillators[i].connect(fundgainNode);

    ot1Oscillators.splice(i, r, (this["ot1"+i] = audioContext.createOscillator()));
    ot1Oscillators[i].frequency.value = baseFrequency*1.5;
    ot1Oscillators[i].detune.value = detune;
    ot1Oscillators[i].type = ot1Type;
    ot1Oscillators[i].playing = false; // Creates .playing attribute and sets it to false.
    ot1Oscillators[i].connect(ot1gainNode);

    ot2Oscillators.splice(i, r, (this["ot2"+i] = audioContext.createOscillator()));
    ot2Oscillators[i].frequency.value = baseFrequency*2;
    ot2Oscillators[i].detune.value = detune;
    ot2Oscillators[i].type = ot2Type;
    ot2Oscillators[i].playing = false; // Creates .playing attribute and sets it to false.
    ot2Oscillators[i].connect(ot2gainNode);

    ot3Oscillators.splice(i, r, (this["ot3"+i] = audioContext.createOscillator()));
    ot3Oscillators[i].frequency.value = baseFrequency*2.5;
    ot3Oscillators[i].detune.value = detune;
    ot3Oscillators[i].type = ot3Type;
    ot3Oscillators[i].playing = false; // Creates .playing attribute and sets it to false.
    ot3Oscillators[i].connect(ot3gainNode);
}

// Use above function to automate making oscillators for each key
function createOscillators() {
    for (let i=0; i<keys.length; i++) {
        createSingleOscillator(i, 0);
    }
};

createOscillators();

//---------------------Adjust Synth Settings----------------------------------


// Gain Sliders and Settings
fundgainSlider.addEventListener("input", function(){
    fundgainSetting = Math.floor(fundgainSlider.value * 100)/100;
    fundgainText.innerText = (Math.floor(fundgainSlider.value * 100)) + "%";
    fundgainNode.gain.setValueAtTime(fundgainSetting, audioContext.currentTime);
});

ot1gainSlider.addEventListener("input", function(){
    ot1gainSetting = Math.floor(ot1gainSlider.value * 100)/100;
    ot1gainText.innerText = (Math.floor(ot1gainSlider.value * 100)) + "%";
    ot1gainNode.gain.setValueAtTime(ot1gainSetting, audioContext.currentTime);
});

ot2gainSlider.addEventListener("input", function(){
    ot2gainSetting = Math.floor(ot2gainSlider.value * 100)/100;
    ot2gainText.innerText = (Math.floor(ot2gainSlider.value * 100)) + "%";
    ot2gainNode.gain.setValueAtTime(ot2gainSetting, audioContext.currentTime);
});

ot3gainSlider.addEventListener("input", function(){
    ot3gainSetting = Math.floor(ot3gainSlider.value * 100)/100;
    ot3gainText.innerText = (Math.floor(ot3gainSlider.value * 100)) + "%";
    ot3gainNode.gain.setValueAtTime(ot3gainSetting, audioContext.currentTime);
});

mastergainSlider.addEventListener("input", function(){
    mastergainSetting = Math.floor(mastergainSlider.value * 100)/100;
    mastergainText.innerText = (Math.floor(mastergainSlider.value * 100)) + "%";
    mastergainNode.gain.setValueAtTime(mastergainSetting, audioContext.currentTime);
});



// Detect wave selection for each oscillator:

function detectWaveSelection(oscillator) { //oscillator attribute refers to the waveSelector/ot1Selector/etc.
    for (let i=0; i<oscillator.length; i++) {
        if (oscillator[i].checked == true) {
            return(oscillator[i].value);
        }
    }
};

//Wave selection input event listeners

for (let i=0; i<waveSelection.length; i++) { 
    waveSelection[i].onclick = function() {
        fundamentalType = detectWaveSelection(waveSelection);
        for (let i=0; i<fundamentalOscillators.length; i++) {
            fundamentalOscillators[i].type = fundamentalType;
    }
}};

for (let i=0; i<ot1Selection.length; i++) { 
    ot1Selection[i].onclick = function() {
        ot1Type = detectWaveSelection(ot1Selection);
        for (let i=0; i<ot1Oscillators.length; i++) {
            ot1Oscillators[i].type = ot1Type;
    }
}};

for (let i=0; i<ot2Selection.length; i++) { 
    ot2Selection[i].onclick = function() {
        ot2Type = detectWaveSelection(ot2Selection);
        for (let i=0; i<ot2Oscillators.length; i++) {
            ot2Oscillators[i].type = ot2Type;
    }
}};

for (let i=0; i<ot3Selection.length; i++) { 
    ot3Selection[i].onclick = function() {
        ot3Type = detectWaveSelection(ot3Selection);
        for (let i=0; i<ot3Oscillators.length; i++) {
            ot3Oscillators[i].type = ot3Type;
    }
}};



//-------------------- Play Notes and Activate Keys----------------------------

// Play Notes

// oscillator.context.state==running
function playNote(note) {
    if (fundamentalOscillators[note].playing == false){ // Checks if oscillator is already playing, if not it starts it.
        fundamentalOscillators[note].start();
        ot1Oscillators[note].start();
        ot2Oscillators[note].start();
        ot3Oscillators[note].start();
        fundamentalOscillators[note].playing = true; // Sets .playing attribute to true to prevent attempts to start it again.
    };
};

// Stop Notes and re-create oscillator for next play
function stopNote(note) {
    fundamentalOscillators[note].stop();
    ot1Oscillators[note].stop();
    ot2Oscillators[note].stop();
    ot3Oscillators[note].stop();
    createSingleOscillator(note, 1);
};


// Set and remove active key classes for key color changes
function setActive(key) {
    if (key.classList.contains("active") == false) {
        key.classList.add("active");
        };
};

function removeActive(key) {
    if (key.classList.contains("active") == true) {
        key.classList.remove("active");
        };
};



//--------------Event Listeners----------------------------

// Mouse
for (let i=0; i<keys.length; i++) {
    keyDivs[i].addEventListener("mousedown", function() {
        var keyNumber = keys.indexOf(this.innerText);
        playNote(keyNumber);
        setActive(this);
    });
};

for (let i=0; i<keys.length; i++) {
    keyDivs[i].addEventListener("mouseup", function(){
        var keyNumber = keys.indexOf(this.innerText);
        stopNote(keyNumber);
        removeActive(this);
    });
};


// Keyboard
window.addEventListener("keydown", function(e) {
    var keyNumber = keys.indexOf(e.key.toUpperCase());
    if (keyNumber >= 0 && keyNumber <= keys.length) {
        playNote(keyNumber);
        var pressedKeyNumber = keyDivsText.indexOf(e.key.toUpperCase());
        setActive(keyDivs[pressedKeyNumber]);
    };
});

window.addEventListener("keyup", function(e) {
    var keyNumber = keys.indexOf(e.key.toUpperCase());
    if (keyNumber >= 0 && keyNumber <= keys.length) {
        stopNote(keyNumber);
        var pressedKeyNumber = keyDivsText.indexOf(e.key.toUpperCase());
        removeActive(keyDivs[pressedKeyNumber]);
    };
});

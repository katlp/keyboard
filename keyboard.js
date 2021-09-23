document.addEventListener("DOMContentLoaded", function(event) {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    var noteCount = 1;

    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    activeOscillators = {}
    gainNode = {}

    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        playNote(key);
        noteCount++;
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            
            gainNode[key].gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
            

            activeOscillators[key].stop(audioCtx.currentTime + .1); //offset time to give itme to ramp down
            delete activeOscillators[key];
            delete gainNode[key];
        }
    }

    var wave = 'sawtooth';
    const sine = document.getElementById("sine");
    const sawtooth = document.getElementById("sawtooth");

    sine.addEventListener('click', function (){
        wave = 'sine';
        console.log(wave);
    })

    sawtooth.addEventListener('click', function(){
        wave = 'sawtooth';
        console.log(wave);
    })


    function playNote(key) {
        //create oscilator
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
        osc.type = wave; //choose your favorite waveform

        //create gain
        const soundGain = audioCtx.createGain();       
        soundGain.gain.setValueAtTime(0, audioCtx.currentTime);
        soundGain.connect(audioCtx.destination);

        //connect oscilator to gain
        osc.connect(soundGain);
        gainNode[key] = soundGain;

        osc.start();
        activeOscillators[key] = osc
        
        //ramp up value
        soundGain.gain.setTargetAtTime((0.7/noteCount), audioCtx.currentTime, 0.01);
        soundGain.gain.setTargetAtTime((0.4/noteCount), audioCtx.currentTime + 0.1, 0.01);
    
    }

    const minor = document.getElementById("blue");
    const major = document.getElementById("yellow");
    const diminished = document.getElementById("gray");
    const augmented = document.getElementById("purple");
    const dominant = document.getElementById("pink");

    minor.addEventListener('click', function (){
        noteCount = 4;
        playNote('90');
        playNote('68');
        playNote('66');
        playNote('74');
        quietChords('90');
        quietChords('68');
        quietChords('66');
        quietChords('74');
        noteCount = 1;
    })

    major.addEventListener('click', function(){
        noteCount = 4;
        playNote('90');
        playNote('67');
        playNote('66');
        playNote('77');
        quietChords('90');
        quietChords('67');
        quietChords('66');
        quietChords('77');
        noteCount = 1;
    })

    diminished.addEventListener('click', function(){
        noteCount = 4;
        playNote('90');
        playNote('68');
        playNote('71');
        playNote('78');
        quietChords('90');
        quietChords('68');
        quietChords('71');
        quietChords('78');
        noteCount = 1;
    })

    augmented.addEventListener('click', function(){
        noteCount = 4;
        playNote('90');
        playNote('67');
        playNote('72');
        playNote('77');
        quietChords('90');
        quietChords('67');
        quietChords('72');
        quietChords('77');
        noteCount = 1;
    })

    dominant.addEventListener('click', function(){
        noteCount = 4;
        playNote('90');
        playNote('67');
        playNote('66');
        playNote('74');
        quietChords('90');
        quietChords('67');
        quietChords('66');
        quietChords('74');
        noteCount = 1;
    })

    function quietChords(key){
        gainNode[key].gain.setTargetAtTime(0.0001, audioCtx.currentTime + 0.1, .7);
        activeOscillators[key].stop(audioCtx.currentTime + 4); //offset time to give itme to ramp down
        delete activeOscillators[key];
        delete gainNode[key];
    }

});

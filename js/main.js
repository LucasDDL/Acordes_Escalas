// https://tonejs.github.io/examples/monoSynth
const synth = new Tone.PolySynth(Tone.MonoSynth, {
    volume: -6,
    oscillator: {
        type: "square8"
    },
    envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8,
    },
    filterEnvelope: {
        attack: 0.001,
        decay: 0.7,
        sustain: 0.1,
        release: 0.8,
        baseFrequency: 300,
        octaves: 4
    }
}).toDestination();

const url = "../acordes.json"
let acordes;
fetch(url)
    .then(resp => resp.json())
    .then(json => {
        acordes = json
        console.log(acordes)
        renderizarTeclado()
        cargarEscalaGuardada()
    })


const notas = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
]

const intervalos = {
    "tonica": 0,
    "segundaMenor": 1,
    "segundaMayor": 2,
    "terceraMenor": 3,
    "terceraMayor": 4,
    "cuartaJusta": 5,
    "cuartaAumentada": 6,
    "quintaDiminuida": 6,
    "quintaJusta": 7,
    "sextaMenor": 8,
    "sextaMayor": 9,
    "septimaMenor": 10,
    "septimaMayor": 11,
    "octava": 12,
};




function tomarTonica(tonica) {

    const indiceTonica = notas.indexOf(tonica)

    if (indiceTonica < 0) {
        return
    }

    let tonalidad = Object.entries(intervalos).reduce((acc, [intervalo, semitonos], intervalIndex) => {
        let indiceNota = indiceTonica + semitonos

        if (indiceNota > notas.length - 1) {
            indiceNota = indiceNota - notas.length
        }

        acc[intervalo] = notas[indiceNota]
        return acc
    }, {})

    return tonalidad
}


const escalas = {
    mayor: ["tonica", "segundaMayor", "terceraMayor", 'cuartaJusta', 'quintaJusta', 'sextaMayor', 'septimaMayor'],
    frigia: ["tonica", "segundaMenor", "terceraMenor", 'cuartaJusta', 'quintaJusta', 'sextaMenor', 'septimaMenor'],
}

const acordesEscalaMayor = {
    "tonica": "triadasMayores",
    "segundaMayor": "triadasMenores",
    "terceraMayor": "triadasMenores",
    "cuartaJusta": "triadasMayores",
    "quintaJusta": "triadasMayores",
    "sextaMayor": "triadasMenores",
    "septimaMayor": "acordesDiminuidos"
}

const acordesParaEscalas = {
    mayor: acordesEscalaMayor,
    frigia: {
        "tonica": "triadasMayores",
        "segundaMayor": "triadasMenores",
        "terceraMayor": "triadasMenores",
        "cuartaJusta": "triadasMayores",
        "quintaJusta": "triadasMayores",
        "sextaMayor": "triadasMenores",
        "septimaMayor": "acordesDiminuidos"
    }
}

function notasParaEscala(tonica, escala) {
    let tonalidad = tomarTonica(tonica)
    let notasEnEscala = escalas[escala].reduce((obj, intervalo) => {
        obj[intervalo] = tonalidad[intervalo];
        return obj;
    }, {});

    return notasEnEscala;
}


const button = document.querySelector('#submit');
button.addEventListener('click', (evento) => {
    const inputTonica = document.querySelector('#tonica');
    const tonica = inputTonica.value
    const inputEscala = document.querySelector('#escala');
    const nombreEscala = inputEscala.value
    if (!notas.includes(tonica)) {
        alert('No se encontro la nota')
        return
    }
    if (!Object.keys(escalas).some(k => nombreEscala.toLowerCase() === k.toLowerCase())) {
        alert('No se encontro la escala')
        return
    }

    const botones = document.querySelectorAll('.keyboard-container button');
    botones.forEach(boton => {
        boton.style.backgroundColor = '';
    });

    const escala = notasParaEscala(tonica, nombreEscala)

    console.log(escala);



    localStorage.setItem('escala', JSON.stringify({ tonica, nombreEscala }));

    cargarEscalaGuardada()
})

const selectTonica = document.querySelector('#tonica');
notas.forEach(nota => {
    const option = document.createElement('option')
    option.innerText = nota
    option.value = nota
    selectTonica.append(option)

});

const selectEscala = document.querySelector('#escala')
for (const nombreEscala in escalas) {
    const option = document.createElement('option')
    option.innerText = nombreEscala
    option.value = nombreEscala
    selectEscala.append(option);
}

function cargarEscalaGuardada() {

    const escalaGuardada = localStorage.getItem('escala')
    const divAcordes = document.getElementById("acordes");
    divAcordes.innerHTML = "";
    if (escalaGuardada) {
        const escalaParseada = JSON.parse(escalaGuardada)
        const escala = notasParaEscala(escalaParseada.tonica, escalaParseada.nombreEscala)
        selectTonica.value = escalaParseada.tonica;
        selectEscala.value = escalaParseada.nombreEscala;

        resaltarEscala(escala)
        if (escalaParseada.nombreEscala === "mayor") {

            for (const intervalo in escala) {
                let nota = escala[intervalo];
                console.log(nota)

                const tipoAcorde = acordesEscalaMayor[intervalo]
                const acorde = acordes[tipoAcorde][nota];
                console.log(acorde)
                const imgAcordes = document.createElement("img");
                imgAcordes.src = encodeURIComponent(`./${acorde.imagen}`)
                imgAcordes.onclick = () => {
                    console.log(acorde.notas)
                    // TODO: reemplazar notaOctavada por array de notas (con octava, ej: C5 G#4)
                    const notaOctavada = `${nota}4`
                    const ahora = Tone.now()
                    // reproducir nota en tiempo de inicio (ahora)
                    synth.triggerAttack(notaOctavada, ahora)
                    // silenciar nota 1 segundo despues de arrancar a reproducir
                    synth.triggerRelease(notaOctavada, ahora + 1)
                }

                divAcordes.append(imgAcordes);

            }


        }
    }

}

function renderizarTeclado() {
    const container = document.querySelector('.keyboard-container')

    let naturals = document.querySelector('.keyboard-container .naturals')
    if (!naturals) {
        naturals = document.createElement('div')
        naturals.className = 'row naturals'
        container.append(naturals)
    }


    let accidentals = document.querySelector('.keyboard-container .accidentals')
    if (!accidentals) {
        accidentals = document.createElement('div')
        accidentals.className = 'row accidentals'
        container.append(accidentals)
    }

    [...notas, ...notas].forEach((nota) => {
        const accidental = document.createElement('div')

        if (nota.length > 1) {
            accidental.innerText = nota
            accidental.className = 'key ' + nota.replace('#', '-sost')
            if (['F#', 'C#'].includes(nota)) {
                accidental.className = accidental.className + ' spacer'
            }
        } else {
            const natural = document.createElement('div')
            natural.className = 'key ' + nota
            natural.innerText = nota
            naturals.appendChild(natural)
        }

        accidentals.appendChild(accidental)
    });
}

function resaltarEscala(escala) {

    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {

        key.style.backgroundColor = '';


        for (const intervalo in escala) {
            const nota = escala[intervalo]
            if (nota.includes("#")) {
                if (key.className.includes(nota.replace("#", "-sost"))) {
                    key.style.backgroundColor = intervalo === 'tonica' ? 'green' : 'red';
                    console.log(key.className, escala[intervalo]);

                }
            } else {
                if (key.className.includes(nota) && !key.className.includes('-sost')) {
                    key.style.backgroundColor = intervalo === 'tonica' ? 'green' : 'red';
                }

            }

        }
    });

}






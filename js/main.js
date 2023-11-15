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


    // for (const intervalo in escala) {
    //     let boton = document.getElementById(escala[intervalo]);
    //     if (boton) {
    //         boton.style.backgroundColor = 'red'
    //     }
    // }

    // let botonTonica = document.getElementById(tonica);
    // if (botonTonica) {
    //     botonTonica.style.backgroundColor = 'green'
    // }
    resaltarEscala(escala)

    localStorage.setItem('tonalidad', tonica);
    localStorage.setItem('escala', nombreEscala);


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
    const tonalidadGuardada = localStorage.getItem('tonalidad')
    const escalaGuardada = localStorage.getItem('escala')

    if (tonalidadGuardada && escalaGuardada) {
        const escala = notasParaEscala(tonalidadGuardada, escalaGuardada)
        selectTonica.value = tonalidadGuardada;
        selectEscala.value = escalaGuardada;

        resaltarEscala(escala)
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
            accidental.className = 'key ' + nota.replace('#', '-sost')
            if (['F#', 'C#'].includes(nota)) {
                accidental.className = accidental.className + ' spacer'
            }
        } else {
            const natural = document.createElement('div')
            natural.className = 'key ' + nota
            naturals.appendChild(natural)
        }

        accidentals.appendChild(accidental)
    });
}

function resaltarEscala(escala) {
    // ... tusha
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

renderizarTeclado()
cargarEscalaGuardada()

// const acordes = {
//     C: ['C', 'E', 'G'],
//     Caug: ['C', 'E', 'G#'],
//     Cm: ['C', 'Eb', 'G'],
//     Cdim: ['C', 'Eb', 'Gb'],
//     D: ['D', 'F#', 'A'],
//     Dm: ['D', 'F', 'A'],
//     Ddim: ['D', 'F', 'Ab'],
//     Daug: ['D', 'F#', 'A#'],
//     E: ['E', 'G#', 'B'],
//     Eaug: ['E', 'G#', 'C'],
//     Em: ['E', 'G', 'B'],
//     Edim: ['E', 'G', 'Bb'],
//     F: ['F', 'A', 'C'],
//     Fm: ['F', 'Ab', 'C'],
//     Fdim: ['F', 'Ab', 'Cb'],
//     Faug: ['F', 'A', 'C#'],
//     G: ['G', 'B', 'D'],
//     Gm: ['G', 'Bb', 'D'],
//     Gdim: ['G', 'Bb', 'Db'],
//     Gaug: ['G', 'B', 'D#'],
//     A: ['A', 'C#', 'E'],
//     Am: ['A', 'C', 'E'],
//     Adim: ['A', 'C', 'Eb'],
//     Aaug: ['A', 'C#', 'E'],
//     B: ['B', 'D#', 'F#'],
//     Bm: ['B', 'D', 'F#'],
//     Baug: ['B', 'D#', 'G'],
//     Bdim: ['B', 'D', 'F'],
// }

// let acordeIngresado = prompt("Ingrese acorde");

// function elementosComunes(array1, array2) {
//     return array1.filter(elemento => array2.includes(elemento));
// }


// function acordesRelacionados(acordeIngresado) {
//     let acordeBuscado = acordes[acordeIngresado];
//     let acordesEncontrados = [];

//     for (let acorde in acordes) {
//         let notasComunes = elementosComunes(acordeBuscado, acordes[acorde]);
//         if (notasComunes.length >= 2) {
//             acordesEncontrados.push(acorde);
//         }
//     }

//     return acordesEncontrados;

// }

// let resultado = acordesRelacionados(acordeIngresado);
// console.log(resultado);


// Ingrese un acorde
// Dm
// Acordes relacionados
// F, G, A, Bdim
// (#) => SIGNIFICA "SOSTENIDO"
// (b) => SIGNIFICA "BEMOL"
// (|) => SIGNIFICA "O"
const notas = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
]

const notasEsp = {
    "A": "LA",
    "A#": "LA#",
    "B": "SI", //NO EXISTE "SI#" NI "DOb"
    "C": "DO",
    "C#": "DO#",
    "D": "RE",
    "D#": "RE#",
    "E": "MI", // NO EXISTE "MI#" NI "FAb"
    "F": "FA",
    "F#": "FA#",
    "G": "SOL",
    "G#": "SOL#",
    //LAS NOTAS SE REPITEN INFINITAMENTE....
}

console.log(notasEsp['G#'])
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


    for (const intervalo in escala) {
        let boton = document.getElementById(escala[intervalo]);
        if (boton) {
            boton.style.backgroundColor = 'red'
        }
    }

    let botonTonica = document.getElementById(tonica);
    if (botonTonica) {
        botonTonica.style.backgroundColor = 'green'
    }

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

const tonalidadGuardada = localStorage.getItem('tonalidad')
const escalaGuardada = localStorage.getItem('escala')

if (tonalidadGuardada && escalaGuardada) {
    const escala = notasParaEscala(tonalidadGuardada, escalaGuardada)

    for (const intervalo in escala) {
        let boton = document.getElementById(escala[intervalo]);
        if (boton) {
            boton.style.backgroundColor = 'red';
        }
    }

    // Resaltar la tonica
    let botonTonica = document.getElementById(tonalidadGuardada);
    if (botonTonica) {
        botonTonica.style.backgroundColor = 'green';
    }

    if (tonalidadGuardada) {
        selectTonica.value = tonalidadGuardada;
    }

    if (escalaGuardada) {
        selectEscala.value = escalaGuardada;
    }

}



// console.log(tomarTonica("C"));
// console.log(notasParaEscala('C', escalaMayor))
// console.log(notasParaEscala('F#', escalaFrigia))

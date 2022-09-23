/* ;(function() { */
    /* 'use strict' */
    
let palabras = ['html', 'css', 'programa', 'juego', 'ventana', 'imagen', 'agua', 'animal', 'planta', 'afinidad', 'libro', 'cubo', 'estrella', 'mar', 'tierra', 'cielo', 'lluvia', 'sol', 'cuadro', 'camara', 'foto', 'cama', 'reloj', 'palabra', 'cabello', 'control', 'llave', 'celular', 'hoja', 'galleta', 'tijera', 'sonido', 'basura', 'calle', 'carro', 'arbol', 'flor'];

//agregar palabras a la lista
function focus() {
    let input = document.getElementById("input-texto");
    input.focus();
}

function value() {
    let input = document.getElementById("input-texto");
    input.value = "";
}

function agregar_palabra() {
    let input = document.getElementById('input-texto').value;
    
    if (/[^a-zñ]/.test(input)) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: 'Oops...',
            showConfirmButton: false,
            text: 'Solo se permiten letras minusculas y sin acento',
          })
        focus();
    }

    else if (input.length === 0) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: 'Oops...',
            confirmButtonColor: '#4A5E60',
            text: 'El campo de texto está vacio, escriba una palabra',
          })
        focus();
    }

    else {
        palabras.push(input)
        Swal.fire({
            icon: 'success',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: '¡Bien!',
            confirmButtonColor: '#4A5E60',
            text: 'Palabra agregada con éxito',
        })

        value()
    }
}

//almacenar la configuración actual
let juego = null
//por si ya se envió alguna alerta
let finalizado = false

let $html = {
    personaje: document.getElementById('arlequin-juego'),
    adivinado: document.querySelector('.contenedor-acertadas'),
    errado: document.querySelector('.contenedor-erradas')
}

function dibujar(juego) {
    //actualizar la imagen del personaje
    let $elemento
    $elemento = $html.personaje
    let estado = juego.estado

    if (estado === 8) {
        estado = juego.previo
    }

    $elemento.src = './image/estado-arlequin/0' + estado + '.png'

    //creamos las letras adivinadas
    let palabra = juego.palabra
    let adivinado = juego.adivinado
    $elemento = $html.adivinado

    //borramos los elementos anteriores
    $elemento.innerHTML = ''

    for (let letra of palabra) {
        let $span = document.createElement('span')
        let $texto = document.createTextNode('')

        if (adivinado.indexOf(letra) >= 0) {
            $texto.nodeValue = letra
        }

        $span.setAttribute('class', 'span-acertado')
        $span.appendChild($texto)
        $elemento.appendChild($span)
    }

    //creamos las letras erradas
    let errado = juego.errado
    $elemento = $html.errado

    //borramos los elementos anteriores
    $elemento.innerHTML = ''

    for (let letra of errado) {
        let $span = document.createElement('span')
        let $texto = document.createTextNode(letra)

        $span.setAttribute('class', 'span-errado')
        $span.appendChild($texto)
        $elemento.appendChild($span)
    }
}

function adivinar(juego, letra) {
    let estado = juego.estado

    //si se ha perdido o ganado, no hay que hacer nada
    if (estado === 1 || estado === 8) {
        return
    }

    let adivinado = juego.adivinado
    let errado = juego.errado

    //si ya hemos errado o adivinado la letra, no hay que hacer nada
    if (adivinado.indexOf(letra) >= 0 || errado.indexOf(letra) >= 0) {
        return
    }

    var palabra = juego.palabra

    //sie es letra de la palabra
    if (palabra.indexOf(letra) >= 0) {
        let ganado = true

        //ver si llegamos al estado ganado
        for (let l of palabra) {
            if (adivinado.indexOf(l) < 0 && l != letra) {
                ganado = false
                juego.previo = juego.estado
                break
            }
        }

        //si ya se ha ganado, indicarlo
        if (ganado) {
            juego.estado = 8
        }

        //agregamos a la lista de letras adivinadas
        adivinado.push(letra)
    }

    //si no es letra de la palabra, se acerca el personaje a la horca
    else {
        juego.estado--

        //agregamos a la lista de letras erradas
        errado.push(letra)
    }
}

window.onkeydown = function adivinarLetra(e) {
    let letra = e.key

    if (/[^a-zñ]/.test(letra)) {
        return
    }

    adivinar(juego, letra)
    let estado = juego.estado

    if (estado === 8 && !finalizado) {
        setTimeout(alerta_ganado, 500)
        finalizado = true
    }

    else if (estado === 1 && !finalizado) {
        let palabra = juego.palabra
        let fn = alerta_perdido.bind(undefined, palabra)
        setTimeout(fn, 500)
        finalizado = true
    }

    dibujar(juego)
}

window.nuevoJuego = function nuevoJuego() {
    let palabra = palabra_aleatoria()
    juego = {}
    juego.palabra = palabra
    juego.estado = 7
    juego.adivinado = []
    juego.errado = []
    finalizado = false
    dibujar(juego)
    /* console.log(juego) */
}

function palabra_aleatoria() {
    let index = ~~(Math.random() * palabras.length)
    return palabras[index]
}

function alerta_ganado() {
    Swal.fire({
        title: '¡Felicidades, ganaste!',
        width: 380,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/ganaste.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

function alerta_perdido(palabra) {
    Swal.fire({
        title: 'Perdiste',
        text: 'La palabra era: ' + palabra,
        width: 300,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/perdiste.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

nuevoJuego()

/* }()) */
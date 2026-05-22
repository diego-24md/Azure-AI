/* 
    Utiliza el LLM Phi-4 de MicroSoft
    Requiere la activación de MicroSoft.Web
*/
/*
//Datos de Acceso
const endPointURL = `https://openaiprueba2026.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview`
const token = `AaMI7X1JC0c1DpJfPiOFBfCtZCntyo7sSgwMciDoUGzWiEubXxoNJQQJ99CEACYeBjFXJ3w3AAAAACOGyJwy`

async function enviarPregunta(pregunta = '') {

    const config = {
        model: 'Phi-4',
        messages: [
            { role: 'user', content: pregunta }
        ]
    }

    const response = await fetch(endPointURL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })

    if (!response.ok) {
        console.error(`Error ${response.status}: No se pudo acceder al servicio`)
        return
    }

    const resultado = await response.json()

    if (resultado.choices && resultado.choices.length > 0) {
        console.log(`Respuesta: ${resultado.choices[0].message.content}`)
    } else {
        console.log('No se encontró contenido en la respuesta')
        console.log(JSON.stringify(resultado, null, 2))
    }
}

// Test
enviarPregunta('¿Quién descubrió América?')
*/

const endPointURL = `https://openaiprueba2026.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview`
const token = `AaMI7X1JC0c1DpJfPiOFBfCtZCntyo7sSgwMciDoUGzWiEubXxoNJQQJ99CEACYeBjFXJ3w3AAAAACOGyJwy`

const chatMessages = document.getElementById('chatMessages')
const userInput = document.getElementById('userInput')
const button = document.querySelector('button')

function agregarMensaje(texto, tipo) {
    const div = document.createElement('div')
    div.classList.add('message', `${tipo}-message`)
    div.innerHTML = `<span>${texto}</span>`
    chatMessages.appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
    return div
}

async function enviar() {
    const pregunta = userInput.value.trim()
    if (!pregunta) return

    // Muestra mensaje del usuario
    agregarMensaje(pregunta, 'user')
    userInput.value = ''
    button.disabled = true

    // Muestra indicador de carga
    const loading = agregarMensaje('Escribiendo...', 'loading')

    const config = {
        model: 'Phi-4',
        messages: [
            { role: 'user', content: pregunta }
        ]
    }

    try {
        const response = await fetch(endPointURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })

        // Elimina el loading
        loading.remove()

        if (!response.ok) {
            agregarMensaje(`❌ Error ${response.status}: No se pudo acceder al servicio`, 'bot')
            return
        }

        const resultado = await response.json()

        if (resultado.choices && resultado.choices.length > 0) {
            agregarMensaje(resultado.choices[0].message.content, 'bot')
        } else {
            agregarMensaje('No se encontró contenido en la respuesta', 'bot')
        }

    } catch (e) {
        loading.remove()
        agregarMensaje(`Error de conexión: ${e.message}`, 'bot')
    } finally {
        button.disabled = false
        userInput.focus()
    }
}

function handleKey(event) {
    if (event.key === 'Enter') enviar()
}
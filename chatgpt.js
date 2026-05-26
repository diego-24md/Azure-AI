/*
//  Configuración
const AZURE_ENDPOINT = ``
const DEPLOYMENT_NAME = `gpt-5.4-mini`
const API_KEY = ``
const API_VERSION = `2025-04-01-preview`

async function preguntarAzure(pregunta = ``, historial = []) {

    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`

    const body = {
        messages: [
            { role: "system", content: "Eres un asistente útil" },
            ...historial,
            { role: "user", content: pregunta },
        ],
        max_completion_tokens: 800,
        temperature: 0.7
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        console.error(`Error ${response.status}: No se accedió al servicio`)
        return
    }

    const data = await response.json()
    const mensaje = data.choices[0].message

    const nuevo_historial = [
        ...historial,
        { role: 'user', content: pregunta },
        { role: 'assistant', content: mensaje.content }
    ]

    return {
        respuesta: mensaje.content,
        tokens_usados: data.usage.total_tokens,
        nuevo_historial
    }
}

async function test() {
    let historial = []

    //  Primera pregunta
    console.log('--- Pregunta 1 ---')
    let r1 = await preguntarAzure('¿De qué película es el personaje Jack Sparrow? Dame una respuesta corta', historial)
    console.log(r1.respuesta)
    historial = r1.nuevo_historial

    //  Segunda pregunta
    console.log('--- Pregunta 2 ---')
    let r2 = await preguntarAzure('¿En cuántas películas sale? Dame una respuesta corta', historial)
    console.log(r2.respuesta)
    historial = r2.nuevo_historial

    //  Tercera pregunta
    console.log('--- Pregunta 3 ---')
    let r3 = await preguntarAzure('¿Cuál es la frase más famosa del personaje? Dame una respuesta corta', historial)
    console.log(r3.respuesta)
    historial = r3.nuevo_historial

    //  Fin...
    console.log(`--- Tokens utilizados: ${r3.tokens_usados}`)
}

test()
*/

const AZURE_ENDPOINT = `https://openaiprueba2026.services.ai.azure.com`
const DEPLOYMENT_NAME = `gpt-5.4-mini`
const API_KEY = `AaMI7X1JC0c1DpJfPiOFBfCtZCntyo7sSgwMciDoUGzWiEubXxoNJQQJ99CEACYeBjFXJ3w3AAAAACOGyJwy`
const API_VERSION = `2025-04-01-preview`

const chatMessages = document.getElementById('chatMessages')
const userInput = document.getElementById('userInput')
const button = document.querySelector('button')
const tokensBadge = document.getElementById('tokensBadge')

let historial = []
let totalTokens = 0

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

    agregarMensaje(pregunta, 'user')
    userInput.value = ''
    button.disabled = true

    const loading = agregarMensaje('Escribiendo...', 'loading')

    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`

    const body = {
        messages: [
            { role: 'system', content: 'Eres un asistente útil' },
            ...historial,
            { role: 'user', content: pregunta }
        ],
        max_completion_tokens: 800,
        temperature: 0.7
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: JSON.stringify(body)
        })

        loading.remove()

        if (!response.ok) {
            agregarMensaje(`❌ Error ${response.status}: No se pudo acceder al servicio`, 'bot')
            return
        }

        const data = await response.json()
        const mensaje = data.choices[0].message

        // Acumula historial
        historial = [
            ...historial,
            { role: 'user', content: pregunta },
            { role: 'assistant', content: mensaje.content }
        ]

        // Actualiza tokens
        totalTokens += data.usage.total_tokens
        tokensBadge.textContent = `Tokens: ${totalTokens}`

        agregarMensaje(mensaje.content, 'bot')

    } catch (e) {
        loading.remove()
        agregarMensaje(`❌ Error de conexión: ${e.message}`, 'bot')
    } finally {
        button.disabled = false
        userInput.focus()
    }
}

function handleKey(event) {
    if (event.key === 'Enter') enviar()
}

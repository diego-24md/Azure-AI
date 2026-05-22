/* 
    Utiliza el LLM Phi-4 de MicroSoft
    Requiere la activación de MicroSoft.Web
*/

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
const suscriptionKey = ""
const endpoint = ""

// ── Texto a analizar ──────────────────────────
const texto = "Hoy fue un día increíble, me siento muy feliz con los resultados del proyecto."

// ─────────────────────────────────────────────

async function analizarSentimiento() {
    const url = `${endpoint}/text/analytics/v3.1/sentiment`

    console.log("Analizando sentimiento...")
    console.log(`Texto: "${texto}"\n`)

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                documents: [
                    {
                        id: "1",
                        language: "es",
                        text: texto
                    }
                ]
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || "Error en la API")
        }

        const data = await response.json()
        const resultado = data.documents[0]

        // Traducción de sentimientos al español
        const etiquetas = {
            positive: "Positivo",
            negative: "Negativo",
            neutral:  "Neutro",
            mixed:    "Mixto"
        }

        const sentimiento = etiquetas[resultado.sentiment] || resultado.sentiment

        console.log("─────────────────────────────────")
        console.log(`Sentimiento general: ${sentimiento}`)
        console.log("─────────────────────────────────")
        console.log("Puntuaciones:")
        console.log(`  Positivo: ${(resultado.confidenceScores.positive * 100).toFixed(1)}%`)
        console.log(`  Neutro:   ${(resultado.confidenceScores.neutral  * 100).toFixed(1)}%`)
        console.log(`  Negativo: ${(resultado.confidenceScores.negative * 100).toFixed(1)}%`)

        // Si hay análisis por oraciones
        if (resultado.sentences && resultado.sentences.length > 1) {
            console.log("\nAnálisis por oración:")
            resultado.sentences.forEach((oracion, i) => {
                const s = etiquetas[oracion.sentiment] || oracion.sentiment
                console.log(`  [${i + 1}] ${s} — "${oracion.text}"`)
            })
        }

        console.log("─────────────────────────────────")

    } catch (error) {
        console.error("❌ Error:", error.message)
    }
}

analizarSentimiento()
/*
const subscriptionKey = "";
const endpoint = "";

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
                "Ocp-Apim-Subscription-Key": subscriptionKey,
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
        console.error("Error:", error.message)
    }
}

analizarSentimiento()
*/

const subscriptionKey = "";
const endpoint = "";
const url = `${endpoint}text/analytics/v3.1/sentiment`;
const boton = document.getElementById("btnAnalizar");
boton.addEventListener("click", analizarSentimiento);

async function analizarSentimiento() {

    const texto = document.getElementById("textoEntrada").value;
    const tbody = document.getElementById("tbodyResultados");

    tbody.innerHTML = "";

    if (texto.trim() === "") {
        alert("Ingresa un texto");
        return;
    }

    try {
        boton.disabled = true;
        boton.innerText = "Analizando...";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey,
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
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Error en la API");
        }

        const data = await response.json();
        const resultado = data.documents[0];
        const etiquetas = {
            positive: "Positivo",
            negative: "Negativo",
            neutral: "Neutro",
            mixed: "Mixto"
        };

        const sentimientoGeneral =
            etiquetas[resultado.sentiment] || resultado.sentiment;

        tbody.innerHTML = "";

        tbody.innerHTML += `
            <tr>
                <td><strong>GENERAL</strong></td>
                <td>${sentimientoGeneral}</td>
                <td>
                    ${(resultado.confidenceScores.positive * 100).toFixed(1)}%
                    /
                    ${(resultado.confidenceScores.neutral * 100).toFixed(1)}%
                    /
                    ${(resultado.confidenceScores.negative * 100).toFixed(1)}%
                </td>
            </tr>
        `;

        if (resultado.sentences && resultado.sentences.length > 0) {

            resultado.sentences.forEach(oracion => {

                const sentimiento =
                    etiquetas[oracion.sentiment] || oracion.sentiment;

                let confianza = 0;

                if (oracion.sentiment === "positive") {
                    confianza = oracion.confidenceScores.positive;
                }
                if (oracion.sentiment === "neutral") {
                    confianza = oracion.confidenceScores.neutral;
                }
                if (oracion.sentiment === "negative") {
                    confianza = oracion.confidenceScores.negative;
                }

                tbody.innerHTML += `
                    <tr>
                        <td>${oracion.text}</td>
                        <td>${sentimiento}</td>
                        <td>${(confianza * 100).toFixed(1)}%</td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3">
                    Error: ${error.message}
                </td>
            </tr>
        `;
    } finally {
        boton.disabled = false;
        boton.innerText = "Analizar";
    }
}
// IMPORTANTE:
// Reemplaza estos datos con los tuyos
const subscriptionKey = "";
const endpoint = "";

async function leerTexto() {
    const imageURL = document.getElementById('ocrImageUrl').value.trim();
    const resultBox = document.getElementById('ocrResult');

    if (!imageURL) {
        resultBox.innerText = 'Por favor ingresa una URL de imagen.';
        return;
    }

    resultBox.innerText = 'Procesando OCR...';

    try {
        const url = `${endpoint}vision/v3.2/read/analyze`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageURL })
        });

        if (!response.ok) {
            throw new Error('Error enviando imagen a OCR');
        }

        const operationLocation = response.headers.get('operation-location');

        let result;
        while (true) {
            const checkResponse = await fetch(operationLocation, {
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                }
            });

            result = await checkResponse.json();

            if (result.status === 'succeeded') break;
            if (result.status === 'failed') throw new Error('Falló el análisis OCR');

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        let texto = '';

        result.analyzeResult.readResults.forEach(page => {
            page.lines.forEach(line => {
                texto += line.text + '\n';
            });
        });

        resultBox.innerText = texto || 'No se detectó texto.';

    } catch (error) {
        resultBox.innerText = 'Error: ' + error.message;
    }
}

async function detectarObjetos() {
    const imageURL = document.getElementById('objImageUrl').value.trim();
    const resultBox = document.getElementById('objResult');

    if (!imageURL) {
        resultBox.innerText = 'Por favor ingresa una URL de imagen.';
        return;
    }

    resultBox.innerText = 'Detectando objetos...';

    try {
        const url = `${endpoint}vision/v3.2/analyze?visualFeatures=Objects`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageURL })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Error detectando objetos');
        }

        let salida = '';

        data.objects.forEach(obj => {
            const confianza = (obj.confidence * 100).toFixed(2);
            salida += `Objeto: ${obj.object} | Confianza: ${confianza}%\n`;
        });

        resultBox.innerText = salida || 'No se detectaron objetos.';

    } catch (error) {
        resultBox.innerText = 'Error: ' + error.message;
    }
}
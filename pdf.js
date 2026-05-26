/* 
    Analizar un archivo PDF, como si se tratara de un archivo PLANO (txt)
    Este ejercicio se puede realizar con PDf (online https://...) o PDf local
*/

/* 
    ¿Cómo utilizar este servicio con un PDF local?

*/

const endPoint = ``
const apiKey = ``
const modelId = `prebuilt-invoice` //Optimizado para lectura de boletas, facturas

const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`
const documentUrl = `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf`

// AZRE NECESITA HOSTEAR EL ARCHIVO PDf
async function subirDocumento() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ urlSource: documentUrl })
        })

        if (!response.ok) {
            console.error('Problemas de acceso')
            return
        }

        const operationLocation = response.headers.get('Operation-Location')
        console.log('Análisis iniciado, URL:', operationLocation)
        return operationLocation
    }
    catch (error) {
        console.error(error)
    }
}

//Archivo que debemos analizar
async function analizarDocumento(operationLocation) {
    try {
        const response = await fetch(operationLocation, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
            }
        })

        if (!response.ok) {
            console.error('Problemas de acceso')
            return
        }

        // El análisis puede tardar unos instantes...
        const data = await response.json()

        if (data.status === 'running' || data.status === 'noStarted'){
            console.log('Procesando, espere por favor...')
            await new Promise(resolve => setTimeout(resolve, 2000))
            return analizarDocumento(operationLocation) //RECURSIVIDAD (métodoA -> métodoA)
        }else if (data.status === 'succeeded'){
            console.log('Datos extraídos del PDf')
            console.log(data.analyzeResult.documents)
        }
    }
    catch (error) {
        console.error(error)
    }
}

async function procesarFactura() {
    const urlResultado = await subirDocumento()

    //Si el objeto =/= undefined
    if (urlResultado){
        const ResultadoFinal = await analizarDocumento(urlResultado)
        console.log(ResultadoFinal)
    }
}

procesarFactura()
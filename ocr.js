//Detección de texto en imagen - OCR
const suscriptionKey = ""
const endpoint = ""

const url = `${endpoint}/vision/v3.2/read/analyze`
const imageURL = `https://image.slidesharecdn.com/eleditorial-220301120619/95/El-editorial-3-638.jpg`
//const imageURL = `https://azurejhon.w3spaces-preview.com/peru.pdf`

async function leerTexto(){
  try{
    console.log('Enviando imagen a Azure...')

    //PARTE 1 - Enviar el documento a leer
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: imageURL })
    })

    if (!response.ok){
      const errorData = await response.json()
      throw new Error(`Error en: ${errorData.error.message}`)
    }

    //Tratamiento especial...
    //Azure no devuelve el texto inmediatamente, devuelve una URL en el Header 'operation-location'
    const operationLocation = response.headers.get('operation-location')
    console.log('Procesando... esperando resultados')

    //PARTE 2 - Consultar URL de la operación hasta que se encuentre como "succeded"
    let result = null
    while(true){
      const checkResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": suscriptionKey }
      })
      
      result = await checkResponse.json()

      if (result.status === 'succeeded') break; //Escapar del while
      if (result.status === 'failed') throw new Error('Error analizando datos...')

      //Esperar 1 segundo para volver a intentarlo
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    //PARTE 3 - Extraer y mostrar el texto detectado
    console.log("Texto detectado")

    //Como el resultado se encuentra dentro de una matriz [[]] necesitamos
    //recorrer la estructura con dos ciclos
    result.analyzeResult.readResults.forEach(page => {
      page.lines.forEach(line => {
        console.log(line.text)
      })
    })
    

  }catch(error){
    console.error(`Error en el servicio: ${error.message}`)
  }
}

leerTexto()
//Estos datos son CONFIDENCIALES (BACKEND)
const subscriptionKey = "CK7SNr3nyrpKOauqWoX2QlZFby8Rq4Obe3TNW7px1gJizBrSpvAGJQQJ99CEACYeBjFXJ3w3AAAFACOGcbht"
const endpoint = "https://1521552-ai.cognitiveservices.azure.com/"

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`
const imageURL = `https://static.vecteezy.com/system/resources/previews/035/846/121/non_2x/man-job-entrepreneur-sitting-work-manager-office-modern-person-adult-smart-computer-desk-portrait-photo.jpg`

async function detectarObjetos(){
  try{
    console.log("Iniciando la detección de objetos...")

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
      throw new Error(errorData.error.message)
    }

    //éxito...
    const data = await response.json()
    //console.log(data)

    data.objects.forEach(obj => {
      const confianza = (obj.confidence * 100).toFixed(2)
      console.log(`Objeto identificado: ${obj.object} - Confianza: ${confianza}%`)

      //Ubicación - ¿en qué parte de la imagen está ese objeto?
      const rect = obj.rectangle
      console.log(`  Coordenadas del rectángulo:`)
      console.log(`  Inicio (superior, izquierdo): ${rect.x}, ${rect.y}`)
      console.log(`  Dimensiones (px): ${rect.w} ancho, ${rect.h} alto`)
    })

  }catch(error){
    console.error(`Error en el servicio: ${error.message}`)
  }
}

detectarObjetos()
/*
//Detección de imágenes
const subscriptionKey = ""
const endpoint = ""

//La URL describe las funcionalidades que deseamos aprovechar
const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`

//Imagen que analizaremos
//const imageURL = `https://images.pexels.com/videos/7655554/pexels-photo-7655554.jpeg`
const imageURL = `https://img.magnific.com/fotos-premium/amigos-felices-corriendo-campo-contra-arboles_7186-4118.jpg`

//Esta funcionalidad requiere ejecutase como promesa
async function analizarImagen(){
  try{
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

    //Logramos recibir un resultado favorable
    const data = await response.json()
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2)

    //Muestra todos los datos
    //console.log(data.description)
    
    console.log("Descripción: ", data.description.captions[0].text)
    console.log(`Confianza: ${confianza} %`)
    
    //join método que itera y concatena valores de un array
    console.log("Etiquetas: " + data.description.tags.join(", ")) 



  }catch(error){
    console.error(`Error analizando imagen: ${error.message}`)
  }
}

analizarImagen()
*/

const subscriptionKey = ""
const endpoint = ""

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`

function setStatus(type, msg, spinner) {
  const bar = document.getElementById('statusBar')
  const icon = document.getElementById('statusIcon')
  const msgEl = document.getElementById('statusMsg')

  bar.className = 'status-bar ' + type
  bar.classList.remove('hidden')

  if (spinner) {
    icon.innerHTML = '<div class="spinner"></div>'
  } else {
    const icons = { success: '', error: '', running: '' }
    icon.textContent = icons[type] || ''
  }

  msgEl.textContent = msg
}

async function analizarImagen() {
  const imageUrl = document.getElementById('imageUrl').value.trim()
  const btn = document.getElementById('analyzeBtn')
  const resultSection = document.getElementById('resultSection')

  if (!imageUrl) {
    setStatus('error', 'Ingresa la URL de una imagen.', false)
    return
  }

  btn.disabled = true
  resultSection.classList.add('hidden')
  setStatus('running', 'Analizando imagen…', true)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2)
    const descripcion = data.description.captions[0].text
    const etiquetas = data.description.tags
    const colorDominante = data.color.dominantColors[0] || 'N/A'

    document.getElementById('previewImg').src = imageUrl
    document.getElementById('descripcion').textContent = descripcion
    document.getElementById('confianza').textContent = `${confianza}%`
    document.getElementById('color').textContent = colorDominante

    const tagsContainer = document.getElementById('etiquetas')
    tagsContainer.innerHTML = ''
    etiquetas.forEach(tag => {
      const span = document.createElement('span')
      span.className = 'tag'
      span.textContent = tag
      tagsContainer.appendChild(span)
    })

    resultSection.classList.remove('hidden')
    setStatus('success', 'Análisis completado.', false)

  } catch (e) {
    setStatus('error', 'Error: ' + e.message, false)
  } finally {
    btn.disabled = false
  }
}
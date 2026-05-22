/*
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
*/

const subscriptionKey = "AaMI7X1JC0c1DpJfPiOFBfCtZCntyo7sSgwMciDoUGzWiEubXxoNJQQJ99CEACYeBjFXJ3w3AAAAACOGyJwy"
const endpoint = "https://openaiprueba2026.services.ai.azure.com/"

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`

const COLORS = ['#4a90e2', '#e25c4a', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c']

function setStatus(type, msg, spinner) {
  const bar = document.getElementById('statusBar')
  const icon = document.getElementById('statusIcon')
  const msgEl = document.getElementById('statusMsg')

  bar.className = 'status-bar ' + type
  bar.classList.remove('hidden')

  icon.innerHTML = spinner
    ? '<div class="spinner"></div>'
    : `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>`

  msgEl.textContent = msg
}

function dibujarCanvas(imgEl, objetos) {
  const canvas = document.getElementById('overlay')
  const ctx = canvas.getContext('2d')

  canvas.width = imgEl.naturalWidth
  canvas.height = imgEl.naturalHeight

  objetos.forEach((obj, idx) => {
    const color = COLORS[idx % COLORS.length]
    const { x, y, w, h } = obj.rectangle

    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(2, canvas.width * 0.003)
    ctx.strokeRect(x, y, w, h)

    const label = `${obj.object} ${(obj.confidence * 100).toFixed(0)}%`
    const fontSize = Math.max(12, canvas.width * 0.018)
    ctx.font = `bold ${fontSize}px Arial`

    const textW = ctx.measureText(label).width
    const padding = 6

    ctx.fillStyle = color
    ctx.fillRect(x, y - fontSize - padding * 2, textW + padding * 2, fontSize + padding * 2)

    ctx.fillStyle = '#fff'
    ctx.fillText(label, x + padding, y - padding)
  })
}

async function detectarObjetos() {
  const imageUrl = document.getElementById('imageUrl').value.trim()
  const btn = document.getElementById('analyzeBtn')
  const resultSection = document.getElementById('resultSection')

  if (!imageUrl) {
    setStatus('error', 'Ingresa la URL de una imagen.', false)
    return
  }

  btn.disabled = true
  resultSection.classList.add('hidden')
  setStatus('running', 'Detectando objetos…', true)

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
    const objetos = data.objects

    if (!objetos || objetos.length === 0) {
      setStatus('success', 'No se detectaron objetos en la imagen.', false)
      btn.disabled = false
      return
    }

    // Mostrar imagen y esperar a que cargue para dibujar el canvas
    const img = document.getElementById('previewImg')
    img.src = imageUrl
    img.onload = () => dibujarCanvas(img, objetos)

    // Lista de objetos
    const list = document.getElementById('objectList')
    list.innerHTML = ''

    objetos.forEach((obj, idx) => {
      const color = COLORS[idx % COLORS.length]
      const confianza = (obj.confidence * 100).toFixed(2)
      const { x, y, w, h } = obj.rectangle

      const item = document.createElement('div')
      item.className = 'object-item'
      item.innerHTML = `
        <div class="object-header">
          <div class="object-dot" style="background:${color}"></div>
          <span class="object-name">${obj.object}</span>
          <span class="object-confidence">${confianza}%</span>
        </div>
        <div class="object-coords">
          <span><i class="fa-solid fa-location-dot"></i> Inicio: ${x}px, ${y}px</span>
          <span><i class="fa-solid fa-ruler-combined"></i> Tamaño: ${w} × ${h} px</span>
        </div>
      `
      list.appendChild(item)
    })

    resultSection.classList.remove('hidden')
    setStatus('success', `${objetos.length} objeto${objetos.length > 1 ? 's' : ''} detectado${objetos.length > 1 ? 's' : ''}.`, false)

  } catch (e) {
    setStatus('error', 'Error: ' + e.message, false)
  } finally {
    btn.disabled = false
  }
}
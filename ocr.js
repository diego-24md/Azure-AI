/*
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
*/

const subscriptionKey = "CK7SNr3nyrpKOauqWoX2QlZFby8Rq4Obe3TNW7px1gJizBrSpvAGJQQJ99CEACYeBjFXJ3w3AAAFACOGcbht"
const endpoint = "https://1521552-ai.cognitiveservices.azure.com/"

function setStatus(type, msg, spinner) {
  const bar = document.getElementById('statusBar');
  const icon = document.getElementById('statusIcon');
  const msgEl = document.getElementById('statusMsg');

  bar.className = 'status-bar ' + type;
  bar.classList.remove('hidden');

  if (spinner) {
    icon.innerHTML = '<div class="spinner"></div>';
  } else {
    const icons = { success: '', error: '', running: '' };
    icon.textContent = icons[type] || '';
  }

  msgEl.textContent = msg;
}

async function analizarTexto() {
  const imageUrl = document.getElementById('imageUrl').value.trim();
  const btn = document.getElementById('analyzeBtn');
  const resultSection = document.getElementById('resultSection');

  if (!imageUrl) {
    setStatus('error', 'Ingresa la URL de la imagen a analizar.', false);
    return;
  }

  btn.disabled = true;
  resultSection.classList.add('hidden');
  setStatus('running', 'Enviando imagen a Azure…', true);

  try {
    const url = `${endpoint}/vision/v3.2/read/analyze`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const operationLocation = response.headers.get('operation-location');
    setStatus('running', 'Procesando… esperando resultados de Azure', true);

    let result = null;
    let attempts = 0;

    while (true) {
      await new Promise(r => setTimeout(r, 1200));
      attempts++;

      const check = await fetch(operationLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
      });

      result = await check.json();

      if (result.status === 'succeeded') break;
      if (result.status === 'failed') throw new Error('Azure no pudo analizar la imagen.');

      setStatus('running', `Procesando… intento ${attempts}`, true);
    }

    const pages = result.analyzeResult.readResults;
    const container = document.getElementById('pagesContainer');
    container.innerHTML = '';

    pages.forEach((page, idx) => {
      const text = page.lines.map(l => l.text).join('\n');
      const pageDiv = document.createElement('div');
      pageDiv.style.marginBottom = idx < pages.length - 1 ? '1.25rem' : '0';
      pageDiv.innerHTML = `
        <div class="meta-row">
          <span class="meta-label">Texto detectado</span>
          <div style="display:flex;align-items:center;gap:8px;">
            ${pages.length > 1 ? `<span class="page-badge">Página ${idx + 1}</span>` : ''}
            <button class="copy-btn" onclick="copyText(this, ${idx})">Copiar</button>
          </div>
        </div>
        <div class="result-box" id="result-${idx}">${escHtml(text)}</div>
      `;
      container.appendChild(pageDiv);
    });

    resultSection.classList.remove('hidden');
    const totalLines = pages.reduce((s, p) => s + p.lines.length, 0);
    setStatus('success', `Listo — ${totalLines} líneas detectadas en ${pages.length} página${pages.length > 1 ? 's' : ''}.`, false);

  } catch (e) {
    setStatus('error', 'Error: ' + e.message, false);
  } finally {
    btn.disabled = false;
  }
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function copyText(btn, idx) {
  const text = document.getElementById('result-' + idx).textContent;
  await navigator.clipboard.writeText(text);
  btn.textContent = 'Copiado';
  setTimeout(() => { btn.textContent = 'Copiar'; }, 1800);
}
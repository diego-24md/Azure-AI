# Azure Cognite Services
## Computer Vision

# Azure Vision — OCR + Detección de Objetos

Aplicación web que usa la API de **Azure Computer Vision** para extraer texto de imágenes (OCR) y detectar objetos dentro de ellas, mostrando los resultados en una interfaz visual.

---

## Estructura del proyecto

```
azure-ia/
├── public/
│   ├── index.html
│   ├── ocr.html      
│   ├── objetos.html    
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
├── templates/
├── package.json
└── README.md
```

---

## Cómo funciona

### 1. `index.html` — Página principal

Punto de entrada de la app. Muestra dos botones:

- **OCR — Leer Texto** → navega a `ocr.html`
- **Detección de Objetos** → navega a `objetos.html`

No tiene lógica propia, solo sirve de menú de navegación.

---

### 2. `ocr.html` — Lectura de texto (OCR)

El usuario pega una URL de imagen con texto visible (por ejemplo, una foto de un documento, cartel o pantalla).

Al presionar **Analizar Texto**, el frontend llama a la función `leerTexto()` definida en `app.js`, que:

1. Toma la URL del input `#ocrImageUrl`
2. Hace un `POST` a la API de Azure Computer Vision (`/vision/v3.2/read/analyze`)
3. Espera a que el análisis esté listo (Azure procesa de forma asíncrona)
4. Obtiene el resultado con otro `GET` al endpoint de resultado
5. Muestra el texto extraído en el div `#ocrResult`

---

### 3. `objetos.html` — Detección de objetos

El usuario pega una URL de imagen que contenga objetos físicos (personas, muebles, vehículos, etc.).

Al presionar **Detectar Objetos**, se llama a `detectarObjetos()` desde `app.js`, que:

1. Toma la URL del input `#objImageUrl`
2. Hace un `POST` a la API de Azure (`/vision/v3.2/analyze?visualFeatures=Objects`)
3. Recibe un array de objetos con:
   - `object` — nombre del objeto detectado
   - `confidence` — nivel de confianza entre 0 y 1
   - `rectangle` — coordenadas `x, y, w, h` en la imagen
4. Muestra cada objeto con su porcentaje de confianza en `#objResult`

---

## API de Azure Computer Vision

Ambas funciones usan dos variables definidas al inicio del archivo `app.js` (o `deteccion.js`):

```js
const suscriptionKey = "TU_CLAVE_AQUI";
const endpoint       = "https://TU_RECURSO.cognitiveservices.azure.com";
```

> ⚠️ Estas claves son **confidenciales**.

Las URL de la API que se construyen son:

| Función | Endpoint |
|---|---|
| OCR | `{endpoint}/vision/v3.2/read/analyze` |
| Detección | `{endpoint}/vision/v3.2/analyze?visualFeatures=Objects` |

Ambos usan el header `Ocp-Apim-Subscription-Key` con la clave de suscripción.

---

## Instalación y uso

### Requisitos

- Node.js instalado
- Una cuenta de Azure con un recurso de **Computer Vision** creado

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/diego-24md/Azure-AI.git
cd azure-ia

# 2. Instalar dependencias
npm install

# 3. Agregar tus credenciales de Azure en app.js
#    const suscriptionKey = "TU_CLAVE"
#    const endpoint = "https://TU_RECURSO.cognitiveservices.azure.com"

# 4. Abrir index.html en el navegador
#    (o usar Live Server en VS Code)
```

---

## Estilos

Todos los estilos están en `public/css/styles.css` y aplican a las tres páginas. El diseño usa:

- Tema oscuro con fondo `#0b1120`
- Tipografía **Inter** (Google Fonts)
- Colores principales: azul `#2563eb` para OCR, verde `#16a34a` para detección
- Responsive para pantallas pequeñas

---

## Tecnologías usadas

| Tecnología | Uso |
|---|---|
| HTML5 / CSS3 | Estructura y estilos |
| JavaScript (vanilla) | Lógica del frontend |
| Fetch API | Llamadas HTTP a Azure |
| Azure Computer Vision | OCR y detección de objetos |
| Node.js | Entorno de ejecución |

---

## Notas para la entrega

- El archivo `.gitignore` ya excluye `node_modules/`
- Las claves de Azure **no deben** estar en el repositorio público
- Se puede probar con cualquier imagen pública accesible por URL
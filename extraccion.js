/*
const subscriptionKey = "";
const endpoint = "";

const url = `${endpoint}language/:analyze-text?api-version=2022-05-01`;

async function extraerDatos() {
    try {
        const texto = `El ingeniero Carlos Mendoza del equipo de TI coordinó la compra de 15 servidores marca DELL por un valor de 15000 dolares
        para la sucursal de Autos Nova en Lima el pasado 12 de mayo de 2026`;

        const documentoProcesar = {
            kind: "EntityRecognition",
            analysisInput: {
                documents: [{
                    id: "1",
                    language: "es",
                    text: texto
                }]
            }
        };

        console.log("Enviando texto a Azure para extracción...");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey
            },
            body: JSON.stringify(documentoProcesar)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.errors && data.errors.length > 0) {
            console.log(data.errors);
            return;
        }

        const documentos = data.results.documents;

        // Todos los datos
        documentos.forEach(documento => {
            console.log(documento);
        });

        // Solo fechas
        documentos.forEach(documento => {
            documento.entities.forEach(entidad => {
                if (entidad.category === "DateTime") {
                    console.log("Fecha encontrada:", entidad.text);
                }
            });
        });

    } catch (error) {
        console.error(error.message);
    }
}

extraerDatos();
*/

const subscriptionKey = "";
const endpoint = "";

const url = `${endpoint}language/:analyze-text?api-version=2022-05-01`;

const boton = document.getElementById("btnAnalizar");
boton.addEventListener("click", analizarTexto);

async function analizarTexto() {

    const texto = document.getElementById("textoEntrada").value;
    const tbody = document.getElementById("tbodyResultados");

    tbody.innerHTML = "";

    if (texto.trim() === "") {
        Swal.fire({
            icon: "warning",
            title: "Campo vacío",
            text: "Por favor ingresa un texto antes de analizar.",
            confirmButtonColor: "#185FA5",
            confirmButtonText: "Entendido"
        });
        return;
    }

    const checks = document.querySelectorAll(".categorias input:checked");
    const categoriasSeleccionadas = [];

    checks.forEach(check => {
        categoriasSeleccionadas.push(check.value);
    });

    if (categoriasSeleccionadas.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Sin categorías",
            text: "Selecciona al menos una categoría antes de analizar.",
            confirmButtonColor: "#185FA5",
            confirmButtonText: "Entendido"
        });
        return;
    }

    try {

        boton.disabled = true;
        boton.innerText = "Analizando...";

        const body = {
            kind: "EntityRecognition",
            analysisInput: {
                documents: [
                    {
                        id: "1",
                        language: "es",
                        text: texto
                    }
                ]
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const resultado = await response.json();
        const entidades = resultado.results.documents[0].entities;

        const entidadesFiltradas = entidades.filter(entidad =>
            categoriasSeleccionadas.includes(entidad.category)
        );

        if (entidadesFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">No se encontraron resultados</td>
                </tr>
            `;
            return;
        }

        entidadesFiltradas.forEach(entidad => {
            const confianza = (entidad.confidenceScore * 100).toFixed(1);
            const fila = `
                <tr>
                    <td>${entidad.text}</td>
                    <td>${entidad.category}</td>
                    <td>${confianza}%</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

    } catch (error) {

        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3">Error: ${error.message}</td>
            </tr>
        `;

    } finally {
        boton.disabled = false;
        boton.innerText = "Analizar";
    }
}
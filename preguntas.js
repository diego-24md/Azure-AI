/*
const subscriptionKey = ""
const endpoint = ""

// URL
const url = `${endpoint}language/:query-text?api-version=2021-10-01`;

async function responderPreguntas() {
    try {
        const contextoAnalizar = `
        La política es una actividad importante dentro de cualquier sociedad, ya que permite organizar la convivencia entre las personas 
        y tomar decisiones que afectan al país. A través de la política, los gobiernos crean leyes, administran recursos públicos y buscan 
        soluciones para problemas como la pobreza, la inseguridad y la educación. Por esta razón, la participación de los ciudadanos es fundamental 
        para mantener una democracia estable.
        La participación política puede darse de diferentes maneras. La más conocida es el voto durante las elecciones, pero también existen otras 
        formas como participar en debates, expresar opiniones de manera respetuosa, asistir a reuniones comunitarias o mantenerse informado sobre los
        temas nacionales. Cuando las personas participan activamente, ayudan a que las autoridades conozcan las necesidades reales de la población.
        Sin embargo, uno de los principales problemas en muchos países es la desconfianza hacia los políticos debido a casos de corrupción o incumplimiento 
        de promesas. Esto provoca que algunas personas pierdan interés en participar en asuntos públicos. A pesar de ello, es importante recordar que una ciudadanía 
        informada y crítica puede contribuir a mejorar la calidad de los gobiernos y fortalecer las instituciones democráticas.
        Finalmente, la política no debe verse únicamente como un tema de discusión o conflicto, sino también como una herramienta para generar cambios 
        positivos. Cuando existe diálogo, respeto y participación responsable, es posible construir una sociedad más justa, organizada y con mayores oportunidades 
        para todos.
        `;

        const pregunta = `¿Qué importancia tiene la participación ciudadana en la política?`;

        const cuerpoPeticion = {
            question: pregunta,
            records: [
                {
                    id: "doc_01",
                    text: contextoAnalizar
                }
            ],
            language: "es",
            stringIndexType: "Utf16CodeUnit"
        };

        // 
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
        }

        const resultado = await response.json();

        if (resultado.answers && resultado.answers.length > 0) {
            const mejorRespuesta = resultado.answers[0];
            console.log("Respuesta:", mejorRespuesta.answer);
            console.log("Confianza:", (mejorRespuesta.confidenceScore * 100).toFixed(1) + "%");
        } else {
            console.log("No se encontró respuesta.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

responderPreguntas();
*/

const subscriptionKey = ""
const endpoint = ""

const url = `${endpoint}/language/:query-text?api-version=2021-10-01`;

async function responderPreguntas() {

    const contexto = document.getElementById("contexto").value.trim();
    const pregunta = document.getElementById("pregunta").value.trim();

    if (!contexto || !pregunta) {
        alert("Completa todos los campos");
        return;
    }

    const cuerpoPeticion = {
        question: pregunta,
        records: [
            {
                id: "doc_01",
                text: contexto
            }
        ],
        language: "es",
        stringIndexType: "Utf16CodeUnit"
    };

    try {

        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        const data = await response.json();

        console.log(data);

        if(data.answers?.length){

            document.getElementById("resultado")
                .classList.remove("hidden");

            document.getElementById("respuesta")
                .textContent = data.answers[0].answer;

            document.getElementById("confianza")
                .textContent =
                (data.answers[0].confidenceScore * 100).toFixed(2) + "%";
        }

    } catch(error){
        console.error(error);
        alert(error.message);
    }
}
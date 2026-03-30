document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const descHTML = document.getElementById("descripcio-categoria");

    // 1. Capturar la categoria de la URL
    const params = new URLSearchParams(window.location.search);
    // Busquem 'cat' o 'Categoria' per si de cas
    const catClau = params.get('cat') || params.get('Categoria'); 

    if (!catClau) {
        if (titolHTML) titolHTML.innerText = "Error: No s'ha seleccionat categoria";
        return;
    }

    // Posem el títol provisional
    if (titolHTML) titolHTML.innerText = "Carregant " + catClau + "...";

    function fetchAirtable() {
        // Fem servir la ruta relativa que Netlify entén quan està online
        // Si proves en Live Server, aquesta línia donarà error (404)
        const url = `/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) {
                // Si el servidor respon 400, 401, 500...
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // El codi de la "Cadi" espera data.records. 
            // Si la teva funció ja el neteja, mirem quina de les dues opcions arriba.
            const records = data.records || data;

            if (Array.isArray(records) && records.length > 0) {
                processData(records);
            } else {
                if (titolHTML) titolHTML.innerText = catClau;
                if (contenidor) contenidor.innerHTML = "<p>No hi ha articles disponibles en aquesta categoria.</p>";
            }
        })
        .catch(err => {
            console.error("Error detallat:", err);
            if (titolHTML) titolHTML.innerText = "Error de connexió";
            if (contenidor) contenidor.innerHTML = `<p style="color:red;">Detall: ${err.message}</p>`;
        });
    }

    function processData(records) {
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        // El títol el traiem de la primera fila d'Airtable si cal, o de la URL
        if (titolHTML) titolHTML.innerText = catClau;

        records.forEach(r => {
            const art = r.fields;
            if (!art) return;

            // Lògica de fotos: Comprovem si és Array o String com a la "Cadi"
            let fotoNom = Array.isArray(art.Foto) ? art.Foto[0] : art.Foto;
            const imgPath = fotoNom ? `${baseRuta}${fotoNom}` : `${baseRuta}Default.png`;

            html += `
                <div class="targeta-producte">
                    <div class="imatge-contenidor">
                        <img src="${imgPath}" alt="${art.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    </div>
                    <div class="detalls-producte">
                        <h3>${art.Nom || "Sense nom"}</h3>
                        <p class="descripcio-text">${art.Descripcio || ""}</p>
                        <div class="peu-producte">
                            <span class="preu-text">${art.Preu || "0"} €</span>
                        </div>
                    </div>
                </div>
            `;
        });

        if (contenidor) {
            contenidor.innerHTML = html;
        }
    }

    fetchAirtable();
});
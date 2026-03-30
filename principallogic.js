document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");

    const params = new URLSearchParams(window.location.search);
    // IMPORTANT: Mira si a la URL poses 'cat' o 'Categoria'
    const catClau = params.get('Categoria') || params.get('cat'); 

    if (!catClau) {
        if (titolHTML) titolHTML.innerText = "Falta categoria";
        return;
    }

    if (titolHTML) titolHTML.innerText = "Carregant " + catClau + "...";

    function fetchAirtable() {
        // Crida a la teva funció de Netlify del nou projecte
        const url = `/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en la resposta");
            return response.json();
        })
        .then(data => {
            // Adaptació a l'estructura d'Airtable:
            // Si la teva funció de Netlify ja envia data.records, fem servir 'data'
            // Si envia el paquet sencer, fem servir 'data.records'
            const records = Array.isArray(data) ? data : (data.records || []);
            
            if (records.length > 0) {
                renderizarArticles(records);
            } else {
                if (contenidor) contenidor.innerHTML = "<p>No hi ha articles.</p>";
            }
        })
        .catch(err => {
            console.error("Error:", err);
            if (titolHTML) titolHTML.innerText = "Error en carregar";
        });
    }

    function renderizarArticles(records) {
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        records.forEach(r => {
            const art = r.fields;
            if (!art) return;

            // Lògica de foto que ja et funciona a l'altra web:
            let fotoNom = Array.isArray(art.Foto) ? art.Foto[0] : art.Foto;
            const imgPath = fotoNom ? `${baseRuta}${fotoNom}` : `${baseRuta}Default.png`;

            html += `
                <div class="targeta-producte">
                    <img src="${imgPath}" alt="${art.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3>${art.Nom || "Sense nom"}</h3>
                        <p class="descripcio-text">${art.Descripcio || ""}</p>
                        <span class="preu-text">${art.Preu || "0"} €</span>
                    </div>
                </div>
            `;
        });
        if (contenidor) contenidor.innerHTML = html;
        if (titolHTML) titolHTML.innerText = catClau;
    }

    fetchAirtable();
});
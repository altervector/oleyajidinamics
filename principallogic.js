document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    function fetchAirtable() {
        // Procediment Cadi: Crida neta a la funció amb el paràmetre Categoria
        const url = `/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error " + response.status);
            return response.json();
        })
        .then(data => {
            // Procediment Cadi: Extreure records i processar
            const records = data.records || data;
            if (records && records.length > 0) {
                renderizarArticles(records);
            }
        })
        .catch(err => {
            console.error("Error:", err);
            if (titolHTML) titolHTML.innerText = "Error en carregar dades";
        });
    }

    function renderizarArticles(records) {
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        records.forEach(r => {
            const art = r.fields;
            // Procediment Cadi: Mapeig directe de camps i gestió de foto Array/String
            let foto = Array.isArray(art.Foto) ? art.Foto[0] : art.Foto;
            const imgPath = foto ? `${baseRuta}${foto}` : `${baseRuta}Default.png`;

            html += `
                <div class="targeta-producte">
                    <img src="${imgPath}" alt="${art.Nom}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3>${art.Nom}</h3>
                        <p>${art.Descripcio || ""}</p>
                        <span class="preu">${art.Preu} €</span>
                    </div>
                </div>`;
        });
        
        if (contenidor) contenidor.innerHTML = html;
        if (titolHTML) titolHTML.innerText = catClau;
    }

    fetchAirtable();
});
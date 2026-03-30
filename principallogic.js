document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    if (titolHTML) titolHTML.innerText = catClau;

    fetch(`/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`)
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(data => {
        const records = data.records || [];
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

        records.forEach(r => {
            const f = r.fields;
            
            // Si ve com a llista (Airtable a vegades ho fa) o com a text normal
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseRuta}${foto}` : `${baseRuta}Default.png`;

            html += `
                <div class="targeta-producte">
                    <img src="${imgPath}" alt="${f.Nom}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3>${f.Nom}</h3>
                        <p>${f.Descripcio || ""}</p>
                        <span class="preu">${f.Preu} €</span>
                    </div>
                </div>`;
        });
        
        if (contenidor) contenidor.innerHTML = html;
    })
    .catch(err => {
        if (contenidor) contenidor.innerHTML = "<p>Error de càrrega.</p>";
    });
});
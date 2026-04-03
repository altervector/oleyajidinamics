document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    if (titolHTML) titolHTML.innerText = catClau;

    // --- CANVI AQUÍ: Truquem al Worker de Cloudflare ---
    const workerURL = "https://oleyaji.altervector.workers.dev";
    
    fetch(`${workerURL}?Categoria=${encodeURIComponent(catClau)}`)
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(records => { // El Worker ja ens torna la llista directament
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

        // Si no hi ha plats, avisem
        if (!records || records.length === 0) {
            if (contenidor) contenidor.innerHTML = "<p>No s'han trobat articles en aquesta categoria.</p>";
            return;
        }

        records.forEach(r => {
            const f = r.fields;
            
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseRuta}${foto}` : `${baseRuta}Default.png`;

            html += `
                <div class="bloc-galeria-item">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p>${f.Descripcio || ""}</p>
                        <span class="preu">${f.Preu || "0"} €</span>
                    </div>
                </div>`;
        });
  
        if (contenidor) contenidor.innerHTML = html;
    })
    .catch(err => {
        console.error("Error detallat:", err);
        if (contenidor) contenidor.innerHTML = "<p>Error de càrrega: " + err.message + "</p>";
    });
});
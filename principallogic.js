document.addEventListener("DOMContentLoaded", async () => {
    const elTitol = document.getElementById("titol-categoria");
    const elCos = document.getElementById("cosgaleria");

    if (!elCos) return;

    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("Categoria");

    if (!categoria) {
        elTitol.innerText = "Error: Falta categoria";
        return;
    }

    elTitol.innerText = categoria;

    try {
        const resp = await fetch(`/.netlify/functions/get-articles?Categoria=${categoria}`);
        if (!resp.ok) throw new Error("Error en la resposta de la funció");
        
        const dades = await resp.json();

        if (!Array.isArray(dades) || dades.length === 0) {
            elCos.innerHTML = "<p>No hi ha articles disponibles.</p>";
            return;
        }

        let htmlFinal = "";
        dades.forEach(registre => {
            const f = registre.fields;
            
            // RUTA IMATGE: Carpeta images del teu GitHub Pages
            const imgUrl = f.Foto 
                ? `https://altervector.github.io/oleyajidinamics/images/${f.Foto}`
                : 'https://altervector.github.io/oleyajidinamics/images/placeholder.webp';

            htmlFinal += `
                <div class="targeta-producte">
                    <img src="${imgUrl}" alt="${f.Nom}" class="img-producte">
                    <div class="detalls-producte">
                        <h3>${f.Nom}</h3>
                        <p>${f.Descripcio || ""}</p>
                        <span class="preu">${f.Preu} €</span>
                    </div>
                </div>`;
        });

        elCos.innerHTML = htmlFinal;

    } catch (error) {
        elCos.innerHTML = `<p>Error de càrrega: ${error.message}</p>`;
    }
});
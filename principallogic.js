document.addEventListener("DOMContentLoaded", async () => {
    const elTitol = document.getElementById("titol-categoria");
    const elCos = document.getElementById("cosgaleria");

    if (!elCos) return;

    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("Categoria");

    if (!categoria) {
        elTitol.innerText = "Selecciona categoria";
        return;
    }

    elTitol.innerText = categoria;

    try {
        const resp = await fetch(`/.netlify/functions/get-articles?Categoria=${categoria}`);
        const dades = await resp.json();

        // COMPROVACIÓ: Ens assegurem que tenim un array abans de fer el forEach
        if (!Array.isArray(dades) || dades.length === 0) {
            elCos.innerHTML = "<p>No hi ha articles disponibles en aquesta categoria.</p>";
            return;
        }

        let htmlFinal = "";
        dades.forEach(registre => {
            const f = registre.fields;
            const imgUrl = f.Foto && f.Foto[0] ? f.Foto[0].url : 'https://via.placeholder.com/150';

            htmlFinal += `
                <div class="targeta-producte">
                    <div class="imatge-contenidor">
                        <img src="${imgUrl}" alt="${f.Nom}" class="img-producte">
                    </div>
                    <div class="detalls-producte">
                        <h3>${f.Nom}</h3>
                        <p class="descripcio-text">${f.Descripcio || ""}</p>
                        <div class="peu-producte">
                            <span class="preu-text">${f.Preu} €</span>
                        </div>
                    </div>
                </div>`;
        });

        elCos.innerHTML = htmlFinal;

    } catch (error) {
        elCos.innerHTML = "<p>Error en la connexió amb el servidor.</p>";
    }
});
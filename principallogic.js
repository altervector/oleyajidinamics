document.addEventListener("DOMContentLoaded", async () => {
    const elTitol = document.getElementById("titol-categoria");
    const elDesc = document.getElementById("descripcio-categoria");
    const elCos = document.getElementById("cosgaleria");

    if (!elCos) return;

    // 1. Obtenir la categoria de la URL (ex: ?Categoria=Begudes)
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("Categoria");

    if (!categoria) {
        elTitol.innerText = "Error";
        elCos.innerHTML = "<p>No s'ha seleccionat cap categoria.</p>";
        return;
    }

    // Posem el títol de la categoria mentre carreguem
    elTitol.innerText = categoria;

    try {
        // 2. Crida a la Netlify Function (el cambrer)
        // Nota: La ruta és relativa a la teva web de Netlify
        const resp = await fetch(`/.netlify/functions/get-articles?Categoria=${categoria}`);
        const dades = await resp.json();

        if (dades.length === 0) {
            elCos.innerHTML = "<p>No hi ha articles disponibles en aquesta categoria.</p>";
            return;
        }

        // 3. Pintar els productes
        let htmlFinal = "";

        dades.forEach(registre => {
            const f = registre.fields;
            // Validació de la imatge: si no n'hi ha, posem un placeholder
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
                </div>
            `;
        });

        elCos.innerHTML = htmlFinal;

    } catch (error) {
        console.error("Error:", error);
        elCos.innerHTML = "<p>Error en carregar la carta. Revisa la connexió.</p>";
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau || !contenidor) return;

    function fetchAirtable() {
        const url = `https://oleyaji.netlify.app/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.records) {
                renderitzaGaleria(data.records);
            }
        })
        .catch(err => console.error("Error:", err));
    }

    function renderitzaGaleria(records) {
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        records.forEach(r => {
            const art = r.fields;
            // Fem servir 'Foto' i 'Nom' que és el que tens a la taula Plats
            const imgPath = art.Foto ? `${baseRuta}${art.Foto}` : `${baseRuta}default.jpg`;
            
            html += `
                <div class="bloc-galeria-item" 
                    onclick="window.location.href='article.html?sub=${encodeURIComponent(art.Nom)}'"
                    style="cursor:pointer;">
                    <img src="${imgPath}" alt="${art.Nom}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="titol-item">${art.Nom}</div>
                </div>
            `;
        });
        
        contenidor.innerHTML = html;
        // Treiem estats de càrrega si n'hi hagués
        contenidor.classList.remove('esperant-validacio');
        contenidor.classList.add('revelat-final');
    }

    fetchAirtable();
});

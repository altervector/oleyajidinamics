document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    function fetchAirtable() {
        const url = `https://oleyaji.netlify.app/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.records) {
                processData(data.records);
            }
        })
        .catch(err => console.error("Error:", err));
    }

    function processData(records) {
        if (!records || records.length === 0) return;
        
        // Posem el nom de la categoria al títol de la web
        if (titolHTML) titolHTML.innerText = catClau;

        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        records.forEach(r => {
            const art = r.fields;
            // Fem servir 'Foto' i 'Nom' que és el que tens a la taula
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
    }

    fetchAirtable();
});
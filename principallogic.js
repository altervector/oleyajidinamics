document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const descHTML = document.getElementById("descripcio-categoria");

    // Efecte de càrrega visual
    if (titolHTML && contenidor) {
        titolHTML.classList.add('loading');
        contenidor.classList.add('esperant-validacio');
    }

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    function fetchAirtable() {
        const url = `https://oleyaji.netlify.app/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en la resposta");
            return response.json();
        })
        .then(data => {
            if (data && data.records) {
                processData(data.records);
                // Treure efecte de càrrega després de processar
                setTimeout(() => {
                    titolHTML.classList.remove('loading');
                    contenidor.classList.remove('esperant-validacio');
                    contenidor.classList.add('revelat-final');
                }, 1000); // Reduït a 1s perquè sigui més àgil
            }
        })
        .catch(err => {
            console.error("Error:", err);
            if (titolHTML) titolHTML.innerText = "Error en carregar";
        });
    }

    function processData(records) {
        if (!records || records.length === 0) return;
        const articles = records.map(r => r.fields);

        if (titolHTML) titolHTML.innerText = articles[0].Titol || "";
        if (descHTML) descHTML.innerText = articles[0].Descripcio || "";

        const uniques = [];
        const nomsVistos = new Set();

        articles.forEach(art => {
            let nomReal = Array.isArray(art.TitolSub) ? art.TitolSub[0] : art.TitolSub;
            if (nomReal && !nomsVistos.has(nomReal)) {
                nomsVistos.add(nomReal);
                let foto = Array.isArray(art.Subfoto) ? art.Subfoto[0] : art.Subfoto;
                uniques.push({ titol: nomReal, foto: foto });
            }
        });

        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";
        
        uniques.forEach(item => {
            const imgPath = item.foto ? `${baseRuta}${item.foto}` : `${baseRuta}default.jpg`;
            html += `
                <div class="bloc-galeria-item" 
                    onclick="window.location.href='article.html?Categoria=${catClau}&sub=${encodeURIComponent(item.titol)}'"
                    style="cursor:pointer;">
                    <img src="${imgPath}" alt="${item.titol}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="titol-item">${item.titol}</div>
                </div>
            `;
        });
        contenidor.innerHTML = html;
    }

    fetchAirtable();
});

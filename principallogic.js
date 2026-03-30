document.addEventListener('DOMContentLoaded', () => {
    const contenidor = document.getElementById("cosgaleria");
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('Categoria');

    if (!cat || !contenidor) return;

    // Crida a la teva URL de Netlify
    fetch(`https://oleyaji.netlify.app/.netlify/functions/get-articles?Categoria=${encodeURIComponent(cat)}`)
        .then(res => res.json())
        .then(records => {
            let html = '';
            const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

            records.forEach(r => {
                const f = r.fields;
                // Si a Airtable la columna es diu 'Foto', la busca. Si no, posa la per defecte.
                const img = f.Foto ? `${baseRuta}${f.Foto}` : `${baseRuta}default.jpg`;
                
                html += `
                    <div class="bloc-galeria-item" onclick="window.location.href='article.html?sub=${encodeURIComponent(f.Nom)}'">
                        <img src="${img}" alt="${f.Nom}" onerror="this.src='${baseRuta}Default.png'">
                        <div class="titol-item">${f.Nom || 'Sense nom'}</div>
                    </div>`;
            });

            contenidor.innerHTML = html || '<p>No hi ha plats en aquesta categoria.</p>';
            contenidor.classList.add('revelat-final');
        })
        .catch(err => {
            console.error("Error:", err);
            contenidor.innerHTML = '<p>Error en carregar el menú.</p>';
        });
});

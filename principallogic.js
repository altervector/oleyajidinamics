document.addEventListener('DOMContentLoaded', () => {
    const contenidor = document.getElementById("cosgaleria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria');

    if (!catClau || !contenidor) return;

    fetch(`https://oleyaji.netlify.app/.netlify/functions/get-articles?Categoria=${encodeURIComponent(catClau)}`)
        .then(res => res.json())
        .then(records => {
            let html = '';
            const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

            records.forEach(r => {
                const f = r.fields;
                // Usem 'Foto' i 'Nom' de la teva taula
                const imgNom = f.Foto ? f.Foto : 'default.jpg';
                const imgPath = `${baseRuta}${imgNom}`;
                
                html += `
                    <div class="bloc-galeria-item" onclick="window.location.href='article.html?sub=${encodeURIComponent(f.Nom)}'">
                        <img src="${imgPath}" alt="${f.Nom}" onerror="this.src='${baseRuta}Default.png'">
                        <div class="titol-item">${f.Nom}</div>
                    </div>`;
            });

            contenidor.innerHTML = html || '<p style="text-align:center; width:100%;">No hi ha plats disponibles en aquesta categoria.</p>';
            contenidor.classList.add('revelat-final');
        })
        .catch(err => {
            console.error(err);
            contenidor.innerHTML = '<p>Error en carregar el menú.</p>';
        });
});
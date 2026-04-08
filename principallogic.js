// 1. FORÇAR RECARREGA DEL CSS
(function() {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.rel === "stylesheet" && link.href.includes("estils.css")) {
            link.href = link.href.split('?')[0] + '?v=' + Date.now();
        }
    }
})();

// 2. VARIABLES D'ESTAT I MODAL
// Canvia la línia 14 per això:
let socAdmin = sessionStorage.getItem('adminMode') === 'true';
const modalHTML = `
    <div id="modal-detall">
        <span class="tancar-modal" onclick="tancarModal()">&times;</span>
        <div class="modal-contingut" id="contingut-dinamic-modal"></div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

window.tancarModal = function() {
    document.getElementById('modal-detall').style.display = 'none';
}

// 3. CÀRREGA DE DADES (EL BUCLE)
document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;
    if (titolHTML) {
        titolHTML.innerText = catClau;
        titolHTML.classList.add('loading'); 
    }

    const workerURL = "https://oleyaji.altervector.workers.dev";
    
    fetch(`${workerURL}?Categoria=${encodeURIComponent(catClau)}`)
    .then(response => response.json())
    .then(records => { 
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

        records.forEach(r => {
            const f = r.fields;
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseRuta}${foto}` : `${baseRuta}Default.png`;
            
            // LÒGICA DE VISIBILITAT: Si no és visible i no som admin, no el pintem
            const esVisible = f.Visible === true;
            if (!esVisible && !socAdmin) return; 

            const classeExtra = esVisible ? '' : 'item-ocult';

            html += `
                <div class="bloc-galeria-item ${classeExtra}" onclick="obrirModal('${r.id}','${f.Nom || 'Plat'}', '${imgPath}', \`${f.Descripcio || ''}\`, '${f.Preu || '0'}', ${esVisible})">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p>${f.Descripcio || ""}</p>
                        <span class="preu">${f.Preu || "0"} €</span>
                    </div>
                </div>`;
        });
  
        if (contenidor) contenidor.innerHTML = html;
        if (titolHTML) titolHTML.classList.remove('loading');
    });

    // Activem el detector del Logo per entrar en mode Admin
    iniciarDetectorLogo();
});



                   //     MODAL    

window.obrirModal = function(idAirtable, nom, foto, desc, preu) {
    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    contingut.innerHTML = `
        <img src="${foto}" alt="${nom}" style="width:100%; height:250px; object-fit:cover; border-radius:10px 10px 0 0;">
        <div style="padding:20px; text-align:left;">
            <h2 style="margin:0; color:#191970; font-size:22px;">${nom}</h2>
            <p style="color:#666; margin:15px 0; line-height:1.5; font-size:15px;">${desc}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <span style="font-size:22px; font-weight:bold; color:#191970;">${preu} €</span>
                <button onclick="tancarModal()" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">Tancar</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

window.tancarModal = function() {
    const modal = document.getElementById('modal-detall');
    if (modal) modal.style.display = 'none';
};

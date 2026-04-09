//////////////////////////////////////////////////// 1. FORÇAR RECARREGA DEL CSS    //////////////////////////////
(function() {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.rel === "stylesheet" && link.href.includes("estils.css")) {
            link.href = link.href.split('?')[0] + '?v=' + Date.now();
        }
    }
})();

////////////////////////////////////////////////////   2. VARIABLES D'ESTAT I MODAL    ///////////////////////////////


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

////////////////////////////////////////////////////// 3. CÀRREGA DE DADES (EL BUCLE)   ///////////////////////////

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
                <div class="bloc-galeria-item ${classeExtra}" onclick="obrirModal('${r.id}', '${(f.Nom || 'Plat').replace(/'/g, "\\'")}', '${imgPath}', '${(f.Descripcio || "").replace(/'/g, "\\'")}', '${f.Preu || '0'}', ${esVisible})">
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


  ////////////////////////////////////////////////     MODAL    /////////////////////////////////////////////

window.obrirModal = function(idAirtable, nom, foto, desc, preu, esVisible) {

    const params = new URLSearchParams(window.location.search); // <--- AFEGEIX AIXÒ
    const catClau = params.get('Categoria') || '';              // <--- I AIXÒ
    
    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    if (socAdmin) {
        // MODE ADMIN: Formulari editable
        modal.style.backgroundColor = "rgba(255, 140, 0, 0.5)"; // Fons Taronja
        contingut.innerHTML = `
            <img src="${foto}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
            <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="edit-nom" value="${nom}" placeholder="Nom del plat" style="width:100%; padding:8px; border:1px solid #ccc;">
                <textarea id="edit-desc" placeholder="Descripció" style="width:100%; height:80px; padding:8px; border:1px solid #ccc;">${desc}</textarea>
                <input type="number" id="edit-preu" value="${preu}" placeholder="Preu" style="width:100%; padding:8px; border:1px solid #ccc;">
                
                <div style="margin:10px 0; display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="edit-visible" ${esVisible ? 'checked' : ''}>
                    <label>Visible a la web</label>
                </div>

                    <div style="margin:10px 0; display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:12px; color:#666;">Categoria:</label>
                    <input type="text" id="edit-categoria" value="${catClau}" style="width:100%; padding:8px; border:1px solid #ccc;">
                    </div>

                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button onclick="tancarModal()" style="padding:8px 15px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Cancel·lar</button>
                    <button onclick="guardarCanvis('${idAirtable}')" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">GUARDAR</button>
                </div>
            </div>
        `;
    } else {
        // MODE NORMAL: El teu codi original intacte
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Fons Negre Client
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
    }
    
    modal.style.display = 'flex';
};

window.tancarModal = function() {
    const modal = document.getElementById('modal-detall');
    if (modal) modal.style.display = 'none';
};

////////////////////////////////////////////////     GUARDAR CANVIS MODE EDICIO  ///////////////////////////////////////////////

window.guardarCanvis = function(idAirtable) {
    // 1. Recollim les dades dels inputs del modal
        const dades = {
                id: idAirtable,
                "Nom": document.getElementById('edit-nom').value,
                "Descripcio": document.getElementById('edit-desc').value,
                "Preu": document.getElementById('edit-preu').value,
                "Visible": document.getElementById('edit-visible').checked,
                "Categoria": [document.getElementById('edit-categoria').value] // Airtable sol esperar un Array per a les categories
            };

    console.log("Enviant canvis a Pipedream:", dades);

    // 2. Enviament (aquí posarem la teva URL de Pipedream)
    fetch('https://eo9kzqd94eu875w.m.pipedream.net', {
        method: 'POST',
        body: JSON.stringify(dades)
    })
    .then(response => {
        if (response.ok) {
            alert("Guardat correctament! Refresca per veure els canvis.");
            tancarModal();
        } else {
            alert("Error al guardar.");
        }
    })
    .catch(error => console.error('Error:', error));
};
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
            
            const esVisible = f.Visible === true;
            if (!esVisible && !socAdmin) return; 

            const classeExtra = esVisible ? '' : 'item-ocult';

            html += `
                <div class="bloc-galeria-item ${classeExtra}" 
                    onclick="obrirModal('${r.id}', '${imgPath}', ${esVisible}, this)">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p class="desc-text">${f.Descripcio || ""}</p>
                        <span class="preu-text">${f.Preu || "0"}</span> €
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

////////////////////////////////////////////////    MODAL I PREVISUALITZACIÓ    /////////////////////////////////////////////

window.obrirModal = function(idAirtable, foto, esVisible, el) {
    // 1. Extracció de dades de l'element clicat (seguretat total contra cometes)
    const nom = el.querySelector('.titol-item').innerText;
    const desc = el.querySelector('.desc-text').innerText;
    const preu = el.querySelector('.preu-text').innerText;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('Categoria') || '';

    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    if (socAdmin) {
        // MODE ADMIN: Amb botó de canviar foto i camps editables
        modal.style.backgroundColor = "rgba(255, 140, 0, 0.5)";
        contingut.innerHTML = `
            // //////////////////////////////////////////////////PEGA ESTO EN SU LUGAR:
                    <div style="position:relative;" id="container-foto-admin">
                        <img id="preview-foto" src="${foto}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
                        
                        <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; font-family:sans-serif;">
                            📷 CANVIAR FOTO
                        </label>
                        
                        <input type="file" id="upload-foto" style="display:none;" accept="image/*" 
                            onchange="window.prepararSubidaFoto(this, '${idAirtable}')">
                    </div>
            <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="edit-nom" value="${nom}" placeholder="Nom">
                <textarea id="edit-desc" style="width:100%; height:80px;">${desc}</textarea>
                <input type="number" id="edit-preu" value="${preu}" step="0.01">
                
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="edit-visible" ${esVisible ? 'checked' : ''}>
                    <label>Visible a la web</label>
                </div>

                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:12px; color:#666;">Categoria:</label>
                    <input type="text" id="edit-categoria" value="${categoriaActual}">
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button onclick="tancarModal()" style="padding:8px 15px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Cancel·lar</button>
                    <button onclick="guardarCanvis('${idAirtable}')" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">GUARDAR</button>
                </div>
            </div>
        `;
    } else {
        // MODE NORMAL: Disseny per al client
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
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

// Funció per previsualitzar la imatge abans de pujar-la
window.prepararSubidaFoto = function(input, idAirtable) {
    if (input.files && input.files[0]) {
        const arxiu = input.files[0];
        const nomOriginal = arxiu.name; // Capturamos el nombre real
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview-foto');
            const btnAccion = document.getElementById('btn-foto-accion');
            
            if (preview && btnAccion) {
                // 1. Mostrar la foto nueva en el modal
                preview.src = e.target.result;
                
                // 2. Transformar el botón
                btnAccion.innerHTML = "💾 GUARDAR FOTO";
                btnAccion.style.background = "#28a745"; // Color verde
                
                // 3. Quitar el comportamiento de "abrir archivo"
                btnAccion.removeAttribute('for');
                
                // 4. Asignar la función de subida real para cuando se pulse
                btnAccion.onclick = function() {
                    // Aquí llamaremos a la subida (la definiremos en el siguiente paso)
                    console.log("Subiendo foto:", nomOriginal);
                    window.executarSubidaFoto(idAirtable, e.target.result, nomOriginal);
                };
            }
        };
        reader.readAsDataURL(arxiu);
    }
};

window.tancarModal = function() {
    const modal = document.getElementById('modal-detall');
    if (modal) modal.style.display = 'none';
};

////////////////////////////////////////////////     GUARDAR CANVIS MODE EDICIO  ///////////////////////////////////////////////

window.guardarCanvis = function(idAirtable) {
    // 1. Busquem si hi ha una foto nova previsualitzada (dataset.base64)
    const previewImg = document.getElementById('preview-foto');
    const fotoBase64 = previewImg ? previewImg.dataset.base64 : null;

    // 2. Recollim les dades (EL TEU CODI ORIGINAL AMB ELS FORMATS CORRECTES)
    const dades = {
        id: idAirtable,
        "Nom": document.getElementById('edit-nom').value.trim(),
        "Descripcio": document.getElementById('edit-desc').value.trim(),
        "Preu": parseFloat(document.getElementById('edit-preu').value.replace(',', '.')), 
        "Visible": document.getElementById('edit-visible').checked,
        "Categoria": [document.getElementById('edit-categoria').value.trim()],
        "FotoBase64": fotoBase64, // Nova dada per Pipedream
        "NomArxiu": fotoBase64 ? `foto_${idAirtable}.webp` : null // Suggeriment de nom
    };

    // RESTAURAT: El console.log que t'agrada, però simplificat per no omplir la pantalla si hi ha Base64
    console.log("Enviant canvis a Pipedream:", { ...dades, "FotoBase64": fotoBase64 ? "IMATGE_DETECTADA" : "SENSE_CANVIS" });

    // 3. Enviament a la teva URL de Pipedream
    fetch('https://eo9kzqd94eu875w.m.pipedream.net', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dades)
    })
    .then(response => {
        if (response.ok) {
            console.log("Resposta Pipedream: OK");
            alert("Guardat correctament! Refresca per veure els canvis.");
            tancarModal();
            location.reload(); 
        } else {
            console.error("Error a la resposta de Pipedream");
            alert("Error al guardar.");
        }
    })
    .catch(error => console.error('Error crític en el fetch:', error));
};
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
        
        // --- CONFIGURACIÓ RUTES IMATGES ---
        const baseCloudy = "https://res.cloudinary.com/deopqx65a/image/upload/f_auto,q_auto/";
        const fotoDefault = "https://altervector.github.io/oleyajidinamics/images/Default.png";

        records.forEach(r => {
            const f = r.fields;
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            
            // Si hi ha nom a Airtable -> Cloudinary. Si no -> Default GitHub
            const imgPath = foto ? `${baseCloudy}${foto}` : fotoDefault;
            
            const esVisible = f.Visible === true;
            if (!esVisible && !socAdmin) return; 

            const classeExtra = esVisible ? '' : 'item-ocult';

            html += `
                <div class="bloc-galeria-item ${classeExtra}" 
                    onclick="obrirModal('${r.id}', '${imgPath}', ${esVisible}, this)">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${fotoDefault}'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p class="desc-text">${f.Descripcio || ""}</p>
                        <span class="preu-text">${f.Preu || "0"}</span> €
                    </div>
                </div>`;
        });
  
        if (contenidor) contenidor.innerHTML = html;
        if (titolHTML) titolHTML.classList.remove('loading');
    })
    .catch(err => {
        console.error("Error carregant dades:", err);
        if (titolHTML) titolHTML.innerText = "Error al carregar";
    });

    // Activem el detector del Logo per entrar en mode Admin
        if (typeof iniciarDetectorLogo === "function") iniciarDetectorLogo();

            // --- NUEVO: BOTÓN FLOTANTE PARA AÑADIR ---
            // --- BOTÓN FLOTANTE AJUSTADO AL CENTRO ---
                    if (socAdmin) {
                        const btnAfegir = `
                            <div id="btn-nou-plat" onclick="window.obrirModalNuevo()" 
                                style="position:fixed; bottom:20px; left:50%; transform:translateX(130px); width:60px; height:60px; background:#28a745; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; cursor:pointer; z-index:9999; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-family: sans-serif;">
                                +
                            </div>`;
                        document.body.insertAdjacentHTML('beforeend', btnAfegir);
                    }
        });


////////////////////////////////////////////////    MODAL I PREVISUALITZACIÓ    /////////////////////////////////////////////

window.obrirModal = function(idAirtable, foto, esVisible, el) {
    const nom = el.querySelector('.titol-item').innerText;
    const desc = el.querySelector('.desc-text').innerText;
    const preu = el.querySelector('.preu-text').innerText;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('Categoria') || '';

    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    if (socAdmin) {
        modal.style.backgroundColor = "rgba(255, 140, 0, 0.5)";
        contingut.innerHTML = `
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

window.prepararSubidaFoto = function(input, idAirtable) {
    if (input.files && input.files[0]) {
        const arxiu = input.files[0];
        const nomOriginal = arxiu.name; 
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview-foto');
            const btnAccion = document.getElementById('btn-foto-accion');
            if (preview && btnAccion) {
                preview.src = e.target.result;
                btnAccion.innerHTML = "💾 GUARDAR FOTO";
                btnAccion.style.background = "#28a745"; 
                btnAccion.removeAttribute('for');
                btnAccion.onclick = function() {
                    window.executarSubidaFoto(idAirtable, e.target.result, nomOriginal);
                };
            }
        };
        reader.readAsDataURL(arxiu);
    }
};

////////////////////////////////////////////////     GUARDAR CANVIS MODE EDICIO  ///////////////////////////////////////////////

window.guardarCanvis = function(idAirtable) {
    const idReal = (idAirtable === "null" || !idAirtable) ? null : idAirtable;
    
    // Recollim dades bàsiques
    const dades = {
        id: idReal,
        "Nom": document.getElementById('edit-nom').value.trim(),
        "Descripcio": document.getElementById('edit-desc').value.trim(),
        "Preu": parseFloat(document.getElementById('edit-preu').value.replace(',', '.')) || 0, 
        "Visible": document.getElementById('edit-visible').checked,
        "Categoria": [document.getElementById('edit-categoria').value.trim()]
    };

    // Si és un plat nou, afegim la foto si se n'ha pujat una
    if (!idReal) {
        const fotoNova = document.getElementById('nombre-foto-nueva').value;
        if (fotoNova) {
            dades["Foto"] = fotoNova;
        }
    }

    // Validació mínima
    if (!dades.Nom) { alert("El nom és obligatori"); return; }

    fetch('https://oleyaji.altervector.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dades)
    })
    .then(response => {
        if (response.ok) {
            alert(idReal ? "Guardat correctament!" : "Nou plat creat amb èxit!");
            tancarModal();
            location.reload(); 
        } else {
            alert("Error en l'operació.");
        }
    })
    .catch(error => console.error('Error:', error));
};

////////////////////////////////////////    GUARDAR FOTO    ///////////////////////////////////////////

window.executarSubidaFoto = async function(idAirtable, base64, nomOriginal) {
    const btnAccion = document.getElementById('btn-foto-accion');
    btnAccion.innerHTML = "⏳ OPTIMITZANT...";
    btnAccion.style.pointerEvents = "none";
    btnAccion.style.background = "#ffc107";

    try {
        const img = new Image();
        img.src = base64;
        await img.decode();
        
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1080;

        if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));

        btnAccion.innerHTML = "🚀 PUJANT...";
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', 'ml_default'); 
        
        const nomNet = nomOriginal.split('.')[0].replace(/\s+/g, '_') + "_" + Date.now();
        formData.append('public_id', nomNet); 

        const resCloudy = await fetch('https://api.cloudinary.com/v1_1/deopqx65a/image/upload', {
            method: 'POST',
            body: formData
        });
        
        const dataCloudy = await resCloudy.json();

        if (dataCloudy.secure_url) {
            const nomFinal = dataCloudy.public_id + "." + dataCloudy.format;

            // SI HAY ID: Actualizamos Airtable directamente (como ayer)
            if (idAirtable && idAirtable !== "null") {
                btnAccion.innerHTML = "📝 ACTUALITZANT...";
                await fetch('https://oleyaji.altervector.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: idAirtable, Foto: nomFinal })
                });
            } else {
                // SI NO HAY ID (Plato nuevo): Guardamos el nombre en el campo oculto
                document.getElementById('nombre-foto-nueva').value = nomFinal;
            }

            btnAccion.innerHTML = "✅ FOTO PREPARADA";
            btnAccion.style.background = "#28a745";
            alert("Imatge a punt! Ara omple los dades i dóna-li a Crear.");
        }
    } catch (error) {
        console.error("Error:", error);
        btnAccion.innerHTML = "❌ ERROR";
        btnAccion.style.pointerEvents = "auto";
        btnAccion.style.background = "#dc3545";
    }
};
///////////////////////////////////////////////     MODAL BLANC   ////////////////////////

window.obrirModalNuevo = function() {
    const fotoDefault = "https://altervector.github.io/oleyajidinamics/images/Default.png";
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('Categoria') || '';

    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    
    if (!contingut || !modal) return;

    modal.style.backgroundColor = "rgba(40, 167, 69, 0.8)"; 
    
    contingut.innerHTML = `
        <div style="position:relative;" id="container-foto-admin">
            <img id="preview-foto" src="${fotoDefault}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
            <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                📷 SELECCIONAR FOTO
            </label>
            <input type="file" id="upload-foto" style="display:none;" accept="image/*" 
                onchange="window.prepararSubidaFoto(this, null)">
        </div>

        <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
            <h2 style="margin:0; color:#28a745; font-size:18px;">Nuevo Plato en ${categoriaActual}</h2>
            
            <input type="text" id="edit-nom" placeholder="Nombre del plato" style="padding:8px; border:1px solid #ddd; border-radius:5px;">
            <textarea id="edit-desc" style="width:100%; height:70px; padding:8px; border:1px solid #ddd; border-radius:5px;" placeholder="Descripción"></textarea>
            <input type="number" id="edit-preu" placeholder="Precio (0.00)" step="0.01" style="padding:8px; border:1px solid #ddd; border-radius:5px;">
            
            <input type="hidden" id="nombre-foto-nueva" value="">
            
            <input type="hidden" id="edit-categoria" value="${categoriaActual}">

            <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="edit-visible" checked>
                <label>Visible en la web</label>
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <button onclick="tancarModal()" style="padding:10px 15px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Cancelar</button>
                <button id="btn-crear-final" onclick="guardarCanvis(null)" style="padding:10px 15px; background:#28a745; color:#fff; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">CREAR PLATO</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
};
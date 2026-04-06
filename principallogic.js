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
let socAdmin = false;
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

// 4. FUNCIÓ MODAL (EL TEU NOU MODAL)
window.obrirModal = function(idAirtable, nom, foto, desc, preu, is_visible) {
    const contingut = document.getElementById('contingut-dinamic-modal');
    // ... (la teva lògica d'obertura)
    
    contingut.innerHTML = `
        <img id="foto-modal-img" src="${foto}" style="width:100%; height:250px; object-fit:cover;">
        <div style="padding:20px;">
            <h2 id="nom-edit" data-id="${idAirtable}">${nom}</h2>
            <p id="desc-edit">${desc}</p>
            <span><span id="preu-edit">${preu}</span> €</span>
            
            <div id="admin-extra" style="display:none; margin-top:15px; border-top:1px solid #ccc; padding-top:10px;">
                <label><input type="checkbox" id="visible-edit" ${is_visible ? 'checked' : ''}> Visible</label>
                <input type="text" id="foto-url-edit" value="${foto}" style="width:100%; margin-top:5px;">
                <button id="btn-guardar-admin" style="width:100%; margin-top:10px; background:orange;">GUARDAR</button>
            </div>
            
            <button onclick="tancarModal()">Tancar</button>
        </div>
    `;
    
    // Si venim de ME (Mode Edició), els fem visibles
    if (window.modeEdicio) activarInterficieAdmin();
};

// 5. DETECTORS I MODE ADMIN
function iniciarDetectorLogo() {
    const logo = document.querySelector('.logo img') || document.querySelector('.logo'); // Busca el teu logo
    if (!logo) return;
    let timer;

    logo.addEventListener('mousedown', () => {
        timer = setTimeout(() => {
            const pass = prompt("Contrasenya d'administrador:");
            if (pass === "1234") {
                socAdmin = true;
                document.body.classList.add('admin-mode-active');
                alert("Mode Admin Activat. Ara veus tot el menú.");
                location.reload(); // Recarreguem per forçar el bucle a mostrar els ocults
            }
        }, 4000);
    });
    logo.addEventListener('mouseup', () => clearTimeout(timer));
}

function activarModeEdicio() {
    ['nom-edit', 'desc-edit', 'preu-edit'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.contentEditable = "true";
            el.style.outline = "2px dashed orange";
        }
    });
    const ctrl = document.getElementById('admin-controls');
    const btn = document.getElementById('btn-guardar-admin');
    if (ctrl) ctrl.style.display = "block";
    if (btn) btn.style.display = "block";
}

// 6. PERSISTÈNCIA (PIPEDREAM)
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'btn-guardar-admin') {
        const boto = e.target;
        const idAirtable = document.getElementById('nom-edit').dataset.id;
        const nouNom = document.getElementById('nom-edit').innerText.trim();
        const novaDesc = document.getElementById('desc-edit').innerText.trim();
        const nouPreu = document.getElementById('preu-edit').innerText.replace(',', '.').trim();
        const esVisible = document.getElementById('visible-edit').checked;

        if (isNaN(parseFloat(nouPreu))) return alert("Preu no vàlid");

        const dades = {
            id: idAirtable,
            fields: { "Nom": nouNom, "Descripcio": novaDesc, "Preu": parseFloat(nouPreu), "Visible": esVisible }
        };

        try {
            boto.disabled = true;
            boto.innerText = "Sincronitzant...";
            await fetch('https://eo9kzqd94eu875w.m.pipedream.net', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dades)
            });
            alert("✓ Guardat!");
            location.reload();
        } catch (error) {
            alert("Error de connexió");
            boto.disabled = false;
        }
    }
});
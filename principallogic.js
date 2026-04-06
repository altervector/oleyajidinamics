// FORÇAR RECARREGA DEL CSS (Cache Busting)
(function() {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.rel === "stylesheet" && link.href.includes("estils.css")) {
            link.href = link.href.split('?')[0] + '?v=' + Date.now();
        }
    }
})();

// Creem el div del modal dinàmicament al final del body
const modalHTML = `
    <div id="modal-detall">
        <span class="tancar-modal" onclick="tancarModal()">&times;</span>
        <div class="modal-contingut" id="contingut-dinamic-modal">
            </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Funció per tancar
window.tancarModal = function() {
    document.getElementById('modal-detall').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;

    // --- SPINNER: El posem al principi ---
    if (titolHTML) {
        titolHTML.innerText = catClau;
        titolHTML.classList.add('loading'); 
    }

    const workerURL = "https://oleyaji.altervector.workers.dev";
    
    fetch(`${workerURL}?Categoria=${encodeURIComponent(catClau)}`)
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(records => { 
        let html = '';
        const baseRuta = "https://altervector.github.io/oleyajidinamics/images/";

        if (!records || records.length === 0) {
            if (contenidor) contenidor.innerHTML = "<p>No s'han trobat articles en aquesta categoria.</p>";
            if (titolHTML) titolHTML.classList.remove('loading'); // SPINNER
            return;
        }

        records.forEach(r => {
            const f = r.fields;
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseRuta}${foto}` : `${baseRuta}Default.png`;

            html += `
                <div class="bloc-galeria-item" onclick="obrirModal('${r.id}','${f.Nom || 'Plat'}', '${imgPath}', \`${f.Descripcio || ''}\`, '${f.Preu || '0'}')">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p>${f.Descripcio || ""}</p>
                        <span class="preu">${f.Preu || "0"} €</span>
                    </div>
                </div>`;
        });
  
        if (contenidor) contenidor.innerHTML = html;

        // --- SPINNER: El treiem quan ja hem pintat tot ---
        if (titolHTML) titolHTML.classList.remove('loading');
    })
    .catch(err => {
        console.error("Error detallat:", err);
        if (contenidor) contenidor.innerHTML = "<p>Error de càrrega: " + err.message + "</p>";
        if (titolHTML) titolHTML.classList.remove('loading'); // SPINNER
    });
});

// FUNCIÓ MODAL (FORA)
window.obrirModal = function(idAirtable, nom, foto, desc, preu) {
    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    contingut.innerHTML = `
        <img id="foto-edit" src="${foto}" style="width:100%; height:250px; object-fit:cover;">
        
        <div style="padding:20px; text-align:left;">
            <h2 id="nom-edit" data-id="${idAirtable}" style="margin:0; color:#191970; font-size:22px;">${nom}</h2>
            <p id="desc-edit" style="color:#666; margin:15px 0; line-height:1.5; font-size:15px;">${desc}</p>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <span style="font-size:22px; font-weight:bold; color:#191970;"><span id="preu-edit">${preu}</span> €</span>
                <button onclick="tancarModal()" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">Tancar</button>
            </div>

            <button id="btn-guardar-admin" style="display:none; width:100%; margin-top:20px; padding:10px; background:green; color:white; border:none; border-radius:5px;">
                CONFIRMAR CANVIS
            </button>
        </div>
    `;
    modal.style.display = 'flex';

   
   
   
    // Iniciem el detector de 3 segons sobre la foto que acabem de crear
    iniciarDetectorAdmin();
};
function iniciarDetectorAdmin() {
    const foto = document.getElementById('foto-edit');
    let timer;

    const start = () => {
        timer = setTimeout(() => {
            if (confirm("Vols activar el mode edició?")) {
                const pass = prompt("Contrasenya:");
                if (pass === "1234") activarModeEdicio();
            }
        }, 3000);
    };

    const stop = () => clearTimeout(timer);

    foto.addEventListener('mousedown', start);
    foto.addEventListener('touchstart', start);
    foto.addEventListener('mouseup', stop);
    foto.addEventListener('touchend', stop);
}

function activarModeEdicio() {
    // Fem editables els camps
    ['nom-edit', 'desc-edit', 'preu-edit'].forEach(id => {
        const el = document.getElementById(id);
        el.contentEditable = "true";
        el.style.outline = "2px dashed orange";
    });
    // Mostrem el botó de guardar
    document.getElementById('btn-guardar-admin').style.display = "block";
}



// --- LOGICA DE PERSISTÈNCIA (ENVIAMENT A PIPEDREAM) ---

document.addEventListener('click', async (e) => {
    // Només executem si el clic és al botó de guardar del modal
    if (e.target && e.target.id === 'btn-guardar-admin') {
        const boto = e.target;
        
        // 1. Extracció de dades (Agafem el que el "jefe" ha escrit)
        const idAirtable = document.getElementById('nom-edit').dataset.id;
        const nouNom = document.getElementById('nom-edit').innerText.trim();
        const novaDesc = document.getElementById('desc-edit').innerText.trim();
        let nouPreu = document.getElementById('preu-edit').innerText.replace(',', '.').trim();

        // 2. Validació preventiva (Evitem que Airtable ens rebutgi la dada)
        if (!idAirtable) {
            alert("Error: No s'ha trobat la ID del plat.");
            return;
        }
        
        const preuNumeric = parseFloat(nouPreu);
        if (isNaN(preuNumeric)) {
            alert("Error: El preu ha de ser un número (ex: 12.50). No posis el símbol €.");
            return;
        }

        // Preparem el "paquet" (JSON)
        const dades = {
            id: idAirtable,
            fields: {
                "Nom": nouNom,
                "Descripcio": novaDesc,
                "Preu": preuNumeric
            }
        };

        try {
            // Feedback visual: bloquegem el botó mentre s'envia
            boto.disabled = true;
            boto.innerText = "Sincronitzant...";

            // 3. El "xut" a Pipedream
            const response = await fetch('https://eo9kzqd94eu875w.m.pipedream.net', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dades)
            });

            if (response.ok) {
                alert("✓ Canvis guardats correctament a Airtable.");
                location.reload(); // Recarreguem la pàgina per veure els canvis reals
            } else {
                throw new Error("Error en la resposta del servidor.");
            }
        } catch (error) {
            console.error("Fallada de xarxa:", error);
            alert("No s'ha pogut connectar amb el servidor. Reintenta-ho.");
            boto.disabled = false;
            boto.innerText = "REINTENTAR";
        }
    }
});
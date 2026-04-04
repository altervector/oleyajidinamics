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





const htmlBotiga = `
<div class="bloc-imatges">
    <div class="columna-esquerra">
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Begudes" class="enllac-imatge-fix"> 
            <img src="https://altervector.github.io/oleyajidinamics/images/PicBloc1.webp" alt="Begudes" class="imatge-petita">
            <span class="etiqueta-categoria">Begudes</span>
        </a>
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Postres" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/oleyajidinamics/images/PicBloc2.webp" alt="Postres" class="imatge-petita">
            <span class="etiqueta-categoria">Postres</span>
        </a>
    </div>
    <div class="imatge-dreta">
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Plats" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/oleyajidinamics/images/PicBloc3.webp" alt="Plats" class="imatge-petita">
            <span class="etiqueta-categoria">Plats</span>
        </a>
    </div>
</div>
<div class="bloc-imatge-inferior">
    <a href="https://www.google.com/maps/search/?api=1&query=OLÉ+Y+AJÍ+COMIDA+MEDITERRANEA+Y+LATINA+Vilafranca" target="_blank" class="enllac-imatge-fix item-horizontal">
        <img src="https://altervector.github.io/oleyajidinamics/images/PicBloc4.webp" alt="On som..." class="imatge-petita">
        <span class="etiqueta-categoria">On som (Maps)</span>
    </a>
</div>
<p style="max-width:400px; width:90%; margin: 10px auto 10px auto; font-size: 14px; color:#555; text-align: center;">
    <em>Servicio a domicilio disponible <br><span style="display:block; text-align:center;">...</span></em>
</p>
`;

// SEGURETAT: Esperem que el document estigui llest
document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById('contingut-botiga');
    if (el) {
        el.innerHTML = htmlBotiga;
    }
});


// Injectem tot el bloc al "forat" de l'HTML
document.getElementById('contingut-botiga').innerHTML = htmlBotiga;

// 1. Definim la data de tall (any, mes -1, dia) 
// Nota: El gener és 0, el febrer 1, el març 2, l'abril 3, el maig 4...
const DATA_CADUCITAT = new Date(2026, 4, 8); // Això és l'8 de Maig de 2026

// 2. La línia que em demanaves: Comparem "ARA" amb la "DATA DE TALL"
const MOSTRAR_BLOQUEIG = new Date() > DATA_CADUCITAT;

if (MOSTRAR_BLOQUEIG) {
    document.addEventListener('DOMContentLoaded', function() {
        const capaProhibida = document.createElement('div');
        capaProhibida.id = 'capa-bloqueig-net';
        
        capaProhibida.innerHTML = `
            <style>
                #capa-bloqueig-net {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    /* FONS: Transparent amb difuminat molt suau */
                    background: rgba(255, 255, 255, 0.2); 
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                    z-index: 100000; display: flex; align-items: center; justify-content: center;
                    pointer-events: all; padding: 20px;
                }

                .caixa-neta-glass {
                    /* EL MISSATGE: Molt més bofegat (blur 15px) i Ataronjat mel */
                    background: rgba(255, 240, 220, 0.75); 
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    
                    padding: 50px; border-radius: 20px; text-align: center;
                    max-width: 420px; width: 100%;
                    box-shadow: 0 15px 45px rgba(211, 84, 0, 0.15);
                    border: 1px solid rgba(211, 84, 0, 0.2);
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }

                .caixa-neta-glass h2 { 
                    color: #d35400; 
                    margin-top: 0; font-size: 1.7rem; font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .caixa-neta-glass p { 
                    color: #333; line-height: 1.6; font-size: 1.05rem; 
                    margin-bottom: 20px;
                }

                .botons-grup { display: flex; gap: 15px; justify-content: center; margin-top: 35px; }

                .btn-bloqueig {
                    padding: 14px 24px; border-radius: 8px; text-decoration: none;
                    font-weight: bold; transition: 0.2s; font-size: 0.9rem;
                }

                .btn-mail { background: #d35400; color: white; border: 1px solid #a04000; }
                .btn-mail:hover { background: #a04000; }

                .btn-tornar { background: #1a1a1a; color: white; }
                .btn-tornar:hover { background: #000; }
            </style>
            
            <div class="caixa-neta-glass">
                <h2>Avís del Sistema</h2>
                <p>S'ha acabat el període de prova d'aquest catàleg digital.</p>
                <p style="font-size: 0.9rem; color: #666;">Per renovar el servei o realitzar una comanda, posa't en contacte amb el suport tècnic.</p>
                
                <div class="botons-grup">
                    <a href="mailto:suport@altervector.com?subject=Consulta%20Renovacio%20Cataleg" class="btn-bloqueig btn-mail">Renovar Servei</a>
                    <a href="index.html" class="btn-bloqueig btn-tornar">Tornar a l'Inici</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(capaProhibida);
    });
}

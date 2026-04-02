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
            <span class="etiqueta-categoria">Postress</span>
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
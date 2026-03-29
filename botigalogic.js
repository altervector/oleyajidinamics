const htmlBotiga = `

<div class="bloc-imatges">
    <div class="columna-esquerra">
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Begudes" class="enllac-imatge-fix"> 
            <img src="https://altervector.github.io/oleyajidinamics/images/PICATBegudes.webp" alt="Begudes" class="imatge-petita">
            <span class="etiqueta-categoria">Begudes</span>
        </a>
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Postres" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/oleyajidinamics/images/PICATPostres.webp" alt="Postres" class="imatge-petita">
            <span class="etiqueta-categoria">Postress</span>
        </a>
    </div>
    <div class="imatge-dreta">
        <a href="https://oleyaji.netlify.app/principal.html?Categoria=Plats" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/oleyajidinamics/images/PICATPlats.webp" alt="Plats" class="imatge-gran">
            <span class="etiqueta-categoria">Plats</span>
        </a>
    </div>
</div>
<div class="bloc-imatge-inferior">
    <a href="https://www.google.com/maps/search/?api=1&query=OLÉ+Y+AJÍ+COMIDA+MEDITERRANEA+Y+LATINA+Vilafranca" target="_blank" class="enllac-imatge-fix item-horizontal">
        <img src="https://altervector.github.io/oleyajidinamics/images/PICATUbicacio.webp" alt="On som..." class="imatge-petita">
        <span class="etiqueta-categoria">On som (Maps)</span>
    </a>
</div>
<p style="max-width:400px; width:90%; margin: 10px auto 10px auto; font-size: 14px; color:#555; text-align: center;">
    <em>Productes seleccionats de primera qualitat <br><span style="display:block; text-align:center;"> Servei proper i professional</span></em>
</p>

`;

// Injectem tot el bloc al "forat" de l'HTML
document.getElementById('contingut-botiga').innerHTML = htmlBotiga;

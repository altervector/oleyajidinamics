const htmlBotiga = `

<div class="bloc-imatges">
    <div class="columna-esquerra">
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=ver" class="enllac-imatge-fix"> 
            <img src="https://altervector.github.io/cadinamics/images/PICATVer.webp" alt="Verdures" class="imatge-petita">
            <span class="etiqueta-categoria">Verdures</span>
        </a>
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=pre" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/cadinamics/images/PICATPre.webp" alt="Croquetes" class="imatge-petita">
            <span class="etiqueta-categoria">Precuinats</span>
        </a>
    </div>
    <div class="imatge-dreta">
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=px" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/cadinamics/images/PICATPx.webp" alt="Peix i Marisc" class="imatge-gran">
            <span class="etiqueta-categoria">Peix i Marisc</span>
        </a>
    </div>
</div>
<div class="bloc-imatge-inferior">
    <a href="https://cadialimentacio.netlify.app/principal.html?cat=alt" class="enllac-imatge-fix item-horizontal">
        <img src="https://altervector.github.io/cadinamics/images/PICATAlt.webp" alt="Postres i Altres" class="imatge-petita">
        <span class="etiqueta-categoria">Postres i Altres</span>
    </a>
</div>
<p style="max-width:400px; width:90%; margin: 10px auto 10px auto; font-size: 14px; color:#555; text-align: center;">
    <em>Productes seleccionats de primera qualitat <br><span style="display:block; text-align:center;"> Servei proper i professional</span></em>
</p>

`;

// Injectem tot el bloc al "forat" de l'HTML
document.getElementById('contingut-botiga').innerHTML = htmlBotiga;

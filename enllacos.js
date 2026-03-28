document.addEventListener("DOMContentLoaded", () => {
    const enllacosHTML = `
        
        <div class="bloc-enllacos">
            <p><a href="https://altervector.github.io/oleyajidinamics/PROMO.pdf"><img src="https://altervector.github.io/oleyajidinamics/Icon/Icopdf.png" alt="Pdf" class="icona-app">Descarrega el catàleg complet (PDF)</a></p>
            <p><a href="https://www.instagram.com/oleyajivilafranca" target="_blank"><img src="https://altervector.github.io/oleyajidinamics/Icon/Icoinsta.png" alt="Instagram" class="icona-app">Instagram: @oleyajivilafranca</a></p>
            <p><a href="https://wa.me/"><img src="https://altervector.github.io/oleyajidinamics/Icon/icowhats.png" alt="Whatsapp" class="icona-app">Contacta per WhatsApp</a></p>
            <p><a href="mailto:"> <img src="https://altervector.github.io/oleyajidinamics/Icon/Icomail.png" alt="e-mail" class="icona-app">Envia un correu</a></p>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
    `;

    const contenidor = document.getElementById("bloc-enllacos-dinamic");
    if (contenidor) {
        contenidor.innerHTML = enllacosHTML;
    }
});
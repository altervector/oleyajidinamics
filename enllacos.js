document.addEventListener("DOMContentLoaded", () => {
    const enllacosHTML = `
        
        <div class="bloc-enllacos">
            <p><a href="https://altervector.github.io/cadinamics/PROMO.pdf"><img src="https://altervector.github.io/cadinamics/Icon/Icopdf.png" alt="Pdf" class="icona-app">Descarrega el catàleg complet (PDF)</a></p>
            <p><a href="https://www.instagram.com/cadicarles" target="_blank"><img src="https://altervector.github.io/cadinamics/Icon/Icoinsta.png" alt="Instagram" class="icona-app">Instagram: @cadicarles</a></p>
            <p><a href="https://wa.me/34690091388"><img src="https://altervector.github.io/cadinamics/Icon/icowhats.png" alt="Whatsapp" class="icona-app">Contacta per WhatsApp</a></p>
            <p><a href="mailto:cadimobil2@gmail.com"> <img src="https://altervector.github.io/cadinamics/Icon/Icomail.png" alt="e-mail" class="icona-app">Envia un correu</a></p>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
    `;

    const contenidor = document.getElementById("bloc-enllacos-dinamic");
    if (contenidor) {
        contenidor.innerHTML = enllacosHTML;
    }
});